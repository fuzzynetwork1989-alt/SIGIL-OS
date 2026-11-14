"""
LLM Provider Service
Supports OpenAI and local Ollama models with automatic fallback.
"""

import os
import logging
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# SIGIL model aliases -> concrete backend model names.
# Order of preference per provider is resolved at call time.
# Ordered by reliability on modest hardware: the smallest installed model is
# tried first so requests succeed quickly; larger models are attempted only
# if the small one is unavailable. Set SIGIL_OLLAMA_MODEL to pin one model.
SIGIL_MODEL_ALIASES = {
    "sigil-companion": ["qwen2:0.5b", "llama3.2:3b", "phi3:mini"],
    "sigil-reasoner": ["qwen2:0.5b", "phi3:mini", "llama3.2:3b"],
    "sigil-spatial": ["qwen2:0.5b", "llama3.2:3b", "phi3:mini"],
}

DEFAULT_OLLAMA_HOST = os.getenv("SIGIL_OLLAMA_HOST", "http://localhost:11434/v1")
DEFAULT_OPENAI_MODEL = os.getenv("SIGIL_OPENAI_MODEL", "gpt-4o-mini")


def _mock_response(model: str) -> Dict[str, Any]:
    return {
        "id": "mock-response",
        "object": "chat.completion",
        "created": 0,
        "model": model,
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "I am SIGIL, your AI companion. No LLM backend is reachable. "
                           "Start Ollama (`ollama serve`) with a local model, or set "
                           "OPENAI_API_KEY to enable cloud inference."
            },
            "finish_reason": "stop"
        }],
        "usage": {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0
        }
    }


class _Backend:
    """A single OpenAI-compatible chat backend (OpenAI or Ollama)."""

    def __init__(self, name: str, client: AsyncOpenAI, model: str):
        self.name = name
        self.client = client
        self.model = model

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float,
        max_tokens: int,
        stream: bool,
    ) -> Dict[str, Any]:
        if stream:
            stream_iter = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )

            async def generate():
                async for chunk in stream_iter:
                    if chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content

            return {"stream": generate}

        response = await self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return {
            "id": response.id,
            "object": "chat.completion",
            "created": response.created,
            "model": response.model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": response.choices[0].message.role,
                    "content": response.choices[0].message.content
                },
                "finish_reason": response.choices[0].finish_reason
            }],
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }


class LLMProvider:
    """Manages LLM providers with automatic fallback."""

    def __init__(self):
        self._backends: List[_Backend] = []
        self._build_backends()

    def _build_backends(self):
        provider_pref = os.getenv("SIGIL_LLM_PROVIDER", "auto").lower()

        openai_key = os.getenv("OPENAI_API_KEY")
        has_openai = bool(openai_key and openai_key.startswith("sk-"))

        ollama_host = os.getenv("SIGIL_OLLAMA_HOST", DEFAULT_OLLAMA_HOST)
        self._ollama_model_override = os.getenv("SIGIL_OLLAMA_MODEL")

        candidates = []
        if provider_pref in ("auto", "openai") and has_openai:
            candidates.append(_Backend(
                "openai",
                AsyncOpenAI(api_key=openai_key),
                DEFAULT_OPENAI_MODEL,
            ))
        if provider_pref in ("auto", "ollama"):
            candidates.append(_Backend(
                "ollama",
                AsyncOpenAI(base_url=ollama_host, api_key="ollama"),
                self._ollama_model_override or "llama3.2:3b",
            ))

        if not candidates:
            logger.warning(
                "No LLM backend configured. Set OPENAI_API_KEY or run Ollama "
                "(SIGIL_LLM_PROVIDER=ollama)."
            )
            return

        # In auto mode prefer local Ollama for privacy; explicit pref wins.
        if provider_pref == "auto":
            candidates.sort(key=lambda b: 0 if b.name == "ollama" else 1)

        self._backends = candidates
        logger.info(
            "LLM backends initialized: %s",
            ", ".join(f"{b.name}({b.model})" for b in candidates),
        )

    def _ollama_candidates(self, model: str) -> List[str]:
        """Ordered concrete Ollama model names to try for a request."""
        fallback = self._ollama_model_override or "qwen2:0.5b"
        if model in SIGIL_MODEL_ALIASES:
            candidates = list(SIGIL_MODEL_ALIASES[model])
        elif ":" in model or "/" in model:
            # Looks like an explicit Ollama/HF model reference.
            candidates = [model]
        else:
            # Cloud-style name (e.g. gpt-4o-mini) Ollama won't know: use fallback.
            candidates = []
        if fallback not in candidates:
            candidates.append(fallback)
        return candidates or [fallback]

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "sigil-companion",
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Generate chat completion, trying each configured backend in order.
        """
        last_error: Optional[Exception] = None

        # Build (backend, resolved_model) attempts. Ollama tries each alias
        # candidate so a too-large model falls through to a smaller one.
        attempts: List[tuple] = []
        for backend in self._backends:
            if backend.name == "ollama":
                for candidate in self._ollama_candidates(model):
                    attempts.append((backend, candidate))
            else:
                resolved = DEFAULT_OPENAI_MODEL if model.startswith("sigil-") else model
                attempts.append((backend, resolved))

        for backend, resolved in attempts:
            try:
                result = await backend.chat_completion(
                    messages=messages,
                    model=resolved,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    stream=stream,
                )
                if not stream:
                    result["model"] = model
                logger.info("Chat completion served by %s (%s)", backend.name, resolved)
                return result
            except Exception as e:
                last_error = e
                logger.warning("Backend %s model %s failed: %s", backend.name, resolved, e)
                continue

        logger.error("All LLM backends failed: %s", last_error)
        if stream:
            return {"stream": self._empty_stream}
        return _mock_response(model)

    async def _empty_stream(self):
        yield ""
        return

    @property
    def available(self) -> bool:
        return len(self._backends) > 0

    @property
    def active_provider(self) -> Optional[str]:
        return self._backends[0].name if self._backends else None


# Global provider instance
llm_provider = LLMProvider()
