import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	Slider,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarCategory, CarLocation, CarTransactionType, FuelType, TransmissionType } from '../../enums/car.enum';
import { CarsInquiry } from '../../types/car/car.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: CarsInquiry;
	setSearchFilter: any;
	initialInput: CarsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	
	// State for filter options
	const [carLocation, setCarLocation] = useState<CarLocation[]>(Object.values(CarLocation));
	const [carCategory, setCarCategory] = useState<CarCategory[]>(Object.values(CarCategory));
	const [fuelTypes, setFuelTypes] = useState<FuelType[]>(Object.values(FuelType));
	const [transactionTypes, setTransactionTypes] = useState<CarTransactionType[]>(Object.values(CarTransactionType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);
	const [priceRange, setPriceRange] = useState<number[]>([0, 500000]);
	const [yearRange, setYearRange] = useState<number[]>([1990, 2024]);
	const [mileageRange, setMileageRange] = useState<number[]>([0, 200000]);

	// Popular car brands
	const popularBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Honda', 'Ford', 'Volkswagen', 'Hyundai', 'Nissan', 'Chevrolet'];
	
	// Seats and doors options
	const seatsOptions = [2, 4, 5, 7, 8];
	const doorsOptions = [2, 3, 4, 5];

	/** LIFECYCLES **/
	useEffect(() => {
		// Clean up empty filters and update URL
		const cleanSearch = { ...searchFilter.search };
		
		if (cleanSearch?.locationList?.length === 0) {
			delete cleanSearch.locationList;
		}
		if (cleanSearch?.typeList?.length === 0) {
			delete cleanSearch.typeList;
		}
		if (cleanSearch?.carCategoryList?.length === 0) {
			delete cleanSearch.carCategoryList;
		}
		if (cleanSearch?.fuelTypes?.length === 0) {
			delete cleanSearch.fuelTypes;
		}
		if (cleanSearch?.brands?.length === 0) {
			delete cleanSearch.brands;
		}
		if (cleanSearch?.seatsList?.length === 0) {
			delete cleanSearch.seatsList;
		}
		if (cleanSearch?.doorsList?.length === 0) {
			delete cleanSearch.doorsList;
		}

		const updatedFilter = { ...searchFilter, search: cleanSearch };
		
		router.push(
			`/car?input=${JSON.stringify(updatedFilter)}`,
			`/car?input=${JSON.stringify(updatedFilter)}`,
			{ scroll: false }
		).then();
	}, [searchFilter]);

	/** HANDLERS **/
	const carLocationSelectHandler = useCallback(async (value: any) => {
		try {
			if (value !== 'all') {
				const locationList = searchFilter?.search?.locationList || [];
				if (locationList.includes(value)) {
					const updatedList = locationList.filter((item: string) => item !== value);
					setSearchFilter({
							...searchFilter,
						search: { ...searchFilter.search, locationList: updatedList },
					});
				} else {
					setSearchFilter({
							...searchFilter,
						search: { ...searchFilter.search, locationList: [...locationList, value] },
					});
				}
			} else {
				setSearchFilter({
					...searchFilter,
					search: { ...searchFilter.search, locationList: [] },
				});
			}
			} catch (err: any) {
			console.log('ERROR, carLocationSelectHandler:', err);
		}
	}, [searchFilter]);

	const carCategorySelectHandler = useCallback(async (value: any) => {
		try {
			if (value !== 'all') {
				const categoryList = searchFilter?.search?.carCategoryList || [];
				if (categoryList.includes(value)) {
					const updatedList = categoryList.filter((item: string) => item !== value);
					setSearchFilter({
							...searchFilter,
						search: { ...searchFilter.search, carCategoryList: updatedList },
					});
				} else {
					setSearchFilter({
							...searchFilter,
						search: { ...searchFilter.search, carCategoryList: [...categoryList, value] },
					});
				}
			} else {
				setSearchFilter({
					...searchFilter,
					search: { ...searchFilter.search, carCategoryList: [] },
				});
			}
			} catch (err: any) {
			console.log('ERROR, carCategorySelectHandler:', err);
		}
	}, [searchFilter]);

	const fuelTypeSelectHandler = useCallback(async (value: any) => {
		try {
			if (value !== 'all') {
				const fuelTypesList = searchFilter?.search?.fuelTypes || [];
				if (fuelTypesList.includes(value)) {
					const updatedList = fuelTypesList.filter((item: string) => item !== value);
					setSearchFilter({
								...searchFilter,
						search: { ...searchFilter.search, fuelTypes: updatedList },
					});
				} else {
					setSearchFilter({
							...searchFilter,
						search: { ...searchFilter.search, fuelTypes: [...fuelTypesList, value] },
					});
				}
			} else {
				setSearchFilter({
					...searchFilter,
					search: { ...searchFilter.search, fuelTypes: [] },
				});
			}
		} catch (err: any) {
			console.log('ERROR, fuelTypeSelectHandler:', err);
		}
	}, [searchFilter]);

	const transactionTypeSelectHandler = useCallback(async (value: any) => {
		try {
			if (value !== 'all') {
				const typeList = searchFilter?.search?.typeList || [];
				if (typeList.includes(value)) {
					const updatedList = typeList.filter((item: string) => item !== value);
					setSearchFilter({
							...searchFilter,
						search: { ...searchFilter.search, typeList: updatedList },
					});
				} else {
					setSearchFilter({
							...searchFilter,
						search: { ...searchFilter.search, typeList: [...typeList, value] },
					});
				}
			} else {
				setSearchFilter({
					...searchFilter,
					search: { ...searchFilter.search, typeList: [] },
				});
			}
		} catch (err: any) {
			console.log('ERROR, transactionTypeSelectHandler:', err);
		}
	}, [searchFilter]);

	const brandSelectHandler = useCallback(async (value: any) => {
		try {
			if (value !== 'all') {
				const brandsList = searchFilter?.search?.brands || [];
				if (brandsList.includes(value)) {
					const updatedList = brandsList.filter((item: string) => item !== value);
					setSearchFilter({
								...searchFilter,
						search: { ...searchFilter.search, brands: updatedList },
					});
				} else {
					setSearchFilter({
							...searchFilter,
						search: { ...searchFilter.search, brands: [...brandsList, value] },
					});
				}
			} else {
				setSearchFilter({
					...searchFilter,
					search: { ...searchFilter.search, brands: [] },
				});
			}
		} catch (err: any) {
			console.log('ERROR, brandSelectHandler:', err);
		}
	}, [searchFilter]);

	const seatsSelectHandler = useCallback(async (value: any) => {
		try {
			if (value !== 'all') {
				const seatsList = searchFilter?.search?.seatsList || [];
				if (seatsList.includes(value)) {
					const updatedList = seatsList.filter((item: number) => item !== value);
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, seatsList: updatedList },
					});
				} else {
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, seatsList: [...seatsList, value] },
					});
				}
			} else {
				setSearchFilter({
					...searchFilter,
					search: { ...searchFilter.search, seatsList: [] },
				});
			}
		} catch (err: any) {
			console.log('ERROR, seatsSelectHandler:', err);
		}
	}, [searchFilter]);

	const doorsSelectHandler = useCallback(async (value: any) => {
		try {
			if (value !== 'all') {
				const doorsList = searchFilter?.search?.doorsList || [];
				if (doorsList.includes(value)) {
					const updatedList = doorsList.filter((item: number) => item !== value);
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, doorsList: updatedList },
					});
				} else {
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, doorsList: [...doorsList, value] },
					});
				}
			} else {
				setSearchFilter({
					...searchFilter,
					search: { ...searchFilter.search, doorsList: [] },
				});
			}
		} catch (err: any) {
			console.log('ERROR, doorsSelectHandler:', err);
		}
	}, [searchFilter]);

	const priceRangeHandler = useCallback((event: Event, newValue: number | number[]) => {
		const range = newValue as number[];
		setPriceRange(range);
		setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
				pricesRange: { start: range[0], end: range[1] }
			},
		});
	}, [searchFilter]);

	const yearRangeHandler = useCallback((event: Event, newValue: number | number[]) => {
		const range = newValue as number[];
		setYearRange(range);
		setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
				yearRange: range
			},
		});
	}, [searchFilter]);

	const mileageRangeHandler = useCallback((event: Event, newValue: number | number[]) => {
		const range = newValue as number[];
		setMileageRange(range);
		setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
				minMileage: range[0],
				maxMileage: range[1]
			},
		});
	}, [searchFilter]);

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setPriceRange([0, 500000]);
		setYearRange([1990, 2024]);
		setMileageRange([0, 200000]);
			setSearchText('');
	};

	if (device === 'mobile') {
		return <div>CAR FILTER MOBILE</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-car'} mb={'40px'}>
					<Typography className={'title'} variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#181a20' }}>
						Find Your Perfect Car
					</Typography>

					{/* Location Filter */}
					<Stack className={'car-location'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Location
						</Typography>
						<Stack className={'location-grid'} direction="row" flexWrap="wrap" gap={1}>
							{carLocation.map((location: CarLocation) => {
								const isSelected = searchFilter?.search?.locationList?.includes(location);
								return (
									<Button
										key={location}
										variant={isSelected ? "contained" : "outlined"}
										size="small"
										onClick={() => carLocationSelectHandler(location)}
										sx={{
											borderRadius: '20px',
											textTransform: 'none',
											fontSize: '12px',
											backgroundColor: isSelected ? '#1976d2' : 'transparent',
											color: isSelected ? 'white' : '#666',
											'&:hover': {
												backgroundColor: isSelected ? '#1565c0' : '#f5f5f5',
											}
										}}
									>
										{location}
									</Button>
								);
							})}
						</Stack>
					</Stack>

					{/* Transaction Type Filter */}
					<Stack className={'transaction-type'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Transaction Type
						</Typography>
						<Stack direction="row" gap={1}>
							{transactionTypes.map((type: CarTransactionType) => {
								const isSelected = searchFilter?.search?.typeList?.includes(type);
								return (
									<Button
										key={type}
										variant={isSelected ? "contained" : "outlined"}
										size="small"
										onClick={() => transactionTypeSelectHandler(type)}
										sx={{
											borderRadius: '20px',
											textTransform: 'capitalize',
											fontSize: '12px',
											backgroundColor: isSelected ? '#4caf50' : 'transparent',
											color: isSelected ? 'white' : '#666',
											'&:hover': {
												backgroundColor: isSelected ? '#45a049' : '#f5f5f5',
											}
										}}
									>
										{type.toLowerCase()}
									</Button>
								);
							})}
						</Stack>
					</Stack>

					{/* Car Category Filter */}
					<Stack className={'car-category'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Car Category
						</Typography>
						<Stack direction="row" flexWrap="wrap" gap={1}>
							{carCategory.map((category: CarCategory) => {
								const isSelected = searchFilter?.search?.carCategoryList?.includes(category);
							return (
									<Button
										key={category}
										variant={isSelected ? "contained" : "outlined"}
										size="small"
										onClick={() => carCategorySelectHandler(category)}
										sx={{
											borderRadius: '20px',
											textTransform: 'capitalize',
											fontSize: '12px',
											backgroundColor: isSelected ? '#ff9800' : 'transparent',
											color: isSelected ? 'white' : '#666',
											'&:hover': {
												backgroundColor: isSelected ? '#f57c00' : '#f5f5f5',
											}
										}}
									>
										{category.toLowerCase()}
									</Button>
							);
						})}
					</Stack>
				</Stack>

					{/* Fuel Type Filter */}
					<Stack className={'fuel-type'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Fuel Type
						</Typography>
						<Stack direction="row" flexWrap="wrap" gap={1}>
							{fuelTypes.map((fuel: FuelType) => {
								const isSelected = searchFilter?.search?.fuelTypes?.includes(fuel);
								const getColor = (fuelType: string) => {
									switch(fuelType) {
										case 'ELECTRIC': return '#4caf50';
										case 'HYBRID': return '#2196f3';
										case 'GASOLINE': return '#ff5722';
										case 'DIESEL': return '#795548';
										default: return '#666';
									}
								};
								return (
									<Button
										key={fuel}
										variant={isSelected ? "contained" : "outlined"}
								size="small"
										onClick={() => fuelTypeSelectHandler(fuel)}
										sx={{
											borderRadius: '20px',
											textTransform: 'capitalize',
											fontSize: '12px',
											backgroundColor: isSelected ? getColor(fuel) : 'transparent',
											color: isSelected ? 'white' : getColor(fuel),
											borderColor: getColor(fuel),
											'&:hover': {
												backgroundColor: isSelected ? getColor(fuel) : `${getColor(fuel)}20`,
											}
										}}
									>
										{fuel === 'GASOLINE' ? 'Gas' : fuel.toLowerCase()}
									</Button>
								);
							})}
						</Stack>
				</Stack>

					{/* Brand Filter */}
					<Stack className={'brand-filter'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Popular Brands
						</Typography>
						<Stack direction="row" flexWrap="wrap" gap={1}>
							{popularBrands.map((brand: string) => {
								const isSelected = searchFilter?.search?.brands?.includes(brand);
								return (
						<Button
										key={brand}
										variant={isSelected ? "contained" : "outlined"}
										size="small"
										onClick={() => brandSelectHandler(brand)}
							sx={{
											borderRadius: '20px',
											textTransform: 'none',
											fontSize: '12px',
											backgroundColor: isSelected ? '#9c27b0' : 'transparent',
											color: isSelected ? 'white' : '#666',
											'&:hover': {
												backgroundColor: isSelected ? '#7b1fa2' : '#f5f5f5',
											}
										}}
									>
										{brand}
						</Button>
								);
							})}
						</Stack>
					</Stack>

					{/* Seats Filter */}
					<Stack className={'seats-filter'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Number of Seats
						</Typography>
						<Stack direction="row" gap={1}>
							{seatsOptions.map((seats: number) => {
								const isSelected = searchFilter?.search?.seatsList?.includes(seats);
								return (
						<Button
										key={seats}
										variant={isSelected ? "contained" : "outlined"}
										size="small"
										onClick={() => seatsSelectHandler(seats)}
							sx={{
											borderRadius: '50%',
											minWidth: '40px',
											height: '40px',
											fontSize: '12px',
											backgroundColor: isSelected ? '#607d8b' : 'transparent',
											color: isSelected ? 'white' : '#666',
											'&:hover': {
												backgroundColor: isSelected ? '#546e7a' : '#f5f5f5',
											}
										}}
									>
										{seats}
						</Button>
								);
							})}
						</Stack>
					</Stack>

					{/* Doors Filter */}
					<Stack className={'doors-filter'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Number of Doors
						</Typography>
						<Stack direction="row" gap={1}>
							{doorsOptions.map((doors: number) => {
								const isSelected = searchFilter?.search?.doorsList?.includes(doors);
								return (
						<Button
										key={doors}
										variant={isSelected ? "contained" : "outlined"}
										size="small"
										onClick={() => doorsSelectHandler(doors)}
							sx={{
											borderRadius: '50%',
											minWidth: '40px',
											height: '40px',
											fontSize: '12px',
											backgroundColor: isSelected ? '#795548' : 'transparent',
											color: isSelected ? 'white' : '#666',
											'&:hover': {
												backgroundColor: isSelected ? '#6d4c41' : '#f5f5f5',
											}
										}}
									>
										{doors}
						</Button>
								);
							})}
						</Stack>
					</Stack>

					{/* Price Range */}
					<Stack className={'price-range'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Price Range: \${priceRange[0].toLocaleString()} - \${priceRange[1].toLocaleString()}
						</Typography>
						<Slider
							value={priceRange}
							onChange={priceRangeHandler}
							valueLabelDisplay="auto"
							min={0}
							max={500000}
							step={5000}
							sx={{
								color: '#1976d2',
								'& .MuiSlider-thumb': {
									backgroundColor: '#1976d2',
								},
								'& .MuiSlider-track': {
									backgroundColor: '#1976d2',
								},
							}}
						/>
					</Stack>

					{/* Year Range */}
					<Stack className={'year-range'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Year Range: {yearRange[0]} - {yearRange[1]}
						</Typography>
						<Slider
							value={yearRange}
							onChange={yearRangeHandler}
							valueLabelDisplay="auto"
							min={1990}
							max={2024}
							step={1}
							sx={{
								color: '#ff9800',
								'& .MuiSlider-thumb': {
									backgroundColor: '#ff9800',
								},
								'& .MuiSlider-track': {
									backgroundColor: '#ff9800',
								},
							}}
						/>
					</Stack>

					{/* Mileage Range */}
					<Stack className={'mileage-range'} mb={'20px'}>
						<Typography className={'filter-title'} sx={{ mb: 1, fontWeight: 600 }}>
							Mileage Range: {mileageRange[0].toLocaleString()} - {mileageRange[1].toLocaleString()} miles
						</Typography>
						<Slider
							value={mileageRange}
							onChange={mileageRangeHandler}
							valueLabelDisplay="auto"
							min={0}
							max={200000}
							step={5000}
							sx={{
								color: '#4caf50',
								'& .MuiSlider-thumb': {
									backgroundColor: '#4caf50',
								},
								'& .MuiSlider-track': {
									backgroundColor: '#4caf50',
								},
							}}
						/>
					</Stack>

					{/* Reset Button */}
					<Stack direction="row" justifyContent="center" mt={3}>
						<Button
							variant="outlined"
							startIcon={<RefreshIcon />}
							onClick={resetFilterHandler}
							sx={{
								borderRadius: '25px',
								textTransform: 'none',
								padding: '10px 30px',
								borderColor: '#666',
								color: '#666',
								'&:hover': {
									borderColor: '#333',
									backgroundColor: '#f5f5f5',
								}
							}}
						>
							Reset All Filters
						</Button>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;