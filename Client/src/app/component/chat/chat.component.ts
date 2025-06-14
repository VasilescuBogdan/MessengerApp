import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatDto } from "../../dto/chat.dto";
import { ChatService } from "../../service/chat.service";
import { AuthService } from "../../service/auth.service";
import { UserService } from "../../service/user.service";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import SockJS from 'sockjs-client';
import { NotificationDto } from "../../dto/notification.dto";
import { Client } from "@stomp/stompjs";
import { MessageDto } from "../../dto/message.dto";
import { GroupDto } from "../../dto/group.dto";
import { MatDialog } from "@angular/material/dialog";
import { AddGroupDialogComponent } from "../add-group-dialog/add-group-dialog.component";
import { GroupChatService } from "../../service/group-chat.service";
import { GroupChatDto } from "../../dto/group-chat.dto";
import { ChangeGroupNameDialogComponent } from "../change-group-name-dialog/change-group-name-dialog.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [CdkTextareaAutosize],
})
export class ChatComponent implements OnInit, OnDestroy {
  chats: ChatDto[] = [];
  groups: GroupDto[] = [];
  username = '';
  chatRoom: {
    id: string;
    name: string;
    type: 'private' | 'group' | '';
    messages: { [key: string]: MessageDto[] };
  };
  messageInput = '';
  users: string[] = [];
  stompClient: any = null;
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  private notificationSubscription: any;

  constructor(private chatService: ChatService, private authService: AuthService, private userService: UserService,
              private dialog: MatDialog, private groupChatService: GroupChatService) {
    this.chatRoom = {
      id: '',
      type: '',
      name: '',
      messages: {},
    }
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.initWebSocket();
    this.getAllChats();
  }

  findSecondUser(chat: ChatDto) {
    if (chat.firstUser === this.username) {
      return chat.secondUser;
    } else {
      return chat.firstUser;
    }
  }

  showChat(chat: ChatDto) {
    if (this.chatRoom.id !== chat.id) {
      this.chatRoom.id = chat.id;
      this.chatRoom.messages = this.groupByDate(chat.messages);
      this.chatRoom.name = this.findSecondUser(chat);
      this.chatRoom.type = 'private';
    }
    this.scrollToBottom();
  }

  showGroupChat(group: GroupDto) {
    if (this.chatRoom.id !== group.id) {
      this.chatRoom.id = group.id;
      this.chatRoom.messages = this.groupByDate(group.messages);
      this.chatRoom.name = group.name;
      this.chatRoom.type = 'group';
      this.scrollToBottom();
    }
  }

  userSelected() {
    return this.chatRoom.name !== '';
  }

  sendMessage() {
    if (this.messageInput !== '') {
      if (this.chatRoom.type === 'private') {
        this.sendMessageToUser();
      }
      if (this.chatRoom.type === 'group') {
        this.sendMessageToGroup();
      }
      this.messageInput = '';
    }
  }

  addChat(user: string) {
    this.chatRoom.id = '';
    this.chatRoom.messages = {};
    this.chatRoom.name = user;
  }

  openAddGroupDialog() {
    const dialogRef = this.dialog.open(AddGroupDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.getAllChats();
    })
  }

  timeWithoutMillisecondsOrSeconds(time: string[]) {
    const hours = String(time[0]).padStart(2, '0');
    const minutes = String(time[1]).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  loadNewUsers() {
    this.userService.getAllUsers().subscribe({
      next: value => {
        this.users = value;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  addUserToGroup(user: string) {
    this.groupChatService.addUserToGroupChat(this.chatRoom.id, user).subscribe({
      next: () => {
        window.alert(`user ${user} added to group successfully`);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getUsersNotInChat() {
    const groupChat = this.groups.find((group) => group.id === this.chatRoom.id);
    if (groupChat) {
      return this.users.filter((user) => !groupChat.users.includes(user));
    }
    return [];
  }

  getAllUsersWithoutChatWithLoggedUser() {
    return this.users.filter((user) => user !== this.username && !this.hasChatWithUser().includes(user));
  }

  removeUserFromGroup() {
    this.groupChatService.removeUserFromGroupChat(this.chatRoom.id).subscribe({
      next: () => {
        window.alert(`You exited from group successfully`);
        this.chatRoom = {
          id: '',
          type: '',
          name: '',
          messages: {},
        };
        this.getAllChats();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  openChangeGroupNameDialog() {
    const dialogRef = this.dialog.open(ChangeGroupNameDialogComponent, {
      data: {
        groupName: this.chatRoom.name,
        groupId: this.chatRoom.id
      }
    });
    dialogRef.afterClosed().subscribe((newName: string) => {
      this.getAllGroups();
      this.chatRoom.name = newName;
    })
  }

  ngOnDestroy(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.notificationSubscription.unsubscribe();
      this.stompClient = null;
    }
  }

  private getAllChats() {
    this.chatService.getAllChat().subscribe({
      next: (data) => {
        this.chats = data;
        this.loadNewUsers();
        this.getAllGroups();
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

        const subUrl = `/users/${this.username}/chat`;
        this.notificationSubscription = this.stompClient.subscribe(subUrl, (message: { body: string; }) => {
          const notification: NotificationDto = JSON.parse(message.body);
          if (this.chatRoom.type === 'private') {
            this.handleNotification(notification, this.chats);
          }
          if (this.chatRoom.type === 'group') {
            this.handleNotification(notification, this.groups);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Error: ' + frame);
      }
    });
    this.stompClient.activate();
  }

  private scrollToBottom() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll failed', err);
    }
  }

  private groupByDate(messages: MessageDto[]): { [key: string]: MessageDto[] } {
    const grouped: { [key: string]: MessageDto[] } = {};

    messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (const message of messages) {
      const dateKey = String(message.date.slice()).replaceAll(',', '.');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    }

    return grouped;
  }

  private handleNotification(notification: NotificationDto, chatList: ChatDto[] | GroupChatDto[]) {
    if (!notification) {
      return;
    }
    const chat = (chatList as (ChatDto | GroupChatDto)[]).find(chat => chat.id === notification.chatId);
    if (chat) {
      chat.messages.push(notification.message);
      if (this.chatRoom.id === chat.id) {
        this.chatRoom.messages = this.groupByDate(chat.messages);
      }
    } else {
      this.getAllChats();
    }
  }

  private getAllGroups() {
    this.groupChatService.findAllGroupChats().subscribe({
      next: (data) => {
        this.groups = data;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  private sendMessageToUser() {
    this.chatService.sendMessage({content: this.messageInput, recipient: this.chatRoom.name}).subscribe({
      next: value => {
        const chat = this.chats.find(chat => chat.id === value.id);
        if (!chat) {
          this.chats.push(value);
          this.chatRoom = {
            id: value.id,
            type: 'private',
            messages: this.groupByDate(value.messages),
            name: this.findSecondUser(value),
          }
        } else {
          chat.messages = value.messages;
          this.chatRoom.messages = this.groupByDate(chat.messages);
        }
        this.scrollToBottom();
      },
      error: err => {
        console.log(err);
      }
    });
  }


  private sendMessageToGroup() {
    this.groupChatService.sendMessageToGroupChat({content: this.messageInput, recipient: this.chatRoom.id}).subscribe({
      next: value => {
        const group = this.groups.find(group => group.id === value.id);
        if (!group) {
          this.groups.push(value);
          this.chatRoom = {
            id: value.id,
            type: 'group',
            messages: this.groupByDate(value.messages),
            name: value.name,
          }
        } else {
          group.messages = value.messages;
          this.chatRoom.messages = this.groupByDate(group.messages);
        }
        this.scrollToBottom();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  private hasChatWithUser() {
    let usersWithChat: string[] = [];
    for (const chat of this.chats) {
      usersWithChat.push(this.findSecondUser(chat));
    }
    return usersWithChat;
  }
}
