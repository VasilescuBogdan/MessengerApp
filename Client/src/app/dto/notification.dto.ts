import { MessageDto } from "./chat.dto";

export interface NotificationDto {
  chatId: string;
  message: MessageDto;
}
