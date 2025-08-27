// Auto-crop margins from the Triveo logo using Jimp
// Input:  public/images/triveo-logo.png
// Output: public/images/triveo-logo-cropped.png

const path = require('path');
const fs = require('fs-extra');
const Jimp = require('jimp');

(async () => {
  try {
    const inPath = path.join(__dirname, '..', 'public', 'images', 'triveo-logo.png');
    const outPath = path.join(__dirname, '..', 'public', 'images', 'triveo-logo-cropped.png');

    if (!(await fs.pathExists(inPath))) {
      console.error(`Entrada no encontrada: ${inPath}`);
      process.exit(1);
    }

    const img = await Jimp.read(inPath);

    // Intento 1: autocrop por bordes similares (tolerancia baja para conservar el glow azul)
    img.autocrop({ tolerance: 0.002, cropOnlyFrames: false });

    // Seguridad: si el recorte resultara demasiado agresivo, garantizamos un padding mínimo
    const PADDING = 8; // px
    const w = img.bitmap.width;
    const h = img.bitmap.height;

    // Creamos un lienzo con padding y centramos la imagen
    const canvas = new Jimp(w + PADDING * 2, h + PADDING * 2, 0x00000000);
    canvas.composite(img, PADDING, PADDING);

    await canvas.writeAsync(outPath);

    console.log(`✅ Logo recortado guardado en: ${outPath}`);
  } catch (err) {
    console.error('❌ Error al recortar el logo:', err);
    process.exit(1);
  }
})();
