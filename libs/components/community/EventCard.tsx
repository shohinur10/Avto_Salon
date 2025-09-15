import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Chip, Box, Button } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface EventCardProps {
	boardArticle: BoardArticle;
	likeArticleHandler: any;
}

const EventCard = (props: EventCardProps) => {
	const { boardArticle, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	
	// Extract event information from content (this would ideally come from structured data)
	const isUpcoming = new Date() < new Date(boardArticle.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000); // within 30 days
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/event-placeholder.jpg';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>EVENT CARD MOBILE</div>;
	} else {
		return (
			<Stack
				className="event-card-config"
				onClick={(e: React.SyntheticEvent<Element, Event>) => chooseArticleHandler(e, boardArticle)}
				sx={{
					width: '100%',
					backgroundColor: 'white',
					borderRadius: '16px',
					overflow: 'hidden',
					marginBottom: '20px',
					boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
					cursor: 'pointer',
					transition: 'all 0.3s ease',
					'&:hover': {
						boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
						transform: 'translateY(-4px)'
					}
				}}
			>
				{/* Event Image */}
				<Box component="div"  
					sx={{
						height: '200px',
						backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${imagePath})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						position: 'relative',
						display: 'flex',
						alignItems: 'flex-end',
						padding: '20px'
					}}
				>
					<Stack direction="row" spacing={1}>
						<Chip 
							icon={<EventIcon />}
							label={isUpcoming ? "Upcoming Event" : "Past Event"} 
							color={isUpcoming ? "success" : "default"}
							sx={{ 
								backgroundColor: isUpcoming ? '#4CAF50' : '#757575',
								color: 'white',
								fontWeight: 600
							}}
						/>
						<Chip 
							icon={<CalendarTodayIcon />}
							label={<Moment format={'MMM DD'}>{boardArticle?.createdAt}</Moment>}
							sx={{ 
								backgroundColor: 'rgba(255,255,255,0.9)',
								color: '#333',
								fontWeight: 600
							}}
						/>
					</Stack>
				</Box>

				{/* Event Content */}
				<Stack sx={{ padding: '20px' }}>
					{/* Organizer Info */}
					<Stack direction="row" alignItems="center" spacing={2} mb={2}>
						<Box component="div"  
							sx={{
								width: 36,
								height: 36,
								borderRadius: '50%',
								background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white'
							}}
						>
							<GroupIcon fontSize="small" />
						</Box>
						<Stack>
							<Typography
								variant="subtitle2"
								onClick={(e: { stopPropagation: () => void; }) => {
									e.stopPropagation();
									goMemberPage(boardArticle?.memberData?._id as string);
								}}
								sx={{ 
									fontWeight: 600, 
									color: '#333',
									'&:hover': { color: '#1976d2', textDecoration: 'underline' }
								}}
							>
								Organized by {boardArticle?.memberData?.memberNick}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								<Moment format={'MMMM DD, YYYY'}>{boardArticle?.createdAt}</Moment>
							</Typography>
						</Stack>
					</Stack>

					{/* Event Title */}
					<Typography 
						variant="h5" 
						sx={{ 
							fontWeight: 700, 
							color: '#2c3e50',
							marginBottom: '12px',
							lineHeight: 1.2
						}}
					>
						{boardArticle?.articleTitle}
					</Typography>

					{/* Event Description */}
					<Typography 
						variant="body1" 
						color="text.secondary" 
						sx={{ 
							marginBottom: '16px',
							display: '-webkit-box',
							WebkitLineClamp: 3,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							lineHeight: 1.5
						}}
					>
						{boardArticle?.articleContent.replace(/<[^>]*>/g, '').substring(0, 200)}...
					</Typography>

					{/* Event Details */}
					<Stack direction="row" spacing={3} mb={3}>
						<Stack direction="row" alignItems="center" spacing={1}>
							<LocationOnIcon color="action" fontSize="small" />
							<Typography variant="body2" color="text.secondary">
								Location in description
							</Typography>
						</Stack>
						<Stack direction="row" alignItems="center" spacing={1}>
							<GroupIcon color="action" fontSize="small" />
							<Typography variant="body2" color="text.secondary">
								{boardArticle?.articleLikes} interested
							</Typography>
						</Stack>
					</Stack>

					{/* Stats and Actions */}
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<Stack direction="row" alignItems="center" spacing={2}>
							<Stack direction="row" alignItems="center" spacing={0.5}>
								<IconButton size="small" color="default">
									<RemoveRedEyeIcon fontSize="small" />
								</IconButton>
								<Typography variant="caption">{boardArticle?.articleViews}</Typography>
							</Stack>
							
							<Stack direction="row" alignItems="center" spacing={0.5}>
								<IconButton 
									size="small" 
									color="default" 
									onClick={(e: any) => likeArticleHandler(e, user, boardArticle?._id)}
								>
									{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="error" fontSize="small" />
									) : (
										<FavoriteBorderIcon fontSize="small" />
									)}
								</IconButton>
								<Typography variant="caption">{boardArticle?.articleLikes}</Typography>
							</Stack>
						</Stack>

						{isUpcoming && (
							<Button 
								variant="contained" 
								size="small"
								startIcon={<EventIcon />}
								sx={{
									background: 'linear-gradient(45deg, #4CAF50, #45A049)',
									'&:hover': {
										background: 'linear-gradient(45deg, #45A049, #4CAF50)',
									}
								}}
								onClick={(e) => {
									e.stopPropagation();
									// Handle event registration/interest
								}}
							>
								I'm Interested
							</Button>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default EventCard;
