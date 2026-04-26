import traceback

from tools.rag_tool import retrieve
from agents.explain_agents import run_explain_agents
from tools.image_tool import generate_insurance_image

from schemas.response_schema import multi_response


# -----------------------------
# FALLBACK IMAGE
# -----------------------------
def fallback_image():
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAEACAYAAAB4Y3vSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QYWEQYV6zkRgAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABGSURBVHja7cEBAQAAAIIg/69uIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4GgABAAE6p9kAAAAASUVORK5CYII="


# -----------------------------
# TOPIC MEMORY DETECTION
# -----------------------------
def extract_topic(query: str):
    q = query.lower()

    if "health" in q:
        return "health"
    elif "car" in q or "vehicle" in q:
        return "car"
    elif "life" in q:
        return "life"

    return None


# -----------------------------
# EXPLAIN FLOW
# -----------------------------
def explain_flow(query: str, session: dict) -> dict:
    try:
        print("\n================ EXPLAIN FLOW START ================")
        print("Query:", query)

        topic = extract_topic(query)
        if topic:
            session["last_topic"] = topic
            print("[MEMORY] Updated topic:", topic)

        # STEP 1 — RAG
        print("\n[STEP 1] Retrieving context...")
        chunks = retrieve(query)
        context = "\n".join(chunks)

        # NEW: Extract conversation history (excluding the current prompt)
        history_list = session.get("history", [])[:-1] 
        history_text = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history_list])
        if not history_text:
            history_text = "No previous history."

        # STEP 2 — CREW AI
        print("\n[STEP 2] Running CrewAI...")
        explanation = run_explain_agents(query, context, history_text)

        # STEP 3 — IMAGE
        print("\n[STEP 3] Generating image...")
        image = generate_insurance_image(query, explanation)

        if not image:
            print("[IMAGE] Using fallback")
            image = fallback_image()

        print("\n================ EXPLAIN FLOW SUCCESS ================")

        return multi_response(
            text=str(explanation),
            image=image,
            metadata={}
        )

    except Exception as e:
        print("\n================ EXPLAIN FLOW ERROR ================")
        print("ERROR:", repr(e))
        traceback.print_exc()

        return multi_response(
            text="Something went wrong while generating explanation.",
            image=fallback_image(),
            metadata={"error": True}
        )