"""
SIGIL OS Cognitive Kernel - Main Application
Implements the PVCE-1 architecture with Vital Will Substrate
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
import os
import json
import logging
from datetime import datetime
import asyncio
from dotenv import load_dotenv
from .llm_provider import llm_provider
from .database import db, get_db
from .auth import create_access_token, decode_access_token
from .users import User
from . import billing

# Load environment variables from .env file
load_dotenv()

# Security
security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SIGIL OS Cognitive Kernel",
    description="Planetary Vital-Will Cognitive Engine (PVCE-1)",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "sigil-companion"
    temperature: float = 0.7
    max_tokens: int = 2048
    stream: bool = False
    conversation_id: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    created_at: str
    is_active: bool
    subscription_tier: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[Dict[str, Any]]
    usage: Dict[str, int]

class MemoryItem(BaseModel):
    content: str
    category: str
    importance: float = 0.5
    metadata: Optional[Dict[str, Any]] = None

class ConversationCreate(BaseModel):
    title: Optional[str] = None
    model: str = "sigil-companion"

class ConversationUpdate(BaseModel):
    title: str

class MessageCreate(BaseModel):
    role: str
    content: str
    tokens_used: Optional[int] = None
    xp_gained: int = 0
    cognitive_insight: Optional[str] = None
    confidence: Optional[float] = None

class Mission(BaseModel):
    name: str
    description: str
    status: str = "active"
    progress: float = 0.0

# In-memory storage (replace with real databases)
conversations = {}
memories = []
missions = []

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup.

    The database is optional for local inference: chat completions run
    without it. Auth and persistent memory endpoints will fail explicitly
    if the database is unreachable.
    """
    try:
        await db.connect()
    except Exception as e:
        logger.warning(f"Database unavailable at startup ({e}); running without persistence")
    logger.info("Application startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    await db.close()
    logger.info("Application shutdown complete")

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    if not db.pool:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable; authentication persistence is disabled"
        )

    user = await User.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user

# Authentication endpoints
@app.post("/api/v1/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    _require_db()
    # Check if user already exists
    existing_user = await User.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user = await User.create(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name
    )

    # Create access token
    access_token = create_access_token(data={"sub": str(user["id"])})

    return Token(
        access_token=access_token,
        user=UserResponse(**user)
    )

@app.post("/api/v1/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user"""
    _require_db()
    user = await User.authenticate(user_data.email, user_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create access token
    access_token = create_access_token(data={"sub": str(user["id"])})

    return Token(
        access_token=access_token,
        user=UserResponse(**user)
    )

@app.get("/api/v1/auth/me", response_model=UserResponse)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user info"""
    return UserResponse(**current_user)

def _require_db():
    """Raise 503 if the database pool is unavailable."""
    if not db.pool:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable; persistence is disabled"
        )

# Conversation persistence endpoints
@app.get("/api/v1/conversations")
async def list_conversations(current_user: Dict[str, Any] = Depends(get_current_user)):
    """List the current user's conversations"""
    _require_db()
    return await db.fetch(
        """SELECT id, title, model, xp_earned, created_at, updated_at
           FROM conversations WHERE user_id = $1 ORDER BY updated_at DESC""",
        current_user["id"],
    )

@app.post("/api/v1/conversations", status_code=201)
async def create_conversation(
    body: ConversationCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Create a new conversation"""
    _require_db()
    return await db.fetchrow(
        """INSERT INTO conversations (user_id, title, model)
           VALUES ($1, $2, $3)
           RETURNING id, title, model, xp_earned, created_at, updated_at""",
        current_user["id"], body.title, body.model,
    )

@app.get("/api/v1/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get a conversation with its messages"""
    _require_db()
    conv = await db.fetchrow(
        """SELECT id, title, model, xp_earned, created_at, updated_at
           FROM conversations WHERE id = $1 AND user_id = $2""",
        conversation_id, current_user["id"],
    )
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = await db.fetch(
        """SELECT id, role, content, tokens_used, xp_gained, cognitive_insight,
                  confidence, created_at
           FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC""",
        conversation_id,
    )
    return {**conv, "messages": messages}

@app.patch("/api/v1/conversations/{conversation_id}")
async def update_conversation(
    conversation_id: str,
    body: ConversationUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Rename a conversation"""
    _require_db()
    result = await db.fetchrow(
        """UPDATE conversations SET title = $1
           WHERE id = $2 AND user_id = $3
           RETURNING id, title, model, xp_earned, created_at, updated_at""",
        body.title, conversation_id, current_user["id"],
    )
    if not result:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return result

@app.delete("/api/v1/conversations/{conversation_id}", status_code=204)
async def delete_conversation(
    conversation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Delete a conversation and its messages"""
    _require_db()
    result = await db.execute(
        "DELETE FROM conversations WHERE id = $1 AND user_id = $2",
        conversation_id, current_user["id"],
    )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Conversation not found")

@app.post("/api/v1/conversations/{conversation_id}/messages", status_code=201)
async def add_message(
    conversation_id: str,
    body: MessageCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Append a message to a conversation"""
    _require_db()
    if body.role not in ("user", "assistant", "system"):
        raise HTTPException(status_code=400, detail="Invalid role")
    conv = await db.fetchrow(
        "SELECT id FROM conversations WHERE id = $1 AND user_id = $2",
        conversation_id, current_user["id"],
    )
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    message = await db.fetchrow(
        """INSERT INTO messages
           (conversation_id, role, content, tokens_used, xp_gained,
            cognitive_insight, confidence)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, role, content, tokens_used, xp_gained,
                     cognitive_insight, confidence, created_at""",
        conversation_id, body.role, body.content, body.tokens_used,
        body.xp_gained, body.cognitive_insight, body.confidence,
    )
    await db.execute(
        "UPDATE conversations SET updated_at = NOW() WHERE id = $1",
        conversation_id,
    )
    return message

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "llm_provider": llm_provider.active_provider,
        "database": "connected" if db.pool else "unavailable",
        "services": {
            "cognitive_kernel": "running",
            "memory_fabric": "running",
            "verification_mesh": "enabled"
        }
    }

@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    return {"ready": True}

@app.post("/api/v1/chat/completions")
async def chat_completion(
    request: ChatCompletionRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security)
):
    """
    Main chat completion endpoint
    OpenAI-compatible API for easy integration
    """
    # Optional authentication
    current_user = None
    if credentials:
        try:
            token = credentials.credentials
            payload = decode_access_token(token)
            user_id = payload.get("sub")
            if user_id:
                current_user = await User.get_by_id(user_id)
        except:
            pass  # Allow anonymous access if auth fails

    try:
        logger.info(f"Received chat completion request with {len(request.messages)} messages")

        # Convert messages to dict format
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]

        # Call LLM provider
        response = await llm_provider.chat_completion(
            messages=messages_dict,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            stream=request.stream
        )

        if request.stream and "stream" in response:
            # Streaming response
            async def generate_stream():
                response_id = f"chatcmpl-{datetime.utcnow().timestamp()}"
                async for chunk in response["stream"]():
                    chunk_data = {
                        "id": response_id,
                        "object": "chat.completion.chunk",
                        "created": int(datetime.utcnow().timestamp()),
                        "model": request.model,
                        "choices": [{"index": 0, "delta": {"content": chunk}, "finish_reason": None}]
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingResponse(
                generate_stream(),
                media_type="text/event-stream"
            )
        else:
            # Non-streaming response: persist usage and conversation messages
            if current_user and db.pool:
                usage = response.get("usage", {})
                total_tokens = usage.get("total_tokens", 0)
                try:
                    await db.execute(
                        """INSERT INTO usage_events
                           (user_id, event_type, model, tokens_used, metadata)
                           VALUES ($1, 'chat_completion', $2, $3, $4)""",
                        current_user["id"], request.model, total_tokens,
                        json.dumps({"stream": False}),
                    )
                except Exception as e:
                    logger.warning(f"Failed to record usage event: {e}")

                if request.conversation_id:
                    try:
                        conv = await db.fetchrow(
                            "SELECT id FROM conversations WHERE id = $1 AND user_id = $2",
                            request.conversation_id, current_user["id"],
                        )
                        if conv:
                            for msg in request.messages:
                                await db.execute(
                                    """INSERT INTO messages
                                       (conversation_id, role, content)
                                       VALUES ($1, $2, $3)""",
                                    request.conversation_id, msg.role, msg.content,
                                )
                            assistant_content = (
                                response.get("choices", [{}])[0]
                                .get("message", {}).get("content", "")
                            )
                            await db.execute(
                                """INSERT INTO messages
                                   (conversation_id, role, content, tokens_used)
                                   VALUES ($1, 'assistant', $2, $3)""",
                                request.conversation_id, assistant_content,
                                usage.get("completion_tokens"),
                            )
                            await db.execute(
                                "UPDATE conversations SET updated_at = NOW() WHERE id = $1",
                                request.conversation_id,
                            )
                    except Exception as e:
                        logger.warning(f"Failed to persist conversation messages: {e}")

            return response

    except Exception as e:
        logger.error(f"Error in chat completion: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def _optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security)) -> Optional[Dict[str, Any]]:
    """Resolve the caller's user when a valid token is presented."""
    if not credentials:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get("sub")
        if not user_id:
            return None
        return await User.get_by_id(user_id)
    except Exception:
        return None

@app.post("/api/v1/memory")
async def create_memory(
    memory: MemoryItem,
    current_user: Optional[Dict[str, Any]] = Depends(_optional_user),
):
    """Create a new memory item (persisted per-user when DB + auth available)"""
    if db.pool and current_user:
        row = await db.fetchrow(
            """INSERT INTO memory (user_id, content, category, importance, metadata)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING id, content, category, importance, metadata, created_at""",
            current_user["id"], memory.content, memory.category,
            memory.importance, json.dumps(memory.metadata or {}),
        )
        logger.info(f"Created memory: {row['id']}")
        return {**row, "metadata": row.get("metadata") or {}}

    memory_data = {
        "id": f"mem_{datetime.utcnow().timestamp()}",
        "content": memory.content,
        "category": memory.category,
        "importance": memory.importance,
        "metadata": memory.metadata or {},
        "created_at": datetime.utcnow().isoformat()
    }
    memories.append(memory_data)
    logger.info(f"Created memory (in-memory): {memory_data['id']}")
    return memory_data

@app.get("/api/v1/memory")
async def get_memories(
    category: Optional[str] = None,
    current_user: Optional[Dict[str, Any]] = Depends(_optional_user),
):
    """Retrieve memories"""
    if db.pool and current_user:
        if category:
            return await db.fetch(
                """SELECT id, content, category, importance, metadata, created_at
                   FROM memory WHERE user_id = $1 AND category = $2
                   ORDER BY importance DESC, created_at DESC""",
                current_user["id"], category,
            )
        return await db.fetch(
            """SELECT id, content, category, importance, metadata, created_at
               FROM memory WHERE user_id = $1
               ORDER BY importance DESC, created_at DESC""",
            current_user["id"],
        )

    if category:
        return [m for m in memories if m["category"] == category]
    return memories

@app.post("/api/v1/missions")
async def create_mission(
    mission: Mission,
    current_user: Optional[Dict[str, Any]] = Depends(_optional_user),
):
    """Create a new mission"""
    if db.pool and current_user:
        return await db.fetchrow(
            """INSERT INTO missions (user_id, name, description, status, progress)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING id, name, description, status, progress, created_at, updated_at""",
            current_user["id"], mission.name, mission.description,
            mission.status, mission.progress,
        )

    mission_data = {
        "id": f"mission_{datetime.utcnow().timestamp()}",
        "name": mission.name,
        "description": mission.description,
        "status": mission.status,
        "progress": mission.progress,
        "created_at": datetime.utcnow().isoformat()
    }
    missions.append(mission_data)
    logger.info(f"Created mission (in-memory): {mission_data['id']}")
    return mission_data

@app.get("/api/v1/missions")
async def get_missions(current_user: Optional[Dict[str, Any]] = Depends(_optional_user)):
    """Retrieve all missions"""
    if db.pool and current_user:
        return await db.fetch(
            """SELECT id, name, description, status, progress, created_at, updated_at
               FROM missions WHERE user_id = $1 ORDER BY created_at DESC""",
            current_user["id"],
        )
    return missions

# Billing endpoints
class CheckoutRequest(BaseModel):
    tier: str
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None

@app.get("/api/v1/billing/tiers")
async def list_tiers():
    """List available subscription tiers"""
    return {
        "tiers": [
            {"id": k, **{kk: vv for kk, vv in v.items() if kk != "features"},
             "features": v["features"]}
            for k, v in billing.TIERS.items()
        ],
        "stripe_configured": billing.is_configured(),
    }

@app.get("/api/v1/billing/subscription")
async def get_subscription(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get the current user's subscription state"""
    _require_db()
    return {
        "tier": current_user.get("subscription_tier", "free"),
        "tier_info": billing.TIERS.get(current_user.get("subscription_tier", "free")),
        "stripe_customer_id": current_user.get("stripe_customer_id"),
        "stripe_subscription_id": current_user.get("stripe_subscription_id"),
    }

@app.post("/api/v1/billing/checkout")
async def create_checkout(
    body: CheckoutRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Create a Stripe Checkout Session for a subscription tier"""
    _require_db()
    if not billing.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Billing is not configured (STRIPE_SECRET_KEY missing)",
        )
    app_url = os.getenv("APP_URL", "http://localhost:3000")
    try:
        return await billing.create_checkout_session(
            current_user,
            body.tier,
            body.success_url or f"{app_url}/app/settings?billing=success",
            body.cancel_url or f"{app_url}/app/settings?billing=cancelled",
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/api/v1/billing/webhook")
async def stripe_webhook(request: Request):
    """Stripe webhook endpoint (no auth; verified by signature)"""
    _require_db()
    payload = await request.body()
    signature = request.headers.get("stripe-signature", "")
    try:
        return await billing.handle_webhook(payload, signature)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Stripe webhook error: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook payload")

@app.get("/api/v1/billing/usage")
async def get_usage(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get the current user's token usage for the last 30 days"""
    _require_db()
    summary = await billing.get_usage_summary(current_user["id"], db)
    tier = current_user.get("subscription_tier", "free")
    limit = billing.TIERS.get(tier, billing.TIERS["free"])["monthly_token_limit"]
    summary["tier"] = tier
    summary["monthly_token_limit"] = limit
    summary["percent_used"] = round(min(100, summary["total_tokens"] / limit * 100), 2) if limit else 0
    return summary

@app.get("/api/v1/models")
async def list_models():
    """List available SIGIL models"""
    return {
        "object": "list",
        "data": [
            {
                "id": "sigil-companion",
                "object": "model",
                "created": 1690000000,
                "owned_by": "sigil-os"
            },
            {
                "id": "sigil-reasoner",
                "object": "model",
                "created": 1690000000,
                "owned_by": "sigil-os"
            },
            {
                "id": "sigil-spatial",
                "object": "model",
                "created": 1690000000,
                "owned_by": "sigil-os"
            }
        ]
    }

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """WebSocket endpoint for real-time chat"""
    await websocket.accept()
    logger.info("WebSocket connection established")

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            # Process message
            response = {
                "id": f"msg_{datetime.utcnow().timestamp()}",
                "role": "assistant",
                "content": "I am SIGIL. WebSocket connection is working! Full cognitive integration coming soon."
            }

            await websocket.send_json(response)

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return {
        "sigil_cognitive_cycles_total": 0,
        "sigil_verification_mesh_passes_total": 0,
        "sigil_verification_mesh_attempts_total": 0,
        "sigil_memory_retrieval_attempts_total": 0,
        "sigil_constitution_violations_total": 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
