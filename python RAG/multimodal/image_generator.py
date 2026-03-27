import requests
from PIL import Image
from io import BytesIO
import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

API_URL = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def generate_image(prompt):

    full_prompt = f"""
    Professional educational infographic.

    {prompt}

    style:
    clean layout,
    flat design,
    vector icons,
    corporate infographic,
    white background
    """

    response = requests.post(
        API_URL,
        headers=headers,
        json={"inputs": full_prompt},
    )

    # 🔥 IMPORTANT DEBUG
    if response.status_code != 200:
        print("❌ API Error:", response.status_code)
        print(response.text)
        return None

    # 🔥 Check if response is actually image
    content_type = response.headers.get("content-type", "")

    if "image" not in content_type:
        print("❌ Not an image, got:")
        print(response.text)
        return None

    # ✅ Safe image loading
    image = Image.open(BytesIO(response.content))
    image.save("infographic.png")

    return "infographic.png"