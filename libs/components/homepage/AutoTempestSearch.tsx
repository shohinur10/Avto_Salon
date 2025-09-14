import React, { useState, useCallback } from 'react';
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Typography,
	Tab,
	Tabs,
	Checkbox,
	FormControlLabel,
	Link,
	Stack,
	Tooltip,
	SelectChangeEvent,
	Slider,
	Collapse,
	IconButton,
	Chip
} from '@mui/material';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarBrand, CarLocation } from '../../enums/car.enum';
import { Direction } from '../../enums/common.enum';
import { CarsInquiry } from '../../types/car/car.input';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface AutoTempestSearchProps {
	onSearch?: (searchData: CarsInquiry) => void;
	defaultValues?: {
		make?: CarBrand | '';
		model?: string;
		zipCode?: string;
		distance?: number;
		priceRange?: [number, number];
		bodyType?: string;
		fuelType?: string;
		transmission?: string;
	};
}

// Quick filter options
const bodyTypes = ['SUV', 'Sedan', 'Coupe', 'Convertible', 'Hatchback', 'Truck', 'Wagon'];
const fuelTypes = ['Gasoline', 'Electric', 'Hybrid', 'Diesel'];
const transmissionTypes = ['Automatic', 'Manual', 'CVT'];

// Car models by brand
const carModels: { [key in CarBrand]: string[] } = {
	[CarBrand.TOYOTA]: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Tundra', 'Sienna'],
	[CarBrand.BMW]: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'M3', 'M5', 'i4', 'iX'],
	[CarBrand.MERCEDES]: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'AMG GT', 'EQS'],
	[CarBrand.AUDI]: ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'R8'],
	[CarBrand.LEXUS]: ['ES', 'IS', 'LS', 'NX', 'RX', 'GX', 'LX', 'LC', 'UX'],
	[CarBrand.HONDA]: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Ridgeline', 'Passport'],
	[CarBrand.NISSAN]: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Titan', 'Leaf'],
	[CarBrand.HYUNDAI]: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Ioniq 5'],
	[CarBrand.KIA]: ['Forte', 'Optima', 'Sorento', 'Telluride', 'Sportage', 'EV6'],
	[CarBrand.VOLKSWAGEN]: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'ID.4'],
	[CarBrand.FORD]: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Bronco', 'Maverick'],
	[CarBrand.CHEVROLET]: ['Silverado', 'Equinox', 'Traverse', 'Tahoe', 'Camaro', 'Corvette'],
	[CarBrand.PORSCHE]: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman'],
	[CarBrand.LAMBORGHINI]: ['Huracán', 'Aventador', 'Urus', 'Revuelto'],
	[CarBrand.FERRARI]: ['488', 'F8', 'SF90', 'Roma', 'Portofino', 'Purosangue'],
	[CarBrand.BENTLEY]: ['Continental', 'Flying Spur', 'Bentayga', 'Mulsanne'],
	[CarBrand.ROLLS_ROYCE]: ['Ghost', 'Phantom', 'Wraith', 'Dawn', 'Cullinan', 'Spectre'],
	[CarBrand.OTHER]: ['Custom', 'Classic', 'Import', 'Kit Car']
};

// Distance options in miles
const distanceOptions = [
	{ value: 25, label: '25 miles' },
	{ value: 50, label: '50 miles' },
	{ value: 100, label: '100 miles' },
	{ value: 200, label: '200 miles' },
	{ value: 500, label: '500 miles' },
	{ value: 1000, label: 'Nationwide' }
];

const AutoTempestSearch: React.FC<AutoTempestSearchProps> = ({ 
	onSearch, 
	defaultValues = {} 
}) => {
	const device = useDeviceDetect();
	const router = useRouter();

	// State for active tab
	const [activeTab, setActiveTab] = useState(0);

	// State for search form
	const [searchData, setSearchData] = useState({
		make: defaultValues.make || '' as CarBrand | '',
		model: defaultValues.model || '',
		zipCode: defaultValues.zipCode || '',
		distance: defaultValues.distance || 100,
		priceRange: defaultValues.priceRange || [10000, 500000] as [number, number],
		bodyType: defaultValues.bodyType || '',
		fuelType: defaultValues.fuelType || '',
		transmission: defaultValues.transmission || '',
		includeInternational: false
	});

	// State for expanded quick filters
	const [showQuickFilters, setShowQuickFilters] = useState(false);

	// Get available models for selected make
	const availableModels = searchData.make 
		? carModels[searchData.make as CarBrand] || [] 
		: [];

	// Debug log to check model availability
	console.log('Selected make:', searchData.make);
	console.log('Available models:', availableModels);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	const handleMakeChange = (event: SelectChangeEvent) => {
		const newMake = event.target.value as CarBrand | '';
		console.log('Make changed to:', newMake);
		console.log('Available models for this make:', carModels[newMake as CarBrand] || []);
		setSearchData(prev => ({
			...prev,
			make: newMake,
			model: '' // Reset model when make changes
		}));
	};

	const handleModelChange = (event: SelectChangeEvent) => {
		const newModel = event.target.value;
		console.log('Model changed to:', newModel);
		setSearchData(prev => ({
			...prev,
			model: newModel
		}));
	};

	const handleDistanceChange = (event: SelectChangeEvent) => {
		setSearchData(prev => ({
			...prev,
			distance: Number(event.target.value)
		}));
	};

	const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchData(prev => ({
			...prev,
			zipCode: event.target.value
		}));
	};

	const handleInternationalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchData(prev => ({
			...prev,
			includeInternational: event.target.checked
		}));
	};

	const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
		setSearchData(prev => ({
			...prev,
			priceRange: newValue as [number, number]
		}));
	};

	const handleQuickFilterChange = (filterType: 'bodyType' | 'fuelType' | 'transmission', value: string) => {
		setSearchData(prev => ({
			...prev,
			[filterType]: prev[filterType] === value ? '' : value
		}));
	};

	const toggleQuickFilters = () => {
		setShowQuickFilters(prev => !prev);
	};

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(value);
	};

	const handleSearch = useCallback(() => {
		// Create search query compatible with existing backend
		const searchQuery: CarsInquiry = {
			page: 1,
			limit: 20,
			sort: 'createdAt',
                        direction: Direction.DESC,
			search: {
				brands: searchData.make ? [searchData.make] : [],
				searchText: searchData.model ? `${searchData.make || ''} ${searchData.model}`.trim() : searchData.make || undefined,
				locationList: searchData.includeInternational 
					? Object.values(CarLocation).filter(loc => loc !== CarLocation.CAR)
					: undefined
			}
		};

		if (onSearch) {
			onSearch(searchQuery);
		} else {
			// Navigate to car listing page with search parameters
			router.push(`/car?input=${JSON.stringify(searchQuery)}`);
		}
	}, [searchData, onSearch, router]);

	const handleAdvancedSearch = () => {
		router.push('/car'); // Navigate to full car listing with filters
	};

	if (device === 'mobile') {
		return (
                        <Box component="div" className="autotempest-search mobile-search">
				<Box component="div" className="search-container mobile-container">
					{/* Mobile Tabs */}
					<Box component="div" className="search-tabs mobile-tabs">
						<Tabs 
							value={activeTab} 
							onChange={handleTabChange} 
							variant="fullWidth"
							className="search-tabs-container"
						>
							<Tab label="Used Cars" />
							<Tab label="Price Trends" />
							<Tab label="New Cars" />
						</Tabs>
					</Box>

					{/* Mobile Search Form */}
					<Box component="div" className="search-form mobile-form">
						<Stack spacing={2}>
							{/* Make Dropdown */}
							<FormControl fullWidth size="medium">
								<InputLabel>Make</InputLabel>
								<Select
									value={searchData.make}
									onChange={handleMakeChange}
									label="Make"
								>
									<MenuItem value="">All Makes</MenuItem>
									{Object.values(CarBrand)
										.filter(brand => brand !== CarBrand.OTHER)
										.map((brand) => (
										<MenuItem key={brand} value={brand}>
											{brand.replace('_', ' ')}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Typography variant="caption" className="helper-link mobile-helper">
								<Link href="#" color="primary">Don't know what to search for?</Link>
							</Typography>

							{/* Model Dropdown */}
							<FormControl fullWidth size="medium">
								<InputLabel>Model</InputLabel>
								<Select
									value={searchData.model}
									onChange={handleModelChange}
									label="Model"
								>
									<MenuItem value="">All Models</MenuItem>
									{searchData.make ? (
										availableModels.map((model) => (
											<MenuItem key={model} value={model}>
												{model}
											</MenuItem>
										))
									) : (
										<MenuItem disabled value="">
											Select a make first
										</MenuItem>
									)}
								</Select>
							</FormControl>
							<Typography variant="caption" className="helper-link mobile-helper">
								<Link href="#" color="primary">Missing or Wrong Model?</Link>
							</Typography>

							{/* Zip Code */}
							<TextField
								fullWidth
								size="medium"
								label="Zip/Postal Code"
								value={searchData.zipCode}
								onChange={handleZipCodeChange}
								placeholder="Enter zip code"
								InputProps={{
									startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />
								}}
							/>

							{/* Distance */}
							<FormControl fullWidth size="medium">
								<InputLabel>Distance</InputLabel>
								<Select
									value={searchData.distance.toString()}
									onChange={handleDistanceChange}
									label="Distance"
								>
									{distanceOptions.map((option) => (
										<MenuItem key={option.value} value={option.value.toString()}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							{/* Search Button */}
							<Button
								variant="contained"
								size="large"
								onClick={handleSearch}
								startIcon={<SearchIcon />}
								className="search-button mobile-search-btn"
							>
								Search Cars
							</Button>

							{/* Options */}
							<Box component="div" className="search-options mobile-options">
								<FormControlLabel
									control={
										<Checkbox
											checked={searchData.includeInternational}
											onChange={handleInternationalChange}
											color="primary"
										/>
									}
									label="Include International"
								/>
								<Link 
									href="#" 
									color="primary" 
									onClick={handleAdvancedSearch}
									className="advanced-search-link"
								>
									Advanced Search
								</Link>
							</Box>
						</Stack>
					</Box>
				</Box>
			</Box>
		);
	}

	return (
		<Box component="div" className="luxury-autotempest-search desktop-search">
			<Box component="div" className="luxury-search-container desktop-container">
				{/* Pill-style Tabs */}
				<Box component="div" className="luxury-search-tabs desktop-tabs">
					<Tabs 
						value={activeTab} 
						onChange={handleTabChange} 
						centered
						className="luxury-tabs-container"
					>
						<Tab label="Used Cars" className="luxury-tab" />
						<Tab label="Trends" className="luxury-tab" />
						<Tab label="New Cars" className="luxury-tab" />
					</Tabs>
				</Box>

				{/* Main Search Form */}
				<Box component="div" className="luxury-search-form desktop-form">
					<Box component="div" className="luxury-search-row desktop-row">
						{/* Make Dropdown */}
						<Box component="div" className="luxury-search-field make-field">
							<FormControl fullWidth size="medium">
								<InputLabel>Make</InputLabel>
								<Select
									value={searchData.make}
									onChange={handleMakeChange}
									label="Make"
									className="luxury-select"
								>
									<MenuItem value="">All Makes</MenuItem>
									{Object.values(CarBrand)
										.filter(brand => brand !== CarBrand.OTHER)
										.map((brand) => (
										<MenuItem key={brand} value={brand}>
											{brand.replace('_', ' ')}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Typography variant="caption" className="luxury-helper-link">
								<Link href="#" className="luxury-link">Don't know what to search for?</Link>
							</Typography>
						</Box>

						{/* Model Dropdown */}
						<Box component="div" className="luxury-search-field model-field">
							<FormControl fullWidth size="medium">
								<InputLabel>Model</InputLabel>
								<Select
									value={searchData.model}
									onChange={handleModelChange}
									label="Model"
									className="luxury-select"
								>
									<MenuItem value="">All Models</MenuItem>
									{searchData.make ? (
										availableModels.map((model) => (
											<MenuItem key={model} value={model}>
												{model}
											</MenuItem>
										))
									) : (
										<MenuItem disabled value="">
											Select a make first
										</MenuItem>
									)}
								</Select>
							</FormControl>
							<Typography variant="caption" className="luxury-helper-link">
								<Link href="#" className="luxury-link">Missing or Wrong Model?</Link>
							</Typography>
						</Box>

						{/* Price Range Slider */}
						<Box component="div" className="luxury-search-field price-field">
							<Typography className="luxury-field-label">
								<AttachMoneyIcon className="price-icon" />
								Price Range
							</Typography>
							<Box component="div" className="luxury-price-slider-container">
								<Slider
									value={searchData.priceRange}
									onChange={handlePriceRangeChange}
									valueLabelDisplay="auto"
									valueLabelFormat={formatPrice}
									min={5000}
									max={1000000}
									step={5000}
									className="luxury-price-slider"
									sx={{
										color: '#D4AF37',
										'& .MuiSlider-thumb': {
											background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
											border: '2px solid #fff',
											boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
										},
										'& .MuiSlider-track': {
											background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
										},
										'& .MuiSlider-rail': {
											backgroundColor: 'rgba(212, 175, 55, 0.2)',
										}
									}}
								/>
								<Box component="div" className="price-range-display">
									<Typography variant="caption" className="price-min">
										{formatPrice(searchData.priceRange[0])}
									</Typography>
									<Typography variant="caption" className="price-max">
										{formatPrice(searchData.priceRange[1])}
									</Typography>
								</Box>
							</Box>
						</Box>

						{/* Location Fields Group */}
						<Box component="div" className="luxury-search-field location-group">
							<Box component="div" className="location-fields-row">
								{/* Zip Code */}
								<TextField
									size="medium"
									label="Zip Code"
									value={searchData.zipCode}
									onChange={handleZipCodeChange}
									placeholder="12345"
									className="luxury-input zip-input"
									InputProps={{
										startAdornment: <LocationOnIcon className="location-icon" />
									}}
								/>

								{/* Distance */}
								<FormControl size="medium" className="distance-select">
									<InputLabel>Distance</InputLabel>
									<Select
										value={searchData.distance.toString()}
										onChange={handleDistanceChange}
										label="Distance"
										className="luxury-select"
									>
										{distanceOptions.map((option) => (
											<MenuItem key={option.value} value={option.value.toString()}>
												{option.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
							
							{/* Include International Checkbox */}
							<FormControlLabel
								control={
									<Checkbox
										checked={searchData.includeInternational}
										onChange={handleInternationalChange}
										className="luxury-checkbox"
									/>
								}
								label="Include International"
								className="international-checkbox"
							/>
						</Box>

						{/* Search Button */}
						<Box component="div" className="luxury-search-field search-button-field">
							<Button
								variant="contained"
								size="large"
								onClick={handleSearch}
								startIcon={<SearchIcon />}
								className="luxury-search-button"
							>
								Search Cars
							</Button>
						</Box>
					</Box>

					{/* Quick Filters Section */}
					<Box component="div" className="luxury-quick-filters-section">
						<Box component="div" className="quick-filters-header">
							<Typography className="quick-filters-label">Quick Filters</Typography>
							<IconButton 
								onClick={toggleQuickFilters} 
								className="expand-filters-button"
								size="small"
							>
								{showQuickFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							</IconButton>
						</Box>
						
						<Collapse in={showQuickFilters}>
							<Box component="div" className="quick-filters-content">
								{/* Body Type */}
								<Box component="div" className="filter-group">
									<Typography className="filter-group-label">Body Type</Typography>
									<Box component="div" className="filter-chips">
										{bodyTypes.map((type) => (
											<Chip
												key={type}
												label={type}
												onClick={() => handleQuickFilterChange('bodyType', type)}
												className={`luxury-filter-chip ${searchData.bodyType === type ? 'selected' : ''}`}
												variant={searchData.bodyType === type ? 'filled' : 'outlined'}
											/>
										))}
									</Box>
								</Box>

								{/* Fuel Type */}
								<Box component="div" className="filter-group">
									<Typography className="filter-group-label">Fuel Type</Typography>
									<Box component="div" className="filter-chips">
										{fuelTypes.map((type) => (
											<Chip
												key={type}
												label={type}
												onClick={() => handleQuickFilterChange('fuelType', type)}
												className={`luxury-filter-chip ${searchData.fuelType === type ? 'selected' : ''}`}
												variant={searchData.fuelType === type ? 'filled' : 'outlined'}
											/>
										))}
									</Box>
								</Box>

								{/* Transmission */}
								<Box component="div" className="filter-group">
									<Typography className="filter-group-label">Transmission</Typography>
									<Box component="div" className="filter-chips">
										{transmissionTypes.map((type) => (
											<Chip
												key={type}
												label={type}
												onClick={() => handleQuickFilterChange('transmission', type)}
												className={`luxury-filter-chip ${searchData.transmission === type ? 'selected' : ''}`}
												variant={searchData.transmission === type ? 'filled' : 'outlined'}
											/>
										))}
									</Box>
								</Box>
							</Box>
						</Collapse>
					</Box>

					{/* Advanced Search Link */}
					<Box component="div" className="luxury-advanced-search">
						<Button 
							onClick={handleAdvancedSearch}
							className="luxury-advanced-search-button"
							variant="text"
						>
							Advanced Search
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default AutoTempestSearch;
