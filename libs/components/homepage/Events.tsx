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
    description: 'Discover the latest models, cutting-edge EVs, and concept cars at Korea’s biggest auto event.',
    imageSrc: 'https://via.placeholder.com/400x250?text=Seoul+Motor+Show',
  },
  {
    eventTitle: 'Tokyo Auto Salon',
    city: CarLocation.TOKYO,
    description: 'Asia’s largest tuning and custom car exhibition, featuring modified supercars and racing machines.',
    imageSrc: 'https://via.placeholder.com/400x250?text=Tokyo+Auto+Salon',
  },
  {
    eventTitle: 'Paris Motor Show',
    city: CarLocation.PARIS,
    description: 'One of the world’s oldest auto shows, showcasing luxury brands and future automotive technology.',
    imageSrc: 'https://via.placeholder.com/400x250?text=Paris+Motor+Show',
  },
  {
    eventTitle: 'Los Angeles Auto Show',
    city: CarLocation.LOS_ANGELES,
    description: 'A massive auto exhibition featuring global debuts, electric cars, and celebrity appearances.',
    imageSrc: 'https://via.placeholder.com/400x250?text=LA+Auto+Show',
  },
  {
    eventTitle: 'Dubai International Motor Show',
    city: CarLocation.DUBAI,
    description: 'Luxury hypercars, exotic supercars, and the latest from the world’s top automotive brands.',
    imageSrc: 'https://via.placeholder.com/400x250?text=Dubai+Motor+Show',
  },
];


const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{getLocationDisplayName(event?.city)}</strong>
					<span>{event?.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Events</span>
							<p className={'white'}>Events waiting your attention!</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
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