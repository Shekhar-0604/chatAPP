import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

@Component({
  standalone: false,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chatService = inject(ChatService);
  inputMessage = '';
  messages: any[] = [];
  router = inject(Router);
  loggedInUserName = sessionStorage.getItem('user');
  roomName = sessionStorage.getItem('room');
  @ViewChild('scrollMe') private ScrollContainer!: ElementRef;

  ngOnInit(): void {
    this.chatService.message$.subscribe((res) => {
      this.messages = res;
      console.log(this.messages);
    });

    this.chatService.connectedUsers$.subscribe((res) => {
      console.log(res);
    });
  }
  ngAfterViewChecked(): void {
    this.ScrollContainer.nativeElement.scrollTop =
      this.ScrollContainer.nativeElement.scrollHeight;
  }
  sendMessage() {
    this.chatService
      .sendMessage(this.inputMessage)
      .then(() => {
        this.inputMessage = '';
      })
      .catch((err) => {
        console.log(err);
      });
  }

  leaveChat() {
    this.chatService
      .leaveChat()
      .then(() => {
        this.router.navigate(['welcome']);
        setTimeout(() => {
          location.reload();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
