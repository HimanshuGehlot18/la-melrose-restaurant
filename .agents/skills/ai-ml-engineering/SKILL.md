---
name: ai-ml-engineering
description: Use this skill when integrating LLM APIs (Gemini, OpenAI, Claude), building Retrieval-Augmented Generation (RAG) pipelines, managing vector embeddings, designing autonomous AI agents, or prompt engineering.
---

# AI/ML Engineering & LLM Systems Integration

This skill provides production patterns for integrating Large Language Model (LLM) APIs, building Retrieval-Augmented Generation (RAG) pipelines, managing vector embeddings, and creating autonomous agent architectures.

---

## 1. High-Reliability LLM API Integration Pattern

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateContentWithFallback(prompt, systemInstruction) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  });

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('LLM Generation Error:', error);
    throw new Error('AI Service temporarily unavailable. Please retry.');
  }
}
```

---

## 2. Production RAG (Retrieval-Augmented Generation) Architecture

```
User Query ──> Embed Query ──> Cosine Similarity Search (Vector DB)
                                           │
                                Top K Relevant Documents
                                           ▼
Prompt = [System Role] + [Retrieved Context] + [User Query]
                                           ▼
                                      LLM Output
```

### Vector Search Best Practices
* **Chunking Strategy**: Chunk documents into 300–500 token segments with 50-token overlaps to preserve semantic continuity.
* **Metadata Filtering**: Always attach metadata (date, author, category, project tag) to vectors to narrow search space before running cosine distance.
* **Hybrid Search**: Combine dense vector similarity (semantic match) with BM25 keyword search (exact match) for maximum recall.

---

## 3. Structured JSON Generation & Guardrails

Always force structured schema generation using Pydantic or JSON Schemas:
* Do not parse freeform markdown when predictable data is required.
* Validate all LLM responses against schemas before saving to database or returning to users.
