import { Component, Inject, OnInit } from '@angular/core';
import { SocketWebService } from 'src/app/socket-web.service';
import { MainService } from '../main.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-loading',
  templateUrl: './dialog-loading.component.html',
  styleUrls: ['./dialog-loading.component.css']
})
export class DialogLoadingComponent implements OnInit {

  private socketSubscription: Subscription | undefined;
  private progressSubscription: Subscription | undefined;

  imageProgress: number = 0;
  progressInterval: any;

  loading = false

  imageURL: string = '';
  errorMessage: string = '';

  messages: string[] = [
    "Espera unos segundos mientras generamos tu creación...",
    "Estamos trabajando en tu imagen. Por favor, sé paciente...",
    "Esto puede tomar unos instantes. Gracias por tu paciencia..."
  ];
  currentMessage: string = this.messages[0];
  messageInterval: any;
  

  constructor(
    private mainService: MainService,
    private socketService: SocketWebService,
    private dialogRef: MatDialogRef<DialogLoadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.startMessageRotation();
    this.startSimulatedProgress();
    // this.progressSubscription = this.socketService.listenForImageProgress().subscribe((progress: any) => {
    //   this.imageProgress = progress;
    //   console.log(`Progreso de la imagen ${this.imageProgress}%`);
    // });

    const userGuid = localStorage.getItem('userGuid') || '';
    const userInput = this.data?.userInput || '';

    if (userInput) {
      const data = { prompt: userInput, userGuid: userGuid };
      this.socketService.emit('userGuid', data.userGuid);

      this.mainService.postData(data).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          this.imageURL = response;
        },
        error => {
          this.stopMessageRotation();
          this.stopSimulatedProgress();
          if (error.status === 401) {
            console.error('Error: Límite de contador superado.');
            this.errorMessage = 'Has alcanzado el límite de imágenes permitidas.'; 
            return;
          } else {
            console.error('Error inesperado:', error);
            this.errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.';
          }
        }
      );

      this.socketService.listenForImageUrls().subscribe((urls: string[]) => {
        if (urls && urls.length > 0) {
          this.imageURL = urls[0];
          this.imageProgress = 100;
          this.closeDialogWithResult();
        }
      });
      
    } else {
      this.dialogRef.close();
    }
  }

  startMessageRotation(): void {
    let index = 0;
    this.messageInterval = setInterval(() => {
      index = (index + 1) % this.messages.length;
      this.currentMessage = this.messages[index];
    }, 5000);
  }
  
  stopMessageRotation(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
  }

  startSimulatedProgress(): void {
    this.imageProgress = 1;
    this.progressInterval = setInterval(() => {
      if (this.imageProgress < 99) {
        this.imageProgress += 1;
      } else {
        clearInterval(this.progressInterval);
      }
    }, 200);
  }
  
  stopSimulatedProgress(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  closeDialogWithResult(): void {
    this.stopMessageRotation();
    this.stopSimulatedProgress();

    setTimeout(() => {
      this.dialogRef.close(this.imageURL);
    }, 2000);

    
  }
}
