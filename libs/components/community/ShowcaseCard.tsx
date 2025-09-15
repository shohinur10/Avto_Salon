import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Chip, Box, Avatar } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import ShareIcon from '@mui/icons-material/Share';

interface ShowcaseCardProps {
	boardArticle: BoardArticle;
	likeArticleHandler: any;
}

const ShowcaseCard = (props: ShowcaseCardProps) => {
	const { boardArticle, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/showcase-placeholder.jpg';
	
	const userImagePath: string = boardArticle?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	// Determine if it's a video based on content or title
	const isVideo = boardArticle.articleTitle.toLowerCase().includes('video') ||
		boardArticle.articleContent.toLowerCase().includes('video') ||
		boardArticle.articleContent.toLowerCase().includes('youtube') ||
		boardArticle.articleContent.toLowerCase().includes('vimeo');

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
		return <div>SHOWCASE CARD MOBILE</div>;
	} else {
		return (
			<Stack
				className="showcase-card-config"
				onClick={(e: React.SyntheticEvent<Element, Event>) => chooseArticleHandler(e, boardArticle)}
				sx={{
					width: '300px',
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
				{/* Main Image/Video */}
				<Box
													component="div"
					sx={{
						height: '240px',
						backgroundImage: `url(${imagePath})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						position: 'relative',
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'flex-end',
						padding: '12px'
					}}
				>
					{/* Media Type Indicator */}
					<Chip 
						icon={isVideo ? <VideocamIcon /> : <PhotoCameraIcon />}
						label={isVideo ? "Video" : "Photo"} 
						size="small"
						sx={{ 
							backgroundColor: 'rgba(0,0,0,0.7)',
							color: 'white',
							fontWeight: 600
						}}
					/>
					
					{/* Play button overlay for videos */}
					{isVideo && (
						<Box
													component="div"
							sx={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								width: '60px',
								height: '60px',
								borderRadius: '50%',
								backgroundColor: 'rgba(0,0,0,0.8)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white'
							}}
						>
							<VideocamIcon fontSize="large" />
						</Box>
					)}
				</Box>

				{/* Content */}
				<Stack sx={{ padding: '16px' }}>
					{/* Title */}
					<Typography 
						variant="h6" 
						sx={{ 
							fontWeight: 600, 
							color: '#2c3e50',
							marginBottom: '8px',
							lineHeight: 1.3,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden'
						}}
					>
						{boardArticle?.articleTitle}
					</Typography>

					{/* Description */}
					<Typography 
						variant="body2" 
						color="text.secondary" 
						sx={{ 
							marginBottom: '12px',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							lineHeight: 1.4
						}}
					>
						{boardArticle?.articleContent.replace(/<[^>]*>/g, '').substring(0, 100)}...
					</Typography>

					{/* User Info */}
					<Stack direction="row" alignItems="center" spacing={1} mb={2}>
						<Avatar 
							src={userImagePath}
							sx={{ width: 32, height: 32 }}
						/>
						<Stack>
							<Typography
								variant="body2"
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
								{boardArticle?.memberData?.memberNick}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								<Moment format={'MMM DD'}>{boardArticle?.createdAt}</Moment>
							</Typography>
						</Stack>
					</Stack>

					{/* Stats and Actions */}
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<Stack direction="row" alignItems="center" spacing={1}>
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

						<IconButton 
							size="small" 
							onClick={(e) => {
								e.stopPropagation();
								// Handle share functionality
							}}
						>
							<ShareIcon fontSize="small" />
						</IconButton>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default ShowcaseCard;
