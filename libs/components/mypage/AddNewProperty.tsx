import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { 
	Button, 
	Stack, 
	Typography, 
	TextField, 
	Select, 
	MenuItem, 
	FormControl, 
	InputLabel, 
	Box,
	Switch,
	FormControlLabel,
	Chip,
	IconButton,
	Card,
	CardContent,
	Divider,
	Paper,
	CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import useDeviceDetect from '../../hooks/useDeviceDetect';

import { carYear, REACT_APP_API_URL } from '../../config';

import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CarInput } from '../../types/car/car.input';
import { 
	CarCategory, 
	CarLocation, 
	CarTransactionType, 
	CarBrand,
	FuelType,
	TransmissionType,
	CarCondition 
} from '../../enums/car.enum';
import { CREATE_CAR, UPDATE_CAR } from '../../../apollo/user/mutation';
import { GET_CAR } from '../../../apollo/user/query';

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

const GoldTextField = styled(TextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		backgroundColor: '#ffffff',
		borderRadius: '12px',
		'& fieldset': {
			borderColor: '#FFD700',
			borderWidth: '2px',
		},
		'&:hover fieldset': {
			borderColor: '#DAA520',
		},
		'&.Mui-focused fieldset': {
			borderColor: '#B8860B',
		},
	},
	'& .MuiInputLabel-root': {
		color: '#B8860B',
		fontWeight: 600,
		'&.Mui-focused': {
			color: '#DAA520',
		},
	},
	'& .MuiInputBase-input': {
		color: '#333',
		fontWeight: 500,
	},
}));

const GoldFormControl = styled(FormControl)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		backgroundColor: '#ffffff',
		borderRadius: '12px',
		'& fieldset': {
			borderColor: '#FFD700',
			borderWidth: '2px',
		},
		'&:hover fieldset': {
			borderColor: '#DAA520',
		},
		'&.Mui-focused fieldset': {
			borderColor: '#B8860B',
		},
	},
	'& .MuiInputLabel-root': {
		color: '#B8860B',
		fontWeight: 600,
		'&.Mui-focused': {
			color: '#DAA520',
		},
	},
}));

const GoldButton = styled(Button)(({ theme }) => ({
	backgroundColor: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
	background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
	color: '#ffffff',
	borderRadius: '15px',
	padding: '12px 32px',
	fontWeight: 700,
	fontSize: '16px',
	textTransform: 'none',
	boxShadow: '0px 4px 12px rgba(255, 215, 0, 0.3)',
	border: 'none',
	'&:hover': {
		background: 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)',
		boxShadow: '0px 6px 20px rgba(255, 215, 0, 0.4)',
		transform: 'translateY(-2px)',
	},
	'&:disabled': {
		background: '#E5E5E5',
		color: '#999',
		boxShadow: 'none',
	},
	transition: 'all 0.3s ease',
}));

const ImageUploadBox = styled(Box)(({ theme }) => ({
	border: '3px dashed #FFD700',
	borderRadius: '20px',
	padding: '40px',
	textAlign: 'center',
	backgroundColor: '#fefefe',
	cursor: 'pointer',
	transition: 'all 0.3s ease',
	'&:hover': {
		borderColor: '#DAA520',
		backgroundColor: '#fffef8',
		transform: 'translateY(-2px)',
	},
}));

const AddCar = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertCarData, setInsertCarData] = useState<CarInput>(initialValues);
	const [carType, setCarType] = useState<CarCategory[]>(Object.values(CarCategory));
	const [carLocation, setCarLocation] = useState<CarLocation[]>(Object.values(CarLocation));
	const [carBrands] = useState<CarBrand[]>(Object.values(CarBrand));
	const [transactionTypes] = useState<CarTransactionType[]>(Object.values(CarTransactionType));
	const [fuelTypes] = useState<FuelType[]>(Object.values(FuelType));
	const [transmissionTypes] = useState<TransmissionType[]>(Object.values(TransmissionType));
	const [carConditions] = useState<CarCondition[]>(Object.values(CarCondition));
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/

	const [createCar] = useMutation(CREATE_CAR);
	const [updateCar] = useMutation(UPDATE_CAR);
	const {
		loading: getCarLoading,
		data: getCarData,
		error: getCarError,
		refetch: getCarRefetch,
	} = useQuery(GET_CAR, {
		fetchPolicy: 'network-only',
		variables: {
			input: router.query.carId,
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (getCarData?.getCar) {
			setInsertCarData(getCarData?.getCar);
		}
	}, [getCarData]);

	/** HANDLERS **/

	async function uploadImages() {
		try {
			setIsUploading(true);
			setUploadProgress(0);

			const files = inputRef.current.files;
			if (!files || files.length === 0) {
				setIsUploading(false);
				return;
			}

			const responseImages: string[] = [];
			
			// Upload each file individually using GraphQL mutation
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				
				// Update progress based on current file
				const currentProgress = Math.round(((i + 0.5) / files.length) * 100);
				setUploadProgress(currentProgress);

				const formData = new FormData();
				formData.append(
					'operations',
					JSON.stringify({
						query: `mutation ImageUploader($file: Upload!, $target: String!) {
							imageUploader(file: $file, target: $target) 
						}`,
						variables: {
							file: null,
							target: 'car',
						},
					}),
				);
				formData.append(
					'map',
					JSON.stringify({
						'0': ['variables.file'],
					}),
				);
				formData.append('0', file);

				const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
						'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
				});

				const responseImage = response.data.data.imageUploader;
				if (responseImage) {
					responseImages.push(responseImage);
				}
			}

			setInsertCarData({ ...insertCarData, carImages: [...insertCarData.carImages, ...responseImages] });
			setIsUploading(false);
			setUploadProgress(100);
			
			// Clear progress after a short delay
			setTimeout(() => setUploadProgress(0), 1000);
		} catch (err: any) {
			console.log('err: ', err.message);
			setIsUploading(false);
			setUploadProgress(0);
			await sweetMixinErrorAlert(err.message || 'Failed to upload images. Please try again.');
		}
	}

	const doDisabledCheck = () => {
		if (
			insertCarData.carTitle === '' ||
			insertCarData.carPrice === 0 ||
			insertCarData.carCategory === CarCategory.CAR ||
			insertCarData.carLocation === CarLocation.CAR ||
			insertCarData.carAddress === '' ||
			insertCarData.carDoors === 0 ||
			insertCarData.carSeats === 0 ||
			insertCarData.carYear === 0 ||
			insertCarData.carDesc === '' ||
			insertCarData.carImages.length === 0
		) {
			return true;
		}
	};

	const insertCarHandler = useCallback(async () => {
		try {
			const result = await createCar({
				variables: {
					input: insertCarData,
				},
			});
			await sweetMixinSuccessAlert('This car has been created successfully ');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProperties',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertCarData]);

	const updateCarHandler = useCallback(async () => {
		try {
			//@ts-ignore
			insertCarData._id = getCarData?.getCar?._id;
			const result = await updateCar({
				variables: {
					input: insertCarData,
				},
			});
			await sweetMixinSuccessAlert('This car has been updated successfully');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProperties',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertCarData]);

	// Redirect if user is not an agent
	useEffect(() => {
		if (user?._id && user?.memberType !== 'AGENT') {
			sweetMixinErrorAlert('Only agents can add cars').then(() => {
				router.push('/');
			});
		}
	}, [user, router]);

	console.log('+insertCarData', insertCarData);

	// Show loading while authentication is being checked
	if (!user?._id) {
		return (
			<Box sx={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				minHeight: '50vh' 
			}}>
				<Stack alignItems="center" spacing={2}>
					<CircularProgress sx={{ color: '#FFD700' }} />
					<Typography sx={{ color: '#B8860B' }}>
						Loading user authentication...
					</Typography>
				</Stack>
			</Box>
		);
	}

	if (device === 'mobile') {
		return <div>ADD NEW CAR MOBILE PAGE</div>;
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
								{getCarData?.getCar ? 'Edit Car' : 'Add New Car'}
							</Typography>
							<Typography 
								variant="h6" 
								sx={{ 
									color: '#B8860B', 
									fontWeight: 500 
								}}
							>
								Create your perfect car listing with our premium form
							</Typography>
						</CardContent>
					</GoldCard>

					{/* Basic Information */}
					<GoldCard>
						<CardContent>
							<Typography 
								variant="h5" 
								sx={{ 
									color: '#DAA520', 
									fontWeight: 600, 
									mb: 3,
									borderBottom: '2px solid #FFD700',
									pb: 1
								}}
							>
								Basic Information
							</Typography>
							
							<Stack spacing={3}>
								<Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
									<GoldTextField
										fullWidth
										label="Car Title"
										placeholder="Enter car title"
										value={insertCarData.carTitle}
										onChange={({ target: { value } }) =>
											setInsertCarData({ ...insertCarData, carTitle: value })
										}
									/>
									
									<GoldFormControl fullWidth>
										<InputLabel>Brand</InputLabel>
										<Select
											value={insertCarData.brand || ''}
											label="Brand"
											onChange={({ target: { value } }) =>
												setInsertCarData({ ...insertCarData, brand: value as string })
											}
										>
											{carBrands.map((brand) => (
												<MenuItem key={brand} value={brand}>
													{brand.replace('_', ' ')}
												</MenuItem>
											))}
										</Select>
									</GoldFormControl>
								</Stack>

								<Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
									<GoldFormControl fullWidth>
										<InputLabel>Transaction Type</InputLabel>
										<Select
											value={insertCarData.carTransactionType || ''}
											label="Transaction Type"
											onChange={({ target: { value } }) =>
												setInsertCarData({ ...insertCarData, carTransactionType: value as CarTransactionType })
											}
										>
											{transactionTypes.map((type) => (
												<MenuItem key={type} value={type}>
													{type}
												</MenuItem>
											))}
										</Select>
									</GoldFormControl>

									<GoldFormControl fullWidth>
										<InputLabel>Category</InputLabel>
										<Select
											value={insertCarData.carCategory || ''}
											label="Category"
											onChange={({ target: { value } }) =>
												setInsertCarData({ ...insertCarData, carCategory: value as CarCategory })
											}
										>
											{carType.map((type) => (
												<MenuItem key={type} value={type}>
													{type}
												</MenuItem>
											))}
										</Select>
									</GoldFormControl>
								</Stack>
							</Stack>
						</CardContent>
					</GoldCard>

					{/* Pricing & Location */}
					<GoldCard>
						<CardContent>
							<Typography 
								variant="h5" 
								sx={{ 
									color: '#DAA520', 
									fontWeight: 600, 
									mb: 3,
									borderBottom: '2px solid #FFD700',
									pb: 1
								}}
							>
								Pricing & Location
							</Typography>
							
							<Stack spacing={3}>
								<Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
									<GoldTextField
										fullWidth
										label="Price ($)"
										type="number"
										placeholder="Enter price"
										value={insertCarData.carPrice || ''}
										onChange={({ target: { value } }) =>
											setInsertCarData({ ...insertCarData, carPrice: parseInt(value) || 0 })
										}
									/>
									
									<GoldFormControl fullWidth>
										<InputLabel>Location</InputLabel>
										<Select
											value={insertCarData.carLocation || ''}
											label="Location"
											onChange={({ target: { value } }) =>
												setInsertCarData({ ...insertCarData, carLocation: value as CarLocation })
											}
										>
											{carLocation.map((location) => (
												<MenuItem key={location} value={location}>
													{/* Display the enum value (readable text) but use enum key for backend */}
													{location === CarLocation.LOS_ANGELES ? 'Los Angeles' :
													 location === CarLocation.NEW_YORK ? 'New York' :
													 location === CarLocation.RIO_DE_JANEIRO ? 'Rio de Janeiro' :
													 location === CarLocation.CAR ? 'Select Location' :
													 location}
												</MenuItem>
											))}
										</Select>
									</GoldFormControl>
								</Stack>

								<GoldTextField
									fullWidth
									label="Address"
									placeholder="Enter detailed address"
									value={insertCarData.carAddress}
									onChange={({ target: { value } }) =>
										setInsertCarData({ ...insertCarData, carAddress: value })
									}
								/>
							</Stack>
						</CardContent>
					</GoldCard>

					{/* Vehicle Specifications */}
					<GoldCard>
						<CardContent>
							<Typography 
								variant="h5" 
								sx={{ 
									color: '#DAA520', 
									fontWeight: 600, 
									mb: 3,
									borderBottom: '2px solid #FFD700',
									pb: 1
								}}
							>
								Vehicle Specifications
							</Typography>
							
							<Stack spacing={3}>
								<Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
									<GoldTextField
										fullWidth
										label="Year"
										type="number"
										placeholder="Enter year"
										value={insertCarData.carYear || ''}
										onChange={({ target: { value } }) =>
											setInsertCarData({ ...insertCarData, carYear: parseInt(value) || 0 })
										}
									/>
									
									<GoldTextField
										fullWidth
										label="Mileage"
										type="number"
										placeholder="Enter mileage"
										value={insertCarData.carMileage || ''}
										onChange={({ target: { value } }) =>
											setInsertCarData({ ...insertCarData, carMileage: parseInt(value) || 0 })
										}
									/>
								</Stack>

								<Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
									<GoldTextField
										fullWidth
										label="Doors"
										type="number"
										placeholder="Number of doors"
										value={insertCarData.carDoors || ''}
										onChange={({ target: { value } }) =>
											setInsertCarData({ ...insertCarData, carDoors: parseInt(value) || 0 })
										}
									/>
									
									<GoldTextField
										fullWidth
										label="Seats"
										type="number"
										placeholder="Number of seats"
										value={insertCarData.carSeats || ''}
										onChange={({ target: { value } }) =>
											setInsertCarData({ ...insertCarData, carSeats: parseInt(value) || 0 })
										}
									/>
								</Stack>
							</Stack>
						</CardContent>
					</GoldCard>

					{/* Additional Options */}
					<GoldCard>
						<CardContent>
							<Typography 
								variant="h5" 
								sx={{ 
									color: '#DAA520', 
									fontWeight: 600, 
									mb: 3,
									borderBottom: '2px solid #FFD700',
									pb: 1
								}}
							>
								Additional Options
							</Typography>
							
							<Stack spacing={3}>
								<Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
									<FormControlLabel
										control={
											<Switch
												checked={insertCarData.isBarterAvailable || false}
												onChange={(e) =>
													setInsertCarData({ ...insertCarData, isBarterAvailable: e.target.checked })
												}
												sx={{
													'& .MuiSwitch-switchBase.Mui-checked': {
														color: '#FFD700',
													},
													'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
														backgroundColor: '#DAA520',
													},
												}}
											/>
										}
										label={
											<Typography sx={{ color: '#B8860B', fontWeight: 600 }}>
												Barter Available
											</Typography>
										}
									/>
									
									<FormControlLabel
										control={
											<Switch
												checked={insertCarData.isForRent || false}
												onChange={(e) =>
													setInsertCarData({ ...insertCarData, isForRent: e.target.checked })
												}
												sx={{
													'& .MuiSwitch-switchBase.Mui-checked': {
														color: '#FFD700',
													},
													'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
														backgroundColor: '#DAA520',
													},
												}}
											/>
										}
										label={
											<Typography sx={{ color: '#B8860B', fontWeight: 600 }}>
												Available for Rent
											</Typography>
										}
									/>
								</Stack>
							</Stack>
						</CardContent>
					</GoldCard>

					{/* Description */}
					<GoldCard>
						<CardContent>
							<Typography 
								variant="h5" 
								sx={{ 
									color: '#DAA520', 
									fontWeight: 600, 
									mb: 3,
									borderBottom: '2px solid #FFD700',
									pb: 1
								}}
							>
								Description
							</Typography>
							
							<GoldTextField
								fullWidth
								multiline
								rows={4}
								label="Car Description"
								placeholder="Enter detailed description of your car..."
								value={insertCarData.carDesc}
								onChange={({ target: { value } }) => 
									setInsertCarData({ ...insertCarData, carDesc: value })
								}
							/>
						</CardContent>
					</GoldCard>

					{/* Image Upload */}
					<GoldCard>
						<CardContent>
							<Typography 
								variant="h5" 
								sx={{ 
									color: '#DAA520', 
									fontWeight: 600, 
									mb: 3,
									borderBottom: '2px solid #FFD700',
									pb: 1
								}}
							>
								Car Images
							</Typography>
							
							<input
								type="file"
								ref={inputRef}
								multiple={true}
								accept="image/*"
								onChange={uploadImages}
								style={{ display: 'none' }}
							/>
							
							<ImageUploadBox onClick={() => inputRef.current?.click()}>
								{isUploading ? (
									<Stack alignItems="center" spacing={2}>
										<CircularProgress 
											variant="determinate" 
											value={uploadProgress}
											sx={{ color: '#FFD700' }}
										/>
										<Typography sx={{ color: '#B8860B', fontWeight: 600 }}>
											Uploading... {uploadProgress}%
										</Typography>
									</Stack>
								) : (
									<Stack alignItems="center" spacing={2}>
										<AddPhotoAlternateIcon 
											sx={{ fontSize: 48, color: '#FFD700' }} 
										/>
										<Typography 
											variant="h6" 
											sx={{ color: '#DAA520', fontWeight: 600 }}
										>
											Click to Upload Images
										</Typography>
										<Typography sx={{ color: '#B8860B' }}>
											Support: JPG, PNG, GIF (Max 5MB each)
										</Typography>
									</Stack>
								)}
							</ImageUploadBox>

							{/* Image Preview */}
							{insertCarData.carImages.length > 0 && (
								<Box sx={{ mt: 3 }}>
									<Typography 
										variant="h6" 
										sx={{ color: '#DAA520', fontWeight: 600, mb: 2 }}
									>
										Uploaded Images ({insertCarData.carImages.length})
									</Typography>
									<Stack 
										direction="row" 
										spacing={2} 
										sx={{ flexWrap: 'wrap', gap: 2 }}
									>
										{insertCarData.carImages.map((image: string, index: number) => (
											<Paper
												key={index}
												sx={{
													position: 'relative',
													width: 120,
													height: 120,
													borderRadius: 3,
													overflow: 'hidden',
													border: '2px solid #FFD700',
												}}
											>
												<img
													src={`${REACT_APP_API_URL}/${image}`}
													alt={`Car ${index + 1}`}
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
													}}
												/>
												<IconButton
													size="small"
													sx={{
														position: 'absolute',
														top: 4,
														right: 4,
														backgroundColor: 'rgba(255, 255, 255, 0.9)',
														'&:hover': {
															backgroundColor: 'rgba(255, 255, 255, 1)',
														},
													}}
													onClick={() => {
														const newImages = insertCarData.carImages.filter((_, i) => i !== index);
														setInsertCarData({ ...insertCarData, carImages: newImages });
													}}
												>
													<DeleteIcon sx={{ fontSize: 16, color: '#ff4444' }} />
												</IconButton>
											</Paper>
										))}
									</Stack>
								</Box>
							)}
						</CardContent>
					</GoldCard>

					{/* Submit Button */}
					<Box sx={{ textAlign: 'center', mt: 4 }}>
						<GoldButton
							size="large"
							disabled={doDisabledCheck() || isUploading}
							onClick={getCarData?.getCar ? updateCarHandler : insertCarHandler}
							sx={{ px: 6, py: 2 }}
						>
							{isUploading ? (
								<>
									<CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
									Uploading...
								</>
							) : (
								getCarData?.getCar ? 'Update Car' : 'Add Car'
							)}
						</GoldButton>
					</Box>
				</Stack>
			</Box>
		);
	}
};

AddCar.defaultProps = {
	initialValues: {
		carTransactionType: CarTransactionType.BUY,
		carTitle: '',
		brand: '',
		carPrice: 0,
		carCategory: CarCategory.SEDAN,
		carLocation: CarLocation.NEW_YORK,
		carAddress: '',
		isBarterAvailable: false,
		isForRent: false,
		carDoors: 4,
		carSeats: 5,
		carYear: new Date().getFullYear(),
		carMileage: 0,
		carDesc: '',
		carImages: [],
	},
};

export default AddCar;