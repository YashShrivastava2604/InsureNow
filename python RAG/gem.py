from google import genai

client = genai.Client(api_key="AIzaSyAD6DvyxJ3QEq1vHKsVvD8pLxODCPswnC0")

response = client.models.generate_content(
    model="models/gemini-2.5-flash",  # 👈 USE THIS
    contents="Explain insurance in simple words"
)

print(response.text)