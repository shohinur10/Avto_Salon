import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Typography, IconButton, Card, CardMedia, CardContent } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Car } from '../../types/car/car';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

interface TopCarsProps {
	cars: Car[];
	onLikeToggle?: (carId: string, isLiked: boolean) => void;
}

const TopCars: React.FC<TopCarsProps> = ({ cars = [], onLikeToggle }) => {
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

	if (!cars || cars.length === 0) {
		return (
			<motion.section
				ref={ref}
				initial={{ opacity: 0, y: 50 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
				transition={{ duration: 0.8 }}
				className="top-cars"
			>
				<Box component="div"   className="section-header">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<Typography variant="h2" className="section-title">
							Top Ranked Cars
						</Typography>
						<Typography variant="body1" className="section-subtitle">
							Highest rated premium vehicles in our collection
						</Typography>
					</motion.div>
				</Box>
				<Box component="div"   className="no-cars-message" style={{ textAlign: 'center', padding: '60px 20px' }}>
					<Typography variant="h6" style={{ color: '#666', marginBottom: '16px' }}>
						⭐ No top cars available at the moment
					</Typography>
					<Typography variant="body2" style={{ color: '#999' }}>
						Please check back later for our top-rated vehicles
					</Typography>
				</Box>
			</motion.section>
		);
	}

	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.8 }}
			className="top-cars"
		>
			<Box component="div"   className="section-header">
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Typography variant="h2" className="section-title">
						Top Ranked Cars
					</Typography>
					<Typography variant="body1" className="section-subtitle">
						Highest rated premium vehicles in our collection
					</Typography>
				</motion.div>

				<Box component="div"   className="navigation-controls">
					<IconButton className="nav-btn prev-btn" id="top-cars-prev">
						<ArrowBackIcon />
					</IconButton>
					<IconButton className="nav-btn next-btn" id="top-cars-next">
						<ArrowForwardIcon />
					</IconButton>
				</Box>
			</Box>

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.8, delay: 0.3 }}
				className="cars-carousel-container"
			>
				<Swiper
					spaceBetween={30}
					slidesPerView={1}
					navigation={{
						prevEl: '#top-cars-prev',
						nextEl: '#top-cars-next',
					}}
					pagination={{
						clickable: true,
						dynamicBullets: true,
					}}
					autoplay={{
						delay: 4500,
						disableOnInteraction: false,
					}}
					loop={true}
					breakpoints={{
						640: {
							slidesPerView: 2,
							spaceBetween: 20,
						},
						768: {
							slidesPerView: 2,
							spaceBetween: 25,
						},
						1024: {
							slidesPerView: 3,
							spaceBetween: 30,
						},
						1200: {
							slidesPerView: 4,
							spaceBetween: 30,
						},
					}}
					className="cars-swiper"
				>
					{cars.filter(
						(car, index, self) => index === self.findIndex(c => c._id === car._id)
					).map((car, index) => (
						<SwiperSlide key={`top-${car._id}`}>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
								transition={{ duration: 0.6, delay: 0.1 * index }}
								whileHover={{ y: -10, scale: 1.02 }}
								className="car-card-wrapper"
							>
								<Card 
									className="luxury-car-card"
									onClick={() => handleCarClick(car._id)}
								>
									<Box component="div"   className="card-image-container">
										<CardMedia
											component="img"
											height="240"
											image={car.carImages?.[0] || '/img/cars/default-car.jpg'}
											alt={`${car.brand} ${car.carTitle}`}
											className="car-image"
										/>
										
										<Box component="div"   className="image-overlay" />
										
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
														transition={{ type: "spring", stiffness: 300 }}
													>
														<FavoriteIcon />
													</motion.div>
												) : (
													<FavoriteBorderIcon />
												)}
											</IconButton>
										</motion.div>

										{car.carRank && (
											<motion.div
												initial={{ opacity: 0, scale: 0 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.3 }}
												className="car-badge"
											>
												Rank #{car.carRank}
											</motion.div>
										)}
									</Box>

									<CardContent className="card-content">
										<Box component="div"   className="car-info">
											<Typography variant="h6" className="car-title">
                                                                                                {car.brand} {car.carTitle}
											</Typography>
											<Typography variant="body2" className="car-year">
												{car.carYear} • {car.carMileage ? car.carMileage.toLocaleString() : 'N/A'} miles
											</Typography>
										</Box>

										<Box component="div"   className="car-details">
											<Box component="div"   className="detail-item">
												<Typography variant="caption" className="detail-label">
													Engine
												</Typography>
												<Typography variant="body2" className="detail-value">
													N/A
												</Typography>
											</Box>
											
											<Box component="div"   className="detail-item">
												<Typography variant="caption" className="detail-label">
													Category
												</Typography>
												<Typography variant="body2" className="detail-value">
													{car.carCategory}
												</Typography>
											</Box>
										</Box>

										<Box component="div"   className="card-footer">
											<Typography variant="h5" className="car-price">
												{formatPrice(car.carPrice)}
											</Typography>
											<Box component="div"   className="car-stats">
												<Box component="div"   className="stat-item">
													<FavoriteIcon className="stat-icon" />
													<Typography variant="caption">
														{car.carLikes || 0}
													</Typography>
												</Box>
											</Box>
										</Box>
									</CardContent>
								</Card>
							</motion.div>
						</SwiperSlide>
					))}
				</Swiper>
			</motion.div>
		</motion.section>
	);
};

export default TopCars;