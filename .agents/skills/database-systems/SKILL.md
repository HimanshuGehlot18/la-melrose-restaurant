---
name: database-systems
description: Use this skill when modeling relational schemas (PostgreSQL, MySQL), NoSQL databases (MongoDB), writing complex SQL queries, optimizing indexes, designing migrations, or configuring Redis caching.
---

# Database Systems & Data Architecture Engineering

This skill provides industry best practices for relational and NoSQL database modeling, query tuning, indexing architectures, data migrations, and in-memory caches.

---

## 1. Relational Schema Modeling & Migration Standards (PostgreSQL)

### Clean Migration Pattern
```sql
-- Up Migration: Create projects table with UUID and indexing
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for high-speed queries
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);
```

---

## 2. Query Optimization & Indexing Rules

1. **Covering Indexes**: Include all columns required by the query to prevent expensive table heap lookups.
2. **Avoid Full Table Scans**: Never perform wildcard queries with leading `%` (e.g., `WHERE title LIKE '%foo'`) without a Generalized Inverted Index (GIN) or full-text search index (`to_tsvector`).
3. **Connection Pooling**: Always utilize a connection pooler (e.g., PgBouncer) to avoid exhaustion of database connections under high concurrent traffic.

---

## 3. Redis In-Memory Patterns

* **Key Naming Convention**: `namespace:entity:id:attribute` (e.g., `portfolio:project:proj_123:views`).
* **Atomic Counters**: Use `INCR` or `HINCRBY` for real-time counters (e.g., page views, like buttons) to eliminate race conditions.
