import React from 'react';
import { motion } from 'framer-motion';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

// Import luxury components
import LuxuryHeroSection from './LuxuryHeroSection';
import EnhancedHeaderFilter from './filters/EnhancedHeaderFilter';
import BestSellingCars from './BestSellingCars';
import NewCarsGrid from './NewCarsGrid';
import AgentsSpotlight from './AgentsSpotlight';
import EventsTeaser from './EventsTeaser';

// Import existing components for data
import { useQuery } from '@apollo/client';
import { GET_CARS, GET_AGENTS, GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { CarsInquiry } from '../../types/car/car.input';
import { AgentsInquiry } from '../../types/member/member.input';
import { BoardArticlesInquiry } from '../../types/board-article/board-article.input';

const LuxuryHomepage: React.FC = () => {
	const device = useDeviceDetect();

	// GraphQL queries for data
	const bestSellingCarsInput: CarsInquiry = {
		page: 1,
		limit: 8,
		search: {},
		sort: 'carLikes'
	};

	const newCarsInput: CarsInquiry = {
		page: 1,
		limit: 6,
		search: {},
		sort: 'createdAt'
	};

	const agentsInput: AgentsInquiry = {
		page: 1,
		limit: 8,
		search: {},
		sort: 'memberRank'
	};

	const eventsInput: BoardArticlesInquiry = {
		page: 1,
		limit: 6,
		search: {
			articleCategory: 'EVENT'
		},
		sort: 'createdAt'
	};

	const { data: bestSellingCarsData, loading: bestSellingLoading } = useQuery(GET_CARS, {
		variables: { input: bestSellingCarsInput },
		notifyOnNetworkStatusChange: true,
	});

	const { data: newCarsData, loading: newCarsLoading } = useQuery(GET_CARS, {
		variables: { input: newCarsInput },
		notifyOnNetworkStatusChange: true,
	});

	const { data: agentsData, loading: agentsLoading } = useQuery(GET_AGENTS, {
		variables: { input: agentsInput },
		notifyOnNetworkStatusChange: true,
	});

	const { data: eventsData, loading: eventsLoading } = useQuery(GET_BOARD_ARTICLES, {
		variables: { input: eventsInput },
		notifyOnNetworkStatusChange: true,
	});

	// Handle like toggle for cars
	const handleCarLikeToggle = (carId: string, isLiked: boolean) => {
		console.log(`Car ${carId} ${isLiked ? 'liked' : 'unliked'}`);
		// Implement like functionality here
	};

	// Filter configuration
	const filterInitialInput: CarsInquiry = {
		page: 1,
		limit: 9,
		search: {
			yearRange: [1990, 2024],
			pricesRange: {
				start: 0,
				end: 500000,
			},
			minMileage: 0,
			maxMileage: 200000,
		},
	};

	const handleFilterSearch = async (searchData: CarsInquiry) => {
		console.log('Filter search:', searchData);
		// Filter search will be handled by the enhanced filter component
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			className="luxury-homepage"
		>
			{/* Hero Section */}
			<LuxuryHeroSection />

			{/* Enhanced Filter Section */}
			<motion.section
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-100px' }}
				transition={{ duration: 0.8, delay: 0.2 }}
				className="filter-section"
			>
				<EnhancedHeaderFilter
					initialInput={filterInitialInput}
					onSearch={handleFilterSearch}
				/>
			</motion.section>

			<Stack className="homepage-content">
				{/* Best Selling Cars Section */}
				{!bestSellingLoading && bestSellingCarsData?.getCars?.list && (
					<BestSellingCars
						cars={bestSellingCarsData.getCars.list}
						onLikeToggle={handleCarLikeToggle}
					/>
				)}

				{/* New Cars Grid Section */}
				{!newCarsLoading && newCarsData?.getCars?.list && (
					<NewCarsGrid
						cars={newCarsData.getCars.list}
						onLikeToggle={handleCarLikeToggle}
					/>
				)}

				{/* Agents Spotlight Section */}
				{!agentsLoading && agentsData?.getAgents?.list && (
					<AgentsSpotlight
						agents={agentsData.getAgents.list}
					/>
				)}

				{/* Events Teaser Section */}
				{!eventsLoading && eventsData?.getBoardArticles?.list && (
					<EventsTeaser
						events={eventsData.getBoardArticles.list}
					/>
				)}
			</Stack>

			{/* Loading States */}
			{(bestSellingLoading || newCarsLoading || agentsLoading || eventsLoading) && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="loading-container"
				>
					<div className="luxury-loader">
						<div className="loader-ring"></div>
						<div className="loader-text">Loading luxury experience...</div>
					</div>
				</motion.div>
			)}
		</motion.div>
	);
};

export default LuxuryHomepage;
