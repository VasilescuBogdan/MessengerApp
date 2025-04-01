import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ChatDto } from "../dto/chat.dto";
import { AddMessageDto } from "../dto/add-message.dto";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseURL = "http://localhost:8080/api/chat";

  constructor(private http: HttpClient) {
  }

  public getAllChat() {
    return this.http.get<ChatDto[]>(this.baseURL);
  }

  public sendMessage(addMessageDto: AddMessageDto) {
    return this.http.post<ChatDto>(this.baseURL + '/addMessage', addMessageDto);
  }
}
