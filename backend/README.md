# Backend Server (Prompt.fun)

This backend orchestrates:
- **Gemini LLM**: For prompt parsing and intent extraction (Gemini 1.5 Flash, free tier)
- **RAG Server**: For knowledge retrieval and Copilot answers
- **MongoDB**: For user, token, XP, and transactional data

## Structure
- `main.py` (FastAPI entrypoint)
- `services/` (Gemini, RAG, MongoDB interaction logic)
- `models/` (Pydantic models for requests/responses)
- `.env` (API keys, DB URIs)

## Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```
GEMINI_API_KEY=your_google_gemini_api_key
RAG_SERVER_URL=http://localhost:8000/query
MONGO_URI=mongodb://localhost:27017
```

## Quickstart
1. Install dependencies: `pip install -r requirements.txt`
2. Set up `.env` with Gemini, RAG, and MongoDB credentials
3. Run: `uvicorn main:app --reload`

## Endpoints

### POST /parse
- **Body:** `{ "prompt": "How do I buy DOGE?" }`
- **Returns:** `{ "intent": "buy", "entities": {"token": "DOGE"}, ... }`

### POST /ask
- **Body:** `{ "question": "What is Prompt.fun?" }`
- **Returns:** `{ "answer": "Prompt.fun is...", ... }`

---

**Next:** Implement token/XP endpoints and connect to frontend. 