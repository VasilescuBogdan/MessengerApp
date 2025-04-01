package ace.ucv.messenger.dto;

import lombok.Builder;

@Builder
public record AddMessageDto(String content, String recipient) {
}
