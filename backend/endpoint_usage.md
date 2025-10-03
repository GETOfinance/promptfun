# Backend Endpoint Usage Guide

This document describes all available backend endpoints for Prompt.fun, including methods, parameters, and example requests/responses.

---

## 1. /parse
- **POST**
- **Description:** Parse a prompt for intent and entities using Gemini.
- **Request:**
```json
{ "prompt": "Buy DOGE" }
```
- **Response:**
```json
{ "intent": "buy", "entities": { "token": "DOGE" }, "raw": { ... } }
```

---

## 2. /ask
- **POST**
- **Description:** Ask a question to the RAG server and get a knowledge answer.
- **Request:**
```json
{ "question": "What is Aptos?" }
```
- **Response:**
```json
{ "answer": "Aptos is a layer 1 blockchain...", "raw": { ... } }
```

---

## 3. /chat
- **POST**
- **Description:** Unified chat endpoint. Handles conversation, RAG, and action routing.
- **Request:**
```json
{
  "history": [
    { "role": "user", "content": "What is Aptos?" },
    { "role": "assistant", "content": "Aptos is a layer 1 blockchain..." }
  ],
  "message": "Buy DOGE"
}
```
- **Response (action):**
```json
{
  "response": "Okay, running buy for DOGE...",
  "history": [...],
  "action": { "type": "buy", "params": { "token": "DOGE" } }
}
```
- **Response (RAG):**
```json
{
  "response": "DOGE is a meme coin...",
  "history": [...],
  "action": null
}
```

---

## 4. /user/profile
- **GET**
  - **Params:** `address` (required), `xp` (optional, default 0)
  - **Example:** `/user/profile?address=0x123...&xp=2450`
- **POST**
  - **Body:** `{ "address": "0x123...", "xp": 2450 }`
- **Response:**
```json
{
  "address": "0x123...",
  "shortAddress": "0x123...",
  "level": 12,
  "rank": 17,
  "badge": "Rising Star",
  "joinDate": "Aug 2025",
  "nextLevelXP": 3000,
  "tokensCreated": 3,
  "tokensTraded": 28,
  "winRate": "68%",
  "streak": 5,
  "achievements": 8,
  "totalTrades": 156,
  "totalVolume": "15.2M APT"
}
```

---

## 5. /user/achievements
- **GET**
  - **Params:** `address` (required), `xp` (optional)
  - **Example:** `/user/achievements?address=0x123...&xp=2450`
- **POST**
  - **Body:** `{ "address": "0x123...", "xp": 2450 }`
- **Response:**
```json
[
  { "title": "First Launch", "description": "Created your first token", "icon": "🚀", "unlocked": true, "rarity": "Common" },
  ...
]
```

---

## 6. /user/quests
- **GET**
  - **Params:** `address` (required), `xp` (optional)
  - **Example:** `/user/quests?address=0x123...&xp=2450`
- **POST**
  - **Body:** `{ "address": "0x123...", "xp": 2450 }`
- **Response:**
```json
[
  { "title": "Daily Trader", "description": "Make 5 trades today", "progress": 3, "total": 5, "reward": "50 XP", "timeLeft": "18h" },
  ...
]
```

---

## 7. /user/activity
- **GET**
  - **Params:** `address` (required), `xp` (optional)
  - **Example:** `/user/activity?address=0x123...&xp=2450`
- **POST**
  - **Body:** `{ "address": "0x123...", "xp": 2450 }`
- **Response:**
```json
[
  { "action": "Launched", "token": "$ROCKET", "amount": "1000 tokens", "time": "2 hours ago", "type": "launch" },
  ...
]
```

---

## 8. /launch-token, /buy-token, /sell-token
- **POST**
- **Description:** Token actions (to be implemented as needed).
- **Request:** `{ ... }`
- **Response:** `{ "status": "launched" | "bought" | "sold", "raw": { ... } }`

---

**Note:** For all endpoints, XP must be fetched onchain in the frontend and sent to the backend as shown above. 