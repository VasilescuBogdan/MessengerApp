import {Component, OnInit} from '@angular/core';
import {ChatDto, MessageDto} from "../../dto/chat.dto";
import {ChatService} from "../../service/chat.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chats: ChatDto[] = [];
  username = '';
  chatRoom: {
    secondUser: string;
    messages: MessageDto[];
  };
  messageInput = '';

  constructor(private chatService: ChatService, private authService: AuthService) {
    this.chatRoom = {
      secondUser: '',
      messages: [],
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
    this.chatRoom.messages = chat.messages;
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
          this.chatRoom.messages = value;
        },
        error: err => {
          console.log(err);
        }
      });
      this.messageInput = '';
    }
  }
}
