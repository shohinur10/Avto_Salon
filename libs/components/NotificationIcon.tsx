import React, { useState } from 'react';
import {
	Badge,
	IconButton,
	Tooltip
} from '@mui/material';
import {
	NotificationsOutlined as NotificationsIcon,
	NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';
// import NotificationDropdown from './NotificationDropdown';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationIconProps {
	className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ className }) => {
	// const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { notificationCount } = useNotifications();

	// const handleClick = (event: React.MouseEvent<HTMLElement>) => {
	// 	setAnchorEl(event.currentTarget);
	// };

	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };

	// const open = Boolean(anchorEl);

	return (
		<>
			<Tooltip title="Notifications">
				<IconButton
					className={className}
					// onClick={handleClick}
					sx={{
						color: 'inherit',
						'&:hover': {
							backgroundColor: 'rgba(255, 255, 255, 0.1)'
						}
					}}
				>
					<Badge
						badgeContent={notificationCount.unread}
						color="error"
						max={99}
						sx={{
							'& .MuiBadge-badge': {
								fontSize: '0.7rem',
								height: 18,
								minWidth: 18,
								top: 2,
								right: 2
							}
						}}
					>
						{notificationCount.unread > 0 ? (
							<NotificationsActiveIcon />
						) : (
							<NotificationsIcon />
						)}
					</Badge>
				</IconButton>
			</Tooltip>

			{/* Temporarily disabled notification dropdown */}
			{/* <NotificationDropdown
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			/> */}
		</>
	);
};

export default NotificationIcon;
