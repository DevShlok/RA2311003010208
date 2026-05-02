import sys
from PIL import Image, ImageDraw, ImageFont

def create_image(text_file, output_image):
    with open(text_file, 'r', encoding='utf-16') as f:
        text = f.read()

    lines = text.split('\n')
    
    # Try to use a monospace font if available, else default
    try:
        font = ImageFont.truetype("cour.ttf", 16)
    except IOError:
        try:
            font = ImageFont.truetype("consola.ttf", 16)
        except IOError:
            font = ImageFont.load_default()

    # Calculate image size
    # Using a dummy image to calculate text bounding box
    dummy_img = Image.new('RGB', (1, 1))
    draw = ImageDraw.Draw(dummy_img)
    
    max_width = 0
    total_height = 0
    line_spacing = 4
    
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        width = bbox[2] - bbox[0]
        height = bbox[3] - bbox[1]
        
        # If height is 0 (empty line), give it some default height
        if height == 0:
            height = 16
            
        max_width = max(max_width, width)
        total_height += height + line_spacing
        
    width = max_width + 40
    height = total_height + 40
    
    # Create the actual image
    img = Image.new('RGB', (int(width), int(height)), color=(30, 30, 30))
    draw = ImageDraw.Draw(img)
    
    y_text = 20
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_height = bbox[3] - bbox[1]
        if line_height == 0:
            line_height = 16
            
        draw.text((20, y_text), line, font=font, fill=(230, 230, 230))
        y_text += line_height + line_spacing
        
    img.save(output_image)

if __name__ == "__main__":
    create_image("output.txt", "screenshot.png")
