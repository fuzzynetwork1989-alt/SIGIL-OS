# SIGIL OS - RAG (Retrieval-Augmented Generation) Architecture

**Version:** 1.0
**Date:** 2026-10-15
**Status:** Draft

---

## 1. Overview

SIGIL OS implements a sophisticated RAG (Retrieval-Augmented Generation) system to enhance AI responses with relevant, contextual information from memory, knowledge graphs, and external sources. The RAG system is designed to be fast, accurate, and auditable—all with cryptographic warrants.

**Key Principles:**
- Retrieval is warranted and auditable
- Context is compressed and ranked
- Sources are attributed in responses
- Context freshness is tracked
- Retrieval can be rolled back

---

## 2. RAG Pipeline Architecture

### 2.1 Pipeline Stages

```
User Query
    ↓
Query Processing
    ↓
Embedding Generation
    ↓
Retrieval (Multi-Source)
    ↓
Ranking & Filtering
    ↓
Context Compression
    ↓
Context Assembly
    ↓
Generation (with context)
    ↓
Response with Attribution
```

### 2.2 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    RAG Orchestrator                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Query Parser │  │ Embedder     │  │ Retriever    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                ↓                ↓                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Ranker       │  │ Compressor   │  │ Assembler    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │ LLM Generation │
                    └───────────────┘
```

---

## 3. Retrieval Sources

### 3.1 Memory Retrieval

**Source:** Episodic and Semantic Memory
**Vector Database:** Qdrant
**Embedding Model:** OpenAI text-embedding-3-small

**Query:**
```rust
async fn retrieve_from_memory(
    query_embedding: Vec<f32>,
    limit: usize,
    confidence_threshold: f32,
) -> Result<Vec<MemoryEntry>, RetrievalError> {
    let client = qdrant_client();
    
    let search_result = client
        .search_points(&SearchPoints {
            collection_name: "episodic_memory".to_string(),
            vector: query_embedding,
            limit: limit as u64,
            with_payload: Some(true),
            filter: Some(Filter::must([
                Condition::field("confidence").range(0.5..=1.0),
            ])),
            ..Default::default()
        })
        .await?;
    
    let memories: Vec<MemoryEntry> = search_result
        .result
        .into_iter()
        .map(|point| MemoryEntry::from_qdrant_point(point))
        .collect();
    
    Ok(memories)
}
```

### 3.2 Knowledge Graph Retrieval

**Source:** World Model Knowledge Graph
**Database:** Neo4j or PostgreSQL with pgvector
**Query:** Cypher or SQL

**Query:**
```rust
async fn retrieve_from_knowledge_graph(
    query: String,
    limit: usize,
) -> Result<Vec<Entity>, RetrievalError> {
    let client = neo4j_client();
    
    let cypher = format!(
        "MATCH (e:Entity)-[r:RELATED_TO]->(related)
         WHERE e.name CONTAINS $query
         RETURN e, r, related
         LIMIT $limit"
    );
    
    let result = client
        .run(cypher, [("query", query), ("limit", limit)])
        .await?;
    
    let entities: Vec<Entity> = result
        .into_iter()
        .map(|record| Entity::from_cypher_record(record))
        .collect();
    
    Ok(entities)
}
```

### 3.3 External Source Retrieval

**Source:** Web, documents, APIs
**Tools:** Web search, document parsers, API clients
**Rate Limiting:** Configurable per source

**Query:**
```rust
async fn retrieve_from_external(
    query: String,
    sources: Vec<ExternalSource>,
    limit: usize,
) -> Result<Vec<ExternalDocument>, RetrievalError> {
    let mut results = Vec::new();
    
    for source in sources {
        match source {
            ExternalSource::Web => {
                let web_results = web_search(query, limit).await?;
                results.extend(web_results);
            }
            ExternalSource::Documents => {
                let doc_results = document_search(query, limit).await?;
                results.extend(doc_results);
            }
            ExternalSource::API(api_client) => {
                let api_results = api_client.search(query, limit).await?;
                results.extend(api_results);
            }
        }
    }
    
    Ok(results)
}
```

---

## 4. Ranking and Filtering

### 4.1 Ranking Algorithm

**Ranking Factors:**
- Semantic similarity (vector similarity)
- Source reliability (memory > knowledge graph > external)
- Confidence score (from memory or verification)
- Freshness (recency)
- Relevance (query match)

**Score Formula:**
```
score = (similarity * 0.4) + 
        (source_reliability * 0.2) + 
        (confidence * 0.2) + 
        (freshness * 0.1) + 
        (relevance * 0.1)
```

**Implementation:**
```rust
fn rank_results(results: Vec<RetrievalResult>) -> Vec<RetrievalResult> {
    let mut ranked = results;
    
    ranked.sort_by(|a, b| {
        let score_a = calculate_ranking_score(a);
        let score_b = calculate_ranking_score(b);
        score_b.partial_cmp(&score_a).unwrap()
    });
    
    ranked
}

fn calculate_ranking_score(result: &RetrievalResult) -> f32 {
    let similarity = result.similarity;
    let source_reliability = result.source.reliability();
    let confidence = result.confidence.unwrap_or(0.5);
    let freshness = calculate_freshness(&result.timestamp);
    let relevance = result.relevance;
    
    (similarity * 0.4) + 
    (source_reliability * 0.2) + 
    (confidence * 0.2) + 
    (freshness * 0.1) + 
    (relevance * 0.1)
}
```

### 4.2 Filtering

**Confidence Filter:**
```rust
fn filter_by_confidence(results: Vec<RetrievalResult>, threshold: f32) -> Vec<RetrievalResult> {
    results
        .into_iter()
        .filter(|r| r.confidence.unwrap_or(0.0) >= threshold)
        .collect()
}
```

**Deduplication:**
```rust
fn deduplicate_results(results: Vec<RetrievalResult>) -> Vec<RetrievalResult> {
    let mut seen = HashSet::new();
    let mut deduplicated = Vec::new();
    
    for result in results {
        let content_hash = hash_content(&result.content);
        if !seen.contains(&content_hash) {
            seen.insert(content_hash);
            deduplicated.push(result);
        }
    }
    
    deduplicated
}
```

---

## 5. Context Compression

### 5.1 Compression Strategies

**Token-Based Compression:**
- Remove redundant information
- Summarize long passages
- Prioritize high-relevance content

**Implementation:**
```rust
async fn compress_context(
    context: Vec<String>,
    max_tokens: usize,
) -> Result<String, CompressionError> {
    let total_tokens = count_tokens(&context.join("\n"));
    
    if total_tokens <= max_tokens {
        return Ok(context.join("\n"));
    }
    
    // Summarize each passage
    let summarized: Vec<String> = futures::future::join_all(
        context.iter().map(|c| summarize_passage(c))
    ).await;
    
    // Re-evaluate token count
    let summarized_tokens = count_tokens(&summarized.join("\n"));
    
    if summarized_tokens <= max_tokens {
        return Ok(summarized.join("\n"));
    }
    
    // Truncate to max tokens
    let truncated = truncate_to_tokens(&summarized.join("\n"), max_tokens);
    
    Ok(truncated)
}
```

### 5.2 Context Prioritization

**Priority:**
1. High-confidence memory
2. Recent information
3. User-specific information
4. General knowledge

**Implementation:**
```rust
fn prioritize_context(results: Vec<RetrievalResult>) -> Vec<RetrievalResult> {
    let mut prioritized = results;
    
    prioritized.sort_by(|a, b| {
        let priority_a = calculate_priority(a);
        let priority_b = calculate_priority(b);
        priority_b.partial_cmp(&priority_a).unwrap()
    });
    
    prioritized
}

fn calculate_priority(result: &RetrievalResult) -> f32 {
    let confidence = result.confidence.unwrap_or(0.5);
    let recency = calculate_recency(&result.timestamp);
    let user_specific = result.is_user_specific();
    
    let mut score = (confidence * 0.4) + (recency * 0.3);
    
    if user_specific {
        score += 0.3;
    }
    
    score
}
```

---

## 6. Context Assembly

### 6.1 Assembly Strategy

**Context Template:**
```
Context:
[Memory Section]
[Knowledge Graph Section]
[External Sources Section]

User Query: {query}
```

**Implementation:**
```rust
fn assemble_context(
    memory_context: String,
    kg_context: String,
    external_context: String,
    query: String,
) -> String {
    let mut context = String::new();
    
    if !memory_context.is_empty() {
        context.push_str("Memory:\n");
        context.push_str(&memory_context);
        context.push_str("\n\n");
    }
    
    if !kg_context.is_empty() {
        context.push_str("Knowledge:\n");
        context.push_str(&kg_context);
        context.push_str("\n\n");
    }
    
    if !external_context.is_empty() {
        context.push_str("External Sources:\n");
        context.push_str(&external_context);
        context.push_str("\n\n");
    }
    
    context.push_str(&format!("User Query: {}", query));
    
    context
}
```

### 6.2 Context Validation

**Validation Checks:**
- Token count within limits
- No duplicate information
- Sources are diverse
- Context is relevant to query

**Implementation:**
```rust
fn validate_context(context: &Context, query: &str) -> Result<(), ContextError> {
    // Check token count
    let token_count = count_tokens(&context.assembled);
    if token_count > context.max_tokens {
        return Err(ContextError::TooManyTokens(token_count));
    }
    
    // Check for duplicates
    if has_duplicates(&context.assembled) {
        return Err(ContextError::DuplicateContent);
    }
    
    // Check source diversity
    if !has_source_diversity(&context.sources) {
        return Err(ContextError::LowSourceDiversity);
    }
    
    // Check relevance
    if !is_relevant(&context.assembled, query) {
        return Err(ContextError::LowRelevance);
    }
    
    Ok(())
}
```

---

## 7. Generation with Attribution

### 7.1 Attribution Format

**Response with Attribution:**
```
[AI Response]

Sources:
- Memory: "User prefers dark theme" (Confidence: 92%)
- Knowledge: "Dark mode reduces eye strain" (Verified)
- External: "https://example.com/dark-mode-benefits" (Retrieved 2026-10-15)
```

**Implementation:**
```rust
struct AttributedResponse {
    content: String,
    sources: Vec<SourceAttribution>,
}

struct SourceAttribution {
    source_type: SourceType,
    content: String,
    confidence: Option<f32>,
    url: Option<String>,
    retrieved_at: DateTime<Utc>,
}

async fn generate_with_attribution(
    context: String,
    query: String,
    sources: Vec<RetrievalResult>,
) -> Result<AttributedResponse, GenerationError> {
    // Generate response
    let response = llm_generate(&context, &query).await?;
    
    // Build attributions
    let attributions: Vec<SourceAttribution> = sources
        .into_iter()
        .map(|s| SourceAttribution {
            source_type: s.source_type,
            content: s.content.clone(),
            confidence: s.confidence,
            url: s.url,
            retrieved_at: s.timestamp,
        })
        .collect();
    
    Ok(AttributedResponse {
        content: response,
        sources: attributions,
    })
}
```

---

## 8. Context Freshness

### 8.1 Freshness Tracking

**Freshness Metrics:**
- Age of information
- Last verification time
- Update frequency
- Source reliability

**Implementation:**
```rust
fn calculate_freshness(timestamp: DateTime<Utc>) -> f32 {
    let now = Utc::now();
    let duration = now.signed_duration_since(timestamp);
    
    let hours = duration.num_hours();
    
    // Freshness decays over time
    match hours {
        0..=1 => 1.0,
        1..=24 => 0.9,
        24..=168 => 0.8,  // 1 week
        168..=720 => 0.7, // 1 month
        _ => 0.6,
    }
}
```

### 8.2 Freshness Display

**Display Format:**
```
Information freshness: Fresh (retrieved 5 minutes ago)
Last verified: 2026-10-15 14:30 UTC
```

---

## 9. RAG API

### 9.1 REST Endpoints

```
POST   /api/v1/rag/query
GET    /api/v1/rag/context/{id}
POST   /api/v1/rag/feedback
GET    /api/v1/rag/sources
```

### 9.2 Example API Calls

**Query with RAG:**
```bash
curl -X POST http://localhost:8080/api/v1/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are my preferences?",
    "sources": ["memory", "knowledge_graph"],
    "max_tokens": 4000,
    "include_attribution": true
  }'
```

**Response:**
```json
{
  "response": "Based on your memory, you prefer dark theme and...",
  "context_id": "uuid",
  "sources": [
    {
      "type": "memory",
      "content": "User prefers dark theme",
      "confidence": 0.92,
      "retrieved_at": "2026-10-15T14:30:00Z"
    }
  ]
}
```

---

## 10. RAG Testing

### 10.1 Unit Tests

```rust
#[tokio::test]
async fn test_retrieve_from_memory() {
    let rag = RAGSystem::new().await;
    
    let results = rag.retrieve_from_memory(
        "preferences".to_string(),
        10,
        0.5,
    ).await.unwrap();
    
    assert!(results.len() > 0);
}

#[tokio::test]
async fn test_context_compression() {
    let context = vec![
        "Long passage 1...".repeat(100),
        "Long passage 2...".repeat(100),
    ];
    
    let compressed = compress_context(context, 1000).await.unwrap();
    
    let token_count = count_tokens(&compressed);
    assert!(token_count <= 1000);
}
```

### 10.2 Integration Tests

```rust
#[tokio::test]
async fn test_full_rag_pipeline() {
    let rag = RAGSystem::new().await;
    
    let response = rag.query(
        "What are my preferences?".to_string(),
        vec!["memory".to_string()],
        4000,
        true,
    ).await.unwrap();
    
    assert!(!response.content.is_empty());
    assert!(!response.sources.is_empty());
}
```

---

## 11. Performance Optimization

### 11.1 Caching

**Query Cache:**
```rust
struct RAGCache {
    cache: Arc<RwLock<HashMap<String, CachedResponse>>>,
}

struct CachedResponse {
    response: AttributedResponse,
    cached_at: DateTime<Utc>,
    ttl: Duration,
}
```

**Embedding Cache:**
```rust
struct EmbeddingCache {
    cache: Arc<RwLock<HashMap<String, Vec<f32>>>>,
}
```

### 11.2 Parallel Retrieval

```rust
async fn parallel_retrieval(
    query: String,
    sources: Vec<SourceType>,
) -> Result<Vec<RetrievalResult>, RetrievalError> {
    let tasks: Vec<_> = sources
        .into_iter()
        .map(|source| async move {
            retrieve_from_source(query.clone(), source).await
        })
        .collect();
    
    let results = futures::future::join_all(tasks).await;
    
    let all_results: Vec<RetrievalResult> = results
        .into_iter()
        .filter_map(|r| r.ok())
        .flatten()
        .collect();
    
    Ok(all_results)
}
```

---

## 12. Implementation Plan

### Phase 1: Core Retrieval (Week 1-2)
- Implement memory retrieval
- Implement knowledge graph retrieval
- Implement external source retrieval
- Unit tests

### Phase 2: Ranking and Compression (Week 3-4)
- Implement ranking algorithm
- Implement context compression
- Implement context prioritization
- Integration tests

### Phase 3: Assembly and Generation (Week 5-6)
- Implement context assembly
- Implement attribution
- Implement freshness tracking
- End-to-end tests

### Phase 4: Optimization (Week 7-8)
- Implement caching
- Implement parallel retrieval
- Performance tuning
- Load testing

---

## 13. References

- RAG Paper: "Retrieval-Augmented Generation for Knowledge-Intensive NLP"
- LangChain RAG Documentation
- LlamaIndex RAG Documentation
- Qdrant Documentation
- OpenAI Embeddings API

---

**Document Status:** Draft
**Next Review:** 2026-11-15
**Approved By:** [Pending]
