import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination, Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CommunityCard from '../../libs/components/common/CommunityCard';
import ReviewCard from '../../libs/components/community/ReviewCard';
import QACard from '../../libs/components/community/QACard';
import EventCard from '../../libs/components/community/EventCard';
import ShowcaseCard from '../../libs/components/community/ShowcaseCard';
import TeslaSocialPost from '../../libs/components/community/TeslaSocialPost';
import InfiniteScrollFeed from '../../libs/components/community/InfiniteScrollFeed';
import CreatePostModal from '../../libs/components/community/CreatePostModal';
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
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [createPostOpen, setCreatePostOpen] = useState<boolean>(false);
	const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
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
			const newArticles = data?.getBoardArticles?.list || [];
			const total = data?.getBoardArticles?.metaCounter[0]?.total || 0;
			
			if (searchCommunity.page === 1) {
				setBoardArticles(newArticles);
			} else {
				setBoardArticles(prev => [...prev, ...newArticles]);
			}
			
			setTotalCount(total);
			setHasMorePosts(boardArticles.length + newArticles.length < total);
			setLoadingMore(false);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'REVIEWS' },
				},
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		console.log(value);

		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
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
			console.log('Error, likeCarHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const loadMorePosts = () => {
		if (!hasMorePosts || loadingMore) return;
		
		setLoadingMore(true);
		setSearchCommunity(prev => ({
			...prev,
			page: prev.page + 1
		}));
	};

	const handleCreatePost = async (postData: any) => {
		try {
			// Here you would typically call your create post mutation
			console.log('Creating post:', postData);
			
			// Refresh the posts after creation
			setSearchCommunity(prev => ({ ...prev, page: 1 }));
			await boardArticlesRefetch({ input: { ...searchCommunity, page: 1 } });
			
			await sweetTopSmallSuccessAlert('Post created successfully!', 1000);
		} catch (err: any) {
			console.log('Error creating post:', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	} else {
		return (
			<Box
				sx={{
					backgroundColor: '#f8f9fa',
					minHeight: '100vh',
					position: 'relative'
				}}
			>
				{/* Header */}
				<Box
					sx={{
						backgroundColor: 'white',
						borderBottom: '1px solid #e0e0e0',
						position: 'sticky',
						top: 0,
						zIndex: 100
					}}
				>
					<div className="container">
						<Stack direction="row" alignItems="center" justifyContent="space-between" py={2}>
							<Stack direction="row" alignItems="center" spacing={3}>
								<img src={'/img/logo/logo.png'} alt="Logo" style={{ height: '50px' }} />
								<Typography variant="h4" fontWeight={700} color="#1a1a1a">
									Auto Salon Community
								</Typography>
							</Stack>
							<Button
								variant="contained"
								startIcon={<AddIcon />}
								onClick={() => setCreatePostOpen(true)}
								sx={{
									borderRadius: '25px',
									textTransform: 'none',
									fontWeight: 600,
									px: 3,
									background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
									'&:hover': {
										background: 'linear-gradient(45deg, #1565c0, #1976d2)',
									}
								}}
							>
								Create Post
							</Button>
						</Stack>
					</div>
				</Box>

				{/* Content */}
				<div className="container">
					<Stack direction="row" spacing={3} py={3}>
						{/* Sidebar */}
						<Box
							sx={{
								width: '280px',
								position: 'sticky',
								top: '100px',
								height: 'fit-content'
							}}
						>
							<Stack
								sx={{
									backgroundColor: 'white',
									borderRadius: '16px',
									p: 2,
									boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
									border: '1px solid rgba(0,0,0,0.05)'
								}}
							>
								<Typography variant="h6" fontWeight={600} mb={2}>
									Categories
								</Typography>
								<Stack spacing={1}>
									{[
										{ value: 'REVIEWS', label: '🚗 Reviews & Experiences', color: '#FF6B6B' },
										{ value: 'QNA', label: '❓ Q&A Forum', color: '#4ECDC4' },
										{ value: 'EVENTS', label: '📅 Events & Meetups', color: '#45B7D1' },
										{ value: 'CAR_NEWS', label: '📰 Car News', color: '#FFA726' },
										{ value: 'SHOWCASE', label: '📸 Photo/Video Showcase', color: '#AB47BC' },
										{ value: 'FREE', label: '💬 Free Board', color: '#66BB6A' },
										{ value: 'RECOMMEND', label: '⭐ Recommendations', color: '#FF7043' },
										{ value: 'HUMOR', label: '😄 Humor', color: '#FFCA28' }
									].map(category => (
										<Button
											key={category.value}
											onClick={(e) => tabChangeHandler(e, category.value)}
											sx={{
												justifyContent: 'flex-start',
												textTransform: 'none',
												fontWeight: 600,
												borderRadius: '12px',
												p: 2,
												color: searchCommunity.search.articleCategory === category.value ? 'white' : '#666',
												backgroundColor: searchCommunity.search.articleCategory === category.value 
													? category.color 
													: 'transparent',
												'&:hover': {
													backgroundColor: searchCommunity.search.articleCategory === category.value 
														? category.color 
														: `${category.color}15`,
													color: searchCommunity.search.articleCategory === category.value 
														? 'white' 
														: category.color
												}
											}}
										>
											{category.label}
										</Button>
									))}
								</Stack>
							</Stack>
						</Box>

						{/* Main Feed */}
						<Box flex={1} maxWidth="600px">
							<InfiniteScrollFeed
								posts={boardArticles}
								loading={boardArticlesLoading || loadingMore}
								hasMore={hasMorePosts}
								onLoadMore={loadMorePosts}
								likeArticleHandler={likeArticleHandler}
								category={searchCommunity.search.articleCategory}
							/>
						</Box>
					</Stack>
				</div>

				{/* Create Post Modal */}
				<CreatePostModal
					open={createPostOpen}
					onClose={() => setCreatePostOpen(false)}
					onSubmit={handleCreatePost}
					defaultCategory={searchCommunity.search.articleCategory as any}
				/>

				{/* Floating Action Button for Mobile */}
				<Fab
					onClick={() => setCreatePostOpen(true)}
					sx={{
						position: 'fixed',
						bottom: 24,
						right: 24,
						background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
						color: 'white',
						'&:hover': {
							background: 'linear-gradient(45deg, #1565c0, #1976d2)',
						},
						display: { xs: 'flex', md: 'none' }
					}}
				>
					<AddIcon />
				</Fab>
			</Box>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'REVIEWS',
		},
	},
};

export default withLayoutBasic(Community);