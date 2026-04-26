import httpx
import os

BASE_URL = os.getenv("BACKEND_URL", "http://backend:5000") + "/api"


async def get_plans(insurance_type: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BASE_URL}/buy",
                params={"type": insurance_type}
            )

            if response.status_code != 200:
                print("[BACKEND ERROR]:", response.text)
                return []

            return response.json()

    except Exception as e:
        print("[BACKEND EXCEPTION]:", repr(e))
        return []