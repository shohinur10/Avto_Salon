import React from 'react';
import { useRouter } from 'next/router';
import { 
	Box, 
	Button, 
	Stack, 
	Typography, 
	Chip, 
	Card, 
	CardContent,
	IconButton,
	Tooltip
} from '@mui/material';
import {
	Home as HomeIcon,
	TrendingUp as TrendingIcon,
	Add as AddIcon,
	Notifications as NotificationIcon,
	Search as SearchIcon,
	Category as CategoryIcon,
	Person as PersonIcon,
	Star as StarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface CommunityNavigationProps {
	currentPage?: string;
	activeCategory?: string;
}

const CommunityNavigation: React.FC<CommunityNavigationProps> = ({
	currentPage = 'community',
	activeCategory
}) => {
	const router = useRouter();

	const navigationItems = [
		{
			key: 'home',
			label: 'Home',
			icon: <HomeIcon />,
			path: '/community',
			color: '#667eea'
		},
		{
			key: 'trending',
			label: 'Trending',
			icon: <TrendingIcon />,
			path: '/community?sort=trending',
			color: '#ff6b6b'
		},
		{
			key: 'create',
			label: 'Create Post',
			icon: <AddIcon />,
			path: '/community/create',
			color: '#4ecdc4',
			highlight: true
		},
		{
			key: 'categories',
			label: 'Categories',
			icon: <CategoryIcon />,
			path: '/community?view=categories',
			color: '#45b7d1'
		}
	];

	const quickCategories = [
		{ label: 'Reviews', value: 'REVIEWS', emoji: '⭐', count: 245 },
		{ label: 'Q&A', value: 'QA', emoji: '❓', count: 189 },
		{ label: 'Showcase', value: 'SHOWCASE', emoji: '🚗', count: 156 },
		{ label: 'Tech', value: 'TECH', emoji: '🔧', count: 98 },
		{ label: 'Events', value: 'EVENTS', emoji: '📅', count: 67 }
	];

	const handleNavigation = (path: string) => {
		router.push(path);
	};

	return (
		<Card 
			sx={{ 
				borderRadius: '20px',
				background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
				backdropFilter: 'blur(20px)',
				border: '1px solid rgba(255,255,255,0.2)',
				boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
				mb: 3
			}}
		>
			<CardContent sx={{ p: 3 }}>
				{/* Main Navigation */}
				<Stack direction="row" spacing={2} alignItems="center" mb={3} flexWrap="wrap">
					{navigationItems.map((item, index) => (
						<motion.div
							key={item.key}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
						>
							<Button
								variant={currentPage === item.key ? "contained" : "outlined"}
								startIcon={item.icon}
								onClick={() => handleNavigation(item.path)}
								sx={{
									borderRadius: '16px',
									textTransform: 'none',
									fontWeight: 600,
									px: 3,
									py: 1.5,
									background: currentPage === item.key 
										? `linear-gradient(45deg, ${item.color}, ${item.color}aa)` 
										: item.highlight 
											? 'linear-gradient(45deg, #4ecdc4, #44a08d)'
											: 'transparent',
									color: currentPage === item.key || item.highlight ? 'white' : item.color,
									borderColor: item.color,
									'&:hover': {
										background: item.highlight 
											? 'linear-gradient(45deg, #44a08d, #4ecdc4)'
											: `${item.color}20`,
										transform: 'translateY(-2px)',
										boxShadow: `0 8px 25px ${item.color}40`
									},
									transition: 'all 0.3s ease'
								}}
							>
								{item.label}
							</Button>
						</motion.div>
					))}
				</Stack>

				{/* Quick Category Access */}
				<Box component="div"  >
					<Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary">
						Quick Access
					</Typography>
					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
						{quickCategories.map((category, index) => (
							<motion.div
								key={category.value}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
							>
								<Chip
									label={
										<Stack direction="row" alignItems="center" spacing={1}>
											<Typography variant="body2" component="span">
												{category.emoji}
											</Typography>
											<Typography variant="body2" fontWeight={600}>
												{category.label}
											</Typography>
											<Chip 
												label={category.count} 
												size="small"
												sx={{ 
													height: 18, 
													fontSize: '0.7rem',
													bgcolor: 'rgba(255,255,255,0.8)',
													color: 'text.primary'
												}}
											/>
										</Stack>
									}
									onClick={() => handleNavigation(`/community?articleCategory=${category.value}`)}
									sx={{
										height: 'auto',
										py: 1,
										px: 2,
										borderRadius: '12px',
										background: activeCategory === category.value 
											? 'linear-gradient(45deg, #667eea, #764ba2)'
											: 'rgba(102, 126, 234, 0.1)',
										color: activeCategory === category.value ? 'white' : '#667eea',
										border: `1px solid ${activeCategory === category.value ? 'transparent' : 'rgba(102, 126, 234, 0.3)'}`,
										cursor: 'pointer',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: activeCategory === category.value
												? 'linear-gradient(45deg, #5a6fd8, #6a42a0)'
												: 'linear-gradient(45deg, #667eea, #764ba2)',
											color: 'white',
											transform: 'scale(1.05)',
											boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
										}
									}}
								/>
							</motion.div>
						))}
					</Stack>
				</Box>

				{/* Quick Actions */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" mt={3} pt={2} borderTop="1px solid rgba(0,0,0,0.06)">
					<Stack direction="row" spacing={1}>
						<Tooltip title="Search Community">
							<IconButton
								size="small"
								sx={{
									bgcolor: 'rgba(102, 126, 234, 0.1)',
									color: '#667eea',
									'&:hover': { 
										bgcolor: '#667eea', 
										color: 'white',
										transform: 'scale(1.1)'
									},
									transition: 'all 0.3s ease'
								}}
							>
								<SearchIcon fontSize="small" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Notifications">
							<IconButton
								size="small"
								sx={{
									bgcolor: 'rgba(255, 107, 107, 0.1)',
									color: '#ff6b6b',
									'&:hover': { 
										bgcolor: '#ff6b6b', 
										color: 'white',
										transform: 'scale(1.1)'
									},
									transition: 'all 0.3s ease'
								}}
							>
								<NotificationIcon fontSize="small" />
							</IconButton>
						</Tooltip>
						<Tooltip title="My Profile">
							<IconButton
								size="small"
								sx={{
									bgcolor: 'rgba(78, 205, 196, 0.1)',
									color: '#4ecdc4',
									'&:hover': { 
										bgcolor: '#4ecdc4', 
										color: 'white',
										transform: 'scale(1.1)'
									},
									transition: 'all 0.3s ease'
								}}
							>
								<PersonIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					</Stack>

					<Stack direction="row" alignItems="center" spacing={1}>
						<StarIcon sx={{ color: '#ffd700', fontSize: 18 }} />
						<Typography variant="caption" color="text.secondary">
							50k+ Active Members
						</Typography>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CommunityNavigation;

