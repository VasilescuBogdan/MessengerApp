import { MessageDto } from "./message.dto";

export interface GroupChatDto {
  id: string;
  name: string;
  users: string[];
  messages: MessageDto[]
}
