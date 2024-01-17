export interface MessageDto {
  content: String;
  date: String;
  time: String;
  senderUsername: String;
}

export interface ChatDto {
  id: string;
  firstUser: string;
  secondUser: string;
  messages: MessageDto[];
}
