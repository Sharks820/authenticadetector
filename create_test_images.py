"""
Deep Scan Test Image Generator
Creates test images of various sizes for Deep Scan FFT testing

Usage: python create_test_images.py
Requirements: pip install pillow
"""

from PIL import Image
import os

def create_test_images():
    """Create test images with different sizes for Deep Scan testing"""

    # Create test images directory
    os.makedirs('test_images', exist_ok=True)

    # Test cases: (width, height, color, filename, description)
    test_cases = [
        (200, 200, 'blue', 'test_200x200_small.png', 'Small - FFT should run'),
        (256, 256, 'green', 'test_256x256_boundary.png', 'Boundary - FFT should run'),
        (257, 257, 'orange', 'test_257x257_just_over.png', 'Just over - FFT should skip'),
        (512, 512, 'red', 'test_512x512_medium.png', 'Medium - FFT should skip'),
        (1920, 1080, 'purple', 'test_1920x1080_hd.png', 'HD - FFT should skip'),
        (2048, 2048, 'yellow', 'test_2048x2048_large.png', 'Large - FFT should skip'),
    ]

    print("Creating test images for Deep Scan FFT testing...")
    print("=" * 70)

    for width, height, color, filename, description in test_cases:
        img = Image.new('RGB', (width, height), color)
        filepath = os.path.join('test_images', filename)
        img.save(filepath)
        print(f"✓ {filename}")
        print(f"  Size: {width}x{height} | Color: {color}")
        print(f"  Expected: {description}")
        print()

    print("=" * 70)
    print(f"✓ Test images created successfully in: test_images/")
    print(f"✓ Total files: {len(test_cases)}")
    print()
    print("Next steps:")
    print("1. Navigate to: https://authenticadetector-v7.pages.dev")
    print("2. Open browser DevTools (F12) → Console tab")
    print("3. Login and go to Deep Scan")
    print("4. Upload each test image and check console logs")
    print("5. Verify FFT runs/skips according to expectations")

if __name__ == '__main__':
    try:
        create_test_images()
    except ImportError:
        print("ERROR: PIL/Pillow not installed")
        print("Install with: pip install pillow")
        exit(1)
