import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';

export interface NotificationInput {
	notificationType: NotificationType;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationContent: string;
	notificationRefId: string;
	memberId: string;
}

export interface NotificationUpdate {
	_id: string;
	notificationStatus?: NotificationStatus;
}

export interface NotificationInquiry {
	page: number;
	limit: number;
	search: {
		notificationStatus?: NotificationStatus;
		notificationType?: NotificationType;
		notificationGroup?: NotificationGroup;
	};
}







