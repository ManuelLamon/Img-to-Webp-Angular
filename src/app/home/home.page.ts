import { Component } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { filesData } from 'src/models';
import { ImgTransformerServiceService } from '../services/img-transformer-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  files: NgxFileDropEntry[] = [];
  filesData: filesData[] = [];
  loading = 0;
  counter = 0;

  constructor(public imageTransform: ImgTransformerServiceService) {}

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    console.log(files);
    for (const [index, droppedFile] of files.entries()) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          this.filesData = [
            ...this.filesData,
            {
              relativePath: droppedFile.relativePath.split('.')[0],
              size: `${Math.round(file.size / 1024)}KB`,
              loading: true,
              image: '',
            },
          ];

          this.imageTransform
            .transformImage(file)
            .then((res: any) => {
              this.counter++;
              this.loading = this.counter / this.filesData.length;
              const elFile = this.filesData.find((data, i) => i === index);
              elFile.loading = false;
              elFile.image = res;
            })
            .catch((error) => {
              console.log(error);
            });
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  download(rowIndex: number) {
    console.log(this.filesData[rowIndex].image);
    const el = document.createElement('a');
    el.setAttribute('href', this.filesData[rowIndex].image);
    el.setAttribute('download', this.filesData[rowIndex].relativePath);
    document.body.appendChild(el);
    el.click();
    el.remove();
    return;
  }

  refresh() {
    this.files = [];
    this.filesData = [];
    this.loading = 0;
    this.counter = 0;
  }

  async downloadAll() {
    for (const img of this.filesData) {
      if (img.loading) {
        return alert('Hay productos cargando');
      }
    }

    this.imageTransform.downloadZip(this.filesData);
  }
}
