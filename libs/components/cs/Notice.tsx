import React, { useState, useEffect } from 'react';
import { 
	Stack, 
	Box, 
	Typography, 
	Chip, 
	CircularProgress, 
	Button,
	TextField,
	InputAdornment,
	Pagination,
	Card,
	CardContent,
	IconButton
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Notice, NoticesInquiry } from '../../types/notice/notice';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import Moment from 'react-moment';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';

// Mock data for demonstration - replace with real Apollo query
const mockNotices: Notice[] = [
	{
		_id: '1',
		noticeCategory: NoticeCategory.INQUIRY,
		noticeStatus: NoticeStatus.ACTIVE,
		noticeTitle: 'New Car Registration System is Live!',
		noticeContent: 'We are excited to announce our new streamlined car registration system. Register your vehicle today and get exclusive discounts on our premium services.',
		noticeViews: 1250,
		isEvent: true,
		eventDate: new Date('2024-12-25'),
		createdAt: new Date('2024-01-03'),
		updatedAt: new Date('2024-01-03'),
	},
	{
		_id: '2',
		noticeCategory: NoticeCategory.FAQ,
		noticeStatus: NoticeStatus.ACTIVE,
		noticeTitle: 'Free Car Listing and Trading Platform',
		noticeContent: 'It\'s absolutely free to upload and trade cars on our platform. No hidden fees, no commission charges. Start selling your car today!',
		noticeViews: 890,
		isEvent: false,
		createdAt: new Date('2024-01-31'),
		updatedAt: new Date('2024-01-31'),
	},
	{
		_id: '3',
		noticeCategory: NoticeCategory.TERMS,
		noticeStatus: NoticeStatus.ACTIVE,
		noticeTitle: 'Updated Terms of Service',
		noticeContent: 'We have updated our terms of service to better serve our automotive community. Please review the new terms for improved transparency and user protection.',
		noticeViews: 567,
		isEvent: false,
		createdAt: new Date('2024-02-15'),
		updatedAt: new Date('2024-02-15'),
	},
	{
		_id: '4',
		noticeCategory: NoticeCategory.INQUIRY,
		noticeStatus: NoticeStatus.ACTIVE,
		noticeTitle: 'Annual Auto Show - March 2024',
		noticeContent: 'Join us for the biggest automotive event of the year! Discover the latest car models, meet industry experts, and enjoy exclusive deals.',
		noticeViews: 2100,
		isEvent: true,
		eventDate: new Date('2024-03-15'),
		createdAt: new Date('2024-02-01'),
		updatedAt: new Date('2024-02-01'),
	},
	{
		_id: '5',
		noticeCategory: NoticeCategory.FAQ,
		noticeStatus: NoticeStatus.ACTIVE,
		noticeTitle: 'New Search Filters Available',
		noticeContent: 'We\'ve added advanced search filters to help you find your perfect car faster. Filter by price, year, mileage, fuel type, and more!',
		noticeViews: 445,
		isEvent: false,
		createdAt: new Date('2024-02-20'),
		updatedAt: new Date('2024-02-20'),
	},
];

interface NoticeComponentProps {
	onNoticeClick?: (notice: Notice) => void;
}

const NoticeComponent = ({ onNoticeClick }: NoticeComponentProps) => {
	const device = useDeviceDetect();
	const [notices, setNotices] = useState<Notice[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [searchInput, setSearchInput] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'ALL'>('ALL');
	
	const [inquiry, setInquiry] = useState<NoticesInquiry>({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			noticeStatus: NoticeStatus.ACTIVE,
		},
	});

	/** APOLLO REQUESTS **/
	// TODO: Replace with real Apollo query
	const fetchNotices = async () => {
		setLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			let filteredNotices = mockNotices;
			
			// Filter by category
			if (selectedCategory !== 'ALL') {
				filteredNotices = filteredNotices.filter(notice => notice.noticeCategory === selectedCategory);
			}
			
			// Filter by search query
			if (searchQuery) {
				filteredNotices = filteredNotices.filter(notice => 
					notice.noticeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
					notice.noticeContent.toLowerCase().includes(searchQuery.toLowerCase())
				);
			}
			
			// Pagination
			const startIndex = (inquiry.page - 1) * inquiry.limit;
			const endIndex = startIndex + inquiry.limit;
			const paginatedNotices = filteredNotices.slice(startIndex, endIndex);
			
			setNotices(paginatedNotices);
			setTotalCount(filteredNotices.length);
		} catch (error) {
			console.error('Error fetching notices:', error);
		} finally {
			setLoading(false);
		}
	};

	/** LIFECYCLES **/
	useEffect(() => {
		fetchNotices();
	}, [inquiry, searchQuery, selectedCategory]);

	/** HANDLERS **/
	const handleSearch = () => {
		setSearchQuery(searchInput);
		setInquiry(prev => ({ ...prev, page: 1 }));
	};

	const handleSearchKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleSearch();
		}
	};

	const handleClearSearch = () => {
		setSearchInput('');
		setSearchQuery('');
	};

	const handleCategoryChange = (category: NoticeCategory | 'ALL') => {
		setSelectedCategory(category);
		setInquiry(prev => ({ ...prev, page: 1 }));
	};

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setInquiry(prev => ({ ...prev, page: value }));
	};

	const handleNoticeClick = (notice: Notice) => {
		// Increment view count (would be done via API)
		if (onNoticeClick) {
			onNoticeClick(notice);
		}
	};

	const getCategoryColor = (category: NoticeCategory) => {
		const colors = {
			[NoticeCategory.FAQ]: '#4CAF50',
			[NoticeCategory.TERMS]: '#FF9800',
			[NoticeCategory.INQUIRY]: '#2196F3',
		};
		return colors[category] || '#757575';
	};

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'} spacing={3}>
				{/* Header with Search */}
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="h4" fontWeight={700} color="#1a1a1a">
						📢 Announcements & Notices
					</Typography>
					<Stack direction="row" spacing={2} alignItems="center">
						<TextField
							placeholder="Search notices..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyPress={handleSearchKeyPress}
							size="small"
							sx={{ width: '300px' }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon color="action" />
									</InputAdornment>
								),
								endAdornment: searchInput && (
									<InputAdornment position="end">
										<IconButton size="small" onClick={handleClearSearch}>
											<ClearIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<Button 
							variant="contained" 
							onClick={handleSearch}
							sx={{ 
								borderRadius: '8px',
								textTransform: 'none',
								fontWeight: 600
							}}
						>
							Search
						</Button>
					</Stack>
				</Stack>

				{/* Category Filters */}
				<Stack direction="row" spacing={1} flexWrap="wrap">
					<Chip
						label="All"
						onClick={() => handleCategoryChange('ALL')}
						color={selectedCategory === 'ALL' ? 'primary' : 'default'}
						variant={selectedCategory === 'ALL' ? 'filled' : 'outlined'}
						sx={{ fontWeight: 600 }}
					/>
					{Object.values(NoticeCategory).map((category) => (
						<Chip
							key={category}
							label={category.replace('_', ' ')}
							onClick={() => handleCategoryChange(category)}
							color={selectedCategory === category ? 'primary' : 'default'}
							variant={selectedCategory === category ? 'filled' : 'outlined'}
							sx={{ 
								fontWeight: 600,
								backgroundColor: selectedCategory === category ? getCategoryColor(category) : 'transparent',
								borderColor: getCategoryColor(category),
								color: selectedCategory === category ? 'white' : getCategoryColor(category),
								'&:hover': {
									backgroundColor: selectedCategory === category ? getCategoryColor(category) : `${getCategoryColor(category)}20`,
								}
							}}
						/>
					))}
				</Stack>

				{/* Loading State */}
				{loading && (
					<Box component="div"    display="flex" justifyContent="center" py={4}>
						<CircularProgress />
					</Box>
				)}

				{/* Notices List */}
				{!loading && (
					<Stack spacing={2}>
						{notices.length > 0 ? (
							notices.map((notice, index) => (
								<Card
									key={notice._id}
									sx={{
										borderRadius: '12px',
										boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
										border: notice.isEvent ? '2px solid #FFD700' : '1px solid #e0e0e0',
										cursor: 'pointer',
										transition: 'all 0.3s ease',
										'&:hover': {
											boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
											transform: 'translateY(-2px)'
										}
									}}
									onClick={() => handleNoticeClick(notice)}
								>
									<CardContent sx={{ p: 3 }}>
										<Stack spacing={2}>
											{/* Header */}
											<Stack direction="row" alignItems="center" justifyContent="space-between">
												<Stack direction="row" alignItems="center" spacing={2}>
													{notice.isEvent ? (
														<Chip
															icon={<EventIcon />}
															label="Event"
															color="warning"
															sx={{
																fontWeight: 600,
																backgroundColor: '#FFD700',
																color: '#1a1a1a'
															}}
														/>
													) : (
														<Chip
															icon={<AnnouncementIcon />}
															label={notice.noticeCategory}
															sx={{
																fontWeight: 600,
																backgroundColor: `${getCategoryColor(notice.noticeCategory)}20`,
																color: getCategoryColor(notice.noticeCategory),
																border: `1px solid ${getCategoryColor(notice.noticeCategory)}`
															}}
														/>
													)}
													
													<Typography variant="body2" color="text.secondary">
														#{(inquiry.page - 1) * inquiry.limit + index + 1}
													</Typography>
												</Stack>
												
												<Stack direction="row" alignItems="center" spacing={1}>
													<VisibilityIcon sx={{ fontSize: 16, color: '#666' }} />
													<Typography variant="body2" color="text.secondary">
														{notice.noticeViews}
													</Typography>
												</Stack>
											</Stack>

											{/* Title */}
											<Typography 
												variant="h6" 
												fontWeight={600} 
												color="#1a1a1a"
												sx={{ lineHeight: 1.3 }}
											>
												{notice.noticeTitle}
											</Typography>

											{/* Content Preview */}
											<Typography 
												variant="body1" 
												color="text.secondary"
												sx={{
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
													lineHeight: 1.5
												}}
											>
												{notice.noticeContent}
											</Typography>

											{/* Footer */}
											<Stack direction="row" alignItems="center" justifyContent="space-between">
												<Typography variant="body2" color="text.secondary">
													<Moment format="MMMM DD, YYYY">{notice.createdAt}</Moment>
												</Typography>
												
												{notice.isEvent && notice.eventDate && (
													<Stack direction="row" alignItems="center" spacing={1}>
														<EventIcon sx={{ fontSize: 16, color: '#FFD700' }} />
														<Typography variant="body2" color="#FFD700" fontWeight={600}>
															<Moment format="MMM DD, YYYY">{notice.eventDate}</Moment>
														</Typography>
													</Stack>
												)}
											</Stack>
										</Stack>
									</CardContent>
								</Card>
							))
						) : (
							<Box
													component="div"
													
													
													
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									py: 8,
									textAlign: 'center'
								}}
							>
								<AnnouncementIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
								<Typography variant="h6" color="text.secondary" mb={1}>
									No notices found
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{searchQuery 
										? `No notices match your search "${searchQuery}"`
										: 'There are no notices available at the moment'
									}
								</Typography>
							</Box>
						)}
					</Stack>
				)}

				{/* Pagination */}
				{!loading && totalCount > inquiry.limit && (
					<Box component="div"    display="flex" justifyContent="center" mt={4}>
						<Pagination
							count={Math.ceil(totalCount / inquiry.limit)}
							page={inquiry.page}
							onChange={handlePageChange}
							color="primary"
							size="large"
							showFirstButton
							showLastButton
						/>
					</Box>
				)}

				{/* Results Info */}
				{!loading && notices.length > 0 && (
					<Typography variant="body2" color="text.secondary" textAlign="center">
						Showing {((inquiry.page - 1) * inquiry.limit) + 1} to {Math.min(inquiry.page * inquiry.limit, totalCount)} of {totalCount} notices
					</Typography>
				)}
			</Stack>
		);
	}
};

export default NoticeComponent;
