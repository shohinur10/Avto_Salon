import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery } from '@apollo/client';

// Import essential components only
import PopularCars from './PopularCars';
import TopCars from './TopCars';
import TopAgents from './TopAgents';
import Events from './Events';

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

const LuxuryHomepage: React.FC = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

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
		sort: 'carRank',
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
		refetch: refetchPopularCars
	} = useQuery(GET_CARS, {
		variables: { input: popularCarsInput },
		notifyOnNetworkStatusChange: true,
	});

	const {
		data: topCarsData,
		loading: topLoading,
		refetch: refetchTopCars
	} = useQuery(GET_CARS, {
		variables: { input: topCarsInput },
		notifyOnNetworkStatusChange: true,
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
		<div className="clean-homepage">
			{/* Simple Header with Car Background */}
			<div className="homepage-header">
				<div className="header-background">
					<img src="/img/mainBanner/main.jpg" alt="Car Background" className="background-car" />
					<div className="header-overlay"></div>
				</div>
				<div className="header-content">
					<Typography variant="h1" className="homepage-title">
						Car Salon
					</Typography>
					<Typography variant="body1" className="homepage-subtitle">
						Find Your Perfect Vehicle
					</Typography>
				</div>
			</div>

			{/* Main Content */}
			<div className="homepage-main">
				<div className="container">
					{/* Popular Cars Section */}
					{!popularLoading && popularCarsData?.getCars?.list && (
						<div className="section">
							<PopularCars
								cars={popularCarsData.getCars.list}
								onLikeToggle={handleCarLikeToggle}
							/>
						</div>
					)}

					{/* Top Cars Section */}
					{!topLoading && topCarsData?.getCars?.list && (
						<div className="section">
							<TopCars
								cars={topCarsData.getCars.list}
								onLikeToggle={handleCarLikeToggle}
							/>
						</div>
					)}

					{/* Top Agents Section */}
					<div className="section">
						<TopAgents 
							initialInput={agentsInput}
						/>
					</div>

					{/* Events Section */}
					<div className="section">
						<Events />
					</div>

					{/* Loading States */}
					{(popularLoading || topLoading) && (
						<div className="loading-container">
							<div className="loader"></div>
							<Typography>Loading...</Typography>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LuxuryHomepage;
