import React, { useState, useEffect, useRef } from 'react';
import {
	Box,
	Badge,
	IconButton,
	Menu,
	MenuItem,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Typography,
	Button,
	Divider,
	Stack,
	Chip,
	Tooltip,
	CircularProgress,
	Fade,
	Paper
} from '@mui/material';
import {
	NotificationsOutlined as NotificationsIcon,
	NotificationsActive as NotificationsActiveIcon,
	MarkEmailRead as MarkReadIcon,
	Delete as DeleteIcon,
	MoreVert as MoreIcon,
	Favorite as LikeIcon,
	Comment as CommentIcon,
	Person as PersonIcon,
	DirectionsCar as CarIcon,
	Article as ArticleIcon
} from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import { 
	MARK_NOTIFICATION_AS_READ, 
	MARK_ALL_NOTIFICATIONS_AS_READ, 
	DELETE_NOTIFICATION 
} from '../../apollo/user/mutation';
import { Notification, NotificationInquiry } from '../types/notification/notification';
import { NotificationStatus, NotificationType, NotificationGroup } from '../enums/notification.enum';
import { REACT_APP_API_URL } from '../config';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../sweetAlert';
import Moment from 'react-moment';

interface NotificationDropdownProps {
	anchorEl?: HTMLElement | null;
	open: boolean;
	onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	anchorEl,
	open,
	onClose
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [notificationCount, setNotificationCount] = useState({ total: 0, unread: 0 });
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	// GraphQL queries and mutations
	const { data: notificationsData, loading: notificationsLoading, refetch: refetchNotifications } = useQuery(
		GET_NOTIFICATIONS,
		{
			variables: {
				input: {
					page: 1,
					limit: 10,
					search: {}
				} as NotificationInquiry
			},
			skip: true, // TEMPORARILY DISABLED - Backend not ready
			errorPolicy: 'ignore',
			onCompleted: (data) => {
				if (data?.getNotifications) {
					setNotifications(data.getNotifications.list || []);
					setHasMore(data.getNotifications.list?.length === 10);
				}
			}
		}
	);

	// Calculate notification count from the notifications list
	useEffect(() => {
		if (notificationsData?.getNotifications?.list) {
			const notifications = notificationsData.getNotifications.list;
			const total = notifications.length;
			const unread = notifications.filter((n: any) => n.notificationStatus === 'UNREAD').length;
			setNotificationCount({ total, unread });
		}
	}, [notificationsData]);

	const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
	const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);
	const [deleteNotification] = useMutation(DELETE_NOTIFICATION);

	// Load more notifications
	const loadMoreNotifications = async () => {
		if (loading || !hasMore) return;
		
		setLoading(true);
		try {
			const result = await refetchNotifications({
				input: {
					page: page + 1,
					limit: 10,
					search: {}
				}
			});
			
			if (result.data?.getNotifications) {
				const newNotifications = result.data.getNotifications.list || [];
				setNotifications(prev => [...prev, ...newNotifications]);
				setPage(prev => prev + 1);
				setHasMore(newNotifications.length === 10);
			}
		} catch (error) {
			console.error('Error loading more notifications:', error);
		} finally {
			setLoading(false);
		}
	};

	// Handle mark as read
	const handleMarkAsRead = async (notificationId: string) => {
		try {
			await markAsRead({
				variables: { input: notificationId }
			});
			
			// Update local state
			setNotifications(prev => 
				prev.map(notification => 
					notification._id === notificationId 
						? { ...notification, notificationStatus: NotificationStatus.READ }
						: notification
				)
			);
			
			// Update count
			setNotificationCount(prev => ({
				...prev,
				unread: Math.max(0, prev.unread - 1)
			}));
			
			await sweetTopSmallSuccessAlert('Marked as read', 1000);
		} catch (error: any) {
			sweetMixinErrorAlert(error.message);
		}
	};

	// Handle mark all as read
	const handleMarkAllAsRead = async () => {
		try {
			await markAllAsRead();
			setNotifications(prev => 
				prev.map(notification => ({
					...notification,
					notificationStatus: NotificationStatus.READ
				}))
			);
			setNotificationCount(prev => ({ ...prev, unread: 0 }));
			await sweetTopSmallSuccessAlert('All notifications marked as read', 1000);
		} catch (error: any) {
			sweetMixinErrorAlert(error.message);
		}
	};

	// Handle delete notification
	const handleDeleteNotification = async (notificationId: string) => {
		try {
			await deleteNotification({
				variables: { input: notificationId }
			});
			
			setNotifications(prev => prev.filter(n => n._id !== notificationId));
			setNotificationCount(prev => ({
				...prev,
				total: Math.max(0, prev.total - 1)
			}));
			
			await sweetTopSmallSuccessAlert('Notification deleted', 1000);
		} catch (error: any) {
			sweetMixinErrorAlert(error.message);
		}
	};

	// Get notification icon based on type
	const getNotificationIcon = (type: NotificationType, group: NotificationGroup) => {
		switch (type) {
			case NotificationType.LIKE:
				return <LikeIcon color="error" fontSize="small" />;
			case NotificationType.COMMENT:
				return <CommentIcon color="primary" fontSize="small" />;
			default:
				switch (group) {
					case NotificationGroup.MEMBER:
						return <PersonIcon color="info" fontSize="small" />;
					case NotificationGroup.CAR:
						return <CarIcon color="warning" fontSize="small" />;
					case NotificationGroup.ARTICLE:
						return <ArticleIcon color="success" fontSize="small" />;
					default:
						return <NotificationsIcon fontSize="small" />;
				}
		}
	};

	// Get notification color based on status
	const getNotificationColor = (status: NotificationStatus) => {
		return status === NotificationStatus.WAIT ? 'primary' : 'default';
	};

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: 400,
					maxHeight: 600,
					mt: 1,
					borderRadius: '12px',
					boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
				}
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			{/* Header */}
			<Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6" fontWeight={600}>
						Notifications
					</Typography>
					<Stack direction="row" spacing={1}>
						{notificationCount.unread > 0 && (
							<Button
								size="small"
								startIcon={<MarkReadIcon />}
								onClick={handleMarkAllAsRead}
								sx={{ textTransform: 'none' }}
							>
								Mark all read
							</Button>
						)}
					</Stack>
				</Stack>
				{notificationCount.total > 0 && (
					<Typography variant="caption" color="text.secondary">
						{notificationCount.unread} unread of {notificationCount.total} total
					</Typography>
				)}
			</Box>

			{/* Notifications List */}
			<Box sx={{ maxHeight: 400, overflow: 'auto' }}>
				{notificationsLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
						<CircularProgress size={24} />
					</Box>
				) : notifications.length === 0 ? (
					<Box sx={{ p: 3, textAlign: 'center' }}>
						<NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
						<Typography variant="body2" color="text.secondary">
							No notifications yet
						</Typography>
					</Box>
				) : (
					<List sx={{ p: 0 }}>
						{notifications.map((notification, index) => (
							<React.Fragment key={notification._id}>
								<ListItem
									sx={{
										py: 1.5,
										px: 2,
										'&:hover': {
											bgcolor: 'action.hover'
										},
										bgcolor: notification.notificationStatus === NotificationStatus.WAIT 
											? 'action.selected' 
											: 'transparent'
									}}
								>
									<ListItemAvatar>
										<Avatar
											src={
												notification.memberData?.memberImage
													? `${REACT_APP_API_URL}/${notification.memberData.memberImage}`
													: undefined
											}
											sx={{ width: 40, height: 40 }}
										>
											{getNotificationIcon(notification.notificationType, notification.notificationGroup)}
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={
											<Stack direction="row" alignItems="center" spacing={1}>
												<Typography 
													variant="body2" 
													fontWeight={notification.notificationStatus === NotificationStatus.WAIT ? 600 : 400}
													sx={{ flex: 1 }}
												>
													{notification.notificationTitle}
												</Typography>
												{notification.notificationStatus === NotificationStatus.WAIT && (
													<Chip 
														label="New" 
														size="small" 
														color="primary" 
														sx={{ height: 16, fontSize: '0.7rem' }}
													/>
												)}
											</Stack>
										}
										secondary={
											<Stack spacing={0.5}>
												<Typography variant="caption" color="text.secondary">
													{notification.notificationContent}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													<Moment fromNow>{notification.createdAt}</Moment>
												</Typography>
											</Stack>
										}
									/>
									<Stack direction="row" spacing={0.5}>
										{notification.notificationStatus === NotificationStatus.WAIT && (
											<Tooltip title="Mark as read">
												<IconButton
													size="small"
													onClick={() => handleMarkAsRead(notification._id)}
												>
													<MarkReadIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										)}
										<Tooltip title="Delete">
											<IconButton
												size="small"
												onClick={() => handleDeleteNotification(notification._id)}
											>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</Stack>
								</ListItem>
								{index < notifications.length - 1 && <Divider />}
							</React.Fragment>
						))}
					</List>
				)}
			</Box>

			{/* Load More Button */}
			{hasMore && notifications.length > 0 && (
				<Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
					<Button
						fullWidth
						variant="outlined"
						onClick={loadMoreNotifications}
						disabled={loading}
						startIcon={loading ? <CircularProgress size={16} /> : null}
					>
						{loading ? 'Loading...' : 'Load More'}
					</Button>
				</Box>
			)}
		</Menu>
	);
};

export default NotificationDropdown;


