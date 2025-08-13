import React, { useState, useEffect } from 'react';
import {
	Box,
	Stack,
	Typography,
	TextField,
	Button,
	Chip,
	Slider,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Rating,
	IconButton,
	Tooltip
} from '@mui/material';
import {
	ExpandMore as ExpandMoreIcon,
	Search as SearchIcon,
	FilterList as FilterListIcon,
	Clear as ClearIcon,
	Star as StarIcon,
	LocationOn as LocationIcon,
	Language as LanguageIcon,
	WorkOutline as WorkIcon,
	Speed as SpeedIcon
} from '@mui/icons-material';
import { CarBrand, CarCategory, FuelType } from '../../enums/car.enum';
import { AgentFilterState } from '../../types/agent/agent-extended';

interface AdvancedAgentFilterProps {
	onFilterChange: (filters: AgentFilterState) => void;
	initialFilters?: Partial<AgentFilterState>;
	loading?: boolean;
}

const AdvancedAgentFilter: React.FC<AdvancedAgentFilterProps> = ({
	onFilterChange,
	initialFilters = {},
	loading = false
}) => {
	const [filters, setFilters] = useState<AgentFilterState>({
		searchText: '',
		sortBy: 'rating',
		sortDirection: 'desc',
		page: 1,
		limit: 12,
		...initialFilters
	});

	const [expanded, setExpanded] = useState<string | false>('basic');

	// Available options
	const locations = [
		'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Suwon'
	];

	const languages = [
		'English', 'Korean', 'Russian', 'Chinese', 'Japanese', 'German', 'French'
	];

	const brandOptions = Object.values(CarBrand);
	const categoryOptions = Object.values(CarCategory);
	const fuelOptions = Object.values(FuelType);

	const availabilityOptions = [
		{ value: 'online', label: 'Online', color: '#4caf50' },
		{ value: 'busy', label: 'Busy', color: '#ff9800' },
		{ value: 'offline', label: 'Offline', color: '#757575' }
	];

	const sortOptions = [
		{ value: 'rating', label: 'Highest Rated' },
		{ value: 'experience', label: 'Most Experienced' },
		{ value: 'carsSold', label: 'Most Sales' },
		{ value: 'recent', label: 'Recently Joined' },
		{ value: 'responseTime', label: 'Fastest Response' }
	];

	useEffect(() => {
		onFilterChange(filters);
	}, [filters, onFilterChange]);

	const handleInputChange = (field: keyof AgentFilterState, value: any) => {
		setFilters(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleArrayToggle = (field: keyof AgentFilterState, value: any) => {
		const currentArray = (filters[field] as any[]) || [];
		const newArray = currentArray.includes(value)
			? currentArray.filter(item => item !== value)
			: [...currentArray, value];
		
		handleInputChange(field, newArray);
	};

	const clearFilters = () => {
		setFilters({
			searchText: '',
			sortBy: 'rating',
			sortDirection: 'desc',
			page: 1,
			limit: 12
		});
	};

	const getActiveFilterCount = () => {
		let count = 0;
		if (filters.searchText) count++;
		if (filters.location) count++;
		if (filters.brandExpertise?.length) count++;
		if (filters.vehicleTypes?.length) count++;
		if (filters.fuelExpertise?.length) count++;
		if (filters.availability?.length) count++;
		if (filters.languages?.length) count++;
		if (filters.minExperience) count++;
		if (filters.minRating) count++;
		if (filters.priceRange) count++;
		return count;
	};

	const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false);
	};

	return (
		<Box className="advanced-agent-filter">
			{/* Header with Search and Quick Actions */}
			<Box className="filter-header">
				<Box className="search-section">
					<TextField
						fullWidth
						variant="outlined"
						placeholder="Search agents by name, specialization, or location..."
						value={filters.searchText}
						onChange={(e) => handleInputChange('searchText', e.target.value)}
						InputProps={{
							startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
							endAdornment: filters.searchText && (
								<IconButton
									size="small"
									onClick={() => handleInputChange('searchText', '')}
								>
									<ClearIcon />
								</IconButton>
							)
						}}
						sx={{ mb: 2 }}
					/>
				</Box>

				<Box className="quick-actions">
					<FormControl size="small" sx={{ minWidth: 200, mr: 2 }}>
						<InputLabel>Sort by</InputLabel>
						<Select
							value={filters.sortBy}
							label="Sort by"
							onChange={(e) => handleInputChange('sortBy', e.target.value)}
						>
							{sortOptions.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Button
						variant="outlined"
						startIcon={<ClearIcon />}
						onClick={clearFilters}
						disabled={getActiveFilterCount() === 0}
					>
						Clear All ({getActiveFilterCount()})
					</Button>
				</Box>
			</Box>

			{/* Advanced Filter Sections */}
			<Box className="filter-sections">
				{/* Basic Filters */}
				<Accordion 
					expanded={expanded === 'basic'} 
					onChange={handleAccordionChange('basic')}
					className="filter-accordion"
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Box display="flex" alignItems="center" gap={1}>
							<LocationIcon color="primary" />
							<Typography variant="h6">Location & Availability</Typography>
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						<Stack spacing={3}>
							{/* Location Selection */}
							<FormControl fullWidth>
								<InputLabel>Location</InputLabel>
								<Select
									value={filters.location || ''}
									label="Location"
									onChange={(e) => handleInputChange('location', e.target.value)}
								>
									<MenuItem value="">All Locations</MenuItem>
									{locations.map(location => (
										<MenuItem key={location} value={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							{/* Availability Status */}
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Availability Status
								</Typography>
								<Box display="flex" gap={1} flexWrap="wrap">
									{availabilityOptions.map(option => (
										<Chip
											key={option.value}
											label={option.label}
											variant={filters.availability?.includes(option.value as any) ? "filled" : "outlined"}
											onClick={() => handleArrayToggle('availability', option.value)}
											sx={{
												borderColor: option.color,
												color: filters.availability?.includes(option.value as any) ? 'white' : option.color,
												backgroundColor: filters.availability?.includes(option.value as any) ? option.color : 'transparent'
											}}
										/>
									))}
								</Box>
							</Box>

							{/* Languages */}
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Languages Spoken
								</Typography>
								<Box display="flex" gap={1} flexWrap="wrap">
									{languages.map(language => (
										<Chip
											key={language}
											label={language}
											variant={filters.languages?.includes(language) ? "filled" : "outlined"}
											onClick={() => handleArrayToggle('languages', language)}
											color="primary"
										/>
									))}
								</Box>
							</Box>
						</Stack>
					</AccordionDetails>
				</Accordion>

				{/* Expertise Filters */}
				<Accordion 
					expanded={expanded === 'expertise'} 
					onChange={handleAccordionChange('expertise')}
					className="filter-accordion"
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Box display="flex" alignItems="center" gap={1}>
							<WorkIcon color="primary" />
							<Typography variant="h6">Expertise & Specialization</Typography>
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						<Stack spacing={3}>
							{/* Brand Expertise */}
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Brand Expertise
								</Typography>
								<Box display="flex" gap={1} flexWrap="wrap">
									{brandOptions.map(brand => (
										<Chip
											key={brand}
											label={brand}
											variant={filters.brandExpertise?.includes(brand) ? "filled" : "outlined"}
											onClick={() => handleArrayToggle('brandExpertise', brand)}
											color="secondary"
										/>
									))}
								</Box>
							</Box>

							{/* Vehicle Types */}
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Vehicle Categories
								</Typography>
								<Box display="flex" gap={1} flexWrap="wrap">
									{categoryOptions.map(category => (
										<Chip
											key={category}
											label={category}
											variant={filters.vehicleTypes?.includes(category) ? "filled" : "outlined"}
											onClick={() => handleArrayToggle('vehicleTypes', category)}
											color="info"
										/>
									))}
								</Box>
							</Box>

							{/* Fuel Expertise */}
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Fuel Type Expertise
								</Typography>
								<Box display="flex" gap={1} flexWrap="wrap">
									{fuelOptions.map(fuel => (
										<Chip
											key={fuel}
											label={fuel}
											variant={filters.fuelExpertise?.includes(fuel) ? "filled" : "outlined"}
											onClick={() => handleArrayToggle('fuelExpertise', fuel)}
											color="success"
										/>
									))}
								</Box>
							</Box>
						</Stack>
					</AccordionDetails>
				</Accordion>

				{/* Performance Filters */}
				<Accordion 
					expanded={expanded === 'performance'} 
					onChange={handleAccordionChange('performance')}
					className="filter-accordion"
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Box display="flex" alignItems="center" gap={1}>
							<StarIcon color="primary" />
							<Typography variant="h6">Performance & Experience</Typography>
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						<Stack spacing={3}>
							{/* Minimum Rating */}
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Minimum Rating
								</Typography>
								<Rating
									value={filters.minRating || 0}
									onChange={(event, newValue) => {
										handleInputChange('minRating', newValue);
									}}
									precision={0.5}
									size="large"
								/>
								<Typography variant="caption" color="text.secondary">
									{filters.minRating ? `${filters.minRating}+ stars` : 'Any rating'}
								</Typography>
							</Box>

							{/* Minimum Experience */}
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Minimum Experience: {filters.minExperience || 0} years
								</Typography>
								<Slider
									value={filters.minExperience || 0}
									onChange={(event, newValue) => {
										handleInputChange('minExperience', newValue);
									}}
									min={0}
									max={20}
									step={1}
									marks={[
										{ value: 0, label: '0' },
										{ value: 5, label: '5' },
										{ value: 10, label: '10' },
										{ value: 20, label: '20+' }
									]}
									valueLabelDisplay="auto"
									valueLabelFormat={(value) => `${value} years`}
								/>
							</Box>

							{/* Price Range Specialization */}
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Price Range Specialization (USD)
								</Typography>
								<Slider
									value={filters.priceRange ? [filters.priceRange.min, filters.priceRange.max] : [0, 200000]}
									onChange={(event, newValue) => {
										const [min, max] = newValue as number[];
										handleInputChange('priceRange', { min, max });
									}}
									min={0}
									max={200000}
									step={5000}
									valueLabelDisplay="auto"
									valueLabelFormat={(value) => `$${value.toLocaleString()}`}
									marks={[
										{ value: 0, label: '$0' },
										{ value: 50000, label: '$50K' },
										{ value: 100000, label: '$100K' },
										{ value: 200000, label: '$200K+' }
									]}
								/>
							</Box>
						</Stack>
					</AccordionDetails>
				</Accordion>
			</Box>

			{/* Active Filters Summary */}
			{getActiveFilterCount() > 0 && (
				<Box className="active-filters" mt={2}>
					<Typography variant="subtitle2" gutterBottom>
						Active Filters ({getActiveFilterCount()}):
					</Typography>
					<Box display="flex" gap={1} flexWrap="wrap">
						{filters.searchText && (
							<Chip 
								label={`Search: "${filters.searchText}"`} 
								onDelete={() => handleInputChange('searchText', '')}
								size="small"
							/>
						)}
						{filters.location && (
							<Chip 
								label={`Location: ${filters.location}`} 
								onDelete={() => handleInputChange('location', undefined)}
								size="small"
							/>
						)}
						{filters.minRating && (
							<Chip 
								label={`Rating: ${filters.minRating}+ stars`} 
								onDelete={() => handleInputChange('minRating', undefined)}
								size="small"
							/>
						)}
						{filters.minExperience && (
							<Chip 
								label={`Experience: ${filters.minExperience}+ years`} 
								onDelete={() => handleInputChange('minExperience', undefined)}
								size="small"
							/>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default AdvancedAgentFilter;

