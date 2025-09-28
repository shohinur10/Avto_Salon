import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Car } from '../../types/car/car';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';

interface PorscheStyleCardsProps {
	cars: Car[];
	onLikeToggle?: (carId: string, isLiked: boolean) => void;
}

const PorscheStyleCards: React.FC<PorscheStyleCardsProps> = ({ cars = [] }) => {
	const router = useRouter();

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

	// Take only the first 3 cars for the Porsche-style layout
	const displayCars = cars.slice(0, 3);

	if (!displayCars || displayCars.length === 0) {
		return null;
	}

	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className="porsche-style-cards"
		>
			<Box component="div" className="porsche-cards-container">
				{displayCars.map((car, index) => (
					<motion.div
						key={`porsche-card-${car._id}`}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.1 * index }}
						whileHover={{ scale: 1.02 }}
						className="porsche-card-wrapper"
					>
						<Box 
							component="div"
							className="porsche-card"
							onClick={() => handleCarClick(car._id)}
						>
							<Box component="div" className="card-image-container">
								<img
									src={car.carImages?.[0] ? `${REACT_APP_API_URL}/${car.carImages[0]}` : '/img/cars/default-car.jpg'}
									alt={`${car.brand} ${car.carTitle}`}
									className="porsche-card-image"
								/>
								
								<Box component="div" className="card-overlay" />
								
								<Box component="div" className="card-content-overlay">
									<Typography variant="h3" className="card-title">
										{car.brand} {car.carTitle}
									</Typography>
									<Typography variant="body1" className="card-subtitle">
										{car.carYear} • {formatPrice(car.carPrice)}
									</Typography>
									
									<Box component="div" className="card-arrow">
										<ArrowForwardIcon className="arrow-icon" />
									</Box>
								</Box>
							</Box>
						</Box>
					</motion.div>
				))}
			</Box>

			{/* Technical Specifications Section */}
			<Box component="div" className="technical-specs">
				{displayCars.map((car, index) => (
					<Box key={`specs-${car._id}`} component="div" className="spec-item">
						<Typography variant="body2" className="spec-text">
							{car.brand} {car.carTitle}: Electric energy consumption combined: 20.3 - 18.0 kWh/100 km, CO2-emissions combined: 0 g/km
						</Typography>
					</Box>
				))}
			</Box>
		</motion.section>
	);
};

export default PorscheStyleCards;
