import io
import os
from pathlib import Path

import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

ROOT = Path(__file__).resolve().parent

app = FastAPI()

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        frontend_origin,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = ROOT.parent / "resnet18_model.onnx"
session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
input_name = session.get_inputs()[0].name


def make_input(image):
    image = image.resize((224, 224))
    pixels = np.asarray(image, dtype=np.float32) / 255.0
    pixels = (pixels - np.array([0.485, 0.456, 0.406], dtype=np.float32)) / np.array(
        [0.229, 0.224, 0.225], dtype=np.float32
    )
    return np.transpose(pixels, (2, 0, 1))[None, ...].astype(np.float32)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        image_bytes = await file.read()

        # Open image and convert to RGB
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        tensor = make_input(image)

        # Run the model
        output = session.run(None, {input_name: tensor})[0][0]
        exp_output = np.exp(output - np.max(output))
        probs = exp_output / exp_output.sum()
        prediction_index = int(np.argmax(probs))
        confidence = float(probs[prediction_index])

        # Return data formatted for React frontend
        return {
            "prediction": (
                "cancerous"
                if prediction_index == 1
                else "non-cancerous"
            ),
            "confidence": confidence,
            "probabilities": {
                "non-cancerous": float(probs[0]),
                "cancerous": float(probs[1]),
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )