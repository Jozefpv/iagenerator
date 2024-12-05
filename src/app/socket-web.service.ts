import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService{

  private socket: Socket;
  private readonly serverUrl: string = 'https://iageneratorapi.onrender.com'
  //'https://iageneratorapi.onrender.com';

  constructor() {
    this.socket = io(this.serverUrl);
  
    this.socket.on('connect', () => {
      const userGuid = localStorage.getItem('userGuid')
      if (userGuid) {
        this.socket.emit('userGuid', userGuid);
      } else {
        console.error('No se encontró el userGuid en localStorage');
      }
    })
   }

   listenForImageUrls(): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      this.socket.on('imageReady', (data: any) => {
        if (data && data.upscaledUrls) {
          observer.next(data.upscaledUrls);
        } else {
          observer.next([]);
        }
      });
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
