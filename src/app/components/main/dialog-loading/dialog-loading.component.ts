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
  imageProgress: number = 0
  loading = false

  imageURL: string = '';
  errorMessage: string = '';

  constructor(
    private mainService: MainService,
    private socketService: SocketWebService,
    private dialogRef: MatDialogRef<DialogLoadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

      this.progressSubscription = this.socketService.listenForImageProgress().subscribe((progress: any) => {
      this.imageProgress = progress;
      console.log(`Progreso de la imagen ${this.imageProgress}%`);
    });

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
          console.log('Imagen recibida del socket:', this.imageURL);
          this.closeDialogWithResult();
        }
      });
      
    } else {
      this.dialogRef.close();
    }
  }

  closeDialogWithResult(): void {
    this.dialogRef.close(this.imageURL);
  }
}
