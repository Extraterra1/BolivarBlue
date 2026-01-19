import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 192, name: 'icon-maskable-192x192.png', maskable: true },
  { size: 512, name: 'icon-maskable-512x512.png', maskable: true },
  { size: 180, name: 'apple-touch-icon.png' },
];

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'icon-template.svg');

async function generateIcons() {
  console.log('Generating PWA icons...');

  try {
    const svgBuffer = fs.readFileSync(svgPath);

    for (const { size, name, maskable } of sizes) {
      let svgContent = svgBuffer.toString();

      if (maskable) {
        const match = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        if (match) {
          const content = match[1];
          const paddedSize = size;
          const safeSize = Math.floor(size * 0.6);
          const padding = (paddedSize - safeSize) / 2;
          
          svgContent = `<svg width="${paddedSize}" height="${paddedSize}" viewBox="0 0 ${paddedSize} ${paddedSize}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${paddedSize}" height="${paddedSize}" fill="#000000"/>
  <g transform="translate(${padding}, ${padding}) scale(${safeSize/512})">
    ${content}
  </g>
</svg>`;
        }
      }

      await sharp(Buffer.from(svgContent))
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(publicDir, name));

      console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
