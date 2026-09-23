/**
 * Utility functions for image processing, conversion, and SVG rendering to base64
 */

export async function svgToPngBase64(svgString: string, width = 850, height = 1100): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }

        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        URL.revokeObjectURL(blobURL);

        const base64Data = dataUrl.split(',')[1];
        resolve({
          data: base64Data,
          mimeType: 'image/jpeg',
        });
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(blobURL);
        reject(e);
      };

      img.src = blobURL;
    } catch (err) {
      reject(err);
    }
  });
}

export function readFileAsBase64(file: File): Promise<{ data: string; mimeType: string; name: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = file.type || 'image/jpeg';
      const base64Data = result.includes(',') ? result.split(',')[1] : result;
      resolve({
        data: base64Data,
        mimeType,
        name: file.name,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
