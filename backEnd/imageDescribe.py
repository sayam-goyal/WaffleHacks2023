from transformers import pipeline

image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")

print(image_to_text('image.jpg')[0]['generated_text'])