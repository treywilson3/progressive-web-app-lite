import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare const io;

@Injectable({
    providedIn: 'root'
  })
  export class WebSocketService {
    socket: any;

    connect(): void {
        this.socket = io.connect('http://localhost:3000');
    }

    observeAddedUsers(): Observable<any> {
        return Observable.create(observer => {
            this.socket.on('addedUsers', data => {
                observer.next(data);
            });
        });
    }

    emitEvent(event: string, value: object) {
        this.socket.emit(event, value);
    }
}
