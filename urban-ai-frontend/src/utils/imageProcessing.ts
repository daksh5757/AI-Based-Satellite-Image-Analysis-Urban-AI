export async function analyzeImagePixels(imageUrl: string): Promise<{
  greenPercentage: number;
  urbanPercentage: number;
  waterPercentage: number;
  dominantColors: Array<{ color: string; percentage: number }>;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context failed');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let greenCount = 0;
        let urbanCount = 0;
        let waterCount = 0;
        const colorMap: Record<string, number> = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const hue = rgbToHue(r, g, b);
          const saturation = rgbToSaturation(r, g, b);
          const value = rgbToValue(r, g, b);

          if (isGreen(r, g, b, hue, saturation, value)) {
            greenCount++;
          } else if (isWater(r, g, b, hue, saturation, value)) {
            waterCount++;
          } else if (isUrban(r, g, b, value)) {
            urbanCount++;
          }

          const colorKey = `rgb(${r},${g},${b})`;
          colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
        }

        const totalPixels = data.length / 4;
        const greenPercentage = (greenCount / totalPixels) * 100;
        const waterPercentage = (waterCount / totalPixels) * 100;
        const urbanPercentage = (urbanCount / totalPixels) * 100;

        const dominantColors = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([color, count]) => ({
            color,
            percentage: (count / totalPixels) * 100,
          }));

        resolve({
          greenPercentage,
          urbanPercentage,
          waterPercentage,
          dominantColors,
        });
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

function rgbToHue(r: number, g: number, b: number): number {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let hue = 0;
  if (delta === 0) {
    hue = 0;
  } else if (max === rNorm) {
    hue = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
  } else if (max === gNorm) {
    hue = ((bNorm - rNorm) / delta + 2) * 60;
  } else {
    hue = ((rNorm - gNorm) / delta + 4) * 60;
  }

  return hue;
}

function rgbToSaturation(r: number, g: number, b: number): number {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const l = (max + min) / 2;

  if (max === min) {
    return 0;
  }

  return l > 0.5
    ? (max - min) / (2 - max - min)
    : (max - min) / (max + min);
}

function rgbToValue(r: number, g: number, b: number): number {
  return Math.max(r, g, b) / 255;
}

function isGreen(
  r: number,
  g: number,
  b: number,
  hue: number,
  saturation: number,
  value: number
): boolean {
  return (
    hue >= 75 &&
    hue <= 165 &&
    saturation > 0.2 &&
    value > 0.1 &&
    g > r &&
    g > b
  );
}

function isWater(
  r: number,
  g: number,
  b: number,
  hue: number,
  saturation: number,
  value: number
): boolean {
  return (
    hue >= 180 &&
    hue <= 260 &&
    saturation > 0.3 &&
    b > r &&
    b > g &&
    value > 0.2
  );
}

function isUrban(r: number, g: number, b: number, value: number): boolean {
  const grayness = Math.max(
    0,
    1 - Math.abs(r - g) / 255 - Math.abs(g - b) / 255 - Math.abs(r - b) / 255
  );
  return grayness > 0.7 && value > 0.3 && value < 0.95;
}

export function calculateNDVI(imageUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context failed');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let totalNDVI = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const nir = r;
          const red = b;

          if (nir + red > 0) {
            const ndvi = (nir - red) / (nir + red);
            totalNDVI += ndvi;
            count++;
          }
        }

        const averageNDVI = count > 0 ? totalNDVI / count : 0;
        const normalizedNDVI = (averageNDVI + 1) / 2 * 100;

        resolve(Math.max(0, Math.min(100, normalizedNDVI)));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

export function detectUrbanPatterns(pixelData: {
  greenPercentage: number;
  urbanPercentage: number;
  waterPercentage: number;
}): {
  buildingDensity: number;
  sprawlIndex: number;
  fragmentation: number;
} {
  const nonVegetatedArea = 100 - pixelData.greenPercentage - pixelData.waterPercentage;

  const buildingDensity = Math.min(100, (pixelData.urbanPercentage / nonVegetatedArea) * 100);

  const sprawlIndex = Math.max(0, Math.min(100, pixelData.greenPercentage * 1.5 - (pixelData.urbanPercentage * 0.5)));

  const compactness = pixelData.urbanPercentage > 0
    ? pixelData.greenPercentage / pixelData.urbanPercentage
    : 1;

  const fragmentation = Math.max(0, Math.min(100, 100 - (compactness * 20)));

  return {
    buildingDensity: Math.max(0, Math.min(100, buildingDensity)),
    sprawlIndex: Math.max(0, Math.min(100, sprawlIndex)),
    fragmentation: Math.max(0, Math.min(100, fragmentation)),
  };
}
