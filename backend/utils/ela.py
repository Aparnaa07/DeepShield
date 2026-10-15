
import numpy as np
from PIL import Image
import io
import base64


def compute_ela(image_bytes: bytes, quality: int = 90) -> dict:
    try:
                                 
        original = Image.open(io.BytesIO(image_bytes)).convert("RGB")

                                                                         
        buffer = io.BytesIO()
        original.save(buffer, format="JPEG", quality=quality)
        buffer.seek(0)
        resaved = Image.open(buffer).convert("RGB")

                                                          
        orig_array = np.array(original, dtype=np.float64)
        resaved_array = np.array(resaved, dtype=np.float64)

                                                                  
        diff = np.abs(orig_array - resaved_array) * 10                                   
        diff = np.clip(diff, 0, 255).astype(np.uint8)

                              
        max_diff = float(np.max(diff))
        mean_diff = float(np.mean(diff))

                                                 
                                                    
                                                       
        score = min(mean_diff / 30.0, 1.0)

                                                           
        ela_image = Image.fromarray(diff)
        ela_buffer = io.BytesIO()
        ela_image.save(ela_buffer, format="PNG")
        ela_b64 = base64.b64encode(ela_buffer.getvalue()).decode("utf-8")

        return {
            "score": round(score, 3),
            "ela_image_b64": ela_b64,
            "max_diff": round(max_diff, 2),
            "mean_diff": round(mean_diff, 2),
            "interpretation": (
                "Low tampering" if score < 0.3
                else "Moderate tampering" if score < 0.6
                else "High tampering detected"
            )
        }

    except Exception as e:
        return {
            "score": 0.0,
            "ela_image_b64": None,
            "error": str(e)
        }
