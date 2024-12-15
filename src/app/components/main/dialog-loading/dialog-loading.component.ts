import { Component, Inject, Input, OnInit } from '@angular/core';
import { SocketWebService } from 'src/app/socket-web.service';
import { MainService } from '../main.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-loading',
  templateUrl: './dialog-loading.component.html',
  styleUrls: ['./dialog-loading.component.css']
})
export class DialogLoadingComponent implements OnInit {

  imageProgress = 0;
  imageURL: string = '';

  constructor(
    private mainService: MainService,
    private socketService: SocketWebService,
    private dialogRef: MatDialogRef<DialogLoadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const userGuid = localStorage.getItem('userGuid') || '';
    const userInput = this.data?.userInput || '';

    if (userInput) {
      const data = { prompt: userInput, userGuid: userGuid };
      this.socketService.emit('event', data);

      setTimeout(() => { this.imageProgress = 10; }, 2000);
      setTimeout(() => { this.imageProgress = 35; }, 10000);
      setTimeout(() => { this.imageProgress = 65; }, 20000);
      setTimeout(() => { this.imageProgress = 85; }, 30000);


      this.mainService.postData(data).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          this.imageURL = response;
        },
        error => {

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