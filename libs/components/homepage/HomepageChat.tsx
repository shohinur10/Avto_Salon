import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
	Avatar, 
	Box, 
	Stack, 
	Typography, 
	TextField, 
	IconButton, 
	Badge, 
	Paper,
	Fade,
	Slide,
	Button,
	Chip,
	Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { socketVar, userVar } from '../../../apollo/store';
import { Member } from '../../types/member/member';
import { Messages, REACT_APP_API_URL } from '../../config';
import { sweetErrorAlert } from '../../sweetAlert';

// Types
interface MessagePayload {
	event: string;
	text: string;
	user?: {
		_id: string;
		nick: string;
		avatar?: string;
	};
	timestamp?: string;
}

interface InfoPayload {
	event: string;
	totalClients: number;
}

interface HomepageChatProps {
	className?: string;
}

const HomepageChat: React.FC<HomepageChatProps> = ({ className }) => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [showChatButton, setShowChatButton] = useState<boolean>(false);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [typingUsers, setTypingUsers] = useState<string[]>([]);
	
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const device = useDeviceDetect();
	const isMobile = device === 'mobile';

	/** LIFECYCLES **/
	useEffect(() => {
		// Show chat button after a short delay
		const timeoutId = setTimeout(() => {
			setShowChatButton(true);
		}, 2000);

		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		// Hide chat button when navigating to different pages
		setShowChatButton(false);
		const timeoutId = setTimeout(() => {
			setShowChatButton(true);
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [router.pathname]);

	useEffect(() => {
		if (socket) {
			// Store the original onmessage handler
			const originalOnMessage = socket.onmessage;
			
		socket.onmessage = (msg) => {
			// Call original handler first
			if (originalOnMessage) {
				originalOnMessage.call(socket, msg);
			}
				
				// Handle homepage chat specific messages
				try {
					const data = JSON.parse(msg.data);
					console.log('Homepage Chat WebSocket message:', data);
					
					switch (data.event) {
						case 'info':
							const newInfo: InfoPayload = data;
							setOnlineUsers(newInfo.totalClients);
							break;
							
						case 'getMessages':
							const list: MessagePayload[] = data.list || [];
							setMessagesList(list);
							break;
							
						case 'message':
							const newMessage: MessagePayload = data;
							setMessagesList(prevMessages => [...prevMessages, newMessage]);
							break;
							
						case 'typing':
							setTypingUsers(data.users || []);
							break;
							
						case 'stopTyping':
							setTypingUsers(prev => prev.filter(u => u !== data.userId));
							break;
					}
				} catch (error) {
					console.warn('Failed to parse WebSocket message:', error);
				}
			};
		}
	}, [socket]);

	/** HANDLERS **/
	const handleToggleChat = () => {
		setIsOpen(prevState => !prevState);
		if (!isOpen && socket) {
			// Request messages when opening chat
			socket.send(JSON.stringify({ event: 'getMessages' }));
		}
	};

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value;
		setMessageInput(text);
		
		// Handle typing indicators
		if (socket && user?._id) {
			if (text.length > 0 && !isTyping) {
				setIsTyping(true);
				socket.send(JSON.stringify({ 
					event: 'typing', 
					userId: user._id,
					userName: user.memberNick 
				}));
			} else if (text.length === 0 && isTyping) {
				setIsTyping(false);
				socket.send(JSON.stringify({ 
					event: 'stopTyping', 
					userId: user._id 
				}));
			}
		}
	}, [socket, user, isTyping]);

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleSendMessage = () => {
		if (!messageInput.trim()) {
			sweetErrorAlert(Messages.error4);
			return;
		}

		if (!socket) {
			sweetErrorAlert('Connection not available');
			return;
		}

		if (!user?._id) {
			sweetErrorAlert('Please login to send messages');
			return;
		}

		// Stop typing indicator
		if (isTyping) {
			setIsTyping(false);
			socket.send(JSON.stringify({ 
				event: 'stopTyping', 
				userId: user._id 
			}));
		}

		// Send message
		socket.send(JSON.stringify({ 
			event: 'message', 
			data: messageInput,
			user: {
				_id: user._id,
				nick: user.memberNick,
				avatar: user.memberImage
			}
		}));
		
		setMessageInput('');
	};

	const formatTime = (timestamp?: string) => {
		if (!timestamp) return '';
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const renderMessage = (message: MessagePayload, index: number) => {
		const isOwnMessage = message.user?._id === user?._id;
		
		return (
			<Box
				key={index}
				sx={{
					display: 'flex',
					justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
					mb: 2,
					px: 2
				}}
			>
				<Stack
					direction={isOwnMessage ? 'row-reverse' : 'row'}
					spacing={1}
					alignItems="flex-end"
					sx={{ maxWidth: '70%' }}
				>
					{!isOwnMessage && (
						<Avatar
							src={message.user?.avatar || '/img/profile/defaultUser.svg'}
							alt={message.user?.nick || 'User'}
							sx={{ width: 32, height: 32 }}
						/>
					)}
					
					<Paper
						elevation={2}
						sx={{
							p: 1.5,
							bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
							color: isOwnMessage ? 'white' : 'text.primary',
							borderRadius: 2,
							position: 'relative',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: '50%',
								[isOwnMessage ? 'right' : 'left']: -8,
								transform: 'translateY(-50%)',
								width: 0,
								height: 0,
								borderTop: '8px solid transparent',
								borderBottom: '8px solid transparent',
								[isOwnMessage ? 'borderLeft' : 'borderRight']: `8px solid ${
									isOwnMessage ? 'primary.main' : 'grey.100'
								}`
							}
						}}
					>
						{!isOwnMessage && (
							<Typography variant="caption" sx={{ 
								fontWeight: 'bold', 
								display: 'block',
								mb: 0.5,
								color: 'primary.main'
							}}>
								{message.user?.nick || 'Anonymous'}
							</Typography>
						)}
						
						<Typography variant="body2">
							{message.text}
						</Typography>
						
						<Typography variant="caption" sx={{ 
							display: 'block',
							mt: 0.5,
							opacity: 0.7,
							textAlign: isOwnMessage ? 'right' : 'left'
						}}>
							{formatTime(message.timestamp)}
						</Typography>
					</Paper>
				</Stack>
			</Box>
		);
	};

	return (
		<Box className={`homepage-chat ${className || ''}`}>
			{/* Chat Toggle Button */}
			<Fade in={showChatButton} timeout={500}>
				<Box
					sx={{
						position: 'fixed',
						bottom: isMobile ? 16 : 24,
						right: isMobile ? 16 : 24,
						zIndex: 1000
					}}
				>
					<Badge
						badgeContent={onlineUsers}
						color="primary"
						overlap="circular"
					>
						<Button
							variant="contained"
							onClick={handleToggleChat}
							sx={{
								borderRadius: '50%',
								width: isMobile ? 56 : 60,
								height: isMobile ? 56 : 60,
								minWidth: 'auto',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
								'&:hover': {
									background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
									transform: 'scale(1.05)',
									transition: 'all 0.3s ease'
								}
							}}
						>
							{isOpen ? <CloseIcon /> : <ChatIcon />}
						</Button>
					</Badge>
				</Box>
			</Fade>

			{/* Chat Window */}
			<Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
				<Paper
					elevation={8}
					sx={{
						position: 'fixed',
						bottom: isMobile ? 80 : 100,
						right: isMobile ? 16 : 24,
						left: isMobile ? 16 : 'auto',
						width: isMobile ? 'calc(100vw - 32px)' : 380,
						height: isMobile ? 'calc(100vh - 120px)' : 500,
						zIndex: 999,
						display: 'flex',
						flexDirection: 'column',
						borderRadius: isMobile ? 2 : 3,
						overflow: 'hidden',
						background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(255,255,255,0.2)'
					}}
				>
					{/* Chat Header */}
					<Box
						sx={{
							p: 2,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<Stack direction="row" spacing={1} alignItems="center">
							<ChatIcon />
							<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
								Live Chat
							</Typography>
							<Chip
								label={`${onlineUsers} online`}
								size="small"
								sx={{
									bgcolor: 'rgba(255,255,255,0.2)',
									color: 'white',
									fontSize: '0.75rem'
								}}
							/>
						</Stack>
						
						<IconButton
							onClick={handleToggleChat}
							sx={{ color: 'white' }}
						>
							<CloseIcon />
						</IconButton>
					</Box>

					{/* Messages Area */}
					<Box
						ref={chatContentRef}
						sx={{
							flex: 1,
							overflow: 'hidden',
							background: 'rgba(248, 250, 252, 0.5)'
						}}
					>
						<ScrollableFeed>
							{messagesList.length === 0 ? (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										height: '100%',
										p: 3,
										textAlign: 'center'
									}}
								>
									<PersonIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
									<Typography variant="body2" color="text.secondary">
										Start a conversation with our community!
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{onlineUsers} people are online
									</Typography>
								</Box>
							) : (
								messagesList.map((message, index) => renderMessage(message, index))
							)}
							
							{/* Typing Indicator */}
							{typingUsers.length > 0 && (
								<Box sx={{ px: 2, py: 1 }}>
									<Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
										{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
									</Typography>
								</Box>
							)}
						</ScrollableFeed>
					</Box>

					{/* Message Input */}
					<Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
						<Stack direction="row" spacing={1} alignItems="flex-end">
							<TextField
								fullWidth
								multiline
								maxRows={3}
								placeholder={user?._id ? "Type your message..." : "Login to chat"}
								value={messageInput}
								onChange={handleInputChange}
								onKeyPress={handleKeyPress}
								disabled={!user?._id}
								variant="outlined"
								size="small"
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
										backgroundColor: 'rgba(255,255,255,0.8)'
									}
								}}
							/>
							<IconButton
								onClick={handleSendMessage}
								disabled={!messageInput.trim() || !user?._id}
								color="primary"
								sx={{
									bgcolor: 'primary.main',
									color: 'white',
									'&:hover': {
										bgcolor: 'primary.dark'
									},
									'&:disabled': {
										bgcolor: 'grey.300',
										color: 'grey.500'
									}
								}}
							>
								<SendIcon />
							</IconButton>
						</Stack>
						
						{!user?._id && (
							<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
								Please login to participate in the chat
							</Typography>
						)}
					</Box>
				</Paper>
			</Slide>
		</Box>
	);
};

export default HomepageChat;
