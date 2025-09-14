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
	InputAdornment, 
	IconButton, 
	Fab, 
	Menu, 
	MenuItem, 
	Divider,
	Skeleton,
	Tab,
	Tabs,
	Paper,
	Badge,
	Tooltip
} from '@mui/material';
import {
	Search as SearchIcon,
	Add as AddIcon,
	TrendingUp as TrendingIcon,
	LocalFireDepartment as HotIcon,
	AccessTime as RecentIcon,
	ThumbUp as LikeIcon,
	Comment as CommentIcon,
	Visibility as ViewIcon,
	BookmarkBorder as BookmarkIcon,
	Share as ShareIcon,
	MoreVert as MoreIcon,
	FilterList as FilterIcon,
	Notifications as NotificationIcon,
	Star as StarIcon,
	EmojiEvents as AwardIcon,
	Group as GroupIcon,
	Forum as ForumIcon,
	Help as HelpIcon,
	RateReview as ReviewIcon,
	DirectionsCar as CarIcon,
	Build as TechIcon,
	PhotoCamera as PhotoIcon,
	VideoLibrary as VideoIcon,
	Poll as PollIcon,
	Event as EventIcon,
	LocationOn as LocationIcon,
	Verified as VerifiedIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import Moment from 'react-moment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Community Categories with icons and descriptions
const communityCategories = [
	{ 
		value: 'ALL', 
		label: 'All Categories', 
		icon: <ForumIcon />, 
		color: '#666666',
		description: 'View all posts from the community',
		count: 1000
	},
	{ 
		value: 'REVIEWS', 
		label: 'Reviews & Experiences', 
		icon: <ReviewIcon />, 
		color: '#4CAF50',
		description: 'Share your car experiences and read honest reviews',
		count: 245
	},
	{ 
		value: 'QA', 
		label: 'Q&A & Help', 
		icon: <HelpIcon />, 
		color: '#2196F3',
		description: 'Ask questions and get expert answers',
		count: 189
	},
	{ 
		value: 'SHOWCASE', 
		label: 'Car Showcase', 
		icon: <PhotoIcon />, 
		color: '#FF9800',
		description: 'Show off your ride and see amazing cars',
		count: 156
	},
	{ 
		value: 'TECH', 
		label: 'Tech & Modifications', 
		icon: <TechIcon />, 
		color: '#9C27B0',
		description: 'Technical discussions and mod guides',
		count: 98
	},
	{ 
		value: 'EVENTS', 
		label: 'Events & Meetups', 
		icon: <EventIcon />, 
		color: '#F44336',
		description: 'Car shows, meetups, and community events',
		count: 67
	},
	{ 
		value: 'VIDEOS', 
		label: 'Videos & Media', 
		icon: <VideoIcon />, 
		color: '#FF5722',
		description: 'Share videos, photos, and automotive media',
		count: 123
	}
];

// Trending topics
const trendingTopics = [
	'Electric Vehicles', 'Tesla Model 3', 'Car Maintenance', 'Racing', 'Luxury Cars',
	'SUVs 2024', 'Fuel Economy', 'Car Insurance', 'Used Cars', 'Auto Shows'
];

// Featured community members
const featuredMembers = [
	{ name: 'Alex Rodriguez', role: 'Car Expert', cars: 5, reputation: 4.9, avatar: '/img/profile/expert1.jpg' },
	{ name: 'Sarah Johnson', role: 'EV Specialist', cars: 2, reputation: 4.8, avatar: '/img/profile/expert2.jpg' },
	{ name: 'Mike Chen', role: 'Mechanic', cars: 8, reputation: 4.9, avatar: '/img/profile/expert3.jpg' }
];

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [selectedCategory, setSelectedCategory] = useState<string>(articleCategory || 'ALL');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortBy, setSortBy] = useState<string>('recent');
	const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('Community page - GraphQL response:', data);
			console.log('Articles list:', data?.getBoardArticles?.list);
			console.log('Total count:', data?.getBoardArticles?.metaCounter[0]?.total);
			setBoardArticles(data?.getBoardArticles?.list || []);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total || 0);
			setIsLoading(false);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		// Removed automatic redirect to allow showing all articles
		// Users can manually select categories if they want to filter
	}, []);

	useEffect(() => {
		setIsLoading(true);
		const newSearchCommunity = {
			...searchCommunity,
			page: 1,
		search: { 
			articleCategory: selectedCategory && selectedCategory !== 'ALL' ? selectedCategory as BoardArticleCategory : BoardArticleCategory.FREE,
			text: searchQuery || undefined
		}
		};
		console.log('Community page - Setting search variables:', newSearchCommunity);
		setSearchCommunity(newSearchCommunity);
	}, [selectedCategory, searchQuery]);

	/** HANDLERS **/
	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		router.push(
			{
				pathname: '/community',
				query: { articleCategory: category },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleSortChange = (sort: string) => {
		setSortBy(sort);
		setFilterMenuAnchor(null);
		// Apply sorting logic here
	};

	const likeArticleHandler = async (e: any, user: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: { input: id },
			});

			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error, likeArticleHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handlePostClick = (article: BoardArticle) => {
		router.push({
			pathname: '/community/detail',
			query: { 
				articleCategory: article.articleCategory, 
				id: article._id 
			},
		});
	};

	// Enhanced Post Card Component
	const PostCard = ({ article }: { article: BoardArticle }) => {
		const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
		
		const authorImage = article?.memberData?.memberImage
			? `${REACT_APP_API_URL}/${article.memberData.memberImage}`
			: '/img/profile/defaultUser.svg';

		const postImage = article?.articleImage
			? `${REACT_APP_API_URL}/${article.articleImage}`
			: null;

		const category = communityCategories.find(cat => cat.value === article.articleCategory);

		return (
			<motion.div
				layout
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				whileHover={{ y: -2 }}
				transition={{ duration: 0.3 }}
			>
				<Card 
					sx={{
						mb: 3, 
						borderRadius: '16px', 
						overflow: 'hidden',
						background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
						border: '1px solid rgba(0,0,0,0.08)',
						transition: 'all 0.3s ease',
						'&:hover': {
							boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
							borderColor: 'rgba(0,0,0,0.15)'
						}
					}}
				>
					{/* Post Header */}
					<CardContent sx={{ pb: 1 }}>
						<Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
							<Stack direction="row" alignItems="center" spacing={2}>
								<Avatar 
									src={authorImage} 
									sx={{ 
										width: 48, 
										height: 48,
										border: '3px solid',
										borderColor: category?.color || '#ccc'
									}} 
								/>
								<Stack>
									<Stack direction="row" alignItems="center" spacing={1}>
										<Typography variant="subtitle1" fontWeight={600}>
											{article.memberData?.memberNick}
										</Typography>
										{article.memberData?.memberCars && article.memberData.memberCars > 2 && (
											<VerifiedIcon color="primary" fontSize="small" />
										)}
									</Stack>
									<Stack direction="row" alignItems="center" spacing={1}>
										<Typography variant="caption" color="text.secondary">
											<Moment fromNow>{article.createdAt}</Moment>
								</Typography>
										<Typography variant="caption" color="text.secondary">•</Typography>
										<Chip 
											icon={category?.icon}
											label={category?.label}
											size="small"
											sx={{
												bgcolor: `${category?.color}15`,
												color: category?.color,
												fontSize: '11px',
												height: '20px'
											}}
										/>
									</Stack>
								</Stack>
							</Stack>
							<IconButton 
								size="small"
								onClick={(e) => {
									e.stopPropagation();
									setAnchorEl(e.currentTarget);
								}}
							>
								<MoreIcon />
							</IconButton>
						</Stack>

						{/* Post Title */}
						<Typography 
							variant="h6" 
							sx={{ 
								fontWeight: 700, 
								mb: 1, 
								cursor: 'pointer',
								'&:hover': { color: 'primary.main' }
							}}
							onClick={() => handlePostClick(article)}
						>
							{article.articleTitle}
						</Typography>

						{/* Post Content Preview */}
						<Typography 
							variant="body1" 
							color="text.secondary"
							sx={{
								display: '-webkit-box',
								WebkitLineClamp: 3,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
								mb: 2,
								lineHeight: 1.6
							}}
						>
							{article.articleContent.replace(/<[^>]*>/g, '').substring(0, 200)}...
						</Typography>

						{/* Post Image */}
						{postImage && (
							<Box component="div"
								sx={{
									width: '100%',
									height: '300px',
									borderRadius: '12px',
									backgroundImage: `url(${postImage})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									mb: 2,
									cursor: 'pointer'
								}}
								onClick={() => handlePostClick(article)}
							/>
						)}

						{/* Post Actions */}
						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Stack direction="row" alignItems="center" spacing={2}>
								<Stack direction="row" alignItems="center" spacing={0.5}>
									<IconButton 
										size="small" 
										onClick={(e) => likeArticleHandler(e, user, article._id)}
										color={article?.meLiked?.[0]?.myFavorite ? "error" : "default"}
									>
										<LikeIcon fontSize="small" />
									</IconButton>
									<Typography variant="body2">{article.articleLikes}</Typography>
								</Stack>

								<Stack direction="row" alignItems="center" spacing={0.5}>
									<IconButton size="small" onClick={() => handlePostClick(article)}>
										<CommentIcon fontSize="small" />
									</IconButton>
									<Typography variant="body2">{article.articleComments}</Typography>
								</Stack>

								<Stack direction="row" alignItems="center" spacing={0.5}>
									<ViewIcon fontSize="small" color="action" />
									<Typography variant="body2" color="text.secondary">
										{article.articleViews}
									</Typography>
								</Stack>
							</Stack>

							<Stack direction="row" alignItems="center" spacing={1}>
								<IconButton size="small">
									<BookmarkIcon fontSize="small" />
								</IconButton>
								<IconButton size="small">
									<ShareIcon fontSize="small" />
								</IconButton>
							</Stack>
						</Stack>
					</CardContent>

					{/* Options Menu */}
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={() => setAnchorEl(null)}
					>
						<MenuItem onClick={() => setAnchorEl(null)}>Report Post</MenuItem>
						<MenuItem onClick={() => setAnchorEl(null)}>Hide Post</MenuItem>
						<MenuItem onClick={() => setAnchorEl(null)}>Follow Author</MenuItem>
					</Menu>
				</Card>
			</motion.div>
		);
	};

	if (device === 'mobile') {
		return <Typography variant="h4">Mobile Community View Coming Soon</Typography>;
	}

	return (
		<Box component="div" sx={{ 
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			minHeight: '100vh'
		}}>
			{/* Hero Header */}
			<Box component="div" sx={{ 
				background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url("/img/community/hero-bg.jpg")',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				py: 8,
				color: 'white',
				textAlign: 'center'
			}}>
				<Container maxWidth="lg">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<Typography variant="h2" fontWeight={700} mb={2}>
							🚗 Car Enthusiasts Community
						</Typography>
						<Typography variant="h5" mb={4} sx={{ opacity: 0.9 }}>
							Connect, Share, and Discover with Fellow Car Lovers
						</Typography>
						<Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
							<Chip 
								icon={<GroupIcon />} 
								label="50k+ Members" 
								sx={{ 
									bgcolor: 'rgba(255,255,255,0.2)', 
									color: 'white',
									backdropFilter: 'blur(10px)'
								}} 
							/>
							<Chip 
								icon={<ForumIcon />} 
								label="1k+ Daily Posts" 
								sx={{ 
									bgcolor: 'rgba(255,255,255,0.2)', 
									color: 'white',
									backdropFilter: 'blur(10px)'
								}} 
							/>
							<Chip 
								icon={<AwardIcon />} 
								label="Expert Reviews" 
								sx={{ 
									bgcolor: 'rgba(255,255,255,0.2)', 
									color: 'white',
									backdropFilter: 'blur(10px)'
								}} 
							/>
						</Stack>
					</motion.div>
				</Container>
			</Box>

			{/* Main Content */}
			<Container maxWidth="xl" sx={{ py: 4, position: 'relative', top: '-50px' }}>
				<Grid container spacing={4}>
					{/* Left Sidebar */}
					<Grid item xs={12} md={3}>
						<Stack spacing={3}>
							{/* Categories */}
							<Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
								<CardContent>
									<Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<ForumIcon color="primary" />
									Categories
								</Typography>
								<Stack spacing={1}>
										{communityCategories.map((category) => (
											<Paper
											key={category.value}
												sx={{
													p: 2,
													cursor: 'pointer',
													borderRadius: '12px',
													border: selectedCategory === category.value ? `2px solid ${category.color}` : '1px solid #e0e0e0',
													bgcolor: selectedCategory === category.value ? `${category.color}10` : 'transparent',
													transition: 'all 0.3s ease',
													'&:hover': {
														bgcolor: `${category.color}08`,
														transform: 'translateX(4px)'
													}
												}}
												onClick={() => handleCategoryChange(category.value)}
											>
												<Stack direction="row" alignItems="center" justifyContent="space-between">
													<Stack direction="row" alignItems="center" spacing={1}>
														<Box component="div" sx={{ color: category.color }}>
															{category.icon}
														</Box>
														<Stack>
															<Typography variant="body2" fontWeight={600}>
																{category.label}
															</Typography>
															<Typography variant="caption" color="text.secondary">
																{category.description}
															</Typography>
														</Stack>
													</Stack>
													<Badge badgeContent={category.count} color="primary" />
												</Stack>
											</Paper>
										))}
									</Stack>
								</CardContent>
							</Card>

							{/* Trending Topics */}
							<Card sx={{ borderRadius: '16px' }}>
								<CardContent>
									<Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<TrendingIcon color="warning" />
										Trending
									</Typography>
									<Stack spacing={1}>
										{trendingTopics.slice(0, 5).map((topic, index) => (
											<Chip
												key={topic}
												label={`#${topic}`}
												variant="outlined"
												size="small"
												sx={{
													justifyContent: 'flex-start',
													'&:hover': { bgcolor: 'primary.light', color: 'white' }
												}}
												icon={<TrendingIcon />}
											/>
										))}
									</Stack>
								</CardContent>
							</Card>

							{/* Featured Members */}
							<Card sx={{ borderRadius: '16px' }}>
								<CardContent>
									<Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<StarIcon color="warning" />
										Top Contributors
									</Typography>
									<Stack spacing={2}>
										{featuredMembers.map((member, index) => (
											<Stack key={member.name} direction="row" alignItems="center" spacing={2}>
												<Avatar src={member.avatar} sx={{ width: 40, height: 40 }} />
												<Stack flex={1}>
													<Typography variant="body2" fontWeight={600}>
														{member.name}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{member.role} • {member.cars} cars
													</Typography>
												</Stack>
												<Chip 
													icon={<StarIcon />}
													label={member.reputation}
													size="small"
													color="warning"
													variant="outlined"
												/>
											</Stack>
										))}
									</Stack>
								</CardContent>
							</Card>
						</Stack>
					</Grid>

					{/* Main Feed */}
					<Grid item xs={12} md={6}>
						<Stack spacing={3}>
							{/* Search and Filters */}
							<Card sx={{ borderRadius: '16px' }}>
								<CardContent>
									<Stack direction="row" spacing={2} alignItems="center">
										<TextField
											fullWidth
											placeholder="Search discussions, reviews, questions..."
											value={searchQuery}
											onChange={(e) => handleSearch(e.target.value)}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<SearchIcon />
													</InputAdornment>
												),
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
												borderRadius: '12px',
												}
											}}
										/>
										<IconButton 
											onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
											sx={{
												bgcolor: 'primary.main',
												color: 'white',
												'&:hover': { bgcolor: 'primary.dark' }
											}}
										>
											<FilterIcon />
										</IconButton>
									</Stack>

									{/* Sort Tabs */}
									<Tabs 
										value={sortBy} 
										onChange={(e, value) => setSortBy(value)}
										sx={{ mt: 2 }}
									>
										<Tab 
											icon={<HotIcon />} 
											label="Hot" 
											value="hot" 
											iconPosition="start"
										/>
										<Tab 
											icon={<RecentIcon />} 
											label="Recent" 
											value="recent" 
											iconPosition="start"
										/>
										<Tab 
											icon={<TrendingIcon />} 
											label="Trending" 
											value="trending" 
											iconPosition="start"
										/>
										<Tab 
											icon={<LikeIcon />} 
											label="Most Liked" 
											value="liked" 
											iconPosition="start"
										/>
									</Tabs>
								</CardContent>
							</Card>

							{/* Create Post Button */}
							{user?._id && (
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Card 
										sx={{ 
											borderRadius: '16px',
											cursor: 'pointer',
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											color: 'white'
										}}
										onClick={() => router.push('/community/create')}
									>
										<CardContent>
											<Stack direction="row" alignItems="center" spacing={2}>
												<Avatar src={user.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'} />
												<Stack flex={1}>
													<Typography variant="body1">
														Share your car experience with the community...
													</Typography>
												</Stack>
												<Button
													variant="contained"
													startIcon={<AddIcon />}
													sx={{
														bgcolor: 'rgba(255,255,255,0.2)',
														backdropFilter: 'blur(10px)',
														'&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
													}}
												>
													Post
										</Button>
											</Stack>
										</CardContent>
									</Card>
								</motion.div>
							)}

							{/* Posts Feed */}
							<AnimatePresence mode="wait">
								{isLoading || boardArticlesLoading ? (
									<Stack spacing={2}>
										{[...Array(5)].map((_, index) => (
											<Card key={index} sx={{ borderRadius: '16px' }}>
												<CardContent>
													<Stack spacing={2}>
														<Stack direction="row" spacing={2}>
															<Skeleton variant="circular" width={48} height={48} />
															<Stack flex={1}>
																<Skeleton variant="text" width="60%" />
																<Skeleton variant="text" width="40%" />
															</Stack>
														</Stack>
														<Skeleton variant="text" width="90%" />
														<Skeleton variant="text" width="70%" />
														<Skeleton variant="rectangular" height={200} sx={{ borderRadius: '12px' }} />
													</Stack>
												</CardContent>
											</Card>
									))}
								</Stack>
								) : (
									<Stack spacing={0}>
										{boardArticles.map((article) => (
											<PostCard key={article._id} article={article} />
										))}
							</Stack>
								)}
							</AnimatePresence>

							{/* Load More */}
							{boardArticles.length < totalCount && (
								<Box component="div" textAlign="center">
									<Button 
										variant="outlined" 
										size="large"
										onClick={() => {
											setSearchCommunity(prev => ({ ...prev, page: prev.page + 1 }));
										}}
									>
										Load More Posts
									</Button>
						</Box>
							)}
						</Stack>
					</Grid>

					{/* Right Sidebar */}
					<Grid item xs={12} md={3}>
						<Stack spacing={3}>
							{/* Community Stats */}
							<Card sx={{ borderRadius: '16px' }}>
								<CardContent>
									<Typography variant="h6" fontWeight={700} mb={2}>
										Community Stats
									</Typography>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<Box component="div" textAlign="center" p={2} bgcolor="primary.light" borderRadius="12px">
												<Typography variant="h4" fontWeight={700} color="white">
													{totalCount}
												</Typography>
												<Typography variant="caption" color="white">
													Total Posts
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={6}>
											<Box component="div" textAlign="center" p={2} bgcolor="success.light" borderRadius="12px">
												<Typography variant="h4" fontWeight={700} color="white">
													50k+
												</Typography>
												<Typography variant="caption" color="white">
													Members
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={6}>
											<Box component="div" textAlign="center" p={2} bgcolor="warning.light" borderRadius="12px">
												<Typography variant="h4" fontWeight={700} color="white">
													24h
												</Typography>
												<Typography variant="caption" color="white">
													Avg Response
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={6}>
											<Box component="div" textAlign="center" p={2} bgcolor="error.light" borderRadius="12px">
												<Typography variant="h4" fontWeight={700} color="white">
													4.8★
												</Typography>
												<Typography variant="caption" color="white">
													Satisfaction
												</Typography>
						</Box>
										</Grid>
									</Grid>
								</CardContent>
							</Card>

							{/* Quick Actions */}
							<Card sx={{ borderRadius: '16px' }}>
								<CardContent>
									<Typography variant="h6" fontWeight={700} mb={2}>
										Quick Actions
									</Typography>
									<Stack spacing={1}>
										<Button
											fullWidth
											variant="outlined"
											startIcon={<AddIcon />}
											sx={{ justifyContent: 'flex-start', borderRadius: '12px' }}
										>
											Create Post
										</Button>
										<Button
											fullWidth
											variant="outlined"
											startIcon={<HelpIcon />}
											sx={{ justifyContent: 'flex-start', borderRadius: '12px' }}
										>
											Ask Question
										</Button>
										<Button
											fullWidth
											variant="outlined"
											startIcon={<PhotoIcon />}
											sx={{ justifyContent: 'flex-start', borderRadius: '12px' }}
										>
											Share Photos
										</Button>
										<Button
											fullWidth
											variant="outlined"
											startIcon={<EventIcon />}
											sx={{ justifyContent: 'flex-start', borderRadius: '12px' }}
										>
											Create Event
										</Button>
					</Stack>
								</CardContent>
							</Card>

							{/* Recent Activity */}
							<Card sx={{ borderRadius: '16px' }}>
								<CardContent>
									<Typography variant="h6" fontWeight={700} mb={2}>
										Recent Activity
									</Typography>
									<Stack spacing={2}>
										{[
											{ action: 'liked your post', user: 'Sarah Johnson', time: '2m ago' },
											{ action: 'commented on', user: 'Mike Chen', time: '5m ago' },
											{ action: 'started following you', user: 'Alex Rodriguez', time: '1h ago' },
											{ action: 'shared your review', user: 'Emma Davis', time: '2h ago' }
										].map((activity, index) => (
											<Stack key={index} direction="row" spacing={2} alignItems="center">
												<Avatar sx={{ width: 32, height: 32 }} />
												<Stack flex={1}>
													<Typography variant="body2">
														<strong>{activity.user}</strong> {activity.action}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{activity.time}
													</Typography>
												</Stack>
											</Stack>
										))}
									</Stack>
								</CardContent>
							</Card>
						</Stack>
					</Grid>
				</Grid>
			</Container>

			{/* Floating Action Button */}
			{user?._id && (
				<Fab
					color="primary"
					sx={{
						position: 'fixed',
						bottom: 24,
						right: 24,
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						'&:hover': {
							transform: 'scale(1.1)',
							boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
						}
					}}
					onClick={() => router.push('/community/create')}
				>
					<AddIcon />
				</Fab>
			)}

			{/* Filter Menu */}
			<Menu
				anchorEl={filterMenuAnchor}
				open={Boolean(filterMenuAnchor)}
				onClose={() => setFilterMenuAnchor(null)}
			>
				<MenuItem onClick={() => handleSortChange('hot')}>
					<HotIcon sx={{ mr: 1 }} /> Hot Posts
				</MenuItem>
				<MenuItem onClick={() => handleSortChange('recent')}>
					<RecentIcon sx={{ mr: 1 }} /> Most Recent
				</MenuItem>
				<MenuItem onClick={() => handleSortChange('trending')}>
					<TrendingIcon sx={{ mr: 1 }} /> Trending
				</MenuItem>
				<MenuItem onClick={() => handleSortChange('liked')}>
					<LikeIcon sx={{ mr: 1 }} /> Most Liked
				</MenuItem>
				<Divider />
				<MenuItem onClick={() => handleSortChange('unanswered')}>
					<HelpIcon sx={{ mr: 1 }} /> Unanswered
				</MenuItem>
			</Menu>
			</Box>
		);
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 15,
		search: {
			// Removed articleCategory filter to show all articles
		},
	},
};

export default withLayoutBasic(Community);