import React, { useEffect } from 'react';
import { Modal, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { CarsInquiry } from '../../../types/car/car.input';
import { CarBrand, CarCategory, FuelType } from '../../../enums/car.enum';
import BrandMultiSelect from './BrandMultiSelect';
import PriceRangeSlider from './PriceRangeSlider';
import CarTypeToggle from './CarTypeToggle';
import YearRangeSlider from './YearRangeSlider';
import FuelTypeSelect from './FuelTypeSelect';
import MileageSlider from './MileageSlider';

interface MobileFilterModalProps {
	isOpen: boolean;
	onClose: () => void;
	searchFilter: CarsInquiry;
	onFilterUpdate: (updatedFilter: CarsInquiry) => void;
	onApplyFilters: () => void;
	onResetFilters: () => void;
}

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
	isOpen,
	onClose,
	searchFilter,
	onFilterUpdate,
	onApplyFilters,
	onResetFilters
}) => {
	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const handleBrandChange = (brands: CarBrand[]) => {
		onFilterUpdate({
			...searchFilter,
			search: { ...searchFilter.search, brands }
		});
	};

	const handlePriceChange = (min: number, max: number) => {
		onFilterUpdate({
			...searchFilter,
			search: {
				...searchFilter.search,
				pricesRange: { start: min, end: max }
			}
		});
	};

	const handleTypeChange = (types: CarCategory[]) => {
		onFilterUpdate({
			...searchFilter,
			search: { ...searchFilter.search, carCategoryList: types }
		});
	};

	const handleYearChange = (min: number, max: number) => {
		onFilterUpdate({
			...searchFilter,
			search: {
				...searchFilter.search,
				yearRange: [min, max]
			}
		});
	};

	const handleFuelTypeChange = (fuelTypes: FuelType[]) => {
		onFilterUpdate({
			...searchFilter,
			search: { ...searchFilter.search, fuelTypes }
		});
	};

	const handleMileageChange = (min: number, max: number) => {
		onFilterUpdate({
			...searchFilter,
			search: {
				...searchFilter.search,
				minMileage: min,
				maxMileage: max
			}
		});
	};

	const handleApplyAndClose = () => {
		onApplyFilters();
		onClose();
	};

	const handleResetAndClose = () => {
		onResetFilters();
		onClose();
	};

	const getActiveFilterCount = () => {
		let count = 0;
		const { search } = searchFilter;
		
		if (search.brands && search.brands.length > 0) count++;
		if (search.carCategoryList && search.carCategoryList.length > 0) count++;
		if (search.fuelTypes && search.fuelTypes.length > 0) count++;
		if (search.pricesRange && (search.pricesRange.start > 0 || search.pricesRange.end < 500000)) count++;
		if (search.yearRange && (search.yearRange[0] > 1990 || search.yearRange[1] < new Date().getFullYear())) count++;
		if (search.minMileage && search.minMileage > 0) count++;
		if (search.maxMileage && search.maxMileage < 200000) count++;
		
		return count;
	};

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="mobile-filter-modal"
			className="mobile-filter-modal"
		>
			<div className="mobile-filter-content">
				<div className="mobile-filter-header">
					<div className="header-left">
						<FilterListIcon className="filter-icon" />
						<Typography variant="h6" className="header-title">
							Filter Cars
						</Typography>
						{getActiveFilterCount() > 0 && (
							<span className="active-filter-badge">
								{getActiveFilterCount()}
							</span>
						)}
					</div>
					<IconButton
						onClick={onClose}
						className="close-button"
						aria-label="Close filter modal"
					>
						<CloseIcon />
					</IconButton>
				</div>

				<div className="mobile-filter-body">
					<div className="filter-section">
						<BrandMultiSelect
							selectedBrands={searchFilter.search.brands || []}
							onBrandChange={handleBrandChange}
							className="mobile-filter-item"
						/>
					</div>

					<div className="filter-section">
						<PriceRangeSlider
							minPrice={searchFilter.search.pricesRange?.start || 0}
							maxPrice={searchFilter.search.pricesRange?.end || 500000}
							onPriceChange={handlePriceChange}
							className="mobile-filter-item"
						/>
					</div>

					<div className="filter-section">
						<CarTypeToggle
							selectedTypes={searchFilter.search.carCategoryList || []}
							onTypeChange={handleTypeChange}
							className="mobile-filter-item"
						/>
					</div>

					<div className="filter-section">
						<YearRangeSlider
							minYear={searchFilter.search.yearRange?.[0] || 1990}
							maxYear={searchFilter.search.yearRange?.[1] || new Date().getFullYear()}
							onYearChange={handleYearChange}
							className="mobile-filter-item"
						/>
					</div>

					<div className="filter-section">
						<FuelTypeSelect
							selectedFuelTypes={searchFilter.search.fuelTypes || []}
							onFuelTypeChange={handleFuelTypeChange}
							className="mobile-filter-item"
						/>
					</div>

					<div className="filter-section">
						<MileageSlider
							minMileage={searchFilter.search.minMileage || 0}
							maxMileage={searchFilter.search.maxMileage || 200000}
							onMileageChange={handleMileageChange}
							className="mobile-filter-item"
						/>
					</div>
				</div>

				<div className="mobile-filter-footer">
					<button
						className="reset-button"
						onClick={handleResetAndClose}
						type="button"
					>
						Reset All
					</button>
					<button
						className="apply-button"
						onClick={handleApplyAndClose}
						type="button"
					>
						Apply Filters
						{getActiveFilterCount() > 0 && (
							<span className="apply-count">({getActiveFilterCount()})</span>
						)}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default MobileFilterModal;
