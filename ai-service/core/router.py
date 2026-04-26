from agents.intent_agent import detect_intent
from schemas.response_schema import text_response, error_response

from flows.explain_flow import explain_flow
from flows.buy_flow import start_buy_flow, continue_buy_flow

from core.logger import logger
from core.validation import validate_query, is_domain_relevant
from core.guardrails import detect_injection


def is_greeting(query: str):
    greetings = [
        "hi", "hello", "hey", "hii", "heyy",
        "good morning", "good evening", "good afternoon"
    ]
    return query.lower().strip() in greetings


async def handle_query(query: str, session: dict) -> dict:
    try:
        logger.info(f"Incoming query: {query}")

        # VALIDATION & GUARDRAILS
        is_valid, result = validate_query(query)
        if not is_valid: return text_response(result)
        query = result

        if is_greeting(query):
            return text_response("Hey! I'm your insurance advisor 🤖\nAsk me anything about insurance or buying plans.")
        
        if detect_injection(query):
            return text_response("I can't process that request.")

        # ---------------------------------------------------------
        # CONTEXT-AWARE DOMAIN GUARDRAIL
        # If we have NO active memory, we strictly check for keywords.
        # If we DO have memory, we let it pass to the LLM to figure out context.
        # ---------------------------------------------------------
        has_memory = bool(session.get("last_topic") or session.get("stage"))
        if not has_memory and not is_domain_relevant(query):
            return text_response("I can help with insurance-related queries like health, car, or life insurance.")

        # ---------------------------------------------------------
        # INTENT AND ROUTING
        # ---------------------------------------------------------
        intent_data = detect_intent(query, session)
        intent = intent_data.get("intent")
        logger.info(f"Detected intent: {intent}")

        # ESCAPE HATCH: If they ask a question, kill the BUY loop
        if intent == "EXPLAIN":
            session["stage"] = None  # Clear the state!
            return explain_flow(query, session)

        # CONTINUE BUY FLOW
        if session.get("stage"):
            logger.info(f"Continuing flow: {session.get('stage')}")
            return await continue_buy_flow(query, session)

        # START BUY FLOW
        if intent == "BUY":
            return await start_buy_flow(query, session)

        return text_response("I didn't fully understand. Can you rephrase?")

    except Exception:
        import traceback
        logger.error("Router error")
        traceback.print_exc()
        return error_response()