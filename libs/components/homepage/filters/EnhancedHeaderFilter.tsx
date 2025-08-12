import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import { CarsInquiry } from '../../../types/car/car.input';
import { CarBrand, CarCategory, FuelType } from '../../../enums/car.enum';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// Import modular filter components
import BrandMultiSelect from './BrandMultiSelect';
import PriceRangeSlider from './PriceRangeSlider';
import CarTypeToggle from './CarTypeToggle';
import YearRangeSlider from './YearRangeSlider';
import FuelTypeSelect from './FuelTypeSelect';
import MileageSlider from './MileageSlider';
import MobileFilterModal from './MobileFilterModal';

interface EnhancedHeaderFilterProps {
	initialInput: CarsInquiry;
	onSearch?: (searchData: CarsInquiry) => void;
}

const EnhancedHeaderFilter: React.FC<EnhancedHeaderFilterProps> = ({
	initialInput,
	onSearch
}) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');
	
	// Filter state management
	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(initialInput);
	const [showMobileModal, setShowMobileModal] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	// Initialize with default values
	const currentYear = new Date().getFullYear();
	const defaultFilter: CarsInquiry = {
		...initialInput,
		search: {
			...initialInput.search,
			brands: initialInput.search.brands || [],
			carCategoryList: initialInput.search.carCategoryList || [],
			fuelTypes: initialInput.search.fuelTypes || [],
			pricesRange: initialInput.search.pricesRange || { start: 0, end: 500000 },
			yearRange: initialInput.search.yearRange || [1990, currentYear],
			minMileage: initialInput.search.minMileage || 0,
			maxMileage: initialInput.search.maxMileage || 200000,
		}
	};

	useEffect(() => {
		setSearchFilter(defaultFilter);
	}, []);

	// Filter change handlers
	const handleBrandChange = useCallback((brands: CarBrand[]) => {
		setSearchFilter(prev => ({
			...prev,
			search: { ...prev.search, brands }
		}));
	}, []);

	const handlePriceChange = useCallback((min: number, max: number) => {
		setSearchFilter(prev => ({
			...prev,
			search: {
				...prev.search,
				pricesRange: { start: min, end: max }
			}
		}));
	}, []);

	const handleTypeChange = useCallback((types: CarCategory[]) => {
		setSearchFilter(prev => ({
			...prev,
			search: { ...prev.search, carCategoryList: types }
		}));
	}, []);

	const handleYearChange = useCallback((min: number, max: number) => {
		setSearchFilter(prev => ({
			...prev,
			search: {
				...prev.search,
				yearRange: [min, max]
			}
		}));
	}, []);

	const handleFuelTypeChange = useCallback((fuelTypes: FuelType[]) => {
		setSearchFilter(prev => ({
			...prev,
			search: { ...prev.search, fuelTypes }
		}));
	}, []);

	const handleMileageChange = useCallback((min: number, max: number) => {
		setSearchFilter(prev => ({
			...prev,
			search: {
				...prev.search,
				minMileage: min,
				maxMileage: max
			}
		}));
	}, []);

	// Apply filters and trigger search
	const handleApplyFilters = useCallback(async () => {
		setIsAnimating(true);
		
		try {
			// Call the search callback if provided
			if (onSearch) {
				await onSearch(searchFilter);
			}

			// Navigate to cars page with filters
			const queryParams = new URLSearchParams();
			queryParams.set('input', JSON.stringify(searchFilter));
			await router.push(`/car?${queryParams.toString()}`);
		} catch (error) {
			console.error('Error applying filters:', error);
		} finally {
			setTimeout(() => setIsAnimating(false), 300);
		}
	}, [searchFilter, onSearch, router]);

	// Reset all filters
	const handleResetFilters = useCallback(() => {
		setSearchFilter(defaultFilter);
	}, [defaultFilter]);

	// Get count of active filters
	const getActiveFilterCount = useCallback(() => {
		let count = 0;
		const { search } = searchFilter;
		
		if (search.brands && search.brands.length > 0) count++;
		if (search.carCategoryList && search.carCategoryList.length > 0) count++;
		if (search.fuelTypes && search.fuelTypes.length > 0) count++;
		if (search.pricesRange && (search.pricesRange.start > 0 || search.pricesRange.end < 500000)) count++;
		if (search.yearRange && (search.yearRange[0] > 1990 || search.yearRange[1] < currentYear)) count++;
		if (search.minMileage && search.minMileage > 0) count++;
		if (search.maxMileage && search.maxMileage < 200000) count++;
		
		return count;
	}, [searchFilter, currentYear]);

	const activeFilterCount = getActiveFilterCount();

	// Mobile view
	if (device === 'mobile') {
		return (
			<>
				<div className="enhanced-mobile-filter-trigger">
					<Button
						variant="outlined"
						startIcon={<FilterListIcon />}
						onClick={() => setShowMobileModal(true)}
						className="mobile-filter-button"
						fullWidth
					>
						Filter Cars
						{activeFilterCount > 0 && (
							<span className="filter-count-badge">{activeFilterCount}</span>
						)}
					</Button>
				</div>

				<MobileFilterModal
					isOpen={showMobileModal}
					onClose={() => setShowMobileModal(false)}
					searchFilter={searchFilter}
					onFilterUpdate={setSearchFilter}
					onApplyFilters={handleApplyFilters}
					onResetFilters={handleResetFilters}
				/>
			</>
		);
	}

	// Desktop view
	return (
		<div className={`enhanced-header-filter ${isAnimating ? 'animating' : ''}`}>
			{/* Filter Header */}
			<div className="filter-header">
				<div className="filter-title">
					<FilterListIcon className="title-icon" />
					<h3>Find Your Perfect Car</h3>
				</div>
				<div className="filter-actions">
					{activeFilterCount > 0 && (
						<>
							<span className="active-filters-count">
								{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
							</span>
							<IconButton
								onClick={handleResetFilters}
								className="reset-filters-btn"
								size="small"
								aria-label="Reset all filters"
							>
								<ClearIcon />
							</IconButton>
						</>
					)}
				</div>
			</div>

			{/* Main Filter Grid */}
			<div className="filter-grid">
				{/* Row 1: Brand and Price */}
				<div className="filter-row">
					<div className="filter-item filter-item-brand">
						<BrandMultiSelect
							selectedBrands={searchFilter.search.brands || []}
							onBrandChange={handleBrandChange}
						/>
					</div>
					<div className="filter-item filter-item-price">
						<PriceRangeSlider
							minPrice={searchFilter.search.pricesRange?.start || 0}
							maxPrice={searchFilter.search.pricesRange?.end || 500000}
							onPriceChange={handlePriceChange}
						/>
					</div>
				</div>

				{/* Row 2: Car Type */}
				<div className="filter-row">
					<div className="filter-item filter-item-type full-width">
						<CarTypeToggle
							selectedTypes={searchFilter.search.carCategoryList || []}
							onTypeChange={handleTypeChange}
						/>
					</div>
				</div>

				{/* Row 3: Year and Fuel Type */}
				<div className="filter-row">
					<div className="filter-item filter-item-year">
						<YearRangeSlider
							minYear={searchFilter.search.yearRange?.[0] || 1990}
							maxYear={searchFilter.search.yearRange?.[1] || currentYear}
							onYearChange={handleYearChange}
						/>
					</div>
					<div className="filter-item filter-item-fuel">
						<FuelTypeSelect
							selectedFuelTypes={searchFilter.search.fuelTypes || []}
							onFuelTypeChange={handleFuelTypeChange}
						/>
					</div>
				</div>

				{/* Row 4: Mileage */}
				<div className="filter-row">
					<div className="filter-item filter-item-mileage">
						<MileageSlider
							minMileage={searchFilter.search.minMileage || 0}
							maxMileage={searchFilter.search.maxMileage || 200000}
							onMileageChange={handleMileageChange}
						/>
					</div>
				</div>
			</div>

			{/* Search Actions */}
			<div className="filter-footer">
				<Box className="search-actions">
					<Button
						variant="outlined"
						onClick={handleResetFilters}
						className="reset-button"
						disabled={activeFilterCount === 0}
					>
						Reset Filters
					</Button>
					<Button
						variant="contained"
						onClick={handleApplyFilters}
						className="search-button"
						startIcon={<SearchIcon />}
						disabled={isAnimating}
					>
						{isAnimating ? 'Searching...' : 'Search Cars'}
						{activeFilterCount > 0 && (
							<span className="search-count">({activeFilterCount})</span>
						)}
					</Button>
				</Box>
			</div>
		</div>
	);
};

export default EnhancedHeaderFilter;
