---
name: devops-cloud
description: Use this skill when writing Dockerfiles, docker-compose configs, CI/CD pipelines (GitHub Actions), deploying to cloud platforms (Vercel, AWS, GCP), managing environment variables, or setting up automated builds.
---

# DevOps, Cloud & CI/CD Infrastructure Engineering

This skill provides production-grade containerization, continuous integration/continuous deployment (CI/CD) pipelines, cloud architecture blueprints, and automated deployment runbooks.

---

## 1. Multi-Stage Production Dockerfile Recipe (Node.js & Web)

```dockerfile
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime with minimal attack surface
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. GitHub Actions CI/CD Pipeline (`.github/workflows/deploy.yml`)

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter & Tests
        run: |
          npm run lint --if-present
          npm test --if-present

      - name: Build Bundle
        run: npm run build
```

---

## 3. Cloud Deployment Best Practices

1. **Immutable Deployments**: Never mutate code on live servers; deploy new versioned artifacts/containers and switch traffic cleanly.
2. **Secret Management**: Never commit `.env` files or API keys. Inject environment variables via cloud secrets managers (GitHub Secrets, AWS Secrets Manager, Vercel Environment Variables).
3. **Edge Caching & CDN**: Deliver static assets (`/assets/*`) through a Global CDN with `Cache-Control: public, max-age=31536000, immutable`.
