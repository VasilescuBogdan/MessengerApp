import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GroupChatDto} from "../dto/group-chat.dto";
import { AddMessageDto } from "../dto/add-message.dto";

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {

  private baseURL = "http://localhost:8080/api/groupChat";

  constructor(private http: HttpClient) {
  }

  public findAllGroupChats() {
    return this.http.get<GroupChatDto[]>(`${this.baseURL}`);
  }

  public createGroupChat(name: string) {
    return this.http.post<GroupChatDto>(`${this.baseURL}?name=${name}`, null);
  }

  public addUserToGroupChat(groupChatId: string, username: string) {
    return this.http.put(`${this.baseURL}/addUser/${groupChatId}?user=${username}`, null);
  }

  public removeUserFromGroupChat(groupChatId: string, username: string) {
    return this.http.put(`${this.baseURL}/removeUser/${groupChatId}?user=${username}`, null);
  }

  public sendMessageToGroupChat(message: AddMessageDto) {
    return this.http.post<GroupChatDto>(`${this.baseURL}/addMessage`, message);
  }
}
