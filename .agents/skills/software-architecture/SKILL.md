---
name: software-architecture
description: Use this skill when planning large-scale system designs, domain-driven architectures (DDD), event-driven systems, caching strategies, microservices boundaries, or scalability patterns.
---

# Software Architecture & System Design Engineering

This skill provides system architecture blueprints, distributed systems patterns, Domain-Driven Design (DDD) principles, and high-availability frameworks.

---

## 1. System Design Core Principles

1. **Single Responsibility & Cohesion**: Modules must do one thing with high internal cohesion.
2. **Loosely Coupled via Contracts**: Decouple modules via clear API contracts, interfaces, or message queues.
3. **Stateless Services for Horizontal Scaling**: Keep API nodes stateless; store session and transient state in Redis / centralized caches.
4. **Idempotency Everywhere**: All mutation operations (POST/PUT) must support idempotency keys to survive network retries safely.

---

## 2. Event-Driven Architecture Pattern

```
[Client] ──HTTP POST──> [API Gateway]
                              │
                    Publishes Event (JSON)
                              ▼
                      [Message Broker] (Kafka / RabbitMQ / Redis PubSub)
                       ├──> [Notification Worker Service]
                       ├──> [Analytics & Audit Service]
                       └──> [Background Processing Pipeline]
```

### Event Payload Schema Contract
```json
{
  "eventId": "evt_01J8F2A9",
  "eventType": "portfolio.project.published",
  "timestamp": "2026-09-18T12:00:00Z",
  "version": "1.0",
  "data": {
    "projectId": "proj_9921",
    "authorId": "usr_441",
    "publishedAt": "2026-09-18T12:00:00Z"
  }
}
```

---

## 3. Multi-Tier Caching Strategy (Cache-Aside Pattern)

```javascript
export async function getCachedData(key, fetchFromDbFn, ttlSeconds = 300) {
  // 1. Check Redis Cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Cache Miss: Fetch from source of truth
  const freshData = await fetchFromDbFn();
  if (freshData) {
    await redis.setex(key, ttlSeconds, JSON.stringify(freshData));
  }

  return freshData;
}
```
