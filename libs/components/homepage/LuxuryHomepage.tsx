import React from 'react';
import { motion } from 'framer-motion';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

// Import essential components only
import LuxuryHeroSection from './LuxuryHeroSection';
import EnhancedHeaderFilter from './filters/EnhancedHeaderFilter';
import PopularCars from './PopularCars';
import TopCars from './TopCars';
import AgentsSpotlight from './AgentsSpotlight';

// Import existing components for data
import { useQuery } from '@apollo/client';
import { GET_CARS, GET_AGENTS } from '../../../apollo/user/query';
import { CarsInquiry } from '../../types/car/car.input';
import { AgentsInquiry } from '../../types/member/member.input';

const LuxuryHomepage: React.FC = () => {
	const device = useDeviceDetect();

	// GraphQL queries for essential data only
	const popularCarsInput: CarsInquiry = {
		page: 1,
		limit: 8,
		search: {},
		sort: 'carViews'
	};

	const topCarsInput: CarsInquiry = {
		page: 1,
		limit: 6,
		search: {},
		sort: 'carRank'
	};

	const agentsInput: AgentsInquiry = {
		page: 1,
		limit: 8,
		search: {},
		sort: 'memberRank'
	};

	const { data: popularCarsData, loading: popularLoading } = useQuery(GET_CARS, {
		variables: { input: popularCarsInput },
		notifyOnNetworkStatusChange: true,
	});

	const { data: topCarsData, loading: topLoading } = useQuery(GET_CARS, {
		variables: { input: topCarsInput },
		notifyOnNetworkStatusChange: true,
	});

	const { data: agentsData, loading: agentsLoading } = useQuery(GET_AGENTS, {
		variables: { input: agentsInput },
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
				{/* Popular Cars Section */}
				{!popularLoading && popularCarsData?.getCars?.list && (
					<PopularCars
						cars={popularCarsData.getCars.list}
						onLikeToggle={handleCarLikeToggle}
					/>
				)}

				{/* Top Cars Section */}
				{!topLoading && topCarsData?.getCars?.list && (
					<TopCars
						cars={topCarsData.getCars.list}
						onLikeToggle={handleCarLikeToggle}
					/>
				)}

				{/* Agents Spotlight Section */}
				{!agentsLoading && agentsData?.getAgents?.list && (
					<AgentsSpotlight
						agents={agentsData.getAgents.list}
					/>
				)}
			</Stack>

			{/* Loading States */}
			{(popularLoading || topLoading || agentsLoading) && (
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
