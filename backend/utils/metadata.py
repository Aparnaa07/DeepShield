
import exifread
import io
from datetime import datetime


                                                           
AI_SOFTWARE_SIGNATURES = [
    "stable diffusion", "midjourney", "dall-e", "dall·e",
    "generative", "ai generated", "artificial intelligence",
    "runway", "adobe firefly", "deepfake", "faceswap",
    "deepfaclab", "reface", "wombo"
]


def extract_metadata(file_bytes: bytes) -> dict:
    try:
        tags = exifread.process_file(io.BytesIO(file_bytes), details=False)
                                                       
        return {str(k): str(v) for k, v in tags.items()}
    except Exception:
        return {}


def analyze_metadata(file_bytes: bytes) -> dict:
    metadata = extract_metadata(file_bytes)
    flags = []
    suspicion_score = 0.0

                                                                               
                                                     
                                              
    if not metadata:
        flags.append("No EXIF metadata found — typical of AI-generated images")
        suspicion_score += 0.35

    else:
                                                                               
                                                             
        metadata_text = " ".join(str(v) for v in metadata.values()).lower()
        for sig in AI_SOFTWARE_SIGNATURES:
            if sig in metadata_text:
                flags.append(f"AI software signature detected: '{sig}'")
                suspicion_score += 0.5
                break

                                                                               
        has_camera = any("Make" in k or "Model" in k for k in metadata.keys())
        if not has_camera:
            flags.append("No camera make/model in metadata")
            suspicion_score += 0.15

                                                                               
        date_keys = [k for k in metadata if "DateTime" in k]
        if date_keys:
            date_str = str(metadata[date_keys[0]])
            try:
                                               
                photo_date = datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
                                                                            
                if photo_date > datetime.now():
                    flags.append(f"Metadata date is in the future: {date_str}")
                    suspicion_score += 0.3
            except ValueError:
                flags.append("Malformed date in metadata")
                suspicion_score += 0.1

                      
    suspicion_score = min(suspicion_score, 1.0)

    return {
        "score": round(suspicion_score, 3),
        "flags": flags,
        "metadata_fields_count": len(metadata),
        "metadata": metadata
    }
