---
name: cybersecurity-appsec
description: Use this skill when auditing application security, mitigating OWASP Top 10 vulnerabilities, implementing secure authentication, configuring Content Security Policy (CSP), or hardening web systems.
---

# Cybersecurity & Application Security Engineering

This skill provides comprehensive procedures, threat modeling frameworks, and hardening runbooks to defend applications against the OWASP Top 10 vulnerabilities.

---

## 1. OWASP Top 10 Defense Matrix

| Vulnerability | Threat Vector | Mitigation Strategy |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | IDOR / Unauthorized data access | Enforce object-level permission checks in service layer (`req.user.id === resource.ownerId`). |
| **A02: Cryptographic Failures** | Plaintext secrets / weak hashes | Use Argon2 or bcrypt for passwords; enforce TLS 1.3 in transit and AES-256-GCM at rest. |
| **A03: Injection (SQL/XSS)** | Untrusted input executed as code | Use parameterized ORM queries; escape HTML outputs; deploy DOMPurify for user-rendered rich text. |
| **A04: Insecure Design** | Missing rate limits / anti-automation | Implement exponential backoff, CAPTCHA on abuse, and token bucket rate limiters. |
| **A05: Security Misconfiguration** | Default credentials / verbose errors | Strip stack traces from production responses; disable unused ports, headers, and directories. |

---

## 2. Hardened HTTP Security Headers

Deploy these headers on every reverse proxy (Nginx, Cloudflare, Vercel):

```nginx
# Prevent MIME sniffing
add_header X-Content-Type-Options "nosniff" always;

# Prevent clickjacking
add_header X-Frame-Options "DENY" always;

# Enforce HTTPS for 1 year
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Strict Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Content Security Policy (CSP)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;" always;
```

---

## 3. Secure Authentication & Session Hygiene

1. **Tokens in HTTP-Only Cookies**: Never store sensitive auth tokens in `localStorage` or `sessionStorage` (vulnerable to XSS). Store tokens in `httpOnly; Secure; SameSite=Strict` cookies.
2. **Short-Lived Access Tokens**: Use 15-minute access tokens paired with rotating refresh tokens stored in Redis with revocation blacklists.
