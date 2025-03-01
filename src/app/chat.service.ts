import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5000/chat', {
      skipNegotiation: true, // skipNegotiation as we specify WebSockets
      transport: signalR.HttpTransportType.WebSockets,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  public message$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];

  constructor() {
    this.start();
    this.connection.on(
      'ReceiveMessage',
      (user: String, message: String, messageTime: String) => {
        // console.log('User : ', user);
        // console.log('Message : ', message);
        // console.log('Messsage Time : ', messageTime);
        this.messages = [...this.messages, { user, message, messageTime }];
        this.message$.next(this.messages);
      }
    );
    this.connection.on('ConnectedUser', (users: any) => {
      //console.log('users: ', users);
      this.connectedUsers$.next(users);
    });
  }

  // start connection

  public async start() {
    try {
      await this.connection.start();
      console.log('Connection is started');
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        this.start();
      });
    }
  }

  //join Room
  public async joinRoom(user: string, room: string) {
    return this.connection.invoke('JoinRoom', { user, room });
  }

  //Send Mesage

  public async sendMessage(messages: string) {
    return this.connection.invoke('SendMessage', messages);
  }

  //leave chat

  public async leaveChat() {
    return this.connection.stop();
  }
}
