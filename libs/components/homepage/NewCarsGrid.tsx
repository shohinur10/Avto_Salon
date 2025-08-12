import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Typography, Card, CardMedia, CardContent, IconButton, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Car } from '../../types/car/car';
import { useRouter } from 'next/router';

interface NewCarsGridProps {
	cars: Car[];
	onLikeToggle?: (carId: string, isLiked: boolean) => void;
}

const NewCarsGrid: React.FC<NewCarsGridProps> = ({ cars = [], onLikeToggle }) => {
	const router = useRouter();
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });
	const [likedCars, setLikedCars] = useState<Set<string>>(new Set());

	const handleLikeToggle = (carId: string, event: React.MouseEvent) => {
		event.stopPropagation();
		const isLiked = likedCars.has(carId);
		const newLikedCars = new Set(likedCars);
		
		if (isLiked) {
			newLikedCars.delete(carId);
		} else {
			newLikedCars.add(carId);
		}
		
		setLikedCars(newLikedCars);
		onLikeToggle?.(carId, !isLiked);
	};

	const handleCarClick = (carId: string) => {
		router.push(`/car/detail?id=${carId}`);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(price);
	};

	const isNewCar = (createdAt: string) => {
		const carDate = new Date(createdAt);
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		return carDate > thirtyDaysAgo;
	};

	if (!cars || cars.length === 0) {
		return null;
	}

	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.8 }}
			className="new-cars-grid"
		>
			<Box className="section-header">
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Typography variant="h2" className="section-title">
						Latest Arrivals
					</Typography>
					<Typography variant="body1" className="section-subtitle">
						Explore our newest collection of premium vehicles, freshly added to our showroom
					</Typography>
				</motion.div>
			</Box>

			<Box className="cars-grid">
				{cars.map((car, index) => (
					<motion.div
						key={car._id}
						initial={{ opacity: 0, y: 30, scale: 0.9 }}
						animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
						transition={{ 
							duration: 0.6, 
							delay: 0.1 * (index % 6), // Stagger animation for first 6 items
							type: "spring",
							stiffness: 100
						}}
						whileHover={{ 
							y: -8, 
							scale: 1.02,
							rotateX: 5,
							rotateY: 5,
							transition: { duration: 0.3 }
						}}
						className="car-card-wrapper"
					>
						<Card 
							className="new-car-card"
							onClick={() => handleCarClick(car._id)}
						>
							<Box className="card-image-container">
								<CardMedia
									component="img"
									height="220"
									image={car.carImages?.[0] || '/img/cars/default-car.jpg'}
									alt={`${car.carBrand} ${car.carModel}`}
									className="car-image"
								/>
								
								{/* Overlay Effects */}
								<Box className="image-overlay" />
								<Box className="hover-overlay" />
								
								{/* Badges */}
								<Box className="card-badges">
									{isNewCar(car.createdAt) && (
										<motion.div
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.3 + 0.1 * index }}
										>
											<Chip 
												label="NEW" 
												className="new-badge"
												size="small"
											/>
										</motion.div>
									)}
									
									{car.carStatus === 'ACTIVE' && (
										<motion.div
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.4 + 0.1 * index }}
										>
											<Chip 
												label="AVAILABLE" 
												className="status-badge"
												size="small"
											/>
										</motion.div>
									)}
								</Box>
								
								{/* Like Button */}
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									className="like-button-container"
								>
									<IconButton
										className={`like-button ${likedCars.has(car._id) ? 'liked' : ''}`}
										onClick={(e) => handleLikeToggle(car._id, e)}
									>
										{likedCars.has(car._id) ? (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ type: "spring", stiffness: 500, damping: 15 }}
											>
												<FavoriteIcon />
											</motion.div>
										) : (
											<FavoriteBorderIcon />
										)}
									</IconButton>
								</motion.div>

								{/* Quick Stats Overlay */}
								<Box className="quick-stats">
									<Box className="stat-item">
										<CalendarTodayIcon className="stat-icon" />
										<Typography variant="caption">{car.carYear}</Typography>
									</Box>
									<Box className="stat-item">
										<SpeedIcon className="stat-icon" />
										<Typography variant="caption">
											{car.carMileage?.toLocaleString() || '0'} mi
										</Typography>
									</Box>
									<Box className="stat-item">
										<LocalGasStationIcon className="stat-icon" />
										<Typography variant="caption">{car.carFuelType || 'Gas'}</Typography>
									</Box>
								</Box>
							</Box>

							<CardContent className="card-content">
								<Box className="car-header">
									<Typography variant="h6" className="car-title">
										{car.carBrand} {car.carModel}
									</Typography>
									<Typography variant="body2" className="car-category">
										{car.carCategory}
									</Typography>
								</Box>

								<Box className="car-features">
									<Box className="feature-item">
										<Typography variant="caption" className="feature-label">
											Transmission
										</Typography>
										<Typography variant="body2" className="feature-value">
											{car.carTransmission || 'Automatic'}
										</Typography>
									</Box>
									
									<Box className="feature-item">
										<Typography variant="caption" className="feature-label">
											Condition
										</Typography>
										<Typography variant="body2" className="feature-value">
											{car.carCondition || 'Excellent'}
										</Typography>
									</Box>
								</Box>

								<Box className="card-footer">
									<Box className="price-section">
										<Typography variant="h5" className="car-price">
											{formatPrice(car.carPrice)}
										</Typography>
										<Typography variant="caption" className="price-label">
											Starting from
										</Typography>
									</Box>
									
									<Box className="engagement-stats">
										<Box className="stat-item">
											<FavoriteIcon className="stat-icon" />
											<Typography variant="caption">
												{car.carLikes || 0}
											</Typography>
										</Box>
										<Box className="stat-item">
											<Typography variant="caption">
												{car.carViews || 0} views
											</Typography>
										</Box>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</Box>

			{/* View More Button */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
				transition={{ duration: 0.6, delay: 0.8 }}
				className="view-more-container"
			>
				<motion.button
					whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(212, 175, 55, 0.3)" }}
					whileTap={{ scale: 0.95 }}
					className="view-more-btn"
					onClick={() => router.push('/car')}
				>
					View All Cars
				</motion.button>
			</motion.div>
		</motion.section>
	);
};

export default NewCarsGrid;
