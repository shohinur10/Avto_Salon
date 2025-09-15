import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { 
	Box, 
	Container, 
	Typography, 
	Button, 
	Card, 
	CardContent, 
	Avatar, 
	Chip, 
	Stack, 
	Grid, 
	TextField, 
	IconButton, 
	Divider,
	Paper,
	Badge,
	Menu,
	MenuItem,
	Tooltip,
	Breadcrumbs,
	Link,
	Collapse
} from '@mui/material';
import {
	ThumbUp as LikeIcon,
	ThumbDown as DislikeIcon,
	Comment as CommentIcon,
	Share as ShareIcon,
	BookmarkBorder as BookmarkIcon,
	Bookmark as BookmarkFilledIcon,
	MoreVert as MoreIcon,
	Reply as ReplyIcon,
	Send as SendIcon,
	ArrowBack as BackIcon,
	Verified as VerifiedIcon,
	Star as StarIcon,
	Flag as FlagIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Expand as ExpandIcon,
	ExpandLess as CollapseIcon,
	Star as AwardIcon,
	TrendingUp as TrendingIcon,
	AccessTime as TimeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import Moment from 'react-moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { Comment } from '../../libs/types/comment/comment';
import { T } from '../../libs/types/common';
import { REACT_APP_API_URL } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Mock data for demonstration
const mockArticle: BoardArticle = {
	_id: '1',
	memberId: 'user1',
	articleTitle: '2024 Tesla Model S Review: Game-Changing Performance',
	articleContent: `<h2>Introduction</h2>
		<p>After 6 months of driving the 2024 Tesla Model S Plaid, I wanted to share my comprehensive experience with this incredible machine. From the jaw-dropping acceleration to the luxurious interior, this car has completely changed my perspective on electric vehicles.</p>
		
		<h3>Performance</h3>
		<p>The acceleration is simply mind-blowing. 0-60 mph in 1.99 seconds feels like being shot out of a cannon. The instant torque delivery makes every drive exciting, whether you're merging onto the highway or just having fun at a stoplight.</p>
		
		<h3>Interior & Technology</h3>
		<p>The minimalist interior design is both elegant and functional. The 17-inch touchscreen controls everything seamlessly, and the build quality has significantly improved from previous generations. The new yoke steering wheel takes some getting used to, but I actually prefer it now for highway driving.</p>
		
		<h3>Charging & Range</h3>
		<p>With the EPA-rated 405 miles of range, range anxiety is virtually non-existent. The Supercharger network makes long trips effortless, and home charging is incredibly convenient.</p>
		
		<h3>Verdict</h3>
		<p>This is hands down the best car I've ever owned. The combination of performance, technology, and sustainability makes it a true game-changer. Highly recommended for anyone considering the transition to electric.</p>`,
	articleImage: '/img/community/tesla-model-s.jpg',
	articleLikes: 234,
	articleComments: 45,
	articleViews: 1520,
	memberData: {
		_id: 'user1',
		memberType: 'USER' as any,
		memberStatus: 'ACTIVE' as any,
		memberAuthType: 'EMAIL' as any,
		memberPhone: '+1-555-0123',
		memberNick: 'TeslaEnthusiast',
		memberImage: '/img/profile/tesla-user.jpg',
		memberCars: 3,
		memberFollowers: 1200,
		memberRank: 4.9,
		memberArticles: 12,
		memberPoints: 1500,
		memberLikes: 500,
		memberViews: 2500,
		memberComments: 89,
		memberWarnings: 0,
		memberBlocks: 0,
		deletedAt: undefined,
		createdAt: new Date('2023-01-15'),
		updatedAt: new Date('2024-01-15'),
		accessToken: '',
		meLiked: [],
		meFollowed: []
	},
	createdAt: new Date('2024-01-15'),
	updatedAt: new Date('2024-01-15'),
	articleCategory: 'REVIEWS' as any,
	articleStatus: 'ACTIVE' as any,
	meLiked: []
};

const mockComments: Comment[] = [
	{
		_id: '1',
		commentStatus: 'ACTIVE' as any,
		commentGroup: 'ARTICLE' as any,
		commentContent: 'Excellent review! I\'ve been considering the Model S and this really helps. How\'s the build quality compared to traditional luxury sedans?',
		commentRefId: '1',
		memberId: 'user2',
		memberData: {
			_id: 'user2',
			memberType: 'USER' as any,
			memberStatus: 'ACTIVE' as any,
			memberAuthType: 'EMAIL' as any,
			memberPhone: '+1-555-0124',
			memberNick: 'CarLover2024',
			memberImage: '/img/profile/user2.jpg',
			memberCars: 2,
			memberArticles: 8,
			memberPoints: 800,
			memberLikes: 200,
			memberFollowers: 150,
			memberFollowings: 75,
			memberViews: 1200,
			memberComments: 45,
			memberWarnings: 0,
			memberBlocks: 0,
			memberRank: 4.2,
			deletedAt: undefined,
			createdAt: new Date('2023-02-15'),
			updatedAt: new Date('2024-01-16'),
			accessToken: '',
			meLiked: [],
			meFollowed: []
		},
		createdAt: new Date('2024-01-16'),
		updatedAt: new Date('2024-01-16')
	},
	{
		_id: '2',
		commentStatus: 'ACTIVE' as any,
		commentGroup: 'ARTICLE' as any,
		commentContent: 'I have the same car and completely agree with your assessment. The performance is absolutely incredible. One thing I\'d add is that the over-the-air updates keep making the car better over time.',
		commentRefId: '1',
		memberId: 'user3',
		memberData: {
			_id: 'user3',
			memberType: 'USER' as any,
			memberStatus: 'ACTIVE' as any,
			memberAuthType: 'EMAIL' as any,
			memberPhone: '+1-555-0125',
			memberNick: 'EVOwner',
			memberImage: '/img/profile/user3.jpg',
			memberCars: 1,
			memberArticles: 5,
			memberPoints: 600,
			memberLikes: 150,
			memberFollowers: 80,
			memberFollowings: 40,
			memberViews: 800,
			memberComments: 25,
			memberWarnings: 0,
			memberBlocks: 0,
			memberRank: 4.0,
			deletedAt: undefined,
			createdAt: new Date('2023-03-10'),
			updatedAt: new Date('2024-01-16'),
			accessToken: '',
			meLiked: [],
			meFollowed: []
		},
		createdAt: new Date('2024-01-16'),
		updatedAt: new Date('2024-01-16')
	}
];

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { query } = router;

	const [article, setArticle] = useState<BoardArticle>(mockArticle);
	const [comments, setComments] = useState<Comment[]>(mockComments);
	const [newComment, setNewComment] = useState<string>('');
	const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
	const [showAllComments, setShowAllComments] = useState<boolean>(false);
	const [replyingTo, setReplyingTo] = useState<string>('');
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

	// Enhanced Comment Component
	const CommentCard = ({ comment }: { comment: Comment }) => {
		const [commentMenuAnchor, setCommentMenuAnchor] = useState<null | HTMLElement>(null);
		const [isLiked, setIsLiked] = useState<boolean>(false);
		const [showReply, setShowReply] = useState<boolean>(false);
		const [replyText, setReplyText] = useState<string>('');

		const authorImage = comment.memberData?.memberImage
			? `${REACT_APP_API_URL}/${comment.memberData.memberImage}`
			: '/img/profile/defaultUser.svg';

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<Paper 
					sx={{ 
						p: 3, 
						borderRadius: '16px', 
						mb: 2,
						border: '1px solid rgba(0,0,0,0.08)',
						'&:hover': {
							boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
						}
					}}
				>
					<Stack direction="row" spacing={2}>
						<Avatar 
							src={authorImage} 
							sx={{ width: 48, height: 48 }} 
						/>
						<Stack flex={1}>
							<Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Typography variant="subtitle1" fontWeight={600}>
										{comment.memberData?.memberNick}
									</Typography>
									{comment.memberData?.memberCars && comment.memberData.memberCars > 2 && (
										<VerifiedIcon color="primary" fontSize="small" />
									)}
									<Chip 
										size="small" 
										label={`${comment.memberData?.memberCars || 0} cars`}
										sx={{ fontSize: '11px', height: '20px' }}
									/>
						</Stack>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Typography variant="caption" color="text.secondary">
										<Moment fromNow>{comment.createdAt}</Moment>
									</Typography>
									<IconButton 
										size="small"
										onClick={(e) => setCommentMenuAnchor(e.currentTarget)}
									>
										<MoreIcon fontSize="small" />
									</IconButton>
								</Stack>
							</Stack>

							<Typography variant="body1" mb={2} sx={{ lineHeight: 1.6 }}>
								{comment.commentContent}
							</Typography>

							<Stack direction="row" alignItems="center" spacing={2}>
								<Button
									size="small"
									startIcon={<LikeIcon />}
									onClick={() => setIsLiked(!isLiked)}
									color={isLiked ? "primary" : "inherit"}
									sx={{ 
										borderRadius: '20px',
										textTransform: 'none'
									}}
								>
                                                                        {isLiked ? 1 : 0}
								</Button>
								<Button
									size="small"
									startIcon={<ReplyIcon />}
									onClick={() => setShowReply(!showReply)}
									sx={{ 
										borderRadius: '20px',
										textTransform: 'none'
									}}
								>
									Reply
								</Button>
							</Stack>

							{/* Reply Section */}
							<Collapse in={showReply}>
								<Stack direction="row" spacing={2} mt={2}>
									<Avatar 
										src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'}
										sx={{ width: 32, height: 32 }} 
									/>
									<Stack flex={1}>
										<TextField
											fullWidth
											placeholder={`Reply to ${comment.memberData?.memberNick}...`}
											value={replyText}
											onChange={(e) => setReplyText(e.target.value)}
											multiline
											rows={2}
											variant="outlined"
											sx={{
												'& .MuiOutlinedInput-root': {
													borderRadius: '12px',
												}
											}}
										/>
										<Stack direction="row" spacing={1} mt={1} justifyContent="flex-end">
											<Button
												size="small"
												onClick={() => {
													setShowReply(false);
													setReplyText('');
												}}
											>
												Cancel
											</Button>
											<Button
												size="small"
												variant="contained"
												endIcon={<SendIcon />}
												disabled={!replyText.trim()}
												sx={{ borderRadius: '20px' }}
											>
												Reply
											</Button>
										</Stack>
									</Stack>
								</Stack>
							</Collapse>
						</Stack>
					</Stack>

					{/* Comment Menu */}
					<Menu
						anchorEl={commentMenuAnchor}
						open={Boolean(commentMenuAnchor)}
						onClose={() => setCommentMenuAnchor(null)}
					>
						<MenuItem onClick={() => setCommentMenuAnchor(null)}>
							<FlagIcon sx={{ mr: 1 }} fontSize="small" />
							Report
						</MenuItem>
						{user?._id === comment.memberData?._id && (
							[
								<MenuItem key="edit" onClick={() => setCommentMenuAnchor(null)}>
									<EditIcon sx={{ mr: 1 }} fontSize="small" />
									Edit
								</MenuItem>,
								<MenuItem key="delete" onClick={() => setCommentMenuAnchor(null)}>
									<DeleteIcon sx={{ mr: 1 }} fontSize="small" />
									Delete
								</MenuItem>
							]
						)}
					</Menu>
				</Paper>
			</motion.div>
		);
	};

	if (device === 'mobile') {
		return <Typography variant="h4">Mobile Community Detail Coming Soon</Typography>;
	}

	return (
                <Box component="div"  sx={{
			background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
			minHeight: '100vh',
			py: 4
		}}>
			<Container maxWidth="lg">
				{/* Breadcrumbs */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<Breadcrumbs sx={{ mb: 3 }}>
						<Link 
							color="inherit" 
							href="/community"
							sx={{ 
								display: 'flex', 
								alignItems: 'center',
								textDecoration: 'none',
								'&:hover': { textDecoration: 'underline' }
							}}
						>
							Community
						</Link>
						<Link 
							color="inherit" 
							href={`/community?articleCategory=${article.articleCategory}`}
							sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
						>
							{article.articleCategory}
						</Link>
						<Typography color="text.primary">Post Detail</Typography>
					</Breadcrumbs>
				</motion.div>

				<Grid container spacing={4}>
					{/* Main Content */}
					<Grid item xs={12} md={8}>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							{/* Article Card */}
							<Card 
								sx={{ 
									borderRadius: '24px', 
									overflow: 'hidden',
									mb: 4,
									background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
									border: '1px solid rgba(0,0,0,0.08)',
									boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
								}}
							>
								{/* Article Image */}
								{article.articleImage && (
									<Box component="div" 
										sx={{
											height: '400px',
											backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${article.articleImage})`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
											position: 'relative'
										}}
									>
										<Box component="div" 
											sx={{
												position: 'absolute',
												bottom: 24,
												left: 24,
												right: 24
											}}
										>
											<Chip 
												label={article.articleCategory}
												sx={{ 
													bgcolor: 'rgba(255,255,255,0.9)',
													color: '#333',
													fontWeight: 600,
													mb: 2
												}}
											/>
											<Typography 
												variant="h3" 
												color="white" 
												fontWeight={700}
												sx={{ 
													textShadow: '0 2px 8px rgba(0,0,0,0.3)',
													lineHeight: 1.2
												}}
											>
												{article.articleTitle}
											</Typography>
										</Box>
									</Box>
								)}

								<CardContent sx={{ p: 4 }}>
									{/* Author Info */}
									<Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
										<Stack direction="row" alignItems="center" spacing={2}>
											<Avatar 
												src={article.memberData?.memberImage 
													? `${REACT_APP_API_URL}/${article.memberData.memberImage}` 
													: '/img/profile/defaultUser.svg'
												}
												sx={{ width: 56, height: 56 }}
											/>
											<Stack>
												<Stack direction="row" alignItems="center" spacing={1}>
													<Typography variant="h6" fontWeight={600}>
														{article.memberData?.memberNick}
													</Typography>
													{article.memberData?.memberCars && article.memberData.memberCars > 2 && (
														<VerifiedIcon color="primary" />
													)}
													<Chip 
														icon={<StarIcon />}
														label={article.memberData?.memberRank}
														size="small"
														color="warning"
														variant="outlined"
													/>
										</Stack>
												<Typography variant="body2" color="text.secondary">
													<Moment format="MMMM DD, YYYY">{article.createdAt}</Moment> • 
													{article.memberData?.memberCars} cars owned • 
													{article.memberData?.memberFollowers} followers
												</Typography>
									</Stack>
								</Stack>
										<IconButton 
											onClick={(e) => setMenuAnchor(e.currentTarget)}
											sx={{
												bgcolor: 'rgba(0,0,0,0.05)',
												'&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
											}}
										>
											<MoreIcon />
										</IconButton>
									</Stack>

									{/* Article Content */}
									<Box component="div"  
										sx={{ 
											mb: 4,
											'& h2, & h3': {
												color: '#2c3e50',
												fontWeight: 700,
												mb: 2,
												mt: 3
											},
											'& h2': { fontSize: '1.5rem' },
											'& h3': { fontSize: '1.25rem' },
											'& p': {
												lineHeight: 1.7,
												mb: 2,
												color: '#4a5568'
											}
										}}
										dangerouslySetInnerHTML={{ __html: article.articleContent }}
									/>

									{/* Article Actions */}
									<Stack direction="row" alignItems="center" justifyContent="between" spacing={3}>
										<Stack direction="row" alignItems="center" spacing={2}>
											<Button
												startIcon={<LikeIcon />}
												variant={article.meLiked?.length ? "contained" : "outlined"}
												color="primary"
												sx={{ borderRadius: '24px' }}
											>
												{article.articleLikes}
											</Button>
											<Button
												startIcon={<CommentIcon />}
												variant="outlined"
												sx={{ borderRadius: '24px' }}
											>
												{article.articleComments}
											</Button>
											<Stack direction="row" alignItems="center" spacing={0.5}>
												<TimeIcon fontSize="small" color="action" />
												<Typography variant="body2" color="text.secondary">
													{article.articleViews} views
															</Typography>
														</Stack>
													</Stack>
										<Stack direction="row" alignItems="center" spacing={1}>
															<IconButton
												onClick={() => setIsBookmarked(!isBookmarked)}
												color={isBookmarked ? "primary" : "default"}
											>
												{isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
															</IconButton>
											<IconButton>
												<ShareIcon />
															</IconButton>
										</Stack>
									</Stack>
								</CardContent>
							</Card>

							{/* Comments Section */}
							<Card 
																sx={{
									borderRadius: '20px',
									background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
									border: '1px solid rgba(0,0,0,0.08)',
									boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
								}}
							>
								<CardContent sx={{ p: 4 }}>
									<Typography variant="h5" fontWeight={700} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<CommentIcon color="primary" />
										Comments ({comments.length})
																	</Typography>

									{/* Add Comment */}
									{user?._id && (
										<Stack direction="row" spacing={2} mb={4}>
											<Avatar 
												src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'}
												sx={{ width: 48, height: 48 }}
											/>
											<Stack flex={1}>
												<TextField
													fullWidth
													placeholder="Share your thoughts about this post..."
													value={newComment}
													onChange={(e) => setNewComment(e.target.value)}
													multiline
													rows={3}
													variant="outlined"
													sx={{
														'& .MuiOutlinedInput-root': {
															borderRadius: '16px',
														}
													}}
												/>
												<Stack direction="row" spacing={1} mt={2} justifyContent="flex-end">
																				<Button
														size="large"
														onClick={() => setNewComment('')}
																				>
																					Cancel
																				</Button>
																				<Button
														size="large"
																					variant="contained"
														endIcon={<SendIcon />}
														disabled={!newComment.trim()}
														sx={{ 
															borderRadius: '24px',
															px: 3
														}}
													>
														Post Comment
																				</Button>
																			</Stack>
																		</Stack>
																	</Stack>
									)}

									{/* Comments List */}
									<AnimatePresence>
										{comments.slice(0, showAllComments ? comments.length : 3).map((comment) => (
											<CommentCard key={comment._id} comment={comment} />
										))}
									</AnimatePresence>

									{/* Show More Comments */}
									{comments.length > 3 && (
										<Box component="div"  textAlign="center" mt={2}>
											<Button
												onClick={() => setShowAllComments(!showAllComments)}
												startIcon={showAllComments ? <CollapseIcon /> : <ExpandIcon />}
												sx={{ 
													borderRadius: '24px',
													textTransform: 'none'
												}}
											>
												{showAllComments 
													? 'Show Less Comments' 
													: `Show ${comments.length - 3} More Comments`
												}
											</Button>
										</Box>
									)}
								</CardContent>
							</Card>
						</motion.div>
					</Grid>

					{/* Sidebar */}
					<Grid item xs={12} md={4}>
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<Stack spacing={3}>
								{/* Author Profile */}
								<Card sx={{ borderRadius: '16px' }}>
									<CardContent>
										<Typography variant="h6" fontWeight={700} mb={2}>
											About the Author
										</Typography>
										<Stack alignItems="center" textAlign="center" spacing={2}>
											<Avatar 
												src={article.memberData?.memberImage 
													? `${REACT_APP_API_URL}/${article.memberData.memberImage}` 
													: '/img/profile/defaultUser.svg'
												}
												sx={{ width: 80, height: 80 }}
											/>
											<Stack>
												<Typography variant="h6" fontWeight={600}>
													{article.memberData?.memberNick}
												</Typography>
												<Typography variant="body2" color="text.secondary" mb={1}>
													Car Enthusiast & Reviewer
												</Typography>
												<Stack direction="row" spacing={2} justifyContent="center">
													<Stack alignItems="center">
														<Typography variant="h6" fontWeight={700}>
															{article.memberData?.memberCars}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															Cars Owned
														</Typography>
																</Stack>
													<Stack alignItems="center">
														<Typography variant="h6" fontWeight={700}>
															{article.memberData?.memberFollowers}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															Followers
														</Typography>
														</Stack>
													<Stack alignItems="center">
														<Typography variant="h6" fontWeight={700}>
															{article.memberData?.memberRank}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															Rating
														</Typography>
												</Stack>
												</Stack>
											</Stack>
											<Button 
												variant="contained" 
												fullWidth
												sx={{ borderRadius: '24px' }}
											>
												Follow
											</Button>
										</Stack>
									</CardContent>
								</Card>

								{/* Related Posts */}
								<Card sx={{ borderRadius: '16px' }}>
									<CardContent>
										<Typography variant="h6" fontWeight={700} mb={2}>
											Related Posts
										</Typography>
										<Stack spacing={2}>
											{[
												{ title: 'BMW M3 vs Mercedes C63 AMG', author: 'SpeedDemon', views: 892 },
												{ title: 'Best Electric Cars Under $50k', author: 'EVExpert', views: 1340 },
												{ title: 'Porsche 911 Turbo S Review', author: 'LuxuryCars', views: 756 }
											].map((post, index) => (
												<Paper 
													key={index}
													sx={{ 
														p: 2, 
														borderRadius: '12px',
														cursor: 'pointer',
														'&:hover': { bgcolor: 'primary.light', color: 'white' }
													}}
												>
													<Typography variant="body2" fontWeight={600} mb={0.5}>
														{post.title}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														by {post.author} • {post.views} views
													</Typography>
												</Paper>
											))}
										</Stack>
									</CardContent>
								</Card>

								{/* Community Guidelines */}
								<Card sx={{ borderRadius: '16px', bgcolor: 'info.light' }}>
									<CardContent>
										<Typography variant="h6" fontWeight={700} mb={2} color="white">
											Community Guidelines
										</Typography>
										<Stack spacing={1}>
											<Typography variant="body2" color="white">
												• Be respectful and constructive
											</Typography>
											<Typography variant="body2" color="white">
												• Share honest experiences
											</Typography>
											<Typography variant="body2" color="white">
												• No spam or self-promotion
											</Typography>
											<Typography variant="body2" color="white">
												• Keep discussions car-related
											</Typography>
										</Stack>
									</CardContent>
								</Card>
									</Stack>
						</motion.div>
					</Grid>
				</Grid>

				{/* Back to Community Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.3 }}
				>
					<Box component="div"  textAlign="center" mt={4}>
						<Button
							startIcon={<BackIcon />}
							variant="outlined"
							size="large"
							onClick={() => router.push('/community')}
							sx={{ 
								borderRadius: '24px',
								px: 4
							}}
						>
							Back to Community
						</Button>
					</Box>
				</motion.div>
			</Container>

			{/* Menu */}
			<Menu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={() => setMenuAnchor(null)}
			>
				<MenuItem onClick={() => setMenuAnchor(null)}>
					<BookmarkIcon sx={{ mr: 1 }} />
					Bookmark
				</MenuItem>
				<MenuItem onClick={() => setMenuAnchor(null)}>
					<ShareIcon sx={{ mr: 1 }} />
					Share
				</MenuItem>
				<MenuItem onClick={() => setMenuAnchor(null)}>
					<FlagIcon sx={{ mr: 1 }} />
					Report
				</MenuItem>
				{user?._id === article.memberData?._id && (
					[
						<Divider key="divider" />,
						<MenuItem key="edit" onClick={() => setMenuAnchor(null)}>
							<EditIcon sx={{ mr: 1 }} />
							Edit Post
						</MenuItem>,
						<MenuItem key="delete" onClick={() => setMenuAnchor(null)}>
							<DeleteIcon sx={{ mr: 1 }} />
							Delete Post
						</MenuItem>
					]
				)}
			</Menu>
		</Box>
	);
};

CommunityDetail.defaultProps = {
	initialInput: {}
};

export default withLayoutBasic(CommunityDetail);