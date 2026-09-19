---
name: backend-api
description: Use this skill when architecting backend APIs, designing RESTful or GraphQL endpoints, writing Node.js/Express or serverless edge functions, handling authentication, or implementing data validation and rate limiting.
---

# Backend API Engineering & Server Architecture

This skill provides enterprise-grade patterns for designing high-throughput, resilient backend services, REST/GraphQL APIs, rate limiters, and serverless edge functions.

---

## 1. Clean Controller-Service-Repository Pattern

```typescript
// 1. Controller Layer: Handles HTTP protocols & validation
export async function createProjectHandler(req: Request, res: Response) {
  try {
    const validatedData = ProjectSchema.parse(req.body); // Zod validation
    const project = await ProjectService.create(validatedData, req.user.id);
    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    return handleError(error, res);
  }
}

// 2. Service Layer: Business logic & transactions
export class ProjectService {
  static async create(dto: CreateProjectDTO, userId: string) {
    // Business rules, permission checks, audit logging
    return await ProjectRepository.save({ ...dto, ownerId: userId });
  }
}
```

---

## 2. Robust API Error Handling & Structured Response Format

Every API endpoint must return consistent, structured JSON responses:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested asset with ID 'xyz-123' does not exist.",
    "timestamp": "2026-09-18T12:00:00.000Z",
    "requestId": "req-98f24a"
  }
}
```

---

## 3. Security & Rate Limiting Middleware

```javascript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Try again later.' }
  }
});
```
