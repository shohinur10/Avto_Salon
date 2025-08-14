import React from 'react';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Avatar, Chip, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

// Import essential components only
import PopularCars from './PopularCars';
import TopCars from './TopCars';
import TopAgents from './TopAgents';
import Events from './Events';
import PlatformStats from './PlatformStats';

// Import GraphQL and types
import { GET_CARS, GET_AGENTS } from '../../../apollo/user/query';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';
import { CarsInquiry } from '../../types/car/car.input';
import { AgentsInquiry } from '../../types/member/member.input';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

// Material UI Icons
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StarIcon from '@mui/icons-material/Star';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import FavoriteIcon from '@mui/icons-material/Favorite';

const LuxuryHomepage: React.FC = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	// GraphQL mutations and queries
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

	// Data queries for homepage sections
	const popularCarsInput: CarsInquiry = {
		page: 1,
		limit: 8,
		search: {},
		sort: 'carViews',
		direction: 'DESC'
	};

	const topCarsInput: CarsInquiry = {
		page: 1,
		limit: 6,
		search: {},
		sort: 'carLikes',
		direction: 'DESC'
	};

	const agentsInput: AgentsInquiry = {
		page: 1,
		limit: 8,
		search: {},
		sort: 'memberRank',
		direction: 'DESC'
	};

	const {
		data: popularCarsData,
		loading: popularLoading,
		refetch: refetchPopularCars,
		error: popularError
	} = useQuery(GET_CARS, {
		variables: { input: popularCarsInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			console.log('Popular Cars Data:', data);
		},
		onError: (error) => {
			console.error('Popular Cars Error:', error);
		}
	});

	const {
		data: topCarsData,
		loading: topLoading,
		refetch: refetchTopCars,
		error: topError
	} = useQuery(GET_CARS, {
		variables: { input: topCarsInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			console.log('Top Cars Data:', data);
		},
		onError: (error) => {
			console.error('Top Cars Error:', error);
		}
	});

	// Remove unused agents query since TopAgents component handles its own data fetching

	// Handle like toggle for cars
	const handleCarLikeToggle = async (carId: string, isLiked: boolean) => {
		try {
			if (!carId) return;
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetCar({
				variables: { input: carId },
			});

			// Refetch data to update like counts
			await refetchPopularCars();
			await refetchTopCars();
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error, handleCarLikeToggle', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// Button click handlers
	const handleStartShopping = () => {
		router.push('/car');
	};

	const handleBookTestDrive = () => {
		// You can modify this to show a modal or navigate to a contact form
		if (user?._id) {
			router.push('/car');
		} else {
			router.push('/account/join');
		}
	};

	const handleExploreCollection = () => {
		router.push('/car');
	};

	const handleScheduleVisit = () => {
		if (user?._id) {
			router.push('/cs');
		} else {
			router.push('/account/join');
		}
	};

	if (device === 'mobile') {
		return (
			<div style={{
				padding: '2rem',
				textAlign: 'center',
				background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
				minHeight: '100vh',
				color: 'white'
			}}>
				<h1>🏠 Welcome to Car Salon</h1>
				<p>Mobile version coming soon!</p>
			</div>
		);
	}

	return (
		<div className="luxury-homepage">
			{/* Hero Section with Car Background - PRESERVED */}
			<div className="luxury-hero-section">
				<div className="hero-background">
					<img src="/img/mainBanner/main.jpg" alt="Luxury Car Background" className="hero-car-image" />
					<div className="hero-overlay"></div>
				</div>
				<div className="hero-content">
					<div className="hero-text-container">
						<Typography variant="h1" className="hero-title">
							<span>Luxury</span>
							<span className="hero-title-accent">Car Salon</span>
						</Typography>
						<Typography variant="body1" className="hero-subtitle">
							Discover the finest collection of premium automobiles. 
							From exotic supercars to elegant luxury vehicles, find your dream car today.
						</Typography>
					</div>
					<div className="hero-actions">
						<Button 
							className="hero-btn hero-btn-primary"
							onClick={handleExploreCollection}
						>
							Explore Collection
						</Button>
						<Button 
							className="hero-btn hero-btn-secondary"
							onClick={handleScheduleVisit}
						>
							Schedule Visit
						</Button>
					</div>
				</div>
				
				{/* Floating Platform Stats */}
				<div className="floating-stats">
					<div className="stat-item">
						<span className="stat-number">500+</span>
						<span className="stat-label">Premium Cars</span>
					</div>
					<div className="stat-item">
						<span className="stat-number">50+</span>
						<span className="stat-label">Expert Agents</span>
					</div>
					<div className="stat-item">
						<span className="stat-number">15+</span>
						<span className="stat-label">Luxury Brands</span>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="scroll-indicator">
					<ArrowDownwardIcon className="scroll-arrow" />
					<Typography className="scroll-text">Discover More</Typography>
				</div>
			</div>

			{/* Premium Features Section */}
			<Box className="premium-features-section">
				<Box className="container">
					<Typography variant="h2" className="section-title">
						Why Choose Our Salon
					</Typography>
					<Typography variant="body1" className="section-subtitle">
						Experience excellence in every aspect of our service
					</Typography>
					
					<Grid container spacing={4} sx={{ mt: 4 }}>
						<Grid item xs={12} md={4}>
							<Card className="feature-card">
								<CardContent className="feature-content">
									<Box className="feature-icon-container">
										<VerifiedIcon className="feature-icon" />
									</Box>
									<Typography variant="h6" className="feature-title">
										Certified Quality
									</Typography>
									<Typography variant="body2" className="feature-description">
										Every vehicle undergoes rigorous inspection to ensure the highest quality standards.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} md={4}>
							<Card className="feature-card">
								<CardContent className="feature-content">
									<Box className="feature-icon-container">
										<SupportAgentIcon className="feature-icon" />
									</Box>
									<Typography variant="h6" className="feature-title">
										Expert Consultation
									</Typography>
									<Typography variant="body2" className="feature-description">
										Our knowledgeable agents provide personalized guidance for your perfect match.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} md={4}>
							<Card className="feature-card">
								<CardContent className="feature-content">
									<Box className="feature-icon-container">
										<SecurityIcon className="feature-icon" />
									</Box>
									<Typography variant="h6" className="feature-title">
										Secure Transactions
									</Typography>
									<Typography variant="body2" className="feature-description">
										Safe and transparent dealings with comprehensive warranty coverage.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Box>

			{/* Platform Statistics */}
			<Box className="stats-showcase-section">
				<PlatformStats />
			</Box>

			{/* Popular Cars Section */}
			<Box className="popular-cars-section">
				{popularLoading ? (
					<Box className="loading-container">
						<Box className="luxury-loader">
							<Box className="loader-ring"></Box>
							<Typography className="loader-text">Loading Popular Cars...</Typography>
						</Box>
					</Box>
				) : (
					<PopularCars
						cars={popularCarsData?.getCars?.list || []}
						onLikeToggle={handleCarLikeToggle}
					/>
				)}
			</Box>

			{/* Top Cars Section */}
			<Box className="top-cars-section">
				{topLoading ? (
					<Box className="loading-container">
						<Box className="luxury-loader">
							<Box className="loader-ring"></Box>
							<Typography className="loader-text">Loading Top Cars...</Typography>
						</Box>
					</Box>
				) : (
					<TopCars
						cars={topCarsData?.getCars?.list || []}
						onLikeToggle={handleCarLikeToggle}
					/>
				)}
			</Box>

			{/* Top Agents Section */}
			<Box className="top-agents-section">
				<TopAgents 
					initialInput={agentsInput}
				/>
			</Box>

			{/* Events Section */}
			<Box className="events-section">
				<Events />
			</Box>

			{/* Call to Action Section */}
			<Box className="cta-section">
				<Box className="container">
					<Box className="cta-content">
						<Typography variant="h3" className="cta-title">
							Ready to Find Your Dream Car?
						</Typography>
						<Typography variant="body1" className="cta-subtitle">
							Join thousands of satisfied customers who found their perfect vehicle with us.
						</Typography>
						<Box className="cta-actions">
							<Button 
								className="cta-btn cta-btn-primary"
								onClick={handleStartShopping}
							>
								Start Shopping
							</Button>
							<Button 
								className="cta-btn cta-btn-secondary"
								onClick={handleBookTestDrive}
							>
								Book Test Drive
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>

			{/* Loading States */}
			{(popularLoading || topLoading) && (
				<Box className="loading-container">
					<Box className="luxury-loader">
						<Box className="loader-ring"></Box>
						<Typography className="loader-text">Loading Premium Content...</Typography>
					</Box>
				</Box>
			)}
		</div>
	);
};

export default LuxuryHomepage;
