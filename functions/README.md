# Cloudflare Functions for AuthenticaDetector

This directory contains Cloudflare Pages Functions for server-side operations.

## Setup

### 1. KV Namespaces

Create these KV namespaces in your Cloudflare dashboard:

- `RATE_LIMIT_KV` - For rate limiting API requests
- `LEARNING_KV` - For storing global learning data
- `STATS_KV` - For global statistics

### 2. Bind KV Namespaces

In your Cloudflare Pages project settings:

1. Go to Settings → Functions
2. Add KV namespace bindings:
   - Variable name: `RATE_LIMIT_KV`, KV namespace: (select your rate limit KV)
   - Variable name: `LEARNING_KV`, KV namespace: (select your learning KV)
   - Variable name: `STATS_KV`, KV namespace: (select your stats KV)

### 3. Deploy

Push to your repository - Cloudflare Pages will automatically deploy the functions.

## Endpoints

### POST /api/analyze
Enhanced server-side AI detection (requires image data).

**Request:**
```json
{
  "image": "data:image/jpeg;base64,...",
  "mode": "deep"
}
```

**Response:**
```json
{
  "score": 75,
  "confidence": "high",
  "signals": {...},
  "provider": "server-side-enhanced"
}
```

### POST /api/learn
Submit feedback to improve global AI model.

**Request:**
```json
{
  "signals": {...},
  "correct": true,
  "userSaidAI": true
}
```

### GET /api/learn
Get global optimized weights.

**Response:**
```json
{
  "noise": 0.18,
  "compression": 0.15,
  ...
  "samples": 1523
}
```

### GET /api/stats
Get global platform statistics.

**Response:**
```json
{
  "totalScans": 45234,
  "totalUsers": 1523,
  "aiDetected": 23456,
  "accuracy": "~87%"
}
```

## Local Development

```bash
npx wrangler pages dev . --kv RATE_LIMIT_KV --kv LEARNING_KV --kv STATS_KV
```

## Security

- Rate limiting: 50 requests/hour per IP
- CORS enabled for all origins (adjust in production)
- No authentication required (add for production)

## Future Enhancements

- [ ] Integrate real AI model (HuggingFace Inference API)
- [ ] Add authentication with JWT tokens
- [ ] Implement webhook for real-time learning updates
- [ ] Add caching layer for frequently analyzed images
- [ ] Implement batch analysis endpoint
