# AuthenticaDetector Security Best Practices Guide

**Document Version:** 1.0
**Last Updated:** December 20, 2025
**Owner:** Security-Abuse Agent

---

## Table of Contents

1. [Development Security Guidelines](#development-security-guidelines)
2. [Input Validation & Sanitization](#input-validation--sanitization)
3. [Authentication & Session Security](#authentication--session-security)
4. [Database Security (Supabase RLS)](#database-security-supabase-rls)
5. [API Security](#api-security)
6. [File Upload Security](#file-upload-security)
7. [XSS Prevention](#xss-prevention)
8. [Secret Management](#secret-management)
9. [Deployment Security](#deployment-security)
10. [Security Testing Checklist](#security-testing-checklist)
11. [User Privacy Protection](#user-privacy-protection)

---

## Development Security Guidelines

### Code Review Security Checklist

Before merging any code, verify:

- [ ] No hardcoded secrets or API keys
- [ ] All user inputs are validated and sanitized
- [ ] No `eval()`, `Function()`, or `document.write()` with user data
- [ ] `innerHTML` only used with sanitized content
- [ ] All database queries use parameterized inputs
- [ ] Error messages don't expose sensitive information
- [ ] Debug/console.log statements removed from production paths
- [ ] File uploads validated (type, size, magic numbers)
- [ ] URLs validated before fetch operations

### Secure Coding Principles

1. **Defense in Depth**: Never rely on a single security control
2. **Principle of Least Privilege**: Only request permissions you need
3. **Fail Securely**: Errors should deny access, not grant it
4. **Don't Trust User Input**: Always validate and sanitize
5. **Security by Default**: Secure settings should be the default

---

## Input Validation & Sanitization

### Always Sanitize These Inputs

| Input Type | Validation Rules | Sanitization |
|------------|-----------------|--------------|
| Email | RFC 5322 format, max 254 chars | Lowercase, trim |
| Password | Min 6 chars, max 128 chars | Never log or store plain text |
| Display Name | Max 100 chars, no HTML | Strip HTML, trim |
| Description | Max 2000 chars | Strip HTML, escape special chars |
| URLs | Valid http/https, no internal IPs | Block localhost, 127.*, 192.168.* |
| Filenames | No path chars, max 255 chars | Remove <>:"/\|?* |

### JavaScript Sanitization Functions

```javascript
// Use AuthenticaSecurity module
const sanitizedEmail = AuthenticaSecurity.sanitize(input, 'email');
const sanitizedName = AuthenticaSecurity.sanitize(input, 'name');
const sanitizedText = AuthenticaSecurity.sanitize(input, 'text');
const sanitizedUrl = AuthenticaSecurity.sanitize(input, 'url');
```

### Server-Side (PostgreSQL) Validation

```sql
-- Add constraints to prevent oversized inputs
ALTER TABLE submissions
ALTER COLUMN context_description TYPE VARCHAR(2000);

-- Validate URL format
ALTER TABLE submissions
ADD CONSTRAINT valid_source_url CHECK (
    source_url IS NULL OR
    source_url ~ '^https?://[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}'
);
```

---

## Authentication & Session Security

### Password Requirements

- Minimum 6 characters (recommend 8+)
- Maximum 128 characters
- No common passwords (implement client-side check)
- Consider password strength indicator

### Session Management

```javascript
// Session timeout configuration
const SESSION_TIMEOUT_MS = 4 * 60 * 60 * 1000; // 4 hours

// Clear session on timeout
window.addEventListener('sessionTimeout', () => {
    // Logout user
    supabase.auth.signOut();
    // Redirect to login
    openLoginView();
});
```

### Authentication Best Practices

1. **Use Supabase Auth exclusively** - Don't implement custom auth
2. **Enable email confirmation** - Prevent fake accounts
3. **Implement rate limiting** on login attempts
4. **Log authentication events** for security monitoring
5. **Use HTTPS only** - Never transmit credentials over HTTP

### Multi-Factor Authentication (Future)

Consider implementing:
- TOTP (Time-based One-Time Password)
- Email-based codes for sensitive operations
- Biometric authentication for mobile

---

## Database Security (Supabase RLS)

### RLS Policy Principles

1. **Default Deny**: If no policy matches, access is denied
2. **Least Privilege**: Only grant necessary permissions
3. **Owner-Based Access**: Users should only modify their own data
4. **Public Read Carefully**: Only make truly public data readable

### RLS Policy Templates

```sql
-- User can only read their own private data
CREATE POLICY "Users read own data"
ON private_table FOR SELECT
USING (auth.uid() = user_id);

-- User can only insert data they own
CREATE POLICY "Users insert own data"
ON user_table FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User can only update their own data
CREATE POLICY "Users update own data"
ON user_table FOR UPDATE
USING (auth.uid() = user_id);

-- User can only delete their own data (with conditions)
CREATE POLICY "Users delete own data with conditions"
ON user_table FOR DELETE
USING (auth.uid() = user_id AND status != 'locked');
```

### Sensitive Tables Configuration

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| scans | Owner only | Owner only | Never | Owner only |
| profiles | Public | Owner only | Owner only | Never |
| user_stats | Public | Owner only | Owner only | Never |
| user_progression | Owner only | Owner only | Owner only | Never |
| submissions | Auth users | Owner only | Owner (pre-consensus) | Owner (pre-consensus) |
| votes | Auth users | Owner only | Never | Never |

---

## API Security

### Rate Limiting Configuration

```javascript
// Recommended rate limits
const RATE_LIMITS = {
    scan: { limit: 100, window: '1 hour' },       // 100 scans/hour
    vote: { limit: 50, window: '1 hour' },        // 50 votes/hour
    submission: { limit: 10, window: '24 hours' }, // 10 submissions/day
    login: { limit: 5, window: '15 minutes' }      // 5 login attempts/15min
};
```

### API Key Security

1. **Never expose service role key** in client code
2. **Anon key is expected** to be in client (protected by RLS)
3. **Rotate keys** if compromise suspected
4. **Use environment variables** for server-side keys
5. **Scope API tokens** to minimum required permissions

### Supabase Rate Limiting

Enable in Supabase Dashboard:
- Settings > API > Rate limiting
- Set appropriate limits per endpoint

---

## File Upload Security

### Validation Checklist

1. **MIME Type Check** - Whitelist allowed types
2. **Extension Check** - Verify file extension matches MIME
3. **Magic Number Check** - Verify file signature matches type
4. **Size Limit** - Enforce maximum file size
5. **Filename Sanitization** - Remove dangerous characters
6. **Content Validation** - Actually parse/load the image

### Implementation

```javascript
// Use AuthenticaSecurity module
const validation = await AuthenticaSecurity.validateFileUpload(file);
if (!validation.valid) {
    toast(validation.error);
    return;
}

// Optionally strip EXIF for privacy
const cleanImage = await AuthenticaSecurity.fileValidator.stripExif(file);
```

### Blocked File Types

- SVG (can contain JavaScript)
- HTML/HTM
- XML
- Any executable formats
- Files with double extensions (.jpg.exe)

### Image Processing Security

```javascript
// Safe image loading
function loadImageSecurely(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Image loaded successfully - it's a valid image
            resolve(img);
        };
        img.onerror = () => {
            reject(new Error('Invalid image file'));
        };
        img.src = URL.createObjectURL(file);
    });
}
```

---

## XSS Prevention

### Never Do This

```javascript
// DANGEROUS - XSS vulnerability
element.innerHTML = userInput;
element.innerHTML = `<p>${userDescription}</p>`;
element.innerHTML = '<img src="' + avatarUrl + '">';
```

### Do This Instead

```javascript
// SAFE - Using textContent for text
element.textContent = userInput;

// SAFE - Creating elements programmatically
const img = document.createElement('img');
img.src = AuthenticaSecurity.sanitize(avatarUrl, 'url') || '';
img.alt = 'Avatar';
element.appendChild(img);

// SAFE - Using escape function if innerHTML needed
element.innerHTML = `<p>${AuthenticaSecurity.sanitize(userInput, 'html')}</p>`;
```

### Content Security Policy

Add to index.html:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https:;
    connect-src 'self' https://vrvoyxxdlcpysthzjbeu.supabase.co https://*.supabase.co;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
">
```

### Safe DOM Manipulation Patterns

```javascript
// Pattern 1: Use textContent for user text
const userName = document.createElement('span');
userName.textContent = user.name; // SAFE

// Pattern 2: Build complex HTML with DOM methods
function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';

    const avatar = document.createElement('img');
    avatar.src = user.avatar_url || 'default-avatar.png';
    avatar.className = 'avatar';

    const name = document.createElement('h3');
    name.textContent = user.name;

    card.appendChild(avatar);
    card.appendChild(name);
    return card;
}
```

---

## Secret Management

### What Should NEVER Be in Code

- API keys (except Supabase anon key)
- Database passwords
- Service account credentials
- JWT secrets
- Encryption keys
- OAuth client secrets

### Secret Storage Hierarchy

| Secret Type | Where to Store |
|-------------|----------------|
| Supabase Anon Key | index.html (expected) |
| Supabase Service Role | Environment variable only |
| Cloudflare API Key | Environment variable only |
| Management API Keys | Environment variable only |
| OAuth Secrets | Backend environment only |

### .gitignore Must Include

```
# Secrets
.env
.env.local
.env.production
CLAUDE.md
credentials.json
*.key
*.pem
secrets/
```

### Verifying .gitignore

```bash
# Check if secret files are tracked
git ls-files | grep -E "(\.env|CLAUDE\.md|credentials)"

# If any files show up, remove them from git
git rm --cached CLAUDE.md
git commit -m "Remove secrets from tracking"
```

---

## Deployment Security

### Cloudflare Configuration

1. **Enable HTTPS Only**
   - SSL/TLS > Edge Certificates > Always Use HTTPS

2. **Security Headers** (via Transform Rules or Workers)
   ```
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   X-XSS-Protection: 1; mode=block
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: camera=(), microphone=(), geolocation=()
   ```

3. **Enable WAF** (Web Application Firewall)
   - Security > WAF > Managed Rules

4. **Rate Limiting**
   - Security > WAF > Rate limiting rules

5. **Bot Protection**
   - Security > Bots > Configure Bot Management

### Pre-Deployment Checklist

- [ ] Remove all console.log statements
- [ ] Remove debug endpoints
- [ ] Verify .gitignore excludes secrets
- [ ] Test all RLS policies
- [ ] Verify security headers
- [ ] Test rate limiting
- [ ] Run security scan

---

## Security Testing Checklist

### Before Each Release

- [ ] **Input Validation**: Test with XSS payloads
  - `<script>alert('XSS')</script>`
  - `<img src=x onerror=alert('XSS')>`
  - `javascript:alert('XSS')`

- [ ] **File Upload**: Test with malicious files
  - Oversized files (>10MB)
  - Wrong extension (.jpg that's actually .exe)
  - SVG with embedded JavaScript

- [ ] **Authentication**: Test edge cases
  - Rapid login attempts
  - Expired sessions
  - Token manipulation

- [ ] **Authorization**: Test RLS policies
  - Try accessing other users' data
  - Try modifying data without auth
  - Test admin-only operations

- [ ] **Rate Limiting**: Verify limits enforced
  - Scan limit (100/hour)
  - Vote limit (50/hour)
  - Submission limit (10/day)

### Monthly Security Audit

- [ ] Review Supabase audit logs
- [ ] Check for unusual patterns
- [ ] Rotate API keys if needed
- [ ] Update dependencies
- [ ] Review RLS policies
- [ ] Test backup/recovery

---

## User Privacy Protection

### Data Minimization

1. **Collect only necessary data**
   - Email (for auth)
   - Display name (for leaderboard)
   - Scan results (for history)

2. **Don't collect**
   - IP addresses (unless required)
   - Device fingerprints
   - Location data
   - Personal photos (beyond scanning)

### Data Retention

| Data Type | Retention Period | Auto-Delete |
|-----------|-----------------|-------------|
| Scan Results | Indefinite (user can delete) | On request |
| Uploaded Images | Session only | After scan |
| Audit Logs | 90 days | Yes |
| Rate Limit Records | 24 hours | Yes |
| Auth Sessions | 7 days inactive | Yes |

### Image Privacy

```javascript
// IMPORTANT: Images are processed locally, not uploaded
// Images are only stored if user explicitly submits to Hunt Mode

// Strip EXIF data for privacy
const cleanImage = await AuthenticaSecurity.fileValidator.stripExif(file);
```

### User Rights

Users should be able to:
- [ ] Delete their scan history
- [ ] Export their data
- [ ] Delete their account
- [ ] Opt out of leaderboards

### Privacy Policy Requirements

Ensure privacy policy covers:
- What data is collected
- How it's used
- Who it's shared with (Supabase, Cloudflare)
- Retention periods
- User rights

---

## Security Contacts

### Reporting Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Email: [security contact to be added]
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Emergency Contacts

- Supabase Support: https://supabase.com/dashboard/support
- Cloudflare Support: https://support.cloudflare.com/
- Project Lead: [to be added]

---

## Quick Reference Card

### Top 5 Security Rules

1. **Never trust user input** - Always validate and sanitize
2. **Use textContent, not innerHTML** - Prevents XSS
3. **Check rate limits** - Before every API call
4. **Validate file uploads** - MIME + extension + magic numbers
5. **Keep secrets secret** - Never in client code or git

### Security Functions Cheat Sheet

```javascript
// Sanitize inputs
AuthenticaSecurity.sanitize(input, 'email');
AuthenticaSecurity.sanitize(input, 'name');
AuthenticaSecurity.sanitize(input, 'text');
AuthenticaSecurity.sanitize(input, 'url');
AuthenticaSecurity.sanitize(input, 'html');

// Check rate limits
const result = AuthenticaSecurity.checkRateLimit('scan');
if (!result.allowed) {
    toast(`Rate limited. Try again in ${Math.ceil(result.resetIn/60000)} minutes`);
    return;
}

// Validate file
const validation = await AuthenticaSecurity.validateFileUpload(file);
if (!validation.valid) {
    toast(validation.error);
    return;
}
```

---

*Document maintained by Security-Abuse Agent*
*AuthenticaDetector 7-Agent Operating System*
