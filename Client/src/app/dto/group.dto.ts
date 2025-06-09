import { MessageDto } from "./message.dto";

export interface GroupDto {
  name: string;
  id: string;
  users: string[];
  messages: MessageDto[];
}
