import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';
import { NgModel } from '@angular/forms'; 
import { SocketWebService } from 'src/app/socket-web.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{

 userInput: string = ''; 
 imageURL = 'https://cdn.pixabay.com/photo/2024/06/18/13/53/ai-generated-8838122_1280.jpg'

 private socketSubscription: Subscription | undefined;

 constructor(private mainService: MainService, private socketService: SocketWebService){}

  ngOnInit(): void {
    this.socketSubscription = this.socketService.listenForImageUrls().subscribe((messages: any) => {
      // Aquí accedemos a las URLs dentro de 'messages'
      if (Array.isArray(messages)) {
        this.imageURL = messages[0]; // Almacenamos las URLs en un array
      }
    });
  }

 createImage() {
  if (this.userInput) {
    let data = {prompt: this.userInput}
    this.socketService.emit('event', data);
    this.mainService.postData(data).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        this.imageURL = response
      },
      error => {
        console.error('Error en la solicitud:', error);
      }
    );
  } else {
    console.log('Por favor, ingrese algún dato');
  }
}

}
