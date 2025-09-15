import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Chip, Box } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface QACardProps {
	boardArticle: BoardArticle;
	likeArticleHandler: any;
}

const QACard = (props: QACardProps) => {
	const { boardArticle, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	
	// Determine if this is a question (contains ?) or answer
	const isQuestion = boardArticle.articleTitle.includes('?') || 
		boardArticle.articleContent.toLowerCase().includes('how') ||
		boardArticle.articleContent.toLowerCase().includes('what') ||
		boardArticle.articleContent.toLowerCase().includes('why') ||
		boardArticle.articleContent.toLowerCase().includes('where');

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
		return <div>QA CARD MOBILE</div>;
	} else {
		return (
			<Stack
				className="qa-card-config"
				onClick={(e: React.SyntheticEvent<Element, Event>) => chooseArticleHandler(e, boardArticle)}
				sx={{
					width: '100%',
					backgroundColor: 'white',
					borderRadius: '12px',
					padding: '20px',
					marginBottom: '16px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
					cursor: 'pointer',
					transition: 'all 0.3s ease',
					'&:hover': {
						boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
						transform: 'translateY(-2px)'
					}
				}}
			>
				{/* Header with user info and type indicator */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Box component="div"  
							sx={{
								width: 40,
								height: 40,
								borderRadius: '50%',
								background: isQuestion ? 'linear-gradient(45deg, #FF6B6B, #4ECDC4)' : 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white'
							}}
						>
							{isQuestion ? <HelpOutlineIcon /> : <QuestionAnswerIcon />}
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
								{boardArticle?.memberData?.memberNick}
							</Typography>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Chip 
									label={isQuestion ? "Question" : "Discussion"} 
									size="small"
									color={isQuestion ? "error" : "info"}
									variant="outlined"
								/>
								<Typography variant="caption" color="text.secondary">
									<Moment format={'MMM DD, YYYY'}>{boardArticle?.createdAt}</Moment>
								</Typography>
							</Stack>
						</Stack>
					</Stack>
				</Stack>

				{/* Title */}
				<Typography 
					variant="h6" 
					sx={{ 
						fontWeight: 600, 
						color: '#2c3e50',
						marginBottom: '8px',
						lineHeight: 1.3
					}}
				>
					{boardArticle?.articleTitle}
				</Typography>

				{/* Content Preview */}
				<Typography 
					variant="body2" 
					color="text.secondary" 
					sx={{ 
						marginBottom: '16px',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden'
					}}
				>
					{boardArticle?.articleContent.replace(/<[^>]*>/g, '').substring(0, 150)}...
				</Typography>

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

						<Stack direction="row" alignItems="center" spacing={0.5}>
							<QuestionAnswerIcon fontSize="small" color="action" />
							<Typography variant="caption">{boardArticle?.articleComments} replies</Typography>
						</Stack>
					</Stack>

					{isQuestion && (
						<Chip 
							label="Need Answer" 
							size="small" 
							color="warning" 
							variant="filled"
							sx={{ fontSize: '0.7rem' }}
						/>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default QACard;
