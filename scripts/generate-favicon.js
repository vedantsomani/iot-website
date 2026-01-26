const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/logo-iot.png');
const outputDir = path.join(__dirname, '../src/app');

async function generateFavicons() {
    try {
        // Generate optimized icon.png (32x32 - standard favicon size)
        await sharp(inputPath)
            .resize(32, 32, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png({ quality: 100 })
            .toFile(path.join(outputDir, 'icon.png'));
        
        console.log('✓ Generated icon.png (32x32)');

        // Generate apple-icon.png (180x180 - Apple touch icon)
        await sharp(inputPath)
            .resize(180, 180, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png({ quality: 100 })
            .toFile(path.join(outputDir, 'apple-icon.png'));
        
        console.log('✓ Generated apple-icon.png (180x180)');

        console.log('\nFavicons generated successfully!');
    } catch (error) {
        console.error('Error generating favicons:', error);
    }
}

generateFavicons();
