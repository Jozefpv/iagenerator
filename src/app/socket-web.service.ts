import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService{

  private socket: Socket;
  private readonly serverUrl: string = 'https://iageneratorapi.onrender.com';

  constructor() {
    this.socket = io(this.serverUrl);
   }

   listenForImageUrls() {
    return new Observable<any>((observer) => {
      this.socket.on('event', (data) => {
        if (data && data.messages) {
          observer.next(data.messages);
        }
      });

    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
