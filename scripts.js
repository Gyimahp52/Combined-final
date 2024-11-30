// File: image-optimizer-display.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Directories for input and output
const inputDir = path.join(__dirname, 'image');
const outputDir = path.join(__dirname, 'optimized');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to optimize images
const optimizeImages = async () => {
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file)); // Only image files

  for (const file of imageFiles) {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);

    try {
      await sharp(inputFilePath)
        .resize(800) // Resize width to 800px, keeping aspect ratio
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toFile(outputFilePath);

      console.log(`Optimized: ${file}`);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err.message);
    }
  }
};

// Function to display optimized images
const displayImages = () => {
  const app = express();

  // Serve the optimized images directory
  app.use('/optimized', express.static(outputDir));

  // Route to display images as HTML
  app.get('/', (req, res) => {
    const files = fs.readdirSync(outputDir);
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file)); // Filter image files

    // Create an HTML page to display images
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Optimized Images</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .gallery { display: flex; flex-wrap: wrap; gap: 20px; }
          .gallery img { width: 200px; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 5px; }
          .gallery img:hover { box-shadow: 0 0 10px rgba(0,0,0,0.5); }
        </style>
      </head>
      <body>
        <h1>Optimized Images Gallery</h1>
        <div class="gallery">
          ${imageFiles.map((file) => `<img src="/optimized/${file}" alt="${file}">`).join('')}
        </div>
      </body>
      </html>
    `;

    res.send(html);
  });

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

// Main function
(async () => {
  console.log('Optimizing images...');
  await optimizeImages();
  console.log('Image optimization complete.');
  console.log('Starting server to display images...');
  displayImages();
})();
