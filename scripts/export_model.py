from pathlib import Path

import torch
from torchvision import models
from torch import nn

ROOT = Path(__file__).resolve().parent.parent
model_path = ROOT / "cinder_model.pth"
output_path = ROOT / "cinder_model.onnx"

model = models.resnet50(weights=None)
model.fc = nn.Linear(model.fc.in_features, 2)
model.load_state_dict(torch.load(model_path, map_location="cpu"))
model.eval()
dummy_input = torch.randn(1, 3, 224, 224)

torch.onnx.export(
    model,
    dummy_input,
    output_path,
    input_names=["image"],
    output_names=["logits"],
    dynamic_axes={"image": {0: "batch"}, "logits": {0: "batch"}},
    opset_version=17,
)

print(f"Exported {output_path}")