import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Car } from '../../types/car/car';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopCarCardProps {
	car: Car;
	likeTargetCarHandler: any;
}

const TopCarCard = (props: TopCarCardProps) => {
	const { car, likeTargetCarHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (carId: string) => {
		console.log('carId:', carId);
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-card-box">
				<Box
													component="div"
													
													component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
                    onClick={() => pushDetailHandler(car._id)} 
				>
					<div>${car?.carPrice}</div>
				</Box>
				<Box component="div"   className={'info'}>
					<strong
					 className={'title'}
					 onClick={() => {
						pushDetailHandler(car._id);
					}}
					 >
						{car?.carTitle}</strong>
					<p className={'desc'}>{car?.carAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/seat.svg" alt="" />
							<span>{car?.carSeats} seats</span>
						</div>
						<div>
							<img src="/img/icons/door.svg" alt="" />
							<span>{car?.carDoors} doors</span>
						</div>
						<div>
							<img src="/img/icons/year.svg" alt="" />
							<span>{car?.carYear}</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{car.isForRent ? 'Rent' : ''} {car.isForRent && car.isBarterAvailable && '/'}{' '}
							{car.isBarterAvailable ? 'Barter' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
							<IconButton color={'default'} onClick={() => likeTargetCarHandler(car._id)}>
								{car?.meLiked && car?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{car?.carLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-card-box">
				<Box
													component="div"
													
													component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
					onClick={() => pushDetailHandler(car._id)}
				>
					<div>${car?.carPrice}</div>
				</Box>
				<Box component="div"   className={'info'}>
					<strong 
					className={'title'}
					onClick={() => {pushDetailHandler(car._id);
					}}
					>{car?.carTitle}</strong>
					<p className={'desc'}>{car?.carAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/seat.svg" alt="" />
							<span>{car?.carSeats} seats</span>
						</div>
						<div>
							<img src="/img/icons/door.svg" alt="" />
							<span>{car?.carDoors} doors</span>
						</div>
						<div>
							<img src="/img/icons/year.svg" alt="" />
							<span>{car?.carYear}</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{car.isForRent ? 'Rent' : ''} {car.isForRent && car.isBarterAvailable && '/'}{' '}
							{car.isBarterAvailable ? 'Barter' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
							<IconButton color={'default'}onClick={() => likeTargetCarHandler(car._id)}
							>
								{car?.meLiked && car?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{car?.carLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TopCarCard;