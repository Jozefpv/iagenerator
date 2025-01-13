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
  loadedImages: boolean[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.setPhotoList();
      this.loadedImages = new Array(this.photosList.length).fill(false);
    });
  }



  printPhoto(photoUrl: string): void {
    const printContent = document.createElement('div');
    printContent.style.position = 'fixed';
    printContent.style.top = '0';
    printContent.style.left = '0';
    printContent.style.width = '100%';
    printContent.style.height = '100%';
    printContent.style.background = 'white';
    printContent.style.display = 'flex';
    printContent.style.justifyContent = 'center';
    printContent.style.alignItems = 'center';
    printContent.style.zIndex = '9999';

    const img = document.createElement('img');
    img.src = photoUrl;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';

    printContent.appendChild(img);
    document.body.appendChild(printContent);

    window.print();

    document.body.removeChild(printContent);
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
    this.loadedImages = new Array(this.photosList.length).fill(false);
  }

  onImageLoad(index: number): void {
    this.loadedImages[index] = true;
  }
}
