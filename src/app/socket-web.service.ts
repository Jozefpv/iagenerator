import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService{

  private socket: Socket;
  private readonly serverUrl: string = 'https://iageneratorapi.onrender.com'
  //private readonly serverUrl: string = 'http://localhost:3000'


  constructor() {
    this.socket = io(this.serverUrl); // Cambia la URL si es necesario
  }

  // Escucha para el progreso de la imagen
  listenForImageProgress(): Observable<number> {
    return new Observable((observer) => {
      this.socket.on('imageProgress', (data: { id: string; progress: number }) => {
        observer.next(data.progress);
      });
    });
  }

  // Escucha cuando la imagen está lista
  listenForImageUrls(): Observable<string[]> {
    return new Observable((observer) => {
      this.socket.on('imageReady', (data: { id: string; upscaledUrls: string[] }) => {
        observer.next(data.upscaledUrls);
      });
    });
  }

  // Emitir eventos
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
