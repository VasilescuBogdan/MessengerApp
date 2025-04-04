export interface MessageDto {
  content: string;
  date: string[];
  time: string[];
  sender: string;
}

export interface ChatDto {
  id: string;
  firstUser: string;
  secondUser: string;
  messages: MessageDto[];
}
