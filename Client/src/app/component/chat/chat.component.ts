import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatDto, MessageDto } from "../../dto/chat.dto";
import { ChatService } from "../../service/chat.service";
import { AuthService } from "../../service/auth.service";
import { UserService } from "../../service/user.service";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import SockJS from 'sockjs-client';
import { NotificationDto } from "../../dto/notification.dto";
import { Client } from "@stomp/stompjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [CdkTextareaAutosize],
})
export class ChatComponent implements OnInit, OnDestroy {
  chats: ChatDto[] = [];
  username = '';
  chatRoom: {
    id: string;
    secondUser: string;
    messages: { [key: string]: MessageDto[] };
  };
  messageInput = '';
  users: string[] = [];
  stompClient: any = null;
  private notificationSubscription: any;

  constructor(private chatService: ChatService, private authService: AuthService, private userService: UserService) {
    this.chatRoom = {
      id: '',
      secondUser: '',
      messages: {},
    }
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.initWebSocket();
    this.getAllChats();
  }

  private getAllChats() {
    this.chatService.getAllChat().subscribe({
      next: (data) => {
        this.chats = data;
        console.log(this.chats);
        this.loadNewUsers();
      },
      error: error => {
        console.log(error);
      }
    });
  }

  private initWebSocket() {
    const ws = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => ws,
      connectHeaders: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
      },
      debug: (msg) => {
        console.log(msg);
      },
      onConnect: (frame) => {
        console.log('Connected: ' + frame);

        // Subscribe to the user-specific chat URL
        const subUrl = `/users/${this.username}/chat`;
        this.notificationSubscription = this.stompClient.subscribe(subUrl, (message: { body: string; }) => {
          console.log('Received message: ' + message.body);
          const notification: NotificationDto = JSON.parse(message.body);  // Parse the notification message
          this.handleNotification(notification);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Error: ' + frame);
      }
    });
    this.stompClient.activate();
  }

  findSecondUser(chat: ChatDto) {
    if (chat.firstUser === this.username) {
      return chat.secondUser;
    } else {
      return chat.firstUser;
    }
  }

  showChat(chat: ChatDto) {
    this.chatRoom.id = chat.id;
    this.chatRoom.messages = this.groupByDate(chat.messages);
    this.chatRoom.secondUser = this.findSecondUser(chat);
  }

  userSelected() {
    return this.chatRoom.secondUser !== '';
  }

  sendMessage() {
    if (this.messageInput !== '') {
      this.chatService.sendMessage({ content: this.messageInput, recipient: this.chatRoom.secondUser }).subscribe({
        next: value => {
          this.chatRoom = {
            id: value.id,
            messages: this.groupByDate(value.messages),
            secondUser: this.findSecondUser(value),
          }
          const chat = this.chats.find(chat => chat.id === value.id);
          if (!chat) {
            this.chats.push(value);
          }
        },
        error: err => {
          console.log(err);
        }
      });
      this.messageInput = '';
    }
  }

  addChat(user: string) {
    this.chatRoom.id = '';
    this.chatRoom.messages = {};
    this.chatRoom.secondUser = user;
  }

  timeWithoutMillisecondsOrSeconds(time: string[]) {
    return `${time[0]}:${time[1]}`;
  }

  private groupByDate(messages: MessageDto[]): { [key: string]: MessageDto[] } {
    const grouped: { [key: string]: MessageDto[] } = {};

    for (const message of messages) {
      const dateKey = String(message.date.slice().reverse()).replaceAll(',', '.');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    }

    const sortedGrouped: { [key: string]: MessageDto[] } = {};
    Object.keys(grouped).sort().forEach(key => {
      sortedGrouped[key] = grouped[key];
    });

    return sortedGrouped;
  }

  loadNewUsers() {
    this.userService.getAllUsers().subscribe({
      next: value => {
        this.users = value.filter(user => {
          if (user === this.username) {
            return false;
          }
          return !this.chats.map(chat => this.findSecondUser(chat))
            .includes(user);
        });
      },
      error: err => {
        console.log(err);
      }
    })
  }

  private handleNotification(notification: NotificationDto) {
    if (!notification) {
      return;
    }
    const chat = this.chats.find(chat => chat.id === notification.chatId)
    if (chat) {
      chat.messages.push(notification.message);
      if (this.chatRoom.id === chat.id) {
        this.chatRoom.messages = this.groupByDate(chat.messages);
      }
    } else {
      this.getAllChats();
    }
  }

  ngOnDestroy(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.notificationSubscription.unsubscribe();
      this.stompClient = null;
    }
  }
}
