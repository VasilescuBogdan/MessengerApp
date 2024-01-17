export interface MessageDto {
  content: String;
  date: String;
  time: String;
  senderUsername: String;
}

export interface ChatDto {
  firstUser: string;
  secondUser: string;
  messages: MessageDto[];
  isActive: boolean;
}
