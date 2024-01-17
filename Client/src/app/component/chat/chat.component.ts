import {Component, OnInit} from '@angular/core';
import {ChatDto, MessageDto} from "../../dto/chat.dto";
import {ChatService} from "../../service/chat.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
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

  constructor(private chatService: ChatService, private authService: AuthService) {
    this.chatRoom = {
      id: '',
      secondUser: '',
      messages: {},
    }
  }

  ngOnInit(): void {
    this.getAllChats();
    this.username = this.authService.getUsername();
  }

  getAllChats() {
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
    this.chatRoom.messages = this.groupByDate(chat.messages);
    this.chatRoom.secondUser = this.findSecondUser(chat);
  }

  userSelected() {
    return this.chatRoom.secondUser !== '';
  }

  sendMessage() {
    if (this.messageInput !== '') {
      const message = this.messageInput;
      this.chatService.sendMessage(message, this.chatRoom.secondUser).subscribe({
        next: value => {
          this.chatRoom.messages = this.groupByDate(value);
          this.getAllChats();
        },
        error: err => {
          console.log(err);
        }
      });
      this.messageInput = '';
    }
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
}
