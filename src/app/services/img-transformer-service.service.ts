import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { filesData } from 'src/models';

@Injectable({
  providedIn: 'root',
})
export class ImgTransformerServiceService {
  constructor() {}

  transformImage(file: File) {
    return new Promise((resolve, reject) => {
      try {
        const imageFile = file;
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (e: any) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.getImageData(0, 0, img.width, img.height);

            const dataurl = canvas.toDataURL('image/webp');

            resolve(dataurl);
          };
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  downloadZip(images: filesData[]) {
    const zip = new JSZip();

    for (const img of images) {
      zip.file(`${img.relativePath}.webp`, img.image.split(',')[1], {
        base64: true,
      });
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'photo-to-webp.zip');
    });
  }
}
