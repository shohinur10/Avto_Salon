import React, { useState } from 'react';
import { NextPage } from 'next';
import { 
	Pagination, 
	Stack, 
	Typography, 
	Card, 
	CardContent, 
	Box, 
	Chip, 
	IconButton, 
	Menu, 
	MenuItem, 
	Button,
	Paper,
	Grid,
	Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarCard } from './CarCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Car } from '../../types/car/car';
import { AgentCarsInquiry } from '../../types/car/car.input';
import { T } from '../../types/common';
import { CarStatus } from '../../enums/car.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_CAR } from '../../../apollo/user/mutation';
import { GET_AGENT_CARS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';

// Styled Components with Gold/White Theme
const GoldCard = styled(Card)(({ theme }) => ({
	backgroundColor: '#ffffff',
	border: '2px solid #FFD700',
	borderRadius: '20px',
	boxShadow: '0px 8px 32px rgba(255, 215, 0, 0.15)',
	marginBottom: '24px',
	'&:hover': {
		boxShadow: '0px 12px 40px rgba(255, 215, 0, 0.25)',
		transform: 'translateY(-2px)',
	},
	transition: 'all 0.3s ease',
}));

const CarItemCard = styled(Card)(({ theme }) => ({
	backgroundColor: '#ffffff',
	border: '1px solid #FFD700',
	borderRadius: '15px',
	boxShadow: '0px 4px 20px rgba(255, 215, 0, 0.12)',
	marginBottom: '16px',
	'&:hover': {
		boxShadow: '0px 8px 28px rgba(255, 215, 0, 0.2)',
		transform: 'translateY(-3px)',
		borderColor: '#DAA520',
	},
	transition: 'all 0.3s ease',
}));

const StatusChip = styled(Chip)(({ status }: { status: string }) => ({
	fontWeight: 600,
	borderRadius: '20px',
	...(status === 'AVAILABLE' && {
		backgroundColor: 'rgba(76, 175, 80, 0.1)',
		color: '#4CAF50',
		border: '1px solid #4CAF50',
	}),
	...(status === 'SOLD' && {
		backgroundColor: 'rgba(244, 67, 54, 0.1)',
		color: '#F44336',
		border: '1px solid #F44336',
	}),
	...(status === 'RESERVED' && {
		backgroundColor: 'rgba(255, 193, 7, 0.1)',
		color: '#FFC107',
		border: '1px solid #FFC107',
	}),
}));

const TabButton = styled(Button)<{ active?: boolean }>(({ theme, active }) => ({
	borderRadius: '15px',
	padding: '12px 24px',
	fontWeight: 600,
	textTransform: 'none',
	fontSize: '16px',
	border: '2px solid #FFD700',
	color: active ? '#ffffff' : '#DAA520',
	backgroundColor: active ? 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)' : '#ffffff',
	background: active ? 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)' : '#ffffff',
	'&:hover': {
		backgroundColor: active ? 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)' : '#fffef8',
		background: active ? 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)' : '#fffef8',
		borderColor: '#DAA520',
		transform: 'translateY(-1px)',
	},
	transition: 'all 0.3s ease',
}));

const GoldIconButton = styled(IconButton)(({ theme }) => ({
	backgroundColor: 'rgba(255, 215, 0, 0.1)',
	border: '1px solid #FFD700',
	color: '#DAA520',
	borderRadius: '12px',
	'&:hover': {
		backgroundColor: 'rgba(255, 215, 0, 0.2)',
		borderColor: '#DAA520',
		transform: 'translateY(-1px)',
	},
	transition: 'all 0.3s ease',
}));

const MyCars: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentCarsInquiry>(initialInput);
	const [agentCars, setAgentCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateCar] = useMutation(UPDATE_CAR);
	const {
		loading: getAgentCarsLoading,
		data: getAgentCarsData,
		error: getAgentCarsError,
		refetch: getAgentCarsRefetch,
	} = useQuery(GET_AGENT_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentCars(data?.getAgentCars?.list);
			setTotal(data?.getAgentCars?.metaCounter[0]?.total ?? 0);
		},
	});
	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: CarStatus) => {
		setSearchFilter({ ...searchFilter, search: { carStatus: value } });
	};

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>, carId: string) => {
		setAnchorEl(event.currentTarget);
		setSelectedCarId(carId);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedCarId(null);
	};

	const handleEditCar = async (carId: string) => {
		await router.push({
			pathname: '/mypage',
			query: { category: 'addCar', carId: carId },
		});
		handleMenuClose();
	};

	const handleViewCar = async (carId: string) => {
		await router.push({
			pathname: '/car/detail',
			query: { id: carId },
		});
		handleMenuClose();
	};

	const deleteCarHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this property?')) {
				await updateCar({
					variables: {
						input: {
							_id: id,
							CarStatus: 'DELETED',
						},
					},
				});
				await getAgentCarsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateCarHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change ${status} status?`)) {
				await updateCar({
					variables: {
						input: {
							_id: id,
							carStatus: status,
						},
					},
				});
				await getAgentCarsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>MY CARS MOBILE</div>;
	} else {
		return (
			<Box sx={{ 
				background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
				minHeight: '100vh',
				padding: '20px'
			}}>
				<Stack spacing={3} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
					{/* Header Section */}
					<GoldCard>
						<CardContent sx={{ textAlign: 'center', py: 4 }}>
							<Typography 
								variant="h3" 
								sx={{ 
									color: '#DAA520', 
									fontWeight: 700, 
									mb: 2,
									textShadow: '0px 2px 4px rgba(218, 165, 32, 0.15)'
								}}
							>
								My Cars
							</Typography>
							<Typography 
								variant="h6" 
								sx={{ 
									color: '#B8860B', 
									fontWeight: 500 
								}}
							>
								Manage your car listings with ease
							</Typography>
						</CardContent>
					</GoldCard>
					{/* Filter Tabs */}
					<GoldCard>
						<CardContent>
							<Stack direction="row" spacing={2} justifyContent="center">
								<TabButton
									active={searchFilter.search.carStatus === 'AVAILABLE'}
									onClick={() => changeStatusHandler(CarStatus.AVAILABLE)}
								>
									Available Cars ({agentCars.filter(car => car.carStatus === 'AVAILABLE').length})
								</TabButton>
								<TabButton
									active={searchFilter.search.carStatus === 'SOLD'}
									onClick={() => changeStatusHandler(CarStatus.SOLD)}
								>
									Sold Cars ({agentCars.filter(car => car.carStatus === 'SOLD').length})
								</TabButton>
							</Stack>
						</CardContent>
					</GoldCard>
					{/* Car List */}
					<Box>
						{agentCars?.length === 0 ? (
							<GoldCard>
								<CardContent sx={{ textAlign: 'center', py: 8 }}>
									<Box sx={{ mb: 3 }}>
										<img 
											src="/img/icons/icoAlert.svg" 
											alt="No cars" 
											style={{ width: 80, height: 80, opacity: 0.5 }}
										/>
									</Box>
									<Typography 
										variant="h5" 
										sx={{ color: '#B8860B', fontWeight: 600, mb: 1 }}
									>
										No Cars Found
									</Typography>
									<Typography sx={{ color: '#888' }}>
										Start by adding your first car listing
									</Typography>
								</CardContent>
							</GoldCard>
						) : (
							<Stack spacing={2}>
								{agentCars.map((car: Car) => (
									<CarItemCard key={car._id}>
										<CardContent>
											<Grid container spacing={3} alignItems="center">
												{/* Car Image */}
												<Grid item xs={12} sm={3}>
													<Box
														sx={{
															width: '100%',
															height: 120,
															borderRadius: 2,
															overflow: 'hidden',
															border: '1px solid #FFD700',
														}}
													>
														<img
															src={`${REACT_APP_API_URL}/${car.carImages[0]}`}
															alt={car.carTitle}
															style={{
																width: '100%',
																height: '100%',
																objectFit: 'cover',
															}}
														/>
													</Box>
												</Grid>

												{/* Car Details */}
												<Grid item xs={12} sm={6}>
													<Stack spacing={1}>
														<Typography 
															variant="h6" 
															sx={{ 
																color: '#DAA520', 
																fontWeight: 700,
																textTransform: 'capitalize'
															}}
														>
															{car.carTitle}
														</Typography>
														
														<Stack direction="row" alignItems="center" spacing={1}>
															<LocationOnIcon sx={{ fontSize: 16, color: '#B8860B' }} />
															<Typography sx={{ color: '#666', fontSize: '14px' }}>
																{car.carAddress}
															</Typography>
														</Stack>

														<Stack direction="row" alignItems="center" spacing={1}>
															<AttachMoneyIcon sx={{ fontSize: 16, color: '#B8860B' }} />
															<Typography 
																sx={{ 
																	color: '#DAA520', 
																	fontWeight: 600,
																	fontSize: '16px'
																}}
															>
																${formatterStr(car.carPrice)}
															</Typography>
														</Stack>

														<Stack direction="row" alignItems="center" spacing={1}>
															<CalendarTodayIcon sx={{ fontSize: 16, color: '#B8860B' }} />
															<Typography sx={{ color: '#666', fontSize: '14px' }}>
																<Moment format="DD MMMM, YYYY">{car.createdAt}</Moment>
															</Typography>
														</Stack>
													</Stack>
												</Grid>

												{/* Status & Actions */}
												<Grid item xs={12} sm={3}>
													<Stack spacing={2} alignItems="flex-end">
														<StatusChip 
															status={car.carStatus || 'AVAILABLE'}
															label={car.carStatus || 'AVAILABLE'}
														/>
														
														<Stack direction="row" alignItems="center" spacing={1}>
															<VisibilityIcon sx={{ fontSize: 16, color: '#B8860B' }} />
															<Typography sx={{ color: '#666', fontSize: '14px' }}>
																{car.carViews?.toLocaleString() || '0'} views
															</Typography>
														</Stack>

														<Stack direction="row" spacing={1}>
															<GoldIconButton 
																size="small"
																onClick={() => handleViewCar(car._id)}
																title="View Car"
															>
																<VisibilityIcon sx={{ fontSize: 18 }} />
															</GoldIconButton>
															
															<GoldIconButton 
																size="small"
																onClick={() => handleEditCar(car._id)}
																title="Edit Car"
															>
																<EditIcon sx={{ fontSize: 18 }} />
															</GoldIconButton>
															
															<GoldIconButton 
																size="small"
																onClick={(e) => handleMenuClick(e, car._id)}
																title="More Actions"
															>
																<MoreVertIcon sx={{ fontSize: 18 }} />
															</GoldIconButton>
														</Stack>
													</Stack>
												</Grid>
											</Grid>
										</CardContent>
									</CarItemCard>
								))}
							</Stack>
						)}

						{/* Menu for Actions */}
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							PaperProps={{
								sx: {
									border: '1px solid #FFD700',
									borderRadius: '12px',
									boxShadow: '0px 8px 24px rgba(255, 215, 0, 0.2)',
								},
							}}
						>
							<MenuItem 
								onClick={() => {
									if (selectedCarId) {
										updateCarHandler(CarStatus.SOLD, selectedCarId);
									}
								}}
								sx={{ color: '#DAA520', fontWeight: 500 }}
							>
								<EditIcon sx={{ mr: 1, fontSize: 18 }} />
								Mark as Sold
							</MenuItem>
							<MenuItem 
								onClick={() => {
									if (selectedCarId) {
										deleteCarHandler(selectedCarId);
									}
								}}
								sx={{ color: '#F44336', fontWeight: 500 }}
							>
								<DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
								Delete Car
							</MenuItem>
						</Menu>
					</Box>

					{/* Pagination */}
					{agentCars.length > 0 && (
						<GoldCard>
							<CardContent>
								<Stack 
									direction={{ xs: 'column', md: 'row' }} 
									justifyContent="space-between" 
									alignItems="center"
									spacing={2}
								>
									<Typography 
										sx={{ 
											color: '#DAA520', 
											fontWeight: 600,
											fontSize: '16px'
										}}
									>
										Total: {total} car{total !== 1 ? 's' : ''} available
									</Typography>
									
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										onChange={paginationHandler}
										sx={{
											'& .MuiPaginationItem-root': {
												color: '#DAA520',
												borderColor: '#FFD700',
												'&:hover': {
													backgroundColor: 'rgba(255, 215, 0, 0.1)',
												},
												'&.Mui-selected': {
													backgroundColor: '#FFD700',
													color: '#ffffff',
													'&:hover': {
														backgroundColor: '#DAA520',
													},
												},
											},
										}}
									/>
								</Stack>
							</CardContent>
						</GoldCard>
					)}
				</Stack>
			</Box>
		);
	}
};

MyCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			carStatus: 'AVAILABLE',
		},
	},
};

export default MyCars;