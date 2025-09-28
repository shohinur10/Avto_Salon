import { apolloClient } from '../../apollo/client';
import { CREATE_NOTIFICATION } from '../../apollo/user/mutation';
import { NotificationType, NotificationGroup } from '../enums/notification.enum';
import { NotificationInput } from '../types/notification/notification.input';

class NotificationService {
	/**
	 * Create a notification for when someone likes a post/article
	 */
	static async createLikeNotification(
		targetMemberId: string,
		refId: string,
		group: NotificationGroup,
		likerName: string,
		itemTitle: string
	) {
		try {
			const notificationInput: NotificationInput = {
				notificationType: NotificationType.LIKE,
				notificationGroup: group,
				notificationTitle: `${likerName} liked your ${group.toLowerCase()}`,
				notificationContent: `${likerName} liked "${itemTitle}"`,
				notificationRefId: refId,
				memberId: targetMemberId
			};

			await apolloClient.mutate({
				mutation: CREATE_NOTIFICATION,
				variables: { input: notificationInput }
			});

			console.log('Like notification created successfully');
		} catch (error) {
			console.error('Error creating like notification:', error);
		}
	}

	/**
	 * Create a notification for when someone comments on a post/article
	 */
	static async createCommentNotification(
		targetMemberId: string,
		refId: string,
		group: NotificationGroup,
		commenterName: string,
		itemTitle: string,
		commentPreview: string
	) {
		try {
			const notificationInput: NotificationInput = {
				notificationType: NotificationType.COMMENT,
				notificationGroup: group,
				notificationTitle: `${commenterName} commented on your ${group.toLowerCase()}`,
				notificationContent: `${commenterName} commented on "${itemTitle}": "${commentPreview}"`,
				notificationRefId: refId,
				memberId: targetMemberId
			};

			await apolloClient.mutate({
				mutation: CREATE_NOTIFICATION,
				variables: { input: notificationInput }
			});

			console.log('Comment notification created successfully');
		} catch (error) {
			console.error('Error creating comment notification:', error);
		}
	}

	/**
	 * Create a notification for when someone follows a user
	 */
	static async createFollowNotification(
		targetMemberId: string,
		followerName: string
	) {
		try {
			const notificationInput: NotificationInput = {
				notificationType: NotificationType.LIKE, // Using LIKE as a generic "positive action" type
				notificationGroup: NotificationGroup.MEMBER,
				notificationTitle: `${followerName} started following you`,
				notificationContent: `${followerName} is now following you`,
				notificationRefId: targetMemberId,
				memberId: targetMemberId
			};

			await apolloClient.mutate({
				mutation: CREATE_NOTIFICATION,
				variables: { input: notificationInput }
			});

			console.log('Follow notification created successfully');
		} catch (error) {
			console.error('Error creating follow notification:', error);
		}
	}

	/**
	 * Create a custom notification
	 */
	static async createCustomNotification(
		targetMemberId: string,
		title: string,
		content: string,
		type: NotificationType = NotificationType.LIKE,
		group: NotificationGroup = NotificationGroup.MEMBER,
		refId?: string
	) {
		try {
			const notificationInput: NotificationInput = {
				notificationType: type,
				notificationGroup: group,
				notificationTitle: title,
				notificationContent: content,
				notificationRefId: refId || targetMemberId,
				memberId: targetMemberId
			};

			await apolloClient.mutate({
				mutation: CREATE_NOTIFICATION,
				variables: { input: notificationInput }
			});

			console.log('Custom notification created successfully');
		} catch (error) {
			console.error('Error creating custom notification:', error);
		}
	}
}

export default NotificationService;


