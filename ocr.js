function otsuThreshold(hist, total) {
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0, weightB = 0, maximum = 0, threshold = 145;
  for (let i = 0; i < 256; i++) {
    weightB += hist[i];
    if (!weightB) continue;
    const weightF = total - weightB;
    if (!weightF) break;
    sumB += i * hist[i];
    const meanB = sumB / weightB;
    const meanF = (sum - sumB) / weightF;
    const variance = weightB * weightF * Math.pow(meanB - meanF, 2);
    if (variance > maximum) { maximum = variance; threshold = i; }
  }
  return threshold;
}

export function preprocessForOcr(sourceCanvas) {
  const factor = sourceCanvas.width < 1800 ? 1.5 : 1;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sourceCanvas.width * factor);
  canvas.height = Math.round(sourceCanvas.height * factor);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const hist = new Array(256).fill(0);
  for (let i = 0; i < image.data.length; i += 4) {
    const g = Math.round(.299 * image.data[i] + .587 * image.data[i+1] + .114 * image.data[i+2]);
    hist[g]++;
  }
  const threshold = Math.max(105, Math.min(205, otsuThreshold(hist, canvas.width * canvas.height)));
  for (let i = 0; i < image.data.length; i += 4) {
    const g = Math.round(.299 * image.data[i] + .587 * image.data[i+1] + .114 * image.data[i+2]);
    const contrasted = g < threshold ? 0 : 255;
    image.data[i] = image.data[i+1] = image.data[i+2] = contrasted;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

export async function ocrCanvas(canvas, onProgress = () => {}) {
  if (!window.Tesseract) throw new Error('Tesseract OCR library did not load. Check your internet connection.');
  const prepared = preprocessForOcr(canvas);
  const result = await window.Tesseract.recognize(prepared, 'eng', {
    logger: message => {
      if (message.status === 'recognizing text') onProgress(Math.round((message.progress || 0) * 100));
    }
  });
  return result.data.text || '';
}
