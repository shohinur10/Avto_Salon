import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stack, Box, CircularProgress, Typography, Fab } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import { Comment } from '../../types/comment/comment';
import TeslaSocialPost from './TeslaSocialPost';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface InfiniteScrollFeedProps {
	posts: BoardArticle[];
	loading: boolean;
	hasMore: boolean;
	onLoadMore: () => void;
	likeArticleHandler: any;
	dislikeArticleHandler?: any;
	category: string;
	onLoadComments?: (postId: string) => Promise<Comment[]>;
}

const InfiniteScrollFeed = (props: InfiniteScrollFeedProps) => {
	const {
		posts,
		loading,
		hasMore,
		onLoadMore,
		likeArticleHandler,
		dislikeArticleHandler,
		category,
		onLoadComments
	} = props;

	const [showScrollTop, setShowScrollTop] = useState(false);
	const [commentsData, setCommentsData] = useState<{ [key: string]: Comment[] }>({});
	const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});
	const observerRef = useRef<IntersectionObserver>();
	const lastPostElementRef = useRef<HTMLDivElement>();

	// Intersection Observer for infinite scroll
	const lastPostRef = useCallback((node: HTMLDivElement) => {
		if (loading) return;
		if (observerRef.current) observerRef.current.disconnect();
		
		observerRef.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore) {
				onLoadMore();
			}
		}, {
			threshold: 0.1,
			rootMargin: '100px'
		});
		
		if (node) observerRef.current.observe(node);
		lastPostElementRef.current = node;
	}, [loading, hasMore, onLoadMore]);

	// Scroll to top handler
	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 400);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	// Load comments for a specific post
	const handleLoadComments = async (postId: string) => {
		if (!onLoadComments || loadingComments[postId]) return;
		
		setLoadingComments(prev => ({ ...prev, [postId]: true }));
		
		try {
			const comments = await onLoadComments(postId);
			setCommentsData(prev => ({ ...prev, [postId]: comments }));
		} catch (error) {
			console.error('Error loading comments:', error);
		} finally {
			setLoadingComments(prev => ({ ...prev, [postId]: false }));
		}
	};

	// Category-specific empty state messages
	const getEmptyMessage = () => {
		const messages = {
			REVIEWS: {
				title: 'No reviews yet',
				subtitle: 'Be the first to share your car experience!'
			},
			QNA: {
				title: 'No questions asked',
				subtitle: 'Ask the community for help with your car needs'
			},
			EVENTS: {
				title: 'No events planned',
				subtitle: 'Organize a car meetup in your area'
			},
			CAR_NEWS: {
				title: 'No news updates',
				subtitle: 'Share the latest automotive industry news'
			},
			SHOWCASE: {
				title: 'No showcases yet',
				subtitle: 'Show off your amazing ride with photos and videos'
			},
			FREE: {
				title: 'No posts yet',
				subtitle: 'Start a conversation with the community'
			},
			RECOMMEND: {
				title: 'No recommendations',
				subtitle: 'Recommend great cars, dealers, or services'
			},
			HUMOR: {
				title: 'No funny posts',
				subtitle: 'Share some automotive humor to brighten the day'
			}
		};

		return messages[category as keyof typeof messages] || messages.FREE;
	};

	const emptyMessage = getEmptyMessage();

	// Loading skeleton
	const LoadingSkeleton = () => (
		<Stack spacing={3}>
			{[1, 2, 3].map((item) => (
				<Box
													
					key={item}
					sx={{
						backgroundColor: 'white',
						borderRadius: '16px',
						padding: 3,
						boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
						border: '1px solid rgba(0,0,0,0.05)'
					}}
				>
					<Stack direction="row" spacing={2} mb={2}>
						<Box
													
							sx={{
								width: 48,
								height: 48,
								borderRadius: '50%',
								backgroundColor: '#f0f0f0',
								animation: 'pulse 1.5s infinite'
							}}
						/>
						<Stack spacing={1} flex={1}>
							<Box
													
								sx={{
									height: 20,
									backgroundColor: '#f0f0f0',
									borderRadius: '4px',
									width: '30%',
									animation: 'pulse 1.5s infinite'
								}}
							/>
							<Box
													
								sx={{
									height: 16,
									backgroundColor: '#f0f0f0',
									borderRadius: '4px',
									width: '20%',
									animation: 'pulse 1.5s infinite'
								}}
							/>
						</Stack>
					</Stack>
					<Stack spacing={2}>
						<Box
													
							sx={{
								height: 24,
								backgroundColor: '#f0f0f0',
								borderRadius: '4px',
								width: '80%',
								animation: 'pulse 1.5s infinite'
							}}
						/>
						<Box
													
							sx={{
								height: 60,
								backgroundColor: '#f0f0f0',
								borderRadius: '8px',
								animation: 'pulse 1.5s infinite'
							}}
						/>
						<Box
													
							sx={{
								height: 200,
								backgroundColor: '#f0f0f0',
								borderRadius: '8px',
								animation: 'pulse 1.5s infinite'
							}}
						/>
					</Stack>
				</Box>
			))}
		</Stack>
	);

	return (
		<Box component="div"  sx={{ position: 'relative', minHeight: '100vh' }}>
			{/* Posts Feed */}
			<Stack spacing={0}>
				{posts.length === 0 && !loading ? (
					// Empty State
					<Box
													
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							py: 8,
							textAlign: 'center'
						}}
					>
						<Box
													
							sx={{
								width: 120,
								height: 120,
								borderRadius: '50%',
								backgroundColor: '#f8f9fa',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								mb: 3,
								fontSize: '48px'
							}}
						>
							🚗
						</Box>
						<Typography variant="h5" fontWeight={600} color="#1a1a1a" mb={1}>
							{emptyMessage.title}
						</Typography>
						<Typography variant="body1" color="text.secondary" maxWidth={400}>
							{emptyMessage.subtitle}
						</Typography>
					</Box>
				) : (
					// Posts List
					posts.map((post, index) => (
						<div
							key={post._id}
							ref={index === posts.length - 1 ? lastPostRef : undefined}
						>
							<TeslaSocialPost
								boardArticle={post}
								likeArticleHandler={likeArticleHandler}
								dislikeArticleHandler={dislikeArticleHandler}
								comments={commentsData[post._id] || []}
								onLoadMoreComments={() => handleLoadComments(post._id)}
								hasMoreComments={false} // This would come from your API
								loadingComments={loadingComments[post._id] || false}
							/>
						</div>
					))
				)}

				{/* Loading Indicator */}
				{loading && (
					posts.length > 0 ? (
						<Box component="div"  sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
							<Stack alignItems="center" spacing={2}>
								<CircularProgress size={32} />
								<Typography variant="body2" color="text.secondary">
									Loading more posts...
								</Typography>
							</Stack>
						</Box>
					) : (
						<LoadingSkeleton />
					)
				)}

				{/* End of Content */}
				{!hasMore && posts.length > 0 && (
					<Box component="div"  sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
						<Typography variant="body2" color="text.secondary">
							You've reached the end! 🎉
						</Typography>
					</Box>
				)}
			</Stack>

			{/* Scroll to Top Button */}
			{showScrollTop && (
				<Fab
					onClick={scrollToTop}
					sx={{
						position: 'fixed',
						bottom: 24,
						right: 24,
						background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
						color: 'white',
						'&:hover': {
							background: 'linear-gradient(45deg, #1565c0, #1976d2)',
						},
						zIndex: 1000
					}}
				>
					<KeyboardArrowUpIcon />
				</Fab>
			)}

			{/* Custom styles for pulse animation */}
			<style jsx>{`
				@keyframes pulse {
					0% {
						opacity: 1;
					}
					50% {
						opacity: 0.5;
					}
					100% {
						opacity: 1;
					}
				}
			`}</style>
		</Box>
	);
};

export default InfiniteScrollFeed;
