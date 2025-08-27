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
import { REACT_APP_API_URL } from '../../config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

interface PopularCarsProps {
	cars: Car[];
	onLikeToggle?: (carId: string, isLiked: boolean) => void;
}

const PopularCars: React.FC<PopularCarsProps> = ({ cars = [], onLikeToggle }) => {
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
		return null;
	}

	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.8 }}
			className="popular-cars"
		>
			<Box className="section-header">
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Typography variant="h2" className="section-title">
						Popular Cars
					</Typography>
					<Typography variant="body1" className="section-subtitle">
						Most viewed and loved vehicles by our community
					</Typography>
				</motion.div>

				<Box className="navigation-controls">
					<IconButton className="nav-btn prev-btn" id="popular-prev">
						<ArrowBackIcon />
					</IconButton>
					<IconButton className="nav-btn next-btn" id="popular-next">
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
						prevEl: '#popular-prev',
						nextEl: '#popular-next',
					}}
					pagination={{
						clickable: true,
						dynamicBullets: true,
					}}
					autoplay={{
						delay: 4000,
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
					{cars.map((car, index) => (
						<SwiperSlide key={car._id}>
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
									<Box className="card-image-container">
										<CardMedia
											component="img"
											height="240"
											image={car.carImages?.[0] ? `${REACT_APP_API_URL}/${car.carImages[0]}` : '/img/cars/default-car.jpg'}
											alt={`${car.carBrand} ${car.carModel}`}
											className="car-image"
										/>
										
										<Box className="image-overlay" />
										
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

										{car.carViews && (
											<motion.div
												initial={{ opacity: 0, scale: 0 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.3 }}
												className="car-badge"
											>
												{car.carViews} views
											</motion.div>
										)}
									</Box>

									<CardContent className="card-content">
										<Box className="car-info">
											<Typography variant="h6" className="car-title">
												{car.carBrand} {car.carModel}
											</Typography>
											<Typography variant="body2" className="car-year">
												{car.carYear} • {car.carMileage?.toLocaleString()} miles
											</Typography>
										</Box>

										<Box className="car-details">
											<Box className="detail-item">
												<Typography variant="caption" className="detail-label">
													Engine
												</Typography>
												<Typography variant="body2" className="detail-value">
													{car.carFuelType || 'Gasoline'}
												</Typography>
											</Box>
											
											<Box className="detail-item">
												<Typography variant="caption" className="detail-label">
													Category
												</Typography>
												<Typography variant="body2" className="detail-value">
													{car.carCategory}
												</Typography>
											</Box>
										</Box>

										<Box className="card-footer">
											<Typography variant="h5" className="car-price">
												{formatPrice(car.carPrice)}
											</Typography>
											<Box className="car-stats">
												<Box className="stat-item">
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

export default PopularCars;