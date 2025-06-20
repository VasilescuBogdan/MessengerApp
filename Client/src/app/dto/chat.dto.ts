import { MessageDto } from "./message.dto";

export interface ChatDto {
  id: string;
  firstUser: string;
  secondUser: string;
  messages: MessageDto[];
}
