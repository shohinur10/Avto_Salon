import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CarLocation, CarCategory, CarTransactionType, FuelType, TransmissionType, CarCondition, CarBrand, CarColor, CarStatus } from '../../enums/car.enum';
import { CarsInquiry } from '../../types/car/car.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { carYear } from '../../config';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const thisYear = new Date().getFullYear();
const mileageOptions = [0, 10000, 25000, 50000, 75000, 100000, 150000, 200000];

interface HeaderFilterProps {
	initialInput: CarsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(initialInput);
	const locationRef: any = useRef();
	const typeRef: any = useRef();
	const categoryRef: any = useRef();
	const brandRef: any = useRef();
	const statusRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openCategory, setOpenCategory] = useState(false);
	const [openCondition, setOpenCondition] = useState(false);
	const [openBrand, setOpenBrand] = useState(false);
	const [openFuel, setOpenFuel] = useState(false);
	const [openTransmission, setOpenTransmission] = useState(false);
	const [openStatus, setOpenStatus] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<CarCategory | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<CarLocation | null>(null);
	const [selectedTransactionType, setSelectedTransactionType] = useState<CarTransactionType | null>(null);
	const [showSecondaryFilters, setShowSecondaryFilters] = useState(false);
	const [carLocation, setCarLocation] = useState<CarLocation[]>(Object.values(CarLocation));
	const [carTransactionType, setCarTransactionType] = useState<CarTransactionType[]>(Object.values(CarTransactionType));
	const [carCategory, setCarCategory] = useState<CarCategory[]>(Object.values(CarCategory));
	const [carCondition, setCarCondition] = useState<CarCondition[]>(Object.values(CarCondition));
	const [carBrand, setCarBrand] = useState<CarBrand[]>(Object.values(CarBrand));
	const [carStatus, setCarStatus] = useState<CarStatus[]>(Object.values(CarStatus));
	const [fuelTypes, setFuelTypes] = useState<FuelType[]>(Object.values(FuelType));
	const [transmissionTypes, setTransmissionTypes] = useState<TransmissionType[]>(Object.values(TransmissionType));
	const [yearCheck, setYearCheck] = useState({ start: 1990, end: thisYear });
	const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
	const [mileageRange, setMileageRange] = useState({ min: 0, max: 200000 });
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenLocation(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!categoryRef?.current?.contains(event.target)) {
				setOpenCategory(false);
			}

			if (!brandRef?.current?.contains(event.target)) {
				setOpenBrand(false);
			}

			if (!statusRef?.current?.contains(event.target)) {
				setOpenStatus(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenLocation(false);
		setOpenCategory(false);
		setOpenType(false);
		setOpenCondition(false);
		setOpenBrand(false);
		setOpenFuel(false);
		setOpenTransmission(false);
		setOpenAdvancedFilter(status);
	};

	const carConditionSelectHandler = (condition: CarCondition) => {
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				// Add condition to search when backend is ready
			}
		});
		setOpenCondition(false);
	};

	const carCategorySelectHandler = (category: CarCategory) => {
		setSelectedCategory(category);
		setShowSecondaryFilters(true);
		setSearchFilter({
			...searchFilter,
			search: { ...searchFilter.search, carCategoryList: [category] },
		});
		setOpenCategory(false);
		// Trigger car filtering when category is selected
		console.log(`Filtering cars by category: ${category}`);
	};

	const carLocationSelectHandler = (location: CarLocation) => {
		setSelectedLocation(location);
		setSearchFilter({
			...searchFilter,
			search: { ...searchFilter.search, locationList: [location] },
		});
		setOpenLocation(false);
		// Show secondary filters if any primary filter is selected
		if (location || selectedCategory || selectedTransactionType) {
			setShowSecondaryFilters(true);
		}
	};

	const carTransactionTypeSelectHandler = (type: CarTransactionType) => {
		setSelectedTransactionType(type);
		setSearchFilter({
			...searchFilter,
			search: { ...searchFilter.search, typeList: [type] },
		});
		setOpenType(false);
		// Show secondary filters if any primary filter is selected
		if (type || selectedCategory || selectedLocation) {
			setShowSecondaryFilters(true);
		}
	};

	const carBrandSelectHandler = (brand: CarBrand) => {
		setSearchFilter({
			...searchFilter,
			search: { ...searchFilter.search, brands: [brand] },
		});
		setOpenBrand(false);
	};

	const carStatusSelectHandler = (status: CarStatus) => {
		// Note: carStatus is handled at the car entity level, not search level
		// We'll store it in a different way or handle it in the backend
		setOpenStatus(false);
	};

	const categoryStateChangeHandler = () => {
		console.log('Category dropdown clicked, current state:', openCategory);
		console.log('Available categories:', carCategory);
		setOpenCategory((prev) => !prev);
		setOpenLocation(false);
		setOpenType(false);
		setOpenBrand(false);
		setOpenCondition(false);
		setOpenFuel(false);
	};

	const locationStateChangeHandler = () => {
		console.log('Location dropdown clicked, current state:', openLocation);
		console.log('Available locations:', carLocation);
		setOpenLocation((prev) => !prev);
		setOpenCategory(false);
		setOpenType(false);
		setOpenBrand(false);
		setOpenCondition(false);
		setOpenFuel(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenLocation(false);
		setOpenCategory(false);
		setOpenBrand(false);
		setOpenCondition(false);
		setOpenFuel(false);
	};

	const brandStateChangeHandler = () => {
		setOpenBrand((prev) => !prev);
		setOpenLocation(false);
		setOpenType(false);
		setOpenCategory(false);
		setOpenCondition(false);
		setOpenFuel(false);
	};

	const statusStateChangeHandler = () => {
		setOpenStatus((prev) => !prev);
		setOpenBrand(false);
		setOpenType(false);
		setOpenLocation(false);
		setOpenCondition(false);
	};



	const carSeatsSelectHandler = (seats: number) => {
		if (seats === 0) {
			setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, seatsList: undefined } });
		} else {
			setSearchFilter({
				...searchFilter,
				search: { ...searchFilter.search, seatsList: [seats] },
			});
		}
	};

	const carOptionSelectHandler = (e: any) => {
		const value = e.target.value;
		setOptionCheck(value);
	};

	const yearStartChangeHandler = (event: any) => {
		setYearCheck({ ...yearCheck, start: parseInt(event.target.value) });
	};

	const yearEndChangeHandler = (event: any) => {
		setYearCheck({ ...yearCheck, end: parseInt(event.target.value) });
	};

	const carMileageHandler = (event: any, type: string) => {
		const value = parseInt(event.target.value);
		if (type === 'start') {
			setSearchFilter({
				...searchFilter,
				search: { ...searchFilter.search, minMileage: value },
			});
		} else {
			setSearchFilter({
				...searchFilter,
				search: { ...searchFilter.search, maxMileage: value },
			});
		}
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setYearCheck({ start: 1990, end: thisYear });
		setOptionCheck('all');
		setSelectedCategory(null);
		setSelectedLocation(null);
		setSelectedTransactionType(null);
		setShowSecondaryFilters(false);
	};

	const pushSearchHandler = async () => {
		try {
			await router.push(
				`/car?input=${JSON.stringify(searchFilter)}`,
				`/car?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box-redesigned ultra-compact'}>
					{/* All Filters in Horizontal Row Layout */}
					<div className="all-filters-row">
						{/* Primary Filters: Transaction Type, Category, Location */}
						<div className={'primary-filters'}>
							<Box className={`filter-box transaction-box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
								<div className="filter-label">Deal Type</div>
								<span className="filter-value">{selectedTransactionType ? selectedTransactionType : 'Buy/Rent/Loan'}</span>
								<ExpandMoreIcon className="dropdown-icon" />
							</Box>
							
							<Box className={`filter-box category-box ${openCategory ? 'on' : ''}`} onClick={categoryStateChangeHandler}>
								<div className="filter-label">Car Category</div>
								<span className="filter-value">{selectedCategory ? selectedCategory : 'Any Category'}</span>
								<ExpandMoreIcon className="dropdown-icon" />
							</Box>
							
							<Box component={'div'} className={`filter-box location-box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
								<div className="filter-label">Location</div>
								<span className="filter-value">{selectedLocation ? selectedLocation : 'Any City'}</span>
								<ExpandMoreIcon className="dropdown-icon" />
							</Box>
						</div>

						{/* Secondary Filters: Show when any primary filter is selected */}
						{showSecondaryFilters && (
							<div className={'secondary-filters'}>
								<Box component={'div'} className={`filter-box brand-box ${openBrand ? 'on' : ''}`} onClick={brandStateChangeHandler}>
									<div className="filter-label">Car Brand</div>
									<span className="filter-value">Any Brand</span>
									<ExpandMoreIcon className="dropdown-icon" />
								</Box>
								
								<Box className={`filter-box condition-box ${openCondition ? 'on' : ''}`} onClick={() => setOpenCondition(!openCondition)}>
									<div className="filter-label">Condition</div>
									<span className="filter-value">New/Used</span>
									<ExpandMoreIcon className="dropdown-icon" />
								</Box>
								
								<Box className={`filter-box fuel-box ${openFuel ? 'on' : ''}`} onClick={() => setOpenFuel(!openFuel)}>
									<div className="filter-label">Fuel Type</div>
									<span className="filter-value">Any Fuel</span>
									<ExpandMoreIcon className="dropdown-icon" />
								</Box>
							</div>
						)}

						{/* Price Range Display */}
						<div className={'price-range-display'}>
							<div className="price-label">Price Range</div>
							<div className="price-value">${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}</div>
						</div>

						{/* Action Buttons */}
						<div className={'search-actions'}>
							<Box className={'advanced-filter-btn'} onClick={() => advancedFilterHandler(true)}>
								<img src="/img/icons/tune.svg" alt="" />
								<span>Filters</span>
							</Box>
							<Box className={'search-btn-primary'} onClick={pushSearchHandler}>
								<img src="/img/icons/search_white.svg" alt="" />
								<span>Search</span>
							</Box>
						</div>
					</div>

					{/* Active Filter Indicator */}
					{(selectedCategory || selectedLocation || selectedTransactionType) && (
						<div className={'active-filters-display'}>
							<div className="active-filters-label">Active:</div>
							<div className="active-filters-list">
								{selectedTransactionType && <span className="filter-tag">{selectedTransactionType}</span>}
								{selectedCategory && <span className="filter-tag">{selectedCategory}</span>}
								{selectedLocation && <span className="filter-tag">{selectedLocation}</span>}
							</div>
						</div>
					)}
				</Stack>

				{/* Dropdown Menus */}
				<div className={`filter-brand ${openBrand ? 'on' : ''}`} ref={brandRef}>
					{carBrand.map((brand: CarBrand) => {
						return (
							<div onClick={() => carBrandSelectHandler(brand)} key={brand} className="brand-item">
								<img src={`/img/brands/${brand}.svg`} alt={brand} className="brand-logo" />
								<span>{brand}</span>
							</div>
						);
					})}
				</div>

				<div className={`filter-status ${openStatus ? 'on' : ''}`} ref={statusRef}>
					{carStatus.map((status: CarStatus) => {
						return (
							<div onClick={() => carStatusSelectHandler(status)} key={status} className="status-item">
								<span className={`status-indicator ${status.toLowerCase()}`}></span>
								<span>{status}</span>
							</div>
						);
					})}
				</div>

				<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
					{Object.entries(CarLocation).length > 0 ? Object.entries(CarLocation).map(([key, value]) => {
						return (
							<div onClick={() => carLocationSelectHandler(value)} key={key}>
								<img src={`/img/banner/cities/${key}.webp`} alt="" />
								<span>{value}</span>
							</div>
						);
					}) : (
						<div style={{padding: '20px', color: 'red'}}>No locations found</div>
					)}
				</div>

				<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
					{carTransactionType.map((type: CarTransactionType) => {
						return (
							<div
								style={{ backgroundImage: `url(/img/banner/types/${type.toLowerCase()}.webp)` }}
								onClick={() => carTransactionTypeSelectHandler(type)}
								key={type}
							>
								<span>{type}</span>
							</div>
						);
					})}
				</div>

				<div className={`filter-category ${openCategory ? 'on' : ''}`} ref={categoryRef}>
					{carCategory.length > 0 ? carCategory.map((category: CarCategory) => {
						return (
							<div onClick={() => carCategorySelectHandler(category)} key={category} className="condition-item">
								<span>{category}</span>
							</div>
						);
					}) : (
						<div style={{padding: '20px', color: 'red'}}>No categories found</div>
					)}
				</div>

				{/* Condition Dropdown for Secondary Filters */}
				<div className={`filter-condition ${openCondition ? 'on' : ''}`}>
					{carCondition.map((condition: CarCondition) => {
						return (
							<div onClick={() => carConditionSelectHandler(condition)} key={condition} className="condition-item">
								<span>{condition}</span>
							</div>
						);
					})}
				</div>

				{/* Fuel Type Dropdown for Secondary Filters */}
				<div className={`filter-fuel ${openFuel ? 'on' : ''}`}>
					{fuelTypes.map((fuel: FuelType) => {
						return (
							<div onClick={() => {
								setSearchFilter({
									...searchFilter,
									search: { ...searchFilter.search, fuelTypes: [fuel] },
								});
								setOpenFuel(false);
							}} key={fuel} className="fuel-item">
								<span>{fuel}</span>
							</div>
						);
					})}
				</div>

				{/* Advanced Filter Modal */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your perfect car</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.searchText ?? ''}
										type="text"
										placeholder={'What car are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, searchText: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>seats</span>
										<div className={'inside'}>
											<div
												className={`room ${!searchFilter?.search?.seatsList ? 'active' : ''}`}
												onClick={() => carSeatsSelectHandler(0)}
											>
												Any
											</div>
											{[2, 4, 5, 7, 8].map((seats: number) => (
												<div
													className={`room ${searchFilter?.search?.seatsList?.includes(seats) ? 'active' : ''}`}
													onClick={() => carSeatsSelectHandler(seats)}
													key={seats}
												>
													{seats == 0 ? 'Any' : seats}
												</div>
											))}
										</div>
									</div>
									<div className={'box'}>
										<span>options</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={optionCheck}
													onChange={carOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'carBarter'}>Barter Available</MenuItem>
													<MenuItem value={'carRent'}>For Rent</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Year Built</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.start.toString()}
													onChange={yearStartChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{carYear?.slice(0)?.map((year: number) => (
														<MenuItem value={year} disabled={yearCheck.end <= year} key={year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.end.toString()}
													onChange={yearEndChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{carYear
														?.slice(0)
														.reverse()
														.map((year: number) => (
															<MenuItem value={year} disabled={yearCheck.start >= year} key={year}>
																{year}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
									<div className={'box'}>
										<span>mileage (miles)</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.minMileage || 0}
													onChange={(e: any) => carMileageHandler(e, 'start')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{mileageOptions.map((mileage: number) => (
														<MenuItem
															value={mileage}
															disabled={(searchFilter?.search?.maxMileage || 200000) < mileage}
															key={mileage}
														>
															{mileage.toLocaleString()}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.maxMileage || 200000}
													onChange={(e: any) => carMileageHandler(e, 'end')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{mileageOptions.map((mileage: number) => (
														<MenuItem
															value={mileage}
															disabled={(searchFilter?.search?.minMileage || 0) > mileage}
															key={mileage}
														>
															{mileage.toLocaleString()}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			yearRange: [1990, 2024],
			pricesRange: {
				start: 0,
				end: 500000,
			},
			minMileage: 0,
			maxMileage: 200000,
		},
	},
};

export default HeaderFilter;