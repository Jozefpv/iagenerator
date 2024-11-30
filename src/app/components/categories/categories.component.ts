import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Animals } from 'src/assets/media/animals';
import { Cars } from 'src/assets/media/cars';
import { Cartoon } from 'src/assets/media/cartoon';
import { Celebrities } from 'src/assets/media/celebrities';
import { Heroes } from 'src/assets/media/heroes';
import { Princesses } from 'src/assets/media/princesses';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {

  id: string | null = null;
  photosList: string[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.setPhotoList();
    });
  }



  printPhoto(photoUrl: string): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Foto</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              img {
                max-width: 100%;
                max-height: 100%;
              }
            </style>
          </head>
          <body>
            <img src="${photoUrl}" alt="Foto a imprimir">
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      console.error('No se pudo abrir la ventana de impresión.');
    }
  }

  setPhotoList() {
    switch (this.id) {
      case '0':
        this.photosList = Animals;
        break;
      case '1':
        this.photosList = Heroes;
        break;
      case '2':
        this.photosList = Princesses;
        break;
      case '3':
        this.photosList = Cars;
        break;
      case '4':
        this.photosList = Celebrities;
        break;
      case '5':
        this.photosList = Cartoon;
        break;
    }
  }
}
