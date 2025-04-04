package ace.ucv.messenger.service.implementation;

import ace.ucv.messenger.dto.Notification;
import ace.ucv.messenger.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userId, Notification notification) {
        log.info("Sending notification to destination {} with payload {}", userId, notification.toString());
        messagingTemplate.convertAndSendToUser(userId, "/chat", notification);
    }
}
