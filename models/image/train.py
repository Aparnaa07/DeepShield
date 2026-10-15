
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
import timm
import argparse
import os
from pathlib import Path


def get_args():
    parser = argparse.ArgumentParser(description="Train EfficientNet-B4 deepfake detector")
    parser.add_argument("--data_dir",   type=str, default="../../data/images")
    parser.add_argument("--output_dir", type=str, default="./")
    parser.add_argument("--epochs",     type=int, default=10)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--lr",         type=float, default=1e-4)
    return parser.parse_args()


def main():
    args = get_args()

                                         
                                                                 
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on: {device}")
    if device.type == "cpu":
        print("⚠️  CPU training is slow. Consider using Google Colab (free GPU):")
        print("    https://colab.research.google.com")

                                                                               
                                                                                 
    train_transform = transforms.Compose([
        transforms.Resize((380, 380)),
        transforms.RandomHorizontalFlip(),                                     
        transforms.ColorJitter(0.2, 0.2, 0.2, 0.1),                         
        transforms.RandomRotation(10),                                         
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
    ])

                                                                 
    val_transform = transforms.Compose([
        transforms.Resize((380, 380)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
    ])

                                                                               
                                                                     
                                       
    train_dataset = ImageFolder(os.path.join(args.data_dir, "train"), train_transform)
    val_dataset   = ImageFolder(os.path.join(args.data_dir, "val"),   val_transform)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True,  num_workers=4)
    val_loader   = DataLoader(val_dataset,   batch_size=args.batch_size, shuffle=False, num_workers=4)

    print(f"Training samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")

                                                                                
    model = timm.create_model("efficientnet_b4", pretrained=True, num_classes=2)
    model = model.to(device)

                                                                                
                                                   
    criterion = nn.CrossEntropyLoss()

                                                  
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr)

                                                                      
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, patience=3, factor=0.1, verbose=True
    )

    best_val_acc = 0.0

                                                                                
    for epoch in range(args.epochs):
                                                                                
        model.train()
        train_loss = 0.0
        train_correct = 0

        for batch_idx, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()                                
            outputs = model(images)                       
            loss = criterion(outputs, labels)
            loss.backward()                                  
            optimizer.step()                               

            train_loss += loss.item()
            preds = outputs.argmax(dim=1)
            train_correct += (preds == labels).sum().item()

            if batch_idx % 10 == 0:
                print(f"  Epoch {epoch+1}/{args.epochs} | Batch {batch_idx}/{len(train_loader)} | Loss: {loss.item():.4f}")

        train_acc = train_correct / len(train_dataset) * 100

                                                                                
        model.eval()
        val_loss = 0.0
        val_correct = 0

        with torch.no_grad():                                              
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                val_loss += loss.item()
                preds = outputs.argmax(dim=1)
                val_correct += (preds == labels).sum().item()

        val_acc = val_correct / len(val_dataset) * 100
        scheduler.step(val_loss)

        print(f"\nEpoch {epoch+1}/{args.epochs}")
        print(f"  Train Loss: {train_loss/len(train_loader):.4f} | Train Acc: {train_acc:.2f}%")
        print(f"  Val Loss:   {val_loss/len(val_loader):.4f} | Val Acc:   {val_acc:.2f}%")

                             
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            save_path = os.path.join(args.output_dir, "efficientnet_b4_deepfake.pt")
            torch.save(model.state_dict(), save_path)
            print(f"  ✅ New best model saved → {save_path}")

    print(f"\nTraining complete! Best validation accuracy: {best_val_acc:.2f}%")
    print(f"Model saved to: {args.output_dir}/efficientnet_b4_deepfake.pt")


if __name__ == "__main__":
    main()
