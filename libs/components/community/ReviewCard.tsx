import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Chip, Box, Rating, Avatar } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

interface ReviewCardProps {
	boardArticle: BoardArticle;
	likeArticleHandler: any;
}

const ReviewCard = (props: ReviewCardProps) => {
	const { boardArticle, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/review-placeholder.jpg';
	
	const userImagePath: string = boardArticle?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	// Extract rating from content (this would ideally come from structured data)
	// Looking for patterns like "5/5", "4 stars", "Rating: 4.5"
	const extractRating = (content: string): number => {
		const ratingPatterns = [
			/(\d(?:\.\d)?)\s*\/\s*5/,
			/(\d(?:\.\d)?)\s*stars?/i,
			/rating:?\s*(\d(?:\.\d)?)/i,
			/(\d(?:\.\d)?)\s*out\s*of\s*5/i
		];
		
		for (const pattern of ratingPatterns) {
			const match = content.match(pattern);
			if (match) {
				const rating = parseFloat(match[1]);
				return rating <= 5 ? rating : rating / 2; // Normalize to 5-star scale
			}
		}
		return 0; // No rating found
	};

	const rating = extractRating(`${boardArticle.articleTitle} ${boardArticle.articleContent}`);
	const isExperiencePost = boardArticle.articleTitle.toLowerCase().includes('experience') ||
		boardArticle.articleContent.toLowerCase().includes('experience') ||
		boardArticle.articleContent.toLowerCase().includes('owned');

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
		return <div>REVIEW CARD MOBILE</div>;
	} else {
		return (
			<Stack
				className="review-card-config"
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
						transform: 'translateY(-2px)'
					}
				}}
			>
				{/* Header with car image */}
				<Box
					sx={{
						height: '200px',
						backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${imagePath})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						position: 'relative',
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						padding: '16px'
					}}
				>
					{/* Review Type */}
					<Chip 
						icon={<DirectionsCarIcon />}
						label={isExperiencePost ? "Owner Experience" : "Car Review"} 
						sx={{ 
							backgroundColor: 'rgba(255,255,255,0.9)',
							color: '#333',
							fontWeight: 600
						}}
					/>
					
					{/* Rating */}
					{rating > 0 && (
						<Box
							sx={{
								backgroundColor: 'rgba(255,255,255,0.9)',
								borderRadius: '8px',
								padding: '8px 12px',
								display: 'flex',
								alignItems: 'center',
								gap: 1
							}}
						>
							<Rating value={rating} readOnly size="small" precision={0.5} />
							<Typography variant="body2" fontWeight={600}>
								{rating.toFixed(1)}
							</Typography>
						</Box>
					)}
				</Box>

				{/* Content */}
				<Stack sx={{ padding: '20px' }}>
					{/* User Info */}
					<Stack direction="row" alignItems="center" spacing={2} mb={2}>
						<Avatar 
							src={userImagePath}
							sx={{ width: 48, height: 48 }}
						/>
						<Stack flex={1}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Typography
									variant="subtitle1"
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
								{boardArticle?.memberData?.memberCars && boardArticle?.memberData?.memberCars > 0 && (
									<VerifiedUserIcon color="primary" fontSize="small" />
								)}
							</Stack>
							<Typography variant="caption" color="text.secondary">
								<Moment format={'MMMM DD, YYYY'}>{boardArticle?.createdAt}</Moment>
								{boardArticle?.memberData?.memberCars && (
									<> • Owner of {boardArticle?.memberData?.memberCars} car{boardArticle?.memberData?.memberCars > 1 ? 's' : ''}</>
								)}
							</Typography>
						</Stack>
					</Stack>

					{/* Review Title */}
					<Typography 
						variant="h5" 
						sx={{ 
							fontWeight: 700, 
							color: '#2c3e50',
							marginBottom: '12px',
							lineHeight: 1.3
						}}
					>
						{boardArticle?.articleTitle}
					</Typography>

					{/* Review Summary */}
					<Typography 
						variant="body1" 
						color="text.secondary" 
						sx={{ 
							marginBottom: '16px',
							display: '-webkit-box',
							WebkitLineClamp: 3,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							lineHeight: 1.6
						}}
					>
						{boardArticle?.articleContent.replace(/<[^>]*>/g, '').substring(0, 250)}...
					</Typography>

					{/* Review Highlights */}
					<Stack direction="row" spacing={2} mb={3}>
						{rating > 4 && (
							<Chip 
								icon={<ThumbUpIcon />}
								label="Highly Recommended" 
								color="success" 
								variant="outlined"
								size="small"
							/>
						)}
						{isExperiencePost && (
							<Chip 
								label="Long-term Owner" 
								color="info" 
								variant="outlined"
								size="small"
							/>
						)}
					</Stack>

					{/* Stats and Actions */}
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<Stack direction="row" alignItems="center" spacing={2}>
							<Stack direction="row" alignItems="center" spacing={0.5}>
								<IconButton size="small" color="default">
									<RemoveRedEyeIcon fontSize="small" />
								</IconButton>
								<Typography variant="body2">{boardArticle?.articleViews}</Typography>
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
								<Typography variant="body2">{boardArticle?.articleLikes}</Typography>
							</Stack>

							<Typography variant="body2" color="text.secondary">
								{boardArticle?.articleComments} comments
							</Typography>
						</Stack>

						{rating > 0 && (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Rating value={rating} readOnly size="small" precision={0.5} />
								<Typography variant="body2" fontWeight={600}>
									{rating.toFixed(1)}/5
								</Typography>
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default ReviewCard;
