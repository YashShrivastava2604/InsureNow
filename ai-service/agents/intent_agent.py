import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def detect_intent(query: str, session: dict) -> dict:
    """
    Uses an ultra-fast LLM call to extract BOTH the intent and the insurance type.
    By passing the session history, it understands context like "I want to buy one".
    """
    # Grab the last few messages for context
    history = session.get("history", [])[-4:]
    history_str = "\n".join([f"{m['role']}: {m['content']}" for m in history])
    
    prompt = f"""
    Analyze the user's latest query and the conversation history.
    Determine:
    1. Intent: "BUY" (purchase, pricing, view plans), "EXPLAIN" (what is it, how it works), or "GREETING".
    2. Type: The specific insurance type (e.g., "health", "car", "life", "family"). If they say "buy one" or "it", figure out the type from the history. If unknown, output null.

    History:
    {history_str}

    Latest Query: {query}

    Respond ONLY in valid JSON format: {{"intent": "BUY|EXPLAIN|GREETING", "type": "health|car|life|null"}}
    """

    try:
        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0
        )
        data = json.loads(res.choices[0].message.content)
        
        # MASTER TRICK: Save the detected type directly into memory!
        extracted_type = data.get("type")
        if extracted_type and extracted_type != "null":
            session["last_topic"] = extracted_type.lower()
            
        return data
    except Exception as e:
        print(f"[INTENT ERROR] {e}")
        return {"intent": "EXPLAIN", "type": None}