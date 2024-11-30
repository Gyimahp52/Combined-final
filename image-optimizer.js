// File: image-optimizer.js
const sharp = require('sharp');
const fs = require('fs');

// Paths
const inputDir = './image/';
// Directory with images
const outputDir = './optimized/'; // Output directory for optimized images

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// List of images to process
const image = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];

// Function to optimize images
const optimizeImage = async (imageName) => {
  const inputPath = `${inputDir}${imageName}`;
  const outputPath = `${outputDir}${imageName.split('.')[0]}.webp`;

  try {
    // Convert to WebP and resize
    await sharp(inputPath)
      .resize(1200) // Resize width to 1200px, keeping aspect ratio
      .toFormat('webp', { quality: 85 }) // Convert to WebP with quality 85
      .toFile(outputPath);

    console.log(`Optimized: ${outputPath}`);
  } catch (error) {
    console.error(`Error optimizing ${imageName}:`, error);
  }
};

// Process all images
image.forEach(optimizeImage);
