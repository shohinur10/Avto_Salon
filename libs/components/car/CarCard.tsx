import React from 'react';
import { Stack, Typography, Box, Chip, IconButton, Tooltip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Car } from '../../types/car/car';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topCarRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface CarCardType {
	car: Car;
	likeCarHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const CarCard = (props: CarCardType) => {
	const { car, likeCarHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	
	const imagePath: string = car?.carImages[0]
		? car?.carImages[0].startsWith('http') 
			? car?.carImages[0]
			: car?.carImages[0].startsWith('/') 
				? car?.carImages[0]
				: `/${car?.carImages[0]}`
		: '/img/banner/header1.svg';

	const handleLikeClick = () => {
		if (likeCarHandler && user) {
			likeCarHandler(user, car._id);
		}
	};

	if (device === 'mobile') {
		return <div>CAR CARD</div>;
	} else {
		return (
			<Box component="div"   className="car-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				{/* Card Header with Image */}
				<Box component="div"   className="card-header" sx={{ position: 'relative', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
					<Link
						href={{
							pathname: '/car/detail',
							query: { id: car?._id },
						}}
						style={{ display: 'block', textDecoration: 'none' }}
					>
						<Box
							component="img"
							src={imagePath}
							alt={car?.carTitle || 'Car Image'}
							sx={{
								width: '100%',
								height: '200px',
								objectFit: 'cover',
								transition: 'transform 0.3s ease',
								'&:hover': {
									transform: 'scale(1.05)',
								},
							}}
						/>
					</Link>
					
					{/* Top Badge */}
					{car && car?.carRank && car?.carRank > topCarRank && (
						<Box component="div"   className="top-badge" sx={{
							position: 'absolute',
							top: '12px',
							left: '12px',
							background: 'linear-gradient(45deg, #FFD700, #FFA500)',
							color: 'white',
							padding: '4px 8px',
							borderRadius: '20px',
							display: 'flex',
							alignItems: 'center',
							gap: '4px',
							fontSize: '0.75rem',
							fontWeight: 'bold',
							boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
						}}>
                                                    <Box component="img" src="/img/icons/electricity.svg" alt="" sx={{ width: '16px', height: '16px' }} />
							<Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>TOP</Typography>
						</Box>
					)}

					{/* Price Box */}
					<Box component="div"   className="price-box" sx={{
						position: 'absolute',
						bottom: '12px',
						right: '12px',
						background: 'rgba(0,0,0,0.8)',
						color: 'white',
						padding: '8px 12px',
						borderRadius: '20px',
						fontWeight: 'bold',
						fontSize: '1.1rem',
						backdropFilter: 'blur(10px)',
					}}>
						${formatterStr(car?.carPrice)}
					</Box>

					{/* Like Button */}
					<IconButton
						onClick={handleLikeClick}
						sx={{
							position: 'absolute',
							top: '12px',
							right: '12px',
							background: 'rgba(255,255,255,0.9)',
							'&:hover': {
								background: 'rgba(255,255,255,1)',
							},
						}}
					>
						{car?.carLikes && car.carLikes > 0 ? (
							<FavoriteIcon sx={{ color: '#e91e63' }} />
						) : (
							<FavoriteBorderIcon sx={{ color: '#666' }} />
						)}
					</IconButton>
				</Box>

				{/* Card Body */}
				<Box component="div"   className="card-body" sx={{ 
					flex: 1, 
					display: 'flex', 
					flexDirection: 'column', 
					padding: '16px',
					background: 'white',
					borderRadius: '0 0 12px 12px',
				}}>
					{/* Car Title and Location */}
					<Box component="div"   className="car-info" sx={{ marginBottom: '16px' }}>
													<Link
							href={{
								pathname: '/car/detail',
								query: { id: car?._id },
							}}
							style={{ textDecoration: 'none' }}
						>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: '600', 
									color: '#333',
									marginBottom: '8px',
									lineHeight: '1.3',
									'&:hover': {
										color: '#667eea',
									},
									transition: 'color 0.2s ease',
								}}
							>
								{car.carTitle}
							</Typography>
							</Link>
						
						<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
							<LocationOnIcon sx={{ fontSize: '16px' }} />
							<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
								{car.carAddress}, {car.carLocation}
							</Typography>
						</Box>
					</Box>

					{/* Car Specifications */}
					<Box component="div"   className="car-specs" sx={{ marginBottom: '16px' }}>
						<Box component="div"   sx={{ 
							display: 'grid', 
							gridTemplateColumns: 'repeat(2, 1fr)', 
							gap: '12px',
							marginBottom: '16px'
						}}>
							<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<DirectionsCarIcon sx={{ fontSize: '18px', color: '#667eea' }} />
								<Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555' }}>
									{car.carSeats} seats
								</Typography>
							</Box>
							<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<DirectionsCarIcon sx={{ fontSize: '18px', color: '#667eea' }} />
								<Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555' }}>
									{car.carDoors} doors
								</Typography>
							</Box>
							<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<EventIcon sx={{ fontSize: '18px', color: '#667eea' }} />
								<Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555' }}>
									{car.carYear}
								</Typography>
							</Box>
					{car.carMileage && (
								<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<SpeedIcon sx={{ fontSize: '18px', color: '#667eea' }} />
									<Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#555' }}>
										{car.carMileage.toLocaleString()} mi
									</Typography>
								</Box>
							)}
						</Box>
					</Box>

					{/* Transaction Type and Status */}
					<Box component="div"   className="car-status" sx={{ marginTop: 'auto' }}>
						<Box component="div"   sx={{ 
							display: 'flex', 
							justifyContent: 'space-between', 
							alignItems: 'center',
							paddingTop: '16px',
							borderTop: '1px solid #f0f0f0'
						}}>
							<Box component="div"   sx={{ display: 'flex', gap: '8px' }}>
								<Chip
									label={car.carTransactionType}
									size="small"
									variant="outlined"
									sx={{ 
										borderColor: car.isForRent ? '#4caf50' : '#ff9800',
										color: car.isForRent ? '#4caf50' : '#ff9800',
										fontWeight: '500',
									}}
								/>
								<Chip
									label={car.carCategory}
									size="small"
									variant="outlined"
									sx={{ 
										borderColor: '#667eea',
										color: '#667eea',
										fontWeight: '500',
									}}
								/>
							</Box>
							
							{/* Views and Likes */}
							<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#999' }}>
								{car.carViews && (
									<Tooltip title="Views">
										<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
											<RemoveRedEyeIcon sx={{ fontSize: '16px' }} />
											<Typography variant="caption">{car.carViews}</Typography>
										</Box>
									</Tooltip>
								)}
								{car.carLikes && (
									<Tooltip title="Likes">
										<Box component="div"   sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
											<FavoriteIcon sx={{ fontSize: '16px', color: '#e91e63' }} />
											<Typography variant="caption">{car.carLikes}</Typography>
										</Box>
									</Tooltip>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}
};

export default CarCard;
