import os
import traceback
from dotenv import load_dotenv
from groq import Groq

from crewai import Agent, Task, Crew, LLM

load_dotenv()

# GROQ CLIENT
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"

# CREWAI LLM WRAPPER
llm = LLM(model=MODEL)


def groq_call(self, prompt, **kwargs):
    try:
        # normalize prompt
        if isinstance(prompt, list):
            prompt = "\n".join(
                msg.get("content", "") for msg in prompt if isinstance(msg, dict)
            )
        elif isinstance(prompt, dict):
            prompt = prompt.get("content", "")

        if not prompt:
            prompt = "Explain insurance simply."

        print("\n[LLM CALL → GROQ]")
        print("Prompt length:", len(prompt))

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are an insurance expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )

        text = response.choices[0].message.content.strip()

        if not text:
            return "No valid response generated."

        return text

    except Exception as e:
        print("\n[LLM ERROR]")
        print("TYPE:", type(e))
        print("ERROR:", repr(e))
        traceback.print_exc()
        print("----------------------------------")

        return "LLM failed."


# bind override
llm.call = groq_call.__get__(llm, LLM)


# CREW EXECUTION
def run_explain_agents(query: str, context: str, history: str):
    try:
        print("\n🚀 Crew Execution Started")

        # -----------------------------
        # Agent 1: Researcher
        # -----------------------------
        researcher = Agent(
            role="Insurance Researcher",
            goal="Extract key facts from context",
            backstory="Expert in insurance policies",
            llm=llm,
            verbose=True
        )

        # Agent 2: Advisor
        advisor = Agent(
            role="Insurance Advisor",
            goal="Explain clearly and concisely",
            backstory="Professional advisor helping users understand insurance",
            llm=llm,
            verbose=True
        )

        # Task 1
        task1 = Task(
            description=f"""
Extract key facts from the following context:

{context}
""",
            expected_output="Bullet points of key facts",
            agent=researcher
        )

        # Task 2
        task2 = Task(
            description=f"""
Explain the following query:

{query}

Recent Conversation History (for context and pronouns):
{history}

Rules:
- Simple language
- Practical explanation
- No jargon
- Use the conversation history to understand pronouns like "it" or "that".
""",
            expected_output="Clear explanation",
            agent=advisor,
            context=[task1]
        )

        # Crew
        crew = Crew(
            agents=[researcher, advisor],
            tasks=[task1, task2],
            verbose=True
        )

        result = crew.kickoff()

        print("\n🏁 Crew Execution Completed")

        if not result:
            raise ValueError("Empty crew result")

        return str(result)

    except Exception as e:
        print("\n❌ CREW ERROR")
        traceback.print_exc()
        return "Failed to generate explanation."