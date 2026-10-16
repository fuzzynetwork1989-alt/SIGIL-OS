# SIGIL OS - Memory Architecture

**Version:** 1.0
**Date:** 2026-10-15
**Status:** Draft

---

## 1. Overview

SIGIL OS implements a multi-layered memory system that mirrors human cognitive memory architecture. The memory system is designed to be persistent, searchable, auditable, and reversible—all with cryptographic warrants.

**Key Principles:**
- Every memory entry carries a cryptographic sigil
- Memory is organized by type (working, episodic, semantic, long-term)
- Memory has confidence scores and source tracking
- Memory can be inspected via timeline
- Memory can be rolled back or deleted

---

## 2. Memory Layers

### 2.1 Working Memory

**Purpose:** Current context and active thinking
**Duration:** Session-limited (minutes to hours)
**Capacity:** ~131K tokens (Super Brain context window)
**Storage:** In-memory with persistence checkpoint

**Contents:**
- Current conversation context
- Active tasks and goals
- Temporary computations
- Immediate user preferences

**Characteristics:**
- Fast access (< 10ms)
- Automatically managed
- Evicted based on relevance
- Backed up on session end

### 2.2 Episodic Memory

**Purpose:** Specific events and experiences
**Duration:** Long-term (years)
**Capacity:** Unlimited (with retention policies)
**Storage:** Vector database with metadata

**Contents:**
- Conversation history
- User interactions
- System events
- Learned behaviors

**Characteristics:**
- Searchable by similarity
- Time-indexed
- Source-tracked
- Confidence-scored

**Schema:**
```rust
struct EpisodicMemory {
    id: Uuid,
    timestamp: DateTime<Utc>,
    content: String,
    embedding: Vec<f32>,
    source: MemorySource,
    confidence: f32,
    sigil: Sigil,
    tags: Vec<String>,
    related_memories: Vec<Uuid>,
}
```

### 2.3 Semantic Memory

**Purpose:** General knowledge and facts
**Duration:** Permanent
**Capacity:** Unlimited
**Storage:** Knowledge graph + vector database

**Contents:**
- Learned facts
- Concepts and relationships
- User preferences
- Domain knowledge

**Characteristics:**
- Deduplicated
- Versioned
- Attributed to source
- Confident enough to act on

**Schema:**
```rust
struct SemanticMemory {
    id: Uuid,
    fact: String,
    embedding: Vec<f32>,
    confidence: f32,
    source: MemorySource,
    verification_status: VerificationStatus,
    last_verified: DateTime<Utc>,
    sigil: Sigil,
    relationships: Vec<Relationship>,
}
```

### 2.4 Long-Term Memory

**Purpose:** Archival storage and backup
**Duration:** Permanent (with retention policies)
**Capacity:** Unlimited
**Storage:** Compressed, encrypted archive

**Contents:**
- Full conversation history
- System state snapshots
- Audit logs
- Backup data

**Characteristics:**
- Compressed storage
- Encrypted at rest
- Retention policies
- Exportable

---

## 3. Memory Schemas

### 3.1 Memory Entry Schema

```rust
pub struct MemoryEntry {
    // Identification
    pub id: Uuid,
    pub memory_type: MemoryType,
    
    // Content
    pub content: String,
    pub embedding: Option<Vec<f32>>,
    
    // Metadata
    pub timestamp: DateTime<Utc>,
    pub source: MemorySource,
    pub confidence: f32,
    pub verification_status: VerificationStatus,
    
    // Cryptographic
    pub sigil: Sigil,
    
    // Relationships
    pub related_memories: Vec<Uuid>,
    pub tags: Vec<String>,
}

pub enum MemoryType {
    Working,
    Episodic,
    Semantic,
    LongTerm,
}

pub enum MemorySource {
    Conversation { conversation_id: Uuid },
    ManualEntry { user_id: Uuid },
    ObservedBehavior { behavior: String },
    External { source_name: String, url: Option<String> },
    Inference { model: String },
}

pub enum VerificationStatus {
    Unverified,
    Confirmed,
    Contradicted,
    Outdated,
}
```

### 3.2 Memory Confidence Scoring

**Confidence Factors:**
- Source reliability (0.0 - 1.0)
- Age decay (newer = higher confidence)
- Verification count (more verification = higher confidence)
- User feedback (user corrections affect confidence)
- Contradiction detection (contradictions lower confidence)

**Formula:**
```
confidence = base_confidence * age_factor * verification_factor * feedback_factor
```

**Age Decay:**
- < 1 day: 1.0
- 1-7 days: 0.9
- 1-4 weeks: 0.8
- 1-12 months: 0.7
- > 12 months: 0.6

---

## 4. Memory Operations

### 4.1 Write Operations

**Store Memory:**
```rust
async fn store_memory(
    content: String,
    memory_type: MemoryType,
    source: MemorySource,
) -> Result<Uuid, MemoryError> {
    // 1. Generate embedding
    let embedding = generate_embedding(&content).await?;
    
    // 2. Calculate confidence
    let confidence = calculate_confidence(&source);
    
    // 3. Create sigil
    let sigil = generate_sigil(&content, &source)?;
    
    // 4. Store in appropriate layer
    let id = match memory_type {
        MemoryType::Working => store_working_memory(content, embedding).await?,
        MemoryType::Episodic => store_episodic_memory(content, embedding, sigil).await?,
        MemoryType::Semantic => store_semantic_memory(content, embedding, sigil).await?,
        MemoryType::LongTerm => store_long_term_memory(content, sigil).await?,
    };
    
    Ok(id)
}
```

**Update Memory:**
```rust
async fn update_memory(
    id: Uuid,
    new_content: String,
) -> Result<(), MemoryError> {
    // 1. Retrieve old memory
    let old_memory = get_memory(id).await?;
    
    // 2. Create new sigil
    let new_sigil = generate_sigil(&new_content, &old_memory.source)?;
    
    // 3. Store new version
    store_memory_version(id, new_content, new_sigil).await?;
    
    // 4. Update embedding
    let new_embedding = generate_embedding(&new_content).await?;
    update_embedding(id, new_embedding).await?;
    
    Ok(())
}
```

### 4.2 Read Operations

**Retrieve Memory:**
```rust
async fn retrieve_memory(id: Uuid) -> Result<MemoryEntry, MemoryError> {
    // 1. Check permissions
    check_memory_access(id)?;
    
    // 2. Retrieve from storage
    let memory = storage.get(id).await?;
    
    // 3. Verify sigil
    verify_sigil(&memory.sigil)?;
    
    // 4. Update access count
    increment_access_count(id).await?;
    
    // 5. Boost confidence
    boost_confidence(id).await?;
    
    Ok(memory)
}
```

**Search Memory:**
```rust
async fn search_memory(
    query: String,
    memory_type: MemoryType,
    limit: usize,
) -> Result<Vec<MemoryEntry>, MemoryError> {
    // 1. Generate query embedding
    let query_embedding = generate_embedding(&query).await?;
    
    // 2. Vector search
    let results = vector_search(
        &query_embedding,
        memory_type,
        limit,
    ).await?;
    
    // 3. Filter by confidence threshold
    let filtered: Vec<_> = results
        .into_iter()
        .filter(|m| m.confidence >= 0.5)
        .collect();
    
    Ok(filtered)
}
```

### 4.3 Delete Operations

**Delete Memory:**
```rust
async fn delete_memory(id: Uuid) -> Result<(), MemoryError> {
    // 1. Check permissions
    check_memory_deletion(id)?;
    
    // 2. Create deletion sigil
    let deletion_sigil = generate_deletion_sigil(id)?;
    
    // 3. Mark as deleted (soft delete)
    mark_as_deleted(id, deletion_sigil).await?;
    
    // 4. Archive after retention period
    schedule_archival(id).await?;
    
    Ok(())
}
```

---

## 5. Retention Policies

### 5.1 Default Retention

| Memory Type | Default Retention | Min Retention | Max Retention |
|-------------|------------------|---------------|---------------|
| Working | Session end | Session end | 24 hours |
| Episodic | 1 year | 30 days | Permanent |
| Semantic | Permanent | 1 year | Permanent |
| Long-Term | Permanent | 1 year | Permanent |

### 5.2 User Configurable Retention

Users can configure:
- Episodic memory retention (30 days - Permanent)
- Automatic deletion of low-confidence memories
- Data export on deletion
- Right to be forgotten (complete deletion)

### 5.3 Archival

**Archival Process:**
1. Compress memory data
2. Encrypt with user's public key
3. Store in cold storage
4. Retain metadata for search
5. Delete after max retention period

---

## 6. Memory Timeline

### 6.1 Timeline View

Users can inspect memory learning history:

```
March 2026
    ↓
Learned OLED calibration preferences
Confidence: 92%
Source: Conversation
Verified: Yes

June 2026
    ↓
Learned development goals
Confidence: 88%
Source: Manual Entry
Verified: Yes

October 2026
    ↓
Updated AI architecture models
Confidence: 95%
Source: External (docs)
Verified: Yes
```

### 6.2 Timeline Operations

**View Timeline:**
```rust
async fn view_timeline(
    user_id: Uuid,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
) -> Result<Vec<TimelineEntry>, MemoryError> {
    // 1. Query memories in date range
    let memories = query_memories_by_date(user_id, start_date, end_date).await?;
    
    // 2. Group by date
    let grouped = group_by_date(memories);
    
    // 3. Calculate confidence stats
    let stats = calculate_confidence_stats(&grouped);
    
    // 4. Build timeline
    let timeline = build_timeline(grouped, stats);
    
    Ok(timeline)
}
```

---

## 7. Memory Confidence System

### 7.1 Confidence Display

Memory confidence is displayed to users:

```
Memory Confidence: 96%
Source: Conversation
Verified: Yes
Last Updated: 2026-10-15
```

### 7.2 Confidence Updates

**Increase Confidence:**
- User confirms memory is correct
- Memory is verified against external source
- Memory is used successfully in reasoning

**Decrease Confidence:**
- User corrects memory
- Memory contradicts other memories
- Memory becomes outdated

### 7.3 Memory Verification

**Verification Process:**
1. Cross-reference with external sources
2. Check for contradictions
3. Validate against user feedback
4. Update verification status
5. Recalculate confidence

---

## 8. Vector Database Integration

### 8.1 Vector Database Options

**Local:**
- pgvector (PostgreSQL extension)
- Qdrant (local deployment)
- Chroma (Python-based)

**Cloud:**
- Pinecone
- Weaviate
- Qdrant Cloud

### 8.2 Recommended: Qdrant

**Rationale:**
- Open source
- Rust-native
- High performance
- Good filtering capabilities
- Local and cloud options

**Integration:**
```rust
use qdrant_client::prelude::*;

async fn setup_qdrant() -> Result<Client, QdrantError> {
    let client = QdrantClient::from_url("http://localhost:6333").build()?;
    
    // Create collection for episodic memory
    client.create_collection(&CreateCollection {
        collection_name: "episodic_memory".to_string(),
        vectors_config: Some(VectorsConfig {
            size: 1536, // OpenAI embedding dimension
            distance: Distance::Cosine,
        }),
        ..Default::default()
    }).await?;
    
    Ok(client)
}
```

---

## 9. Memory Privacy

### 9.1 Encryption

**At Rest:**
- All memory encrypted with AES-256
- User-controlled encryption keys
- Key rotation support

**In Transit:**
- TLS 1.3 for all memory operations
- End-to-end encryption for cloud sync

### 9.2 Access Control

**Memory Access:**
- User owns all their memories
- No sharing without explicit consent
- Admin access only with warrant
- Audit log of all accesses

**Memory Deletion:**
- Soft delete with archival
- Hard delete on user request
- Right to be forgotten
- Verification of deletion

---

## 10. Memory API

### 10.1 REST Endpoints

```
POST   /api/v1/memory/store
GET    /api/v1/memory/{id}
PUT    /api/v1/memory/{id}
DELETE /api/v1/memory/{id}
GET    /api/v1/memory/search
GET    /api/v1/memory/timeline
POST   /api/v1/memory/verify
GET    /api/v1/memory/export
POST   /api/v1/memory/import
```

### 10.2 Example API Calls

**Store Memory:**
```bash
curl -X POST http://localhost:8080/api/v1/memory/store \
  -H "Content-Type: application/json" \
  -d '{
    "content": "User prefers dark theme",
    "memory_type": "semantic",
    "source": {
      "type": "conversation",
      "conversation_id": "uuid"
    }
  }'
```

**Search Memory:**
```bash
curl -X GET "http://localhost:8080/api/v1/memory/search?query=theme&limit=10"
```

---

## 11. Memory Testing

### 11.1 Unit Tests

```rust
#[tokio::test]
async fn test_store_memory() {
    let memory_system = MemorySystem::new().await;
    
    let id = memory_system.store_memory(
        "Test memory".to_string(),
        MemoryType::Episodic,
        MemorySource::Conversation { conversation_id: Uuid::new_v4() },
    ).await.unwrap();
    
    assert!(id != Uuid::nil());
}

#[tokio::test]
async fn test_memory_confidence() {
    let memory_system = MemorySystem::new().await;
    
    let id = memory_system.store_memory(
        "Test memory".to_string(),
        MemoryType::Semantic,
        MemorySource::ManualEntry { user_id: Uuid::new_v4() },
    ).await.unwrap();
    
    let memory = memory_system.retrieve_memory(id).await.unwrap();
    assert!(memory.confidence > 0.0);
    assert!(memory.confidence <= 1.0);
}
```

### 11.2 Integration Tests

```rust
#[tokio::test]
async fn test_memory_search() {
    let memory_system = MemorySystem::new().await;
    
    // Store multiple memories
    memory_system.store_memory("User likes blue".to_string(), ...).await;
    memory_system.store_memory("User prefers dark mode".to_string(), ...).await;
    
    // Search
    let results = memory_system.search_memory("preferences".to_string(), ...).await;
    
    assert!(results.len() > 0);
}
```

---

## 12. Implementation Plan

### Phase 1: Core Memory (Week 1-2)
- Implement memory schemas
- Implement storage layer
- Implement basic CRUD operations
- Unit tests

### Phase 2: Vector Database (Week 3-4)
- Integrate Qdrant
- Implement embedding generation
- Implement vector search
- Integration tests

### Phase 3: Confidence System (Week 5-6)
- Implement confidence scoring
- Implement verification system
- Implement confidence updates
- UI for confidence display

### Phase 4: Timeline (Week 7-8)
- Implement timeline view
- Implement retention policies
- Implement archival
- Export/import functionality

---

## 13. References

- MERIDIAN Memory System
- AETHER OS Cognitive Substrate
- pgvector Documentation
- Qdrant Documentation
- OpenAI Embeddings API

---

**Document Status:** Draft
**Next Review:** 2026-11-15
**Approved By:** [Pending]
