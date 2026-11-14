"""
SIGIL OS Cognitive Kernel - Main Application
Implements the PVCE-1 architecture with Vital Will Substrate
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, status
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
            # Non-streaming response
            return response
            
    except Exception as e:
        logger.error(f"Error in chat completion: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/memory")
async def create_memory(memory: MemoryItem):
    """Create a new memory item"""
    memory_data = {
        "id": f"mem_{datetime.utcnow().timestamp()}",
        "content": memory.content,
        "category": memory.category,
        "importance": memory.importance,
        "metadata": memory.metadata or {},
        "created_at": datetime.utcnow().isoformat()
    }
    memories.append(memory_data)
    logger.info(f"Created memory: {memory_data['id']}")
    return memory_data

@app.get("/api/v1/memory")
async def get_memories(category: Optional[str] = None):
    """Retrieve memories"""
    if category:
        filtered = [m for m in memories if m["category"] == category]
        return filtered
    return memories

@app.post("/api/v1/missions")
async def create_mission(mission: Mission):
    """Create a new mission"""
    mission_data = {
        "id": f"mission_{datetime.utcnow().timestamp()}",
        "name": mission.name,
        "description": mission.description,
        "status": mission.status,
        "progress": mission.progress,
        "created_at": datetime.utcnow().isoformat()
    }
    missions.append(mission_data)
    logger.info(f"Created mission: {mission_data['id']}")
    return mission_data

@app.get("/api/v1/missions")
async def get_missions():
    """Retrieve all missions"""
    return missions

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
