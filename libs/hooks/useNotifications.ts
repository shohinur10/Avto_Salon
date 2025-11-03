import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
// import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';

interface NotificationCount {
	total: number;
	unread: number;
}

export const useNotifications = () => {
	const user = useReactiveVar(userVar);
	const [notificationCount, setNotificationCount] = useState<NotificationCount>({ total: 0, unread: 0 });
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

	// Debug logging
	console.log('useNotifications - User:', user);
	console.log('useNotifications - User ID:', user?._id);

	// TEMPORARILY DISABLED: Backend doesn't have getNotifications query yet
	// TODO: Re-enable when backend implements the notification queries
	// const { data: notificationsData, refetch: refetchNotifications } = useQuery(GET_NOTIFICATIONS, {
	// 	variables: {
	// 		input: {
	// 			page: 1,
	// 			limit: 100,
	// 			search: {
	// 				// Empty search object - will fetch all notifications for the user
	// 			}
	// 		}
	// 	},
	// 	pollInterval: 30000, // Poll every 30 seconds
	// 	skip: true, // TEMPORARILY DISABLED - Backend not ready
	// 	errorPolicy: 'ignore', // Ignore errors to prevent UI crashes
	// 	onCompleted: (data) => {
	// 		if (data?.getNotifications?.list) {
	// 			const notifications = data.getNotifications.list;
	// 			const total = notifications.length;
	// 			const unread = notifications.filter((n: any) => n.notificationStatus === 'UNREAD').length;
				
	// 			setNotificationCount({ total, unread });
	// 			setLastUpdate(new Date());
	// 		}
	// 	},
	// 	onError: (error) => {
	// 		console.error('Error fetching notifications:', error);
	// 		// Set default values on error and don't crash the app
	// 		setNotificationCount({ total: 0, unread: 0 });
	// 	}
	// });
	const notificationsData = null;
	const refetchNotifications = async () => {};

	// Manual refresh function
	const refreshNotifications = useCallback(async () => {
		try {
			await refetchNotifications();
		} catch (error) {
			console.error('Error refreshing notifications:', error);
		}
	}, [refetchNotifications]);

	// Update notification count when data changes
	useEffect(() => {
		if (notificationsData?.getNotifications?.list) {
			const notifications = notificationsData.getNotifications.list;
			const total = notifications.length;
			const unread = notifications.filter((n: any) => n.notificationStatus === 'UNREAD').length;
			setNotificationCount({ total, unread });
		}
	}, [notificationsData]);

	// Reset notifications when user logs out
	useEffect(() => {
		if (!user?._id) {
			setNotificationCount({ total: 0, unread: 0 });
		}
	}, [user?._id]);

	return {
		notificationCount,
		lastUpdate,
		refreshNotifications,
		isLoading: !notificationsData && user?._id
	};
};

export default useNotifications;


