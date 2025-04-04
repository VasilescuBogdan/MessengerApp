package ace.ucv.messenger.service;

import ace.ucv.messenger.dto.Notification;

public interface NotificationService {

    void sendNotification(String userId, Notification notification);
}
