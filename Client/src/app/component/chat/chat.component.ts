import { Component, OnInit } from '@angular/core';
import { ChatDto, MessageDto } from "../../dto/chat.dto";
import { ChatService } from "../../service/chat.service";
import { AuthService } from "../../service/auth.service";
import { UserService } from "../../service/user.service";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [CdkTextareaAutosize],
})
export class ChatComponent implements OnInit {
  chats: ChatDto[] = [];
  username = '';
  chatRoom: {
    id: string;
    secondUser: string;
    messages: { [key: string]: MessageDto[] };
  };
  messageInput = '';
  users: string[] = [];

  constructor(private chatService: ChatService, private authService: AuthService, private userService: UserService) {
    this.chatRoom = {
      id: '',
      secondUser: '',
      messages: {},
    }
  }

  async ngOnInit() {
    await this.getAllChats();
    await this.loadNewUsers();
    this.username = this.authService.getUsername();
  }

  private async getAllChats() {
    this.chatService.getAllChat().subscribe({
      next: (data) => {
        this.chats = data;
      },
      error: error => {
        console.log(error);
      }
    });
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
          this.getAllChats();
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

  formatDateWithoutMillisecondsOrSeconds(time: String) {
    const timeObj = new Date(`1970-01-01T${time}Z`)
    return timeObj.toLocaleTimeString('de-DE', { hour: 'numeric', minute: 'numeric', });
  }

  private groupByDate(messages: MessageDto[]): { [key: string]: MessageDto[] } {
    const grouped: { [key: string]: MessageDto[] } = {};

    for (const message of messages) {
      const dateKey = message.date.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    }

    return grouped;
  }

  async loadNewUsers() {
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
}
