
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
import librosa
import numpy as np
from PIL import Image
import os
import argparse
from pathlib import Path


def prepare_spectrograms(audio_dir: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    audio_files = list(Path(audio_dir).glob("**/*.flac")) + list(Path(audio_dir).glob("**/*.wav"))
    print(f"Converting {len(audio_files)} audio files to spectrograms...")

    for i, audio_path in enumerate(audio_files):
        try:
            audio, sr = librosa.load(str(audio_path), sr=16000, mono=True)

                                            
            target = sr * 3
            if len(audio) > target:
                audio = audio[:target]
            else:
                audio = np.pad(audio, (0, target - len(audio)))

                                      
            mel = librosa.feature.melspectrogram(y=audio, sr=sr, n_mels=128, hop_length=512)
            mel_db = librosa.power_to_db(mel, ref=np.max)

                                
            mel_norm = ((mel_db - mel_db.min()) / (mel_db.max() - mel_db.min() + 1e-8) * 255).astype(np.uint8)
            mel_norm = np.flipud(mel_norm)

                                   
            img = Image.fromarray(mel_norm, mode='L')
            out_path = os.path.join(output_dir, audio_path.stem + ".png")
            img.save(out_path)

            if i % 100 == 0:
                print(f"  {i}/{len(audio_files)} converted")

        except Exception as e:
            print(f"  Error on {audio_path.name}: {e}")

    print(f"Done. Spectrograms saved to: {output_dir}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir",   type=str, default="../../data/audio")
    parser.add_argument("--output_dir", type=str, default="./")
    parser.add_argument("--epochs",     type=int, default=15)
    parser.add_argument("--batch_size", type=int, default=32)
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on: {device}")

                                                 
    transform = transforms.Compose([
        transforms.Grayscale(num_output_channels=1),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5], std=[0.5]),
    ])

    train_dataset = ImageFolder(os.path.join(args.data_dir, "train"), transform)
    val_dataset   = ImageFolder(os.path.join(args.data_dir, "val"),   transform)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True,  num_workers=4)
    val_loader   = DataLoader(val_dataset,   batch_size=args.batch_size, shuffle=False, num_workers=4)

                                            
    model = models.resnet18(pretrained=True)
    model.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
    model.fc = nn.Linear(model.fc.in_features, 2)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

    best_val_acc = 0.0

    for epoch in range(args.epochs):
               
        model.train()
        correct = 0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            loss = criterion(model(images), labels)
            loss.backward()
            optimizer.step()
            correct += (model(images).argmax(1) == labels).sum().item()

                  
        model.eval()
        val_correct = 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                val_correct += (model(images).argmax(1) == labels).sum().item()

        val_acc = val_correct / len(val_dataset) * 100
        print(f"Epoch {epoch+1}/{args.epochs} | Val Acc: {val_acc:.2f}%")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), os.path.join(args.output_dir, "resnet18_voice_clone.pt"))
            print(f"  ✅ Best model saved!")

    print(f"\nDone! Best accuracy: {best_val_acc:.2f}%")


if __name__ == "__main__":
    main()
