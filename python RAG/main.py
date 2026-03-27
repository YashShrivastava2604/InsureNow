from agents.crew_agents import run_agents
from multimodal.image_generator import generate_image
from PIL import Image

def main():
    query = input("Ask insurance question: ")

    print("\nRunning RAG + Agents...\n")
    result = run_agents(query)

    print("\nText Explanation:\n")
    print(result)

    print("\nGenerating infographic...\n")
    image_path = generate_image(str(result))

    if image_path:
        print("Image saved:", image_path)

        # 🔥 SHOW IMAGE
        img = Image.open(image_path)
        img.show()

    else:
        print("Image generation failed ❌")

if __name__ == "__main__":
    main()