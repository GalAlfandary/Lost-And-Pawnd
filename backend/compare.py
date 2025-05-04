#!/usr/bin/env python3

import requests
from io import BytesIO
from PIL import Image
import torch
from torch import nn
import torch.nn.functional as F
from torchvision import models, transforms

# import the Weights enums for all ResNet variants you support
from torchvision.models import (
    ResNet18_Weights, ResNet34_Weights,
    ResNet50_Weights, ResNet101_Weights,
    ResNet152_Weights
)


from PIL import UnidentifiedImageError

def download_and_preprocess_image(url, image_size=224):
    """
    Download an image from a URL and preprocess it for the model.
    Safely handles cases where Content-Type may be misleading.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15"
    }

    response = requests.get(url, headers=headers, timeout=10)

    try:
        img = Image.open(BytesIO(response.content)).convert('RGB')
    except UnidentifiedImageError:
        raise ValueError(f"❌ The content at the URL is not a valid image: {url}")
    except Exception as e:
        raise ValueError(f"❌ Error loading image: {str(e)}")

    preprocess = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],  # ImageNet means
            std=[0.229, 0.224, 0.225]    # ImageNet stds
        ),
    ])

    return preprocess(img).unsqueeze(0)  # Add batch dimension


def get_device(force_cpu=False):
    """
    Select device: GPU if available, otherwise CPU.
    """
    return 'cuda' if torch.cuda.is_available() and not force_cpu else 'cpu'

def extract_vector(img_tensor, extractor, device='cpu'):
    """
    Run a forward pass to get a feature vector (flattened).
    """
    img_tensor = img_tensor.to(device)
    with torch.no_grad():
        feats = extractor(img_tensor)         # shape: (1, 2048, 1, 1)
        feats = feats.view(feats.size(0), -1) # shape: (1, 2048)
        feats = F.normalize(feats, dim=1)     # L2-normalize
    return feats

def get_feature_extractor(model_name='resnet50', device='cpu'):
    """
    Load a pretrained ResNet via the new `weights=` API,
    strip off its final fc layer, and return it in eval() mode.
    """
    # map each model name to its default-weights enum
    weights_map = {
        'resnet18':  ResNet18_Weights.DEFAULT,
        'resnet34':  ResNet34_Weights.DEFAULT,
        'resnet50':  ResNet50_Weights.DEFAULT,
        'resnet101': ResNet101_Weights.DEFAULT,
        'resnet152': ResNet152_Weights.DEFAULT,
    }

    if model_name not in weights_map:
        raise ValueError(f"Unsupported model: {model_name}")

    # load with the proper weights enum instead of pretrained=True
    weights = weights_map[model_name]
    model = getattr(models, model_name)(weights=weights)

    # drop the final classification layer
    modules = list(model.children())[:-1]
    feature_extractor = torch.nn.Sequential(*modules)
    feature_extractor.to(device).eval()
    return feature_extractor

def cosine_sim(vec1, vec2):
    """
    Compute cosine similarity between two normalized vectors.
    """
    return F.cosine_similarity(vec1, vec2).item()

def get_sim_images_by_url(url1, url2, model_name='resnet50', size=224, threshold=0.5, force_cpu=False):
    """
    Compare two images from URLs using a feature extractor and cosine similarity.
    """
    device = get_device(force_cpu)
    extractor = get_feature_extractor(model_name=model_name, device=device)

    img1 = download_and_preprocess_image(url1, image_size=size)
    img2 = download_and_preprocess_image(url2, image_size=size)

    v1 = extract_vector(img1, extractor, device=device)
    v2 = extract_vector(img2, extractor, device=device)

    sim = cosine_sim(v1, v2)

    return sim

def compare_pets(post1, post2, model_name='resnet50', size=224, threshold=0.5, force_cpu=False):
    """
    Compare two pet images and return a similarity score or an error message.
    """
    try:
        url1 = post1['imageurl']
        petname1 = post1['petname']
        url2 = post2['imageurl']
        petname2 = post2['petname']

        sim = get_sim_images_by_url(url1, url2, model_name=model_name, size=size, threshold=threshold, force_cpu=force_cpu)

        result = {
            "pet1": petname1,
            "pet2": petname2,
            "similarity": sim,
            "is_similar": sim >= threshold
        }
        return {"result": result}

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}


def compare_pet_to_many(new_pet, other_pets, model_name='resnet50', size=224, threshold=0.5, force_cpu=False):
    """
    Compare one pet image to a list of other pets. Returns all similarity results in one JSON.
    """
    results = []
    try:
        device = get_device(force_cpu)
        extractor = get_feature_extractor(model_name=model_name, device=device)

        # Get vector for main pet image once
        img1 = download_and_preprocess_image(new_pet['imageurl'], image_size=size)
        vec1 = extract_vector(img1, extractor, device=device)

        # Compare to each other pet
        for other in other_pets:
            try:
                img2 = download_and_preprocess_image(other['imageurl'], image_size=size)
                vec2 = extract_vector(img2, extractor, device=device)
                sim = cosine_sim(vec1, vec2)
                results.append({
                    "postid": other.get("postid"),
                    "pet1": new_pet['petname'],
                    "pet2": other['petname'],
                    "similarity": sim,
                    "is_similar": sim >= threshold
                })
            except Exception as e:
                results.append({
                    "postid": other.get("postid"),
                    "pet1": new_pet['petname'],
                    "pet2": other.get('petname', 'unknown'),
                    "error": str(e)
                })


        return {"results": results}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}
