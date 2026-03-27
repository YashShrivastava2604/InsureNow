from crewai import Agent, Task, Crew, LLM
from google import genai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# Create LLM
gemini_llm = LLM(model="models/gemini-2.5-flash")

# 🔥 FIX (important)
def gemini_call(self, prompt, **kwargs):
    # Convert CrewAI format → simple text
    if isinstance(prompt, list):
        prompt = "\n".join(
            msg.get("content", "") for msg in prompt if isinstance(msg, dict)
        )

    elif isinstance(prompt, dict):
        prompt = prompt.get("content", "")

    response = client.models.generate_content(
        model=self.model,
        contents=prompt
    )

    return response.text

# Bind function
gemini_llm.call = gemini_call.__get__(gemini_llm, LLM)


def run_agents(query):
    context = "Insurance protects you from financial loss."

    # Agents
    researcher = Agent(
        role="Researcher",
        goal="Find key points",
        backstory="Expert",
        llm=gemini_llm
    )

    teacher = Agent(
        role="Teacher",
        goal="Explain simply",
        backstory="Expert",
        llm=gemini_llm
    )

    # Tasks
    task1 = Task(
        description=f"Extract key facts about: {query}\nContext: {context}",
        expected_output="Key facts",
        agent=researcher
    )

    task2 = Task(
        description=f"Explain simply: {query}",
        expected_output="Simple explanation",
        agent=teacher,
        context=[task1]
    )

    # Crew
    crew = Crew(
        agents=[researcher, teacher],
        tasks=[task1, task2]
    )

    return crew.kickoff()


# Run
if __name__ == "__main__":
    result = run_agents("What is insurance?")
    print(result)