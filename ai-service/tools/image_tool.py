import os
import base64
import io
from huggingface_hub import InferenceClient
from PIL import Image

HF_TOKEN = os.getenv("HF_TOKEN")

client = InferenceClient(api_key=HF_TOKEN)

# Image Build Prompt
def build_prompt(query: str, explanation: str) -> str:
    safe_explanation = explanation[:250].replace('\n', ' ').strip()
    
    return f"""
Create a highly detailed, 100% wordless 3D conceptual illustration representing: "{query}".

Context to visualize: {safe_explanation}

Composition Rules (Dynamic Storytelling):

1. Central Hero Object: Generate ONE main high-quality 3D object that is the subject of the context.
   - IMPORTANT RESTRAINT: The model must dynamically choose the hero object based on the context. If the query is about health insurance, draw a 3D medical cross or a stylized 3D human form. If family insurance, draw a conceptual 3D family. If car or home insurance, draw that specific object. DO NOT DRAW CARS, HOUSES, OR HUMAN FORMS UNLESS DIRECTLY ASKED for auto, home, health, or family context, respectively.

2. Zones of Interaction: The image must be divided into a narrative flow between two zones:
   - ZONE 1: DYNAMIC RISKS (e.g., on the left/top). This area must contain icons and elements representing potential problems spezifc to the context (e.g., stylized crash icons, storm clouds, medical alert pings) that are moving towards the central hero.
   - ZONE 2: PROTECTED HERO & MITIGATION (e.g., in the center/bottom). The central hero is in this zone. Small, elegant mitigation symbols (like a stylized floating shield, a modern geometric umbrella, or a checkmark badge) are actively fending off the specific Dynamic Risks from Zone 1.

Style:
- Minimalist modern SaaS vector art.
- Soft lighting, smooth matte textures.
- Clean, uncluttered, and simple. Not everything needs to be present in the center. 
- You can use opposite contrast colors to draw attention to the hero object. Mostly keep the background dark.
- Elegant, premium, and corporate.

CRITICAL RESTRICTION:
- ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS, NO FONTS.
- Do not attempt to write anything. Purely visual icons and metaphors only.
"""

# Generate Image
def generate_insurance_image(query: str, explanation: str = ""):
    try:
        prompt = build_prompt(query, explanation)

        print("[IMAGE] Generating with FLUX.1-schnell...")

        image = client.text_to_image(
            prompt,
            model="black-forest-labs/FLUX.1-schnell",
        )

        if image is None:
            print("[IMAGE ERROR] No image returned")
            return None

        # Convert to BASE64
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        base64_image = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return f"data:image/png;base64,{base64_image}"

    except Exception as e:
        print("[IMAGE ERROR]:", repr(e))
        return None