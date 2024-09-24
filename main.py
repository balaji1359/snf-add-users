import os
from PIL import Image, ImageDraw
import random

def generate_icon(size, filename):
    # Create a new image with a random background color
    color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    image = Image.new('RGB', (size, size), color)
    
    # Create a draw object
    draw = ImageDraw.Draw(image)
    
    # Draw a simple shape (circle) in the center with a contrasting color
    center = size // 2
    radius = size // 4
    contrast_color = (255 - color[0], 255 - color[1], 255 - color[2])
    draw.ellipse([center - radius, center - radius, center + radius, center + radius], fill=contrast_color)
    
    # Save the image
    image.save(filename)
    print(f"Generated {filename}")

def main():
    # Create 'images' directory if it doesn't exist
    if not os.path.exists('images'):
        os.makedirs('images')
    
    # Generate icons of different sizes
    generate_icon(16, 'images/icon16.png')
    generate_icon(48, 'images/icon48.png')
    generate_icon(128, 'images/icon128.png')

if __name__ == "__main__":
    main()
