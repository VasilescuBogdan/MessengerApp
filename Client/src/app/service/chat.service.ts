import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ChatDto, MessageDto} from "../dto/chat.dto";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseURL = "http://localhost:8080/api/chat/";

  constructor(private http: HttpClient) {
  }

  public getAllChat() {
    return this.http.get<ChatDto[]>(this.baseURL + 'all');
  }

  public sendMessage(messageContent: String, recipient: String) {
    return this.http.post<MessageDto[]>(this.baseURL + 'addMessage?messageContent=' + messageContent + '&recipient=' + recipient, null);
  }
}
