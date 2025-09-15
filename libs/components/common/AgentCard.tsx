import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { 
	Stack, 
	Box, 
	Typography, 
	Card, 
	CardContent, 
	Avatar, 
	Button, 
	Grid, 
	Chip, 
	Divider 
} from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
	subscribeHandler?: any;
	unsubscribeHandler?: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler, subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	// Handle agent contact methods
	const handleAgentContact = (method: string) => {
		try {
			switch (method) {
				case 'whatsapp':
					if (agent?.memberPhone) {
						const cleanPhone = agent.memberPhone.replace(/[^\d]/g, '');
						window.open(`https://wa.me/${cleanPhone}`, '_blank');
					}
					break;
				case 'telegram':
					if (agent?.memberPhone) {
						window.open(`https://t.me/share/url?url=Contact Agent: ${agent?.memberNick}`, '_blank');
					}
					break;
				case 'facetime':
					if (agent?.memberPhone) {
						window.open(`facetime://${agent.memberPhone}`, '_blank');
					}
					break;
				case 'phone':
					if (agent?.memberPhone) {
						window.open(`tel:${agent.memberPhone}`, '_blank');
					}
					break;
				default:
					console.log(`Contact method ${method} not implemented`);
			}
		} catch (err: any) {
			sweetMixinErrorAlert('Failed to initiate contact').then();
		}
	};

	if (device === 'mobile') {
		return (
			<Card
				sx={{
					background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
					borderRadius: 2,
					mb: 2
				}}
			>
				<Box component="div"   sx={{ position: 'relative', textAlign: 'center', pt: 2 }}>
					<Avatar
						src={imagePath}
						sx={{
							width: 60,
							height: 60,
							margin: '0 auto',
							border: '2px solid rgba(255, 255, 255, 0.2)',
						}}
					/>
					<IconButton
						onClick={() => likeMemberHandler(user, agent?._id)}
						sx={{
							position: 'absolute',
							top: 8,
							right: 8,
							color: agent?.meLiked && agent?.meLiked[0]?.myFavorite ? '#FF6B6B' : 'rgba(255, 255, 255, 0.6)',
						}}
					>
						{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon />
						) : (
							<FavoriteBorderIcon />
						)}
					</IconButton>
				</Box>

				<CardContent sx={{ p: 2, color: 'white' }}>
					<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1, textAlign: 'center' }}>
						{agent?.memberFullName || agent?.memberNick}
					</Typography>
					
					<Stack direction="row" spacing={1} justifyContent="center" mb={2}>
						<Chip
							icon={<StarIcon />}
							label={`${agent?.memberRank || 4.5}`}
							size="small"
							sx={{ 
								bgcolor: 'rgba(255, 215, 0, 0.2)', 
								color: '#FFD700',
								fontSize: '0.7rem'
							}}
						/>
						<Chip
							label={`${agent?.memberCars || 0} Cars`}
							size="small"
							sx={{ 
								bgcolor: 'rgba(59, 130, 246, 0.2)', 
								color: '#3B82F6',
								fontSize: '0.7rem'
							}}
						/>
					</Stack>

					{/* Follow/Unfollow Button Section - Mobile */}
					{user?._id && user._id !== agent._id && subscribeHandler && unsubscribeHandler && (
						<Box component="div"   sx={{ textAlign: 'center', mb: 2 }}>
							{agent?.meFollowed && agent?.meFollowed[0]?.myFollowing ? (
								<Button
									variant="outlined"
									size="small"
									startIcon={<PersonRemoveIcon />}
									onClick={() => unsubscribeHandler(agent._id)}
									sx={{
										color: '#ff6b6b',
										borderColor: '#ff6b6b',
										fontSize: '0.7rem',
										'&:hover': {
											backgroundColor: 'rgba(255, 107, 107, 0.1)',
											borderColor: '#ff5252',
										}
									}}
								>
									Unfollow
								</Button>
							) : (
								<Button
									variant="contained"
									size="small"
									startIcon={<PersonAddIcon />}
									onClick={() => subscribeHandler(agent._id)}
									sx={{
										backgroundColor: '#4caf50',
										fontSize: '0.7rem',
										'&:hover': {
											backgroundColor: '#45a049',
										}
									}}
								>
									Follow
								</Button>
							)}
						</Box>
					)}

					<Grid container spacing={1}>
						{agent?.memberPhone && (
							<>
								<Grid item xs={6}>
									<Button
										fullWidth
										size="small"
										startIcon={<WhatsAppIcon />}
										onClick={() => handleAgentContact('whatsapp')}
										sx={{
											bgcolor: 'rgba(37, 211, 102, 0.2)',
											color: '#25D366',
											fontSize: '0.7rem',
											minWidth: 'unset',
											'&:hover': { bgcolor: 'rgba(37, 211, 102, 0.3)' }
										}}
									>
										WhatsApp
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										fullWidth
										size="small"
										startIcon={<PhoneIcon />}
										onClick={() => handleAgentContact('phone')}
										sx={{
											bgcolor: 'rgba(34, 197, 94, 0.2)',
											color: '#22C55E',
											fontSize: '0.7rem',
											minWidth: 'unset',
											'&:hover': { bgcolor: 'rgba(34, 197, 94, 0.3)' }
										}}
									>
										Call
									</Button>
								</Grid>
							</>
						)}
					</Grid>
				</CardContent>
			</Card>
		);
	} else {
		return (
			<Card
				sx={{
					height: '100%',
					background: 'linear-gradient(135deg, rgba(128, 128, 128, 0.15) 0%, rgba(96, 96, 96, 0.1) 100%)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(128, 128, 128, 0.2)',
					borderRadius: 3,
					overflow: 'hidden',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-8px)',
						boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
						border: '1px solid rgba(128, 128, 128, 0.4)',
						background: 'linear-gradient(135deg, rgba(128, 128, 128, 0.2) 0%, rgba(96, 96, 96, 0.15) 100%)',
					}
				}}
			>
				<Box component="div"   sx={{ position: 'relative', textAlign: 'center', pt: 3 }}>
				<Link href={`/agent/${agent?._id}`}>
						<Avatar
							src={imagePath}
							sx={{
								width: 80,
								height: 80,
								margin: '0 auto',
								border: '3px solid rgba(255, 255, 255, 0.2)',
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
								cursor: 'pointer'
							}}
						/>
					</Link>
					<IconButton
						onClick={() => likeMemberHandler(user, agent?._id)}
						sx={{
							position: 'absolute',
							top: 16,
							right: 16,
							color: agent?.meLiked && agent?.meLiked[0]?.myFavorite ? '#FF6B6B' : 'rgba(255, 255, 255, 0.6)',
							'&:hover': { color: '#FF6B6B' }
						}}
						>
							{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
				</Box>

				<CardContent sx={{ p: 3, color: 'white' }}>
					<Link href={`/agent/${agent?._id}`} style={{ textDecoration: 'none' }}>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 1, textAlign: 'center', color: 'white', '&:hover': { color: '#3B82F6' } }}>
							{agent?.memberFullName || agent?.memberNick}
						</Typography>
					</Link>
					
					<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', mb: 2 }}>
						Professional Car Consultant
					</Typography>

					<Stack direction="row" spacing={1} justifyContent="center" mb={2}>
						<Chip
							icon={<StarIcon />}
							label={`${agent?.memberRank || 4.5}`}
							size="small"
							sx={{ 
								bgcolor: 'rgba(255, 215, 0, 0.2)', 
								color: '#FFD700',
								border: '1px solid rgba(255, 215, 0, 0.3)'
							}}
						/>
						<Chip
							label={`${agent?.memberCars || 0} Cars`}
							size="small"
							sx={{ 
								bgcolor: 'rgba(59, 130, 246, 0.2)', 
								color: '#3B82F6',
								border: '1px solid rgba(59, 130, 246, 0.3)'
							}}
						/>
					</Stack>

					<Stack direction="row" spacing={2} justifyContent="center" mb={2}>
						<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<RemoveRedEyeIcon sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.6)' }} />
							<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
								{agent?.memberViews || 0}
							</Typography>
						</Box>
						<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<FavoriteIcon sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.6)' }} />
							<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
								{agent?.memberLikes || 0}
							</Typography>
					</Box>
				</Stack>

				{/* Follow/Unfollow Button Section */}
				{user?._id && user._id !== agent._id && subscribeHandler && unsubscribeHandler && (
					<Box component="div"   sx={{ textAlign: 'center', mb: 2 }}>
						{agent?.meFollowed && agent?.meFollowed[0]?.myFollowing ? (
							<Button
								variant="outlined"
								size="small"
								startIcon={<PersonRemoveIcon />}
								onClick={() => unsubscribeHandler(agent._id)}
								sx={{
									color: '#ff6b6b',
									borderColor: '#ff6b6b',
									'&:hover': {
										backgroundColor: 'rgba(255, 107, 107, 0.1)',
										borderColor: '#ff5252',
									}
								}}
							>
								Unfollow
							</Button>
						) : (
							<Button
								variant="contained"
								size="small"
								startIcon={<PersonAddIcon />}
								onClick={() => subscribeHandler(agent._id)}
								sx={{
									backgroundColor: '#4caf50',
									'&:hover': {
										backgroundColor: '#45a049',
									}
								}}
							>
								Follow
							</Button>
						)}
					</Box>
				)}

					<Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

					<Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 1, textAlign: 'center' }}>
						Contact Methods
					</Typography>

					<Grid container spacing={1}>
						{agent?.memberPhone && (
							<>
								<Grid item xs={6}>
									<Button
										fullWidth
										size="small"
										startIcon={<WhatsAppIcon />}
										onClick={() => handleAgentContact('whatsapp')}
										sx={{
											bgcolor: 'rgba(37, 211, 102, 0.2)',
											color: '#25D366',
											border: '1px solid rgba(37, 211, 102, 0.3)',
											'&:hover': { bgcolor: 'rgba(37, 211, 102, 0.3)' }
										}}
									>
										WhatsApp
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										fullWidth
										size="small"
										startIcon={<TelegramIcon />}
										onClick={() => handleAgentContact('telegram')}
										sx={{
											bgcolor: 'rgba(0, 136, 204, 0.2)',
											color: '#0088CC',
											border: '1px solid rgba(0, 136, 204, 0.3)',
											'&:hover': { bgcolor: 'rgba(0, 136, 204, 0.3)' }
										}}
									>
										Telegram
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										fullWidth
										size="small"
										startIcon={<VideocamIcon />}
										onClick={() => handleAgentContact('facetime')}
										sx={{
											bgcolor: 'rgba(0, 122, 255, 0.2)',
											color: '#007AFF',
											border: '1px solid rgba(0, 122, 255, 0.3)',
											'&:hover': { bgcolor: 'rgba(0, 122, 255, 0.3)' }
										}}
									>
										FaceTime
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										fullWidth
										size="small"
										startIcon={<PhoneIcon />}
										onClick={() => handleAgentContact('phone')}
										sx={{
											bgcolor: 'rgba(34, 197, 94, 0.2)',
											color: '#22C55E',
											border: '1px solid rgba(34, 197, 94, 0.3)',
											'&:hover': { bgcolor: 'rgba(34, 197, 94, 0.3)' }
										}}
									>
										Call
									</Button>
								</Grid>
							</>
						)}
					</Grid>
				</CardContent>
			</Card>
		);
	}
};

