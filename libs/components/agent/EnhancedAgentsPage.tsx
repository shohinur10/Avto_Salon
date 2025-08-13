import React, { useState, useEffect, useMemo } from 'react';
import {
	Box,
	Stack,
	Typography,
	Container,
	Grid,
	Fab,
	Backdrop,
	SpeedDial,
	SpeedDialAction,
	SpeedDialIcon,
	Button,
	Card,
	CardContent,
	Avatar,
	Chip,
	LinearProgress,
	Alert,
	Pagination,
	ToggleButton,
	ToggleButtonGroup,
	Skeleton
} from '@mui/material';
import {
	Psychology as PsychologyIcon,
	ViewModule as ViewModuleIcon,
	ViewList as ViewListIcon,
	TrendingUp as TrendingUpIcon,
	Star as StarIcon,
	LocationOn as LocationIcon,
	Phone as PhoneIcon,
	Email as EmailIcon,
	Chat as ChatIcon,
	FilterList as FilterListIcon,
	Search as SearchIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedAgentFilter } from './SimpleAgentFilter';
import EnhancedAgentCard from './EnhancedAgentCard';
import AgentMatcher from './AgentMatcher';
import { AgentProfile, AgentFilterState } from '../../types/agent/agent-extended';
import { Member } from '../../types/member/member';
import { CarBrand, CarCategory, FuelType } from '../../enums/car.enum';

interface EnhancedAgentsPageProps {
	agents: Member[];
	loading?: boolean;
	total?: number;
	onFilterChange?: (filters: AgentFilterState) => void;
	onAgentLike?: (agentId: string) => void;
	onAgentContact?: (agentId: string, method: string) => void;
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
}

const EnhancedAgentsPage: React.FC<EnhancedAgentsPageProps> = ({
	agents,
	loading = false,
	total = 0,
	onFilterChange,
	onAgentLike,
	onAgentContact,
	currentPage = 1,
	totalPages = 1,
	onPageChange
}) => {
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [showFilter, setShowFilter] = useState(true);
	const [showMatcher, setShowMatcher] = useState(false);
	const [likedAgents, setLikedAgents] = useState<Set<string>>(new Set());
	const [filters, setFilters] = useState<AgentFilterState>({
		searchText: '',
		sortBy: 'rating',
		sortDirection: 'desc',
		page: currentPage,
		limit: 12
	});

	// Convert Member[] to AgentProfile[] with mock data
	const enhancedAgents: AgentProfile[] = useMemo(() => {
		return agents.map((agent, index) => ({
			...agent,
			title: getAgentTitle(agent.memberType, index),
			experience: Math.floor(Math.random() * 15) + 2,
			languages: getRandomLanguages(),
			carsSold: Math.floor(Math.random() * 200) + 50,
			clientRating: Math.random() * 1.5 + 3.5,
			responseTime: getRandomResponseTime(),
			satisfactionRate: Math.floor(Math.random() * 20) + 80,
			brandExpertise: getRandomBrands(),
			vehicleTypes: getRandomCategories(),
			fuelExpertise: getRandomFuels(),
			priceRange: { min: 10000, max: 150000 },
			whatsapp: agent.memberPhone,
			availability: getRandomAvailability(),
			workingHours: '9 AM - 6 PM',
			timezone: 'Asia/Seoul',
			certifications: getRandomCertifications(),
			awards: getRandomAwards(),
			recentSales: [],
			clientTestimonials: [],
			territory: getRandomTerritory(),
			serviceAreas: ['Seoul', 'Incheon'],
			monthlyStats: {
				carsSold: Math.floor(Math.random() * 15) + 5,
				clientsMet: Math.floor(Math.random() * 30) + 20,
				responseRate: Math.floor(Math.random() * 20) + 80
			}
		}));
	}, [agents]);

	// Helper functions for mock data
	const getAgentTitle = (memberType: string, index: number) => {
		const titles = [
			'Senior Car Consultant',
			'Luxury Vehicle Specialist',
			'Electric Vehicle Expert',
			'Family Car Advisor',
			'Sports Car Specialist',
			'Commercial Vehicle Expert'
		];
		return titles[index % titles.length];
	};

	const getRandomLanguages = () => {
		const languages = ['English', 'Korean', 'Russian', 'Chinese', 'Japanese'];
		const count = Math.floor(Math.random() * 3) + 2;
		return languages.slice(0, count);
	};

	const getRandomResponseTime = () => {
		const times = ['Usually responds in 30 minutes', 'Usually responds in 1 hour', 'Usually responds in 2 hours'];
		return times[Math.floor(Math.random() * times.length)];
	};

	const getRandomAvailability = (): 'online' | 'busy' | 'offline' => {
		const statuses: ('online' | 'busy' | 'offline')[] = ['online', 'busy', 'offline'];
		return statuses[Math.floor(Math.random() * statuses.length)];
	};

	const getRandomBrands = () => {
		const brands = ['BMW', 'Mercedes', 'Toyota', 'Honda', 'Ford', 'Audi', 'Volkswagen', 'Hyundai'];
		const count = Math.floor(Math.random() * 4) + 2;
		return brands.slice(0, count);
	};

	const getRandomCategories = () => {
		const categories = ['SUV', 'SEDAN', 'HATCHBACK', 'CONVERTIBLE', 'COUPE', 'PICKUP'];
		const count = Math.floor(Math.random() * 3) + 2;
		return categories.slice(0, count);
	};

	const getRandomFuels = () => {
		const fuels = ['GASOLINE', 'ELECTRIC', 'HYBRID', 'DIESEL'];
		const count = Math.floor(Math.random() * 2) + 1;
		return fuels.slice(0, count);
	};

	const getRandomCertifications = () => {
		const certs = ['Certified Sales Professional', 'Automotive Expert', 'Customer Service Excellence'];
		return certs.slice(0, Math.floor(Math.random() * 2) + 1);
	};

	const getRandomAwards = () => {
		const awards = ['Top Seller 2023', 'Customer Choice Award', 'Excellence in Service'];
		return awards.slice(0, Math.floor(Math.random() * 2));
	};

	const getRandomTerritory = () => {
		const territories = ['Seoul Metropolitan Area', 'Busan Region', 'Incheon Area', 'Daegu District'];
		return territories[Math.floor(Math.random() * territories.length)];
	};

	// Handlers
	const handleFilterChange = (newFilters: AgentFilterState) => {
		setFilters(newFilters);
		onFilterChange?.(newFilters);
	};

	const handleAgentLike = (agentId: string) => {
		setLikedAgents(prev => {
			const newSet = new Set(prev);
			if (newSet.has(agentId)) {
				newSet.delete(agentId);
			} else {
				newSet.add(agentId);
			}
			return newSet;
		});
		onAgentLike?.(agentId);
	};

	const handleAgentContact = (agentId: string, method: 'phone' | 'email' | 'whatsapp' | 'chat') => {
		onAgentContact?.(agentId, method);
	};

	const handleViewProfile = (agentId: string) => {
		// Navigate to agent detail page
		window.open(`/agent/detail?id=${agentId}`, '_blank');
	};

	const handleAgentSelect = (agent: AgentProfile) => {
		// Handle agent selection from matcher
		handleViewProfile(agent._id);
	};

	// Stats for top section
	const stats = {
		totalAgents: total,
		onlineAgents: enhancedAgents.filter(a => a.availability === 'online').length,
		avgRating: enhancedAgents.reduce((sum, agent) => sum + agent.clientRating, 0) / enhancedAgents.length || 0,
		totalSales: enhancedAgents.reduce((sum, agent) => sum + agent.carsSold, 0)
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 }
	};

	return (
		<Container maxWidth="xl" className="enhanced-agents-page">
			{/* Hero Section */}
			<Box className="agents-hero" py={4}>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
						<motion.div variants={itemVariants}>
							<Typography variant="h3" fontWeight="bold" gutterBottom>
								Our Expert Agents
							</Typography>
							<Typography variant="h6" color="text.secondary" gutterBottom>
								Find the perfect car consultant for your needs
							</Typography>
						</motion.div>

						<motion.div variants={itemVariants}>
							<Button
								variant="contained"
								size="large"
								startIcon={<PsychologyIcon />}
								onClick={() => setShowMatcher(true)}
								sx={{
									background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
									color: 'white',
									fontWeight: 600,
									padding: '12px 32px',
									borderRadius: '12px',
									textTransform: 'none',
									fontSize: '1.1rem',
									boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
									'&:hover': {
										background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
										boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5)',
										transform: 'translateY(-2px)'
									}
								}}
							>
								Find My Perfect Agent
							</Button>
						</motion.div>
					</Stack>

					{/* Stats Cards */}
					<Grid container spacing={3} mb={4}>
						<Grid item xs={12} sm={6} md={3}>
							<motion.div variants={itemVariants}>
								<Card>
									<CardContent sx={{ textAlign: 'center' }}>
										<Typography variant="h4" color="primary" fontWeight="bold">
											{stats.totalAgents}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Expert Agents
										</Typography>
									</CardContent>
								</Card>
							</motion.div>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<motion.div variants={itemVariants}>
								<Card>
									<CardContent sx={{ textAlign: 'center' }}>
										<Typography variant="h4" color="success.main" fontWeight="bold">
											{stats.onlineAgents}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Online Now
										</Typography>
									</CardContent>
								</Card>
							</motion.div>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<motion.div variants={itemVariants}>
								<Card>
									<CardContent sx={{ textAlign: 'center' }}>
										<Typography variant="h4" color="warning.main" fontWeight="bold">
											{stats.avgRating.toFixed(1)}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Average Rating
										</Typography>
									</CardContent>
								</Card>
							</motion.div>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<motion.div variants={itemVariants}>
								<Card>
									<CardContent sx={{ textAlign: 'center' }}>
										<Typography variant="h4" color="info.main" fontWeight="bold">
											{stats.totalSales.toLocaleString()}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Cars Sold
										</Typography>
									</CardContent>
								</Card>
							</motion.div>
						</Grid>
					</Grid>
				</motion.div>
			</Box>

			{/* Main Content */}
			<Box className="agents-content">
				<Grid container spacing={3}>
					{/* Filter Sidebar */}
					{showFilter && (
						<Grid item xs={12} lg={3}>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3 }}
							>
								<AdvancedAgentFilter
									onFilterChange={handleFilterChange}
									initialFilters={filters}
									loading={loading}
								/>
							</motion.div>
						</Grid>
					)}

					{/* Agent List */}
					<Grid item xs={12} lg={showFilter ? 9 : 12}>
						{/* Controls */}
						<Stack 
							direction="row" 
							justifyContent="space-between" 
							alignItems="center" 
							mb={3}
						>
							<Box display="flex" alignItems="center" gap={2}>
								<Button
									variant="outlined"
									startIcon={<FilterListIcon />}
									onClick={() => setShowFilter(!showFilter)}
								>
									{showFilter ? 'Hide' : 'Show'} Filters
								</Button>
								
								<Button
									variant="text"
									size="small"
									onClick={() => handleFilterChange({
										searchText: '',
										sortBy: 'rating',
										sortDirection: 'desc',
										page: 1,
										limit: 12
									})}
									sx={{
										fontSize: '0.8rem',
										padding: '4px 8px',
										minWidth: 'auto',
										textTransform: 'none'
									}}
								>
									Clear All
								</Button>
								
								<Typography variant="body2" color="text.secondary">
									{total} agents found
								</Typography>
							</Box>

							<ToggleButtonGroup
								value={viewMode}
								exclusive
								onChange={(_, newMode) => newMode && setViewMode(newMode)}
								size="small"
							>
								<ToggleButton value="grid">
									<ViewModuleIcon />
								</ToggleButton>
								<ToggleButton value="list">
									<ViewListIcon />
								</ToggleButton>
							</ToggleButtonGroup>
						</Stack>

						{/* Loading State */}
						{loading && (
							<Grid container spacing={3}>
								{Array.from({ length: 6 }).map((_, index) => (
									<Grid item xs={12} sm={6} md={4} key={index}>
										<Card>
											<CardContent>
												<Box display="flex" alignItems="center" gap={2} mb={2}>
													<Skeleton variant="circular" width={60} height={60} />
													<Box flex={1}>
														<Skeleton variant="text" width="80%" />
														<Skeleton variant="text" width="60%" />
													</Box>
												</Box>
												<Skeleton variant="rectangular" height={100} />
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						)}

						{/* Agent Cards */}
						{!loading && (
							<AnimatePresence>
								<motion.div
									variants={containerVariants}
									initial="hidden"
									animate="visible"
								>
									<Grid container spacing={3}>
										{enhancedAgents.map((agent) => (
											<Grid 
												item 
												xs={12} 
												sm={viewMode === 'grid' ? 6 : 12} 
												md={viewMode === 'grid' ? 4 : 12} 
												key={agent._id}
											>
												<motion.div variants={itemVariants}>
													<EnhancedAgentCard
														agent={agent}
														onLike={handleAgentLike}
														onContact={handleAgentContact}
														onViewProfile={handleViewProfile}
														isLiked={likedAgents.has(agent._id)}
														variant={viewMode === 'list' ? 'detailed' : 'default'}
													/>
												</motion.div>
											</Grid>
										))}
									</Grid>
								</motion.div>
							</AnimatePresence>
						)}

						{/* No Results */}
						{!loading && enhancedAgents.length === 0 && (
							<Box textAlign="center" py={8}>
								<SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
								<Typography variant="h6" gutterBottom>
									No agents found
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Try adjusting your filters or search criteria
								</Typography>
							</Box>
						)}

						{/* Pagination */}
						{!loading && enhancedAgents.length > 0 && totalPages > 1 && (
							<Box display="flex" justifyContent="center" mt={4}>
								<Pagination
									count={totalPages}
									page={currentPage}
									onChange={(_, page) => onPageChange?.(page)}
									color="primary"
									size="large"
									showFirstButton
									showLastButton
								/>
							</Box>
						)}
					</Grid>
				</Grid>
			</Box>

			{/* Agent Matcher Dialog */}
			<AgentMatcher
				agents={enhancedAgents}
				onAgentSelect={handleAgentSelect}
				open={showMatcher}
				onClose={() => setShowMatcher(false)}
			/>

			{/* Floating Speed Dial */}
			<SpeedDial
				ariaLabel="Quick Actions"
				sx={{ position: 'fixed', bottom: 24, right: 24 }}
				icon={<SpeedDialIcon />}
			>
				<SpeedDialAction
					icon={<PsychologyIcon />}
					tooltipTitle="Find Perfect Agent"
					onClick={() => setShowMatcher(true)}
				/>
				<SpeedDialAction
					icon={<ChatIcon />}
					tooltipTitle="Live Chat"
					onClick={() => console.log('Live chat')}
				/>
				<SpeedDialAction
					icon={<PhoneIcon />}
					tooltipTitle="Call Support"
					onClick={() => window.open('tel:+821234567890')}
				/>
			</SpeedDial>
		</Container>
	);
};

export default EnhancedAgentsPage;
