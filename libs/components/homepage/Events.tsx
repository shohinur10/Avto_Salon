import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CarLocation } from '../../enums/car.enum';
import { getLocationDisplayName } from '../../utils/locationHelper';


interface EventData {
  eventTitle: string;
  city: CarLocation;
  description: string;
  imageSrc: string;
}

const eventsData: EventData[] = [
  {
    eventTitle: 'Seoul International Motor Show',
    city: CarLocation.SEOUL,
    description: 'Discover the latest models, cutting-edge EVs, and concept cars at Korea\'s biggest auto event.',
    imageSrc: '/img/events/Seoul.webp',
  },
  {
    eventTitle: 'Tokyo Auto Salon',
    city: CarLocation.TOKYO,
    description: 'Asia\'s largest tuning and custom car exhibition, featuring modified supercars and racing machines.',
    imageSrc: '/img/events/Tokyo.webp',
  },
  {
    eventTitle: 'Paris Motor Show',
    city: CarLocation.PARIS,
    description: 'One of the world\'s oldest auto shows, showcasing luxury brands and future automotive technology.',
    imageSrc: '/img/events/Paris.webp',
  },
  {
    eventTitle: 'Los Angeles Auto Show',
    city: CarLocation.LOS_ANGELES,
    description: 'A massive auto exhibition featuring global debuts, electric cars, and celebrity appearances.',
    imageSrc: '/img/events/LOS_ANGELES.webp',
  },
  {
    eventTitle: 'Dubai International Motor Show',
    city: CarLocation.DUBAI,
    description: 'Luxury hypercars, exotic supercars, and the latest from the world\'s top automotive brands.',
    imageSrc: '/img/events/Dubai.webp',
  },
];


const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack
				className="event-card mobile-event-card"
				sx={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					borderRadius: '16px',
					padding: '16px',
					minHeight: '200px',
					color: 'white',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					margin: '12px',
					position: 'relative',
					overflow: 'hidden',
					cursor: 'pointer',
					transition: 'transform 0.3s ease, box-shadow 0.3s ease',
					'&:hover': {
						transform: 'translateY(-4px)',
						boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
					}
				}}
			>
				<Box component="div"    className="mobile-event-info">
					<Box component="div"    sx={{ 
						fontSize: '14px', 
						fontWeight: 600, 
						color: '#FFD700',
						textTransform: 'uppercase',
						letterSpacing: '1px',
						marginBottom: '8px'
					}}>
						{getLocationDisplayName(event?.city)}
					</Box>
					<Box component="div"    sx={{ 
						fontSize: '18px', 
						fontWeight: 700, 
						lineHeight: '1.3',
						marginBottom: '12px'
					}}>
						{event?.eventTitle}
					</Box>
				</Box>
				<Box component="div"    sx={{ 
					fontSize: '14px', 
					opacity: 0.9,
					lineHeight: '1.4'
				}}>
					{event?.description}
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack
				className="event-card"
				sx={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					borderRadius: '20px',
					padding: '32px',
					minHeight: '350px',
					color: 'white',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					position: 'relative',
					overflow: 'hidden',
					cursor: 'pointer',
					transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					'&:hover': {
						transform: 'translateY(-8px) scale(1.02)',
						boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
						'& .event-overlay': {
							opacity: 1,
						}
					},
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
						opacity: 0,
						transition: 'opacity 0.3s ease',
					},
					'&:hover::before': {
						opacity: 1,
					}
				}}
			>
				<Box component="div"    className="event-info">
					<Box component="div"    sx={{ 
						fontSize: '16px', 
						fontWeight: 600, 
						color: '#FFD700',
						textTransform: 'uppercase',
						letterSpacing: '2px',
						marginBottom: '12px'
					}}>
						{getLocationDisplayName(event?.city)}
					</Box>
					<Box component="div"    sx={{ 
						fontSize: '28px', 
						fontWeight: 700, 
						lineHeight: '1.2',
						textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
					}}>
						{event?.eventTitle}
					</Box>
				</Box>
				<Box component="div"    
					className="event-overlay"
					sx={{ 
						fontSize: '16px', 
						opacity: 0,
						lineHeight: '1.5',
						textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
						transition: 'opacity 0.3s ease',
						background: 'rgba(0, 0, 0, 0.7)',
						padding: '16px',
						borderRadius: '12px',
						backdropFilter: 'blur(10px)'
					}}
				>
					{event?.description}
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack 
				className="events mobile-events"
				sx={{
					padding: '40px 16px',
					background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
					color: 'white'
				}}
			>
				<Box component="div"    sx={{ textAlign: 'center', marginBottom: '32px' }}>
					<Box component="div"    sx={{ 
						fontSize: '32px', 
						fontWeight: 700, 
						marginBottom: '12px',
						background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text'
					}}>
						Events
					</Box>
					<Box component="div"    sx={{ 
						fontSize: '16px', 
						opacity: 0.8,
						lineHeight: '1.5'
					}}>
						Exclusive automotive events waiting for your attention!
					</Box>
				</Box>
				<Stack spacing={2}>
					{eventsData.map((event: EventData) => {
						return <EventCard event={event} key={event?.eventTitle} />;
					})}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack 
				className="events"
				sx={{
					padding: '80px 0',
					background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
					color: 'white',
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
						pointerEvents: 'none'
					}
				}}
			>
				<Stack 
					className="container"
					sx={{
						maxWidth: '1400px',
						margin: '0 auto',
						padding: '0 40px',
						position: 'relative',
						zIndex: 1
					}}
				>
					<Stack 
						className="info-box"
						sx={{
							textAlign: 'center',
							marginBottom: '60px'
						}}
					>
						<Box component="div"    sx={{ 
							fontSize: '48px', 
							fontWeight: 700, 
							marginBottom: '16px',
							background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)'
						}}>
							Exclusive Events
						</Box>
						<Box component="div"    sx={{ 
							fontSize: '20px', 
							opacity: 0.8,
							lineHeight: '1.6',
							maxWidth: '600px',
							margin: '0 auto'
						}}>
							Discover world-class automotive exhibitions and luxury car shows around the globe
						</Box>
					</Stack>
					<Stack 
						className="card-wrapper"
						sx={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
							gap: '24px',
							'@media (max-width: 768px)': {
								gridTemplateColumns: '1fr',
								gap: '16px'
							}
						}}
					>
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;