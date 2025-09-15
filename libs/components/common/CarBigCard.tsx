import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Car } from '../../types/car/car';
import { REACT_APP_API_URL, topCarRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface CarBigCardProps {
	car: Car;
	likeCarHandler?: any;
}

const CarBigCard = (props: CarBigCardProps) => {
	const { car, likeCarHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goCarDetailPage = (carId: string) => {
		router.push(`/car/detail?id=${carId}`);
	};

	if (device === 'mobile') {
		return <div>CAR BIG CARD</div>;
	} else {
		return (
			<Stack className="car-big-card-box" onClick={() => goCarDetailPage(car?._id)}>
                          <Box
                                  
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages?.[0]})` }}
				>
					{car && car?.carRank && car?.carRank >= topCarRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(car?.carPrice)}</div>
				</Box>
				<Box component="div"    className={'info'}>
					<strong className={'title'}>{car?.carTitle}</strong>
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
						<div>
							{car?.isForRent ? <p>Rent</p> : <span>Rent</span>}
							{car?.isBarterAvailable ? <p>Barter</p> : <span>Barter</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: { stopPropagation: () => void; }) => {
									e.stopPropagation();
									likeCarHandler(user, car?._id);
								}}
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

export default CarBigCard;