import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { 
	Stack, 
	Typography, 
	Avatar, 
	Box, 
	IconButton, 
	Button, 
	TextField, 
	Collapse,
	Divider,
	Chip,
	Menu,
	MenuItem,
	CircularProgress
} from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import { Comment } from '../../types/comment/comment';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

// Icons
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReplyIcon from '@mui/icons-material/Reply';

interface TeslaSocialPostProps {
	boardArticle: BoardArticle;
	likeArticleHandler: any;
	dislikeArticleHandler?: any;
	comments?: Comment[];
	onLoadMoreComments?: () => void;
	hasMoreComments?: boolean;
	loadingComments?: boolean;
}

const TeslaSocialPost = (props: TeslaSocialPostProps) => {
	const { 
		boardArticle, 
		likeArticleHandler, 
		dislikeArticleHandler,
		comments = [],
		onLoadMoreComments,
		hasMoreComments = false,
		loadingComments = false
	} = props;
	
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const fileInputRef = useRef<HTMLInputElement>(null);
	
	// Local state
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState('');
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [expandedImage, setExpandedImage] = useState<string | null>(null);

	// User and content data
	const userImagePath: string = boardArticle?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const postImages = boardArticle?.articleImage ? [boardArticle.articleImage] : [];
	const isLiked = boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite;
	
	// Category styling
	const getCategoryStyle = (category: string) => {
		const styles = {
			REVIEWS: { color: '#FF6B6B', bgColor: 'rgba(255, 107, 107, 0.1)' },
			QNA: { color: '#4ECDC4', bgColor: 'rgba(78, 205, 196, 0.1)' },
			EVENTS: { color: '#45B7D1', bgColor: 'rgba(69, 183, 209, 0.1)' },
			CAR_NEWS: { color: '#FFA726', bgColor: 'rgba(255, 167, 38, 0.1)' },
			SHOWCASE: { color: '#AB47BC', bgColor: 'rgba(171, 71, 188, 0.1)' },
			FREE: { color: '#66BB6A', bgColor: 'rgba(102, 187, 106, 0.1)' },
			RECOMMEND: { color: '#FF7043', bgColor: 'rgba(255, 112, 67, 0.1)' },
			HUMOR: { color: '#FFCA28', bgColor: 'rgba(255, 202, 40, 0.1)' },
		};
		return styles[category as keyof typeof styles] || styles.FREE;
	};

	const categoryStyle = getCategoryStyle(boardArticle.articleCategory);

	/** HANDLERS **/
	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const fileArray = Array.from(files);
			setSelectedImages(prev => [...prev, ...fileArray]);
			
			// Preview first image
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(fileArray[0]);
		}
	};

	const handlePostComment = () => {
		if (commentText.trim()) {
			// Handle comment posting logic here
			console.log('Posting comment:', commentText);
			setCommentText('');
			setSelectedImages([]);
			setImagePreview('');
		}
	};

	const handleLikeDislike = (action: 'like' | 'dislike', e: React.MouseEvent) => {
		e.stopPropagation();
		if (action === 'like') {
			likeArticleHandler(e, user, boardArticle._id);
		} else if (dislikeArticleHandler) {
			dislikeArticleHandler(e, user, boardArticle._id);
		}
	};

	if (device === 'mobile') {
		return <div>TESLA SOCIAL POST MOBILE</div>;
	}

	return (
		<Box
													
			sx={{
				backgroundColor: 'white',
				borderRadius: '16px',
				boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
				marginBottom: '24px',
				overflow: 'hidden',
				transition: 'all 0.3s ease',
				border: '1px solid rgba(0,0,0,0.05)',
				'&:hover': {
					boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
				}
			}}
		>
			{/* Post Header */}
			<Stack direction="row" alignItems="center" justifyContent="space-between" p={3} pb={2}>
				<Stack direction="row" alignItems="center" spacing={2}>
					<Avatar 
						src={userImagePath}
						sx={{ 
							width: 48, 
							height: 48,
							cursor: 'pointer',
							border: '2px solid #f0f0f0'
						}}
						onClick={() => goMemberPage(boardArticle?.memberData?._id as string)}
					/>
					<Stack>
						<Stack direction="row" alignItems="center" spacing={1}>
							<Typography
								variant="h6"
								onClick={() => goMemberPage(boardArticle?.memberData?._id as string)}
								sx={{ 
									fontWeight: 600, 
									color: '#1a1a1a',
									cursor: 'pointer',
									'&:hover': { color: '#1976d2' }
								}}
							>
								{boardArticle?.memberData?.memberNick}
							</Typography>
							{boardArticle?.memberData?.memberCars && boardArticle?.memberData?.memberCars > 0 && (
								<VerifiedIcon sx={{ color: '#1976d2', fontSize: 20 }} />
							)}
						</Stack>
						<Stack direction="row" alignItems="center" spacing={1}>
							<Chip 
								label={boardArticle.articleCategory.replace('_', ' ')}
								size="small"
								sx={{
									backgroundColor: categoryStyle.bgColor,
									color: categoryStyle.color,
									fontWeight: 600,
									fontSize: '0.75rem',
									height: '24px'
								}}
							/>
							<Typography variant="body2" color="text.secondary">
								<Moment format={'MMM DD, YYYY'} fromNow>{boardArticle?.createdAt}</Moment>
							</Typography>
						</Stack>
					</Stack>
				</Stack>
				
				<IconButton 
					onClick={(e) => setMenuAnchor(e.currentTarget)}
					sx={{ color: '#666' }}
				>
					<MoreVertIcon />
				</IconButton>
			</Stack>

			{/* Post Content */}
			<Stack px={3} pb={2}>
				<Typography 
					variant="h5" 
					sx={{ 
						fontWeight: 700, 
						color: '#1a1a1a',
						marginBottom: 2,
						lineHeight: 1.3
					}}
				>
					{boardArticle?.articleTitle}
				</Typography>

				<Typography 
					variant="body1" 
					sx={{ 
						color: '#4a4a4a',
						lineHeight: 1.6,
						marginBottom: 2
					}}
				>
					{boardArticle?.articleContent.replace(/<[^>]*>/g, '')}
				</Typography>
			</Stack>

			{/* Post Images */}
			{postImages.length > 0 && (
				<Box component="div"  
					sx={{ 
						position: 'relative',
						backgroundColor: '#f8f9fa'
					}}
				>
					{postImages.map((image, index) => (
						<Box
													
							key={index}
							sx={{
								width: '100%',
								height: '400px',
								backgroundImage: `url(${REACT_APP_API_URL}/${image})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								cursor: 'pointer',
								position: 'relative'
							}}
							onClick={() => setExpandedImage(`${REACT_APP_API_URL}/${image}`)}
						/>
					))}
					
					{/* Photo overlay */}
					<Box
													
						sx={{
							position: 'absolute',
							bottom: 16,
							right: 16,
							backgroundColor: 'rgba(0,0,0,0.7)',
							borderRadius: '20px',
							padding: '8px 12px',
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							gap: 1
						}}
					>
						<PhotoCameraIcon fontSize="small" />
						<Typography variant="caption">{postImages.length}</Typography>
					</Box>
				</Box>
			)}

			{/* Post Stats */}
			<Stack direction="row" alignItems="center" justifyContent="space-between" px={3} py={2}>
				<Stack direction="row" alignItems="center" spacing={3}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<VisibilityIcon sx={{ color: '#666', fontSize: 20 }} />
						<Typography variant="body2" color="text.secondary">
							{boardArticle?.articleViews}
						</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={1}>
						<FavoriteIcon sx={{ color: '#e91e63', fontSize: 20 }} />
						<Typography variant="body2" color="text.secondary">
							{boardArticle?.articleLikes}
						</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={1}>
						<ChatBubbleOutlineIcon sx={{ color: '#666', fontSize: 20 }} />
						<Typography variant="body2" color="text.secondary">
							{boardArticle?.articleComments || comments.length}
						</Typography>
					</Stack>
				</Stack>
			</Stack>

			<Divider />

			{/* Action Buttons */}
			<Stack direction="row" alignItems="center" p={2}>
				<Stack direction="row" flex={1} spacing={1}>
					<Button
						startIcon={<ThumbUpIcon />}
						onClick={(e) => handleLikeDislike('like', e)}
						sx={{
							flex: 1,
							borderRadius: '12px',
							textTransform: 'none',
							fontWeight: 600,
							color: isLiked ? '#1976d2' : '#666',
							backgroundColor: isLiked ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
							'&:hover': {
								backgroundColor: 'rgba(25, 118, 210, 0.1)',
							}
						}}
					>
						Like
					</Button>
					
					<Button
						startIcon={<ThumbDownIcon />}
						onClick={(e) => handleLikeDislike('dislike', e)}
						sx={{
							flex: 1,
							borderRadius: '12px',
							textTransform: 'none',
							fontWeight: 600,
							color: '#666',
							'&:hover': {
								backgroundColor: 'rgba(244, 67, 54, 0.1)',
								color: '#f44336'
							}
						}}
					>
						Dislike
					</Button>
					
					<Button
						startIcon={<ChatBubbleOutlineIcon />}
						onClick={() => setShowComments(!showComments)}
						sx={{
							flex: 1,
							borderRadius: '12px',
							textTransform: 'none',
							fontWeight: 600,
							color: '#666',
							'&:hover': {
								backgroundColor: 'rgba(76, 175, 80, 0.1)',
								color: '#4caf50'
							}
						}}
					>
						Comment
					</Button>
					
					<Button
						startIcon={<ShareIcon />}
						sx={{
							flex: 1,
							borderRadius: '12px',
							textTransform: 'none',
							fontWeight: 600,
							color: '#666',
							'&:hover': {
								backgroundColor: 'rgba(156, 39, 176, 0.1)',
								color: '#9c27b0'
							}
						}}
					>
						Share
					</Button>
				</Stack>
			</Stack>

			{/* Comments Section */}
			<Collapse in={showComments}>
				<Divider />
				
				{/* Comment Input */}
				<Stack p={3} spacing={2}>
					<Stack direction="row" alignItems="flex-start" spacing={2}>
						<Avatar 
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'}
							sx={{ width: 36, height: 36 }}
						/>
						<Stack flex={1} spacing={2}>
							<TextField
								multiline
								rows={3}
								placeholder="Write a comment..."
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								variant="outlined"
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: '12px',
										backgroundColor: '#f8f9fa'
									}
								}}
							/>
							
							{/* Image Preview */}
							{imagePreview && (
								<Box
													
									sx={{
										width: 100,
										height: 100,
										backgroundImage: `url(${imagePreview})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										borderRadius: '8px',
										position: 'relative'
									}}
								>
									<IconButton
										size="small"
										onClick={() => {
											setImagePreview('');
											setSelectedImages([]);
										}}
										sx={{
											position: 'absolute',
											top: 4,
											right: 4,
											backgroundColor: 'rgba(0,0,0,0.7)',
											color: 'white',
											'&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' }
										}}
									>
										×
									</IconButton>
								</Box>
							)}
							
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								<IconButton
									onClick={() => fileInputRef.current?.click()}
									sx={{ color: '#666' }}
								>
									<PhotoCameraIcon />
								</IconButton>
								
								<Button
									variant="contained"
									endIcon={<SendIcon />}
									onClick={handlePostComment}
									disabled={!commentText.trim()}
									sx={{
										borderRadius: '20px',
										textTransform: 'none',
										fontWeight: 600,
										background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
										'&:hover': {
											background: 'linear-gradient(45deg, #1565c0, #1976d2)',
										}
									}}
								>
									Post
								</Button>
							</Stack>
						</Stack>
					</Stack>

					{/* Hidden file input */}
					<input
						type="file"
						ref={fileInputRef}
						multiple
						accept="image/*"
						style={{ display: 'none' }}
						onChange={handleImageUpload}
					/>
				</Stack>

				{/* Comments List */}
				<Stack px={3} pb={3} spacing={2}>
					{comments.map((comment, index) => (
						<CommentItem 
							key={comment._id || index} 
							comment={comment}
							onReply={(commentId) => setReplyingTo(commentId)}
						/>
					))}
					
					{/* Load More Comments */}
					{hasMoreComments && (
						<Stack alignItems="center" py={2}>
							{loadingComments ? (
								<CircularProgress size={24} />
							) : (
								<Button
									onClick={onLoadMoreComments}
									sx={{
										textTransform: 'none',
										fontWeight: 600,
										color: '#1976d2'
									}}
								>
									Load more comments
								</Button>
							)}
						</Stack>
					)}
				</Stack>
			</Collapse>

			{/* Menu */}
			<Menu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={() => setMenuAnchor(null)}
			>
				<MenuItem onClick={() => setMenuAnchor(null)}>Report Post</MenuItem>
				<MenuItem onClick={() => setMenuAnchor(null)}>Hide Post</MenuItem>
				{boardArticle?.memberData?._id === user?._id && (
					<MenuItem onClick={() => setMenuAnchor(null)}>Delete Post</MenuItem>
				)}
			</Menu>
		</Box>
	);
};

// Comment Item Component
interface CommentItemProps {
	comment: Comment;
	onReply: (commentId: string) => void;
	isReply?: boolean;
}

const CommentItem = ({ comment, onReply, isReply = false }: CommentItemProps) => {
	const [showReplies, setShowReplies] = useState(false);
	const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);

	const userImagePath = comment?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${comment?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	return (
		<Stack 
			direction="row" 
			spacing={2} 
			sx={{ 
				ml: isReply ? 6 : 0,
				p: 2,
				borderRadius: '12px',
				backgroundColor: isReply ? '#f8f9fa' : 'transparent',
				'&:hover': {
					backgroundColor: isReply ? '#f0f2f5' : '#f8f9fa'
				}
			}}
		>
			<Avatar 
				src={userImagePath}
				sx={{ width: isReply ? 32 : 36, height: isReply ? 32 : 36 }}
			/>
			<Stack flex={1} spacing={1}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Typography variant="subtitle2" fontWeight={600}>
						{comment?.memberData?.memberNick}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						<Moment fromNow>{comment?.createdAt}</Moment>
					</Typography>
				</Stack>
				
				<Typography variant="body2" sx={{ lineHeight: 1.5 }}>
					{comment?.commentContent}
				</Typography>
				
				<Stack direction="row" alignItems="center" spacing={2}>
					<Button
						size="small"
						startIcon={<ThumbUpIcon sx={{ fontSize: 14 }} />}
						onClick={() => setLiked(!liked)}
						sx={{
							minWidth: 'auto',
							color: liked ? '#1976d2' : '#666',
							fontSize: '0.75rem',
							p: 0.5
						}}
					>
						12
					</Button>
					
					<Button
						size="small"
						startIcon={<ThumbDownIcon sx={{ fontSize: 14 }} />}
						onClick={() => setDisliked(!disliked)}
						sx={{
							minWidth: 'auto',
							color: disliked ? '#f44336' : '#666',
							fontSize: '0.75rem',
							p: 0.5
						}}
					>
						2
					</Button>
					
					<Button
						size="small"
						startIcon={<ReplyIcon sx={{ fontSize: 14 }} />}
						onClick={() => onReply(comment._id)}
						sx={{
							minWidth: 'auto',
							color: '#666',
							fontSize: '0.75rem',
							p: 0.5
						}}
					>
						Reply
					</Button>
				</Stack>
				
				{/* Nested replies would go here */}
			</Stack>
		</Stack>
	);
};

export default TeslaSocialPost;
