import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { filesData } from 'src/models';

@Injectable({
  providedIn: 'root'
})
export class ImgTransformerServiceService {

  constructor() { }

  transformImage(file:File){
    return new Promise((resolve , reject) => {
      try {
        let imageFile = file;
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function (e:any) {

            var img = new Image;
            img.src = e.target.result;
            img.onload = function (event) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0);
                ctx.getImageData(0, 0, img.width, img.height)

                var dataurl =  canvas.toDataURL('image/webp');

                resolve(dataurl)
            }
            
        }
        
      } catch (error) {

        reject(error)
        
      }
    })
  }

  downloadZip(images:filesData[]){

    let zip = new JSZip

    for (const img of images) {

      zip.file(`${img.relativePath}.webp`, img.image.split(',')[1], {base64: true});
      
    }

    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, "photo-to-webp.zip");
    });



  }
}
