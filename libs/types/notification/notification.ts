export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationContent: string;
	notificationRefId: string;
	memberId: string;
	createdAt: string;
	updatedAt: string;
	memberData?: {
		_id: string;
		memberNick: string;
		memberFullName: string;
		memberImage?: string;
	};
}

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

export interface NotificationMetaCounter {
	total: number;
	unread: number;
}

export interface NotificationResponse {
	list: Notification[];
	metaCounter: NotificationMetaCounter[];
}

// Import enums from the existing file
import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';







