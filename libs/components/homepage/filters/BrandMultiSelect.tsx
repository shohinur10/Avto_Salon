import React, { useState, useRef, useEffect } from 'react';
import { CarBrand } from '../../../enums/car.enum';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface BrandMultiSelectProps {
	selectedBrands: CarBrand[];
	onBrandChange: (brands: CarBrand[]) => void;
	className?: string;
}

const BrandMultiSelect: React.FC<BrandMultiSelectProps> = ({
	selectedBrands,
	onBrandChange,
	className = ''
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const allBrands = Object.values(CarBrand);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleBrandToggle = (brand: CarBrand) => {
		const newSelection = selectedBrands.includes(brand)
			? selectedBrands.filter(b => b !== brand)
			: [...selectedBrands, brand];
		onBrandChange(newSelection);
	};

	const handleKeyDown = (event: React.KeyboardEvent, brand?: CarBrand) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (brand) {
				handleBrandToggle(brand);
			} else {
				setIsOpen(!isOpen);
			}
		} else if (event.key === 'Escape') {
			setIsOpen(false);
		}
	};

	const getDisplayText = () => {
		if (selectedBrands.length === 0) return 'All Brands';
		if (selectedBrands.length === 1) return selectedBrands[0];
		return `${selectedBrands.length} Brands Selected`;
	};

	return (
		<div className={`brand-multi-select ${className}`} ref={dropdownRef}>
			<div
				className={`brand-select-trigger ${isOpen ? 'open' : ''}`}
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={(e) => handleKeyDown(e)}
				tabIndex={0}
				role="button"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-label="Select car brands"
			>
				<div className="brand-select-content">
					<span className="filter-label">Brand</span>
					<span className="filter-value">{getDisplayText()}</span>
				</div>
				{isOpen ? <ExpandLessIcon className="dropdown-icon" /> : <ExpandMoreIcon className="dropdown-icon" />}
			</div>

			<div className={`brand-dropdown ${isOpen ? 'open' : ''}`} role="listbox" aria-label="Car brands">
				{allBrands.map((brand) => {
					const isSelected = selectedBrands.includes(brand);
					return (
						<div
							key={brand}
							className={`brand-option ${isSelected ? 'selected' : ''}`}
							onClick={() => handleBrandToggle(brand)}
							onKeyDown={(e) => handleKeyDown(e, brand)}
							tabIndex={0}
							role="option"
							aria-selected={isSelected}
						>
							<div className="brand-option-content">
								<img 
									src={`/img/brands/${brand}.svg`} 
									alt={`${brand} logo`}
									className="brand-logo"
									onError={(e) => {
										e.currentTarget.style.display = 'none';
									}}
								/>
								<span className="brand-name">{brand}</span>
							</div>
							<div className="checkbox-container">
								{isSelected ? (
									<CheckBoxIcon className="checkbox-icon selected" />
								) : (
									<CheckBoxOutlineBlankIcon className="checkbox-icon" />
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default BrandMultiSelect;
