import React, { useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Stack,
	Typography,
	Alert
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { CREATE_NOTIFICATION } from '../apollo/user/mutation';
import { NotificationType, NotificationGroup } from '../enums/notification.enum';
import { NotificationInput } from '../types/notification/notification.input';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../sweetAlert';

const NotificationTest: React.FC = () => {
	const user = useReactiveVar(userVar);
	const [createNotification] = useMutation(CREATE_NOTIFICATION);
	const [testData, setTestData] = useState({
		title: 'Test Notification',
		content: 'This is a test notification to verify the system is working.',
		type: NotificationType.LIKE,
		group: NotificationGroup.MEMBER
	});

	const handleCreateTestNotification = async () => {
		if (!user?._id) {
			sweetMixinErrorAlert('Please log in to test notifications');
			return;
		}

		try {
			const notificationInput: NotificationInput = {
				notificationType: testData.type,
				notificationGroup: testData.group,
				notificationTitle: testData.title,
				notificationContent: testData.content,
				notificationRefId: user._id,
				memberId: user._id
			};

			await createNotification({
				variables: { input: notificationInput }
			});

			await sweetTopSmallSuccessAlert('Test notification created successfully!', 2000);
		} catch (error: any) {
			sweetMixinErrorAlert(error.message);
		}
	};

	if (!user?._id) {
		return (
			<Alert severity="info">
				Please log in to test the notification system.
			</Alert>
		);
	}

	return (
		<Card sx={{ maxWidth: 500, mx: 'auto', mt: 2 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Notification System Test
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					Use this component to test the notification system functionality.
				</Typography>
				
				<Stack spacing={2}>
					<TextField
						fullWidth
						label="Notification Title"
						value={testData.title}
						onChange={(e) => setTestData(prev => ({ ...prev, title: e.target.value }))}
						size="small"
					/>
					
					<TextField
						fullWidth
						label="Notification Content"
						value={testData.content}
						onChange={(e) => setTestData(prev => ({ ...prev, content: e.target.value }))}
						multiline
						rows={3}
						size="small"
					/>

					<Stack direction="row" spacing={2}>
						<Button
							variant="outlined"
							onClick={() => setTestData(prev => ({ 
								...prev, 
								type: NotificationType.LIKE,
								title: 'Someone liked your post',
								content: 'John Doe liked your article "Amazing Car Review"'
							}))}
							size="small"
						>
							Like Notification
						</Button>
						
						<Button
							variant="outlined"
							onClick={() => setTestData(prev => ({ 
								...prev, 
								type: NotificationType.COMMENT,
								title: 'New comment on your post',
								content: 'Sarah commented: "Great article! Thanks for sharing."'
							}))}
							size="small"
						>
							Comment Notification
						</Button>
					</Stack>

					<Button
						variant="contained"
						onClick={handleCreateTestNotification}
						fullWidth
					>
						Create Test Notification
					</Button>
				</Stack>

				<Alert severity="info" sx={{ mt: 2 }}>
					<strong>Instructions:</strong>
					<br />
					1. Click "Create Test Notification" to create a test notification
					<br />
					2. Check the notification icon in the top navigation bar
					<br />
					3. Click the notification icon to see the dropdown with your test notification
					<br />
					4. Try marking it as read or deleting it
				</Alert>
			</CardContent>
		</Card>
	);
};

export default NotificationTest;







