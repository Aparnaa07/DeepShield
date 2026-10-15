
import numpy as np
from sklearn.calibration import CalibratedClassifierCV


                                                                                 
                                                           
RISK_THRESHOLDS = {
    "LOW":      (0,  30),
    "MEDIUM":   (31, 60),
    "HIGH":     (61, 85),
    "CRITICAL": (86, 100),
}

                                            
RECOMMENDATIONS = {
    "LOW": (
        "Content appears authentic. No significant AI manipulation detected. "
        "Exercise standard due diligence."
    ),
    "MEDIUM": (
        "Some suspicious indicators detected. Manual review recommended before "
        "using this content as evidence or identity verification."
    ),
    "HIGH": (
        "Strong indicators of AI manipulation detected. Do NOT use as authentic "
        "media. Escalate to a senior analyst for review."
    ),
    "CRITICAL": (
        "HIGH CONFIDENCE AI GENERATION OR MANIPULATION DETECTED. "
        "This content is almost certainly synthetic. Do not use as authentic media. "
        "Report to relevant authorities if used for fraud."
    ),
}


def platt_scaling(raw_score: float, a: float = -2.5, b: float = 1.2) -> float:
    calibrated = 1.0 / (1.0 + np.exp(a * raw_score + b))
    return float(np.clip(calibrated, 0.0, 1.0))


def compute_final_score(module_scores: dict) -> dict:
    if not module_scores:
        return {
            "fraud_risk_score": 0,
            "risk_category": "LOW",
            "recommendation": RECOMMENDATIONS["LOW"],
            "raw_score": 0.0,
            "calibrated_score": 0.0,
        }

                                                                               
    total_weight = sum(m["weight"] for m in module_scores.values())
    normalized = {
        name: {
            "score": m["score"],
            "weight": m["weight"] / total_weight,             
        }
        for name, m in module_scores.items()
    }

                                                                                
    raw_score = sum(
        m["score"] * m["weight"]
        for m in normalized.values()
    )

                                                                                 
    calibrated_score = platt_scaling(raw_score)

                                                                                
    fraud_risk_score = int(round(calibrated_score * 100))

                                                                                 
    risk_category = "LOW"
    for category, (low, high) in RISK_THRESHOLDS.items():
        if low <= fraud_risk_score <= high:
            risk_category = category
            break

                                                                                
    module_breakdown = {
        name: {
            "raw_score": round(m["score"], 3),
            "weight": round(m["weight"], 3),
            "contribution": round(m["score"] * m["weight"], 3),
            "score_pct": round(m["score"] * 100, 1),
        }
        for name, m in normalized.items()
    }

    return {
        "fraud_risk_score": fraud_risk_score,
        "raw_score": round(raw_score, 4),
        "calibrated_score": round(calibrated_score, 4),
        "risk_category": risk_category,
        "recommendation": RECOMMENDATIONS[risk_category],
        "module_breakdown": module_breakdown,
    }


def get_risk_color(risk_category: str) -> str:
    colors = {
        "LOW":      "#22c55e",          
        "MEDIUM":   "#eab308",           
        "HIGH":     "#f97316",           
        "CRITICAL": "#ef4444",        
    }
    return colors.get(risk_category, "#6b7280")
