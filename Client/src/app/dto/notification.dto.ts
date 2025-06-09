import { MessageDto } from "./message.dto";

export interface NotificationDto {
  chatId: string;
  message: MessageDto;
}
