import React, { useState, useRef, useEffect } from 'react';
import { FuelType } from '../../../enums/car.enum';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface FuelTypeSelectProps {
	selectedFuelTypes: FuelType[];
	onFuelTypeChange: (fuelTypes: FuelType[]) => void;
	className?: string;
}

const FuelTypeSelect: React.FC<FuelTypeSelectProps> = ({
	selectedFuelTypes,
	onFuelTypeChange,
	className = ''
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const allFuelTypes = Object.values(FuelType);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleFuelTypeToggle = (fuelType: FuelType) => {
		const newSelection = selectedFuelTypes.includes(fuelType)
			? selectedFuelTypes.filter(f => f !== fuelType)
			: [...selectedFuelTypes, fuelType];
		onFuelTypeChange(newSelection);
	};

	const handleKeyDown = (event: React.KeyboardEvent, fuelType?: FuelType) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (fuelType) {
				handleFuelTypeToggle(fuelType);
			} else {
				setIsOpen(!isOpen);
			}
		} else if (event.key === 'Escape') {
			setIsOpen(false);
		}
	};

	const getDisplayText = () => {
		if (selectedFuelTypes.length === 0) return 'Any Fuel Type';
		if (selectedFuelTypes.length === 1) return selectedFuelTypes[0];
		return `${selectedFuelTypes.length} Types Selected`;
	};

	const getFuelTypeIcon = (fuelType: FuelType) => {
		const iconMap: Record<FuelType, string> = {
			[FuelType.GASOLINE]: '⛽',
			[FuelType.DIESEL]: '🔧',
			[FuelType.ELECTRIC]: '🔋',
			[FuelType.HYBRID]: '🌱'
		};
		return iconMap[fuelType] || '⛽';
	};

	const getFuelTypeDescription = (fuelType: FuelType) => {
		const descMap: Record<FuelType, string> = {
			[FuelType.GASOLINE]: 'Traditional gasoline engine',
			[FuelType.DIESEL]: 'Efficient diesel engine',
			[FuelType.ELECTRIC]: 'Zero-emission electric motor',
			[FuelType.HYBRID]: 'Combined electric and gasoline'
		};
		return descMap[fuelType] || '';
	};

	return (
		<div className={`fuel-type-select ${className}`} ref={dropdownRef}>
			<div
				className={`fuel-select-trigger ${isOpen ? 'open' : ''}`}
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={(e) => handleKeyDown(e)}
				tabIndex={0}
				role="button"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-label="Select fuel types"
			>
				<div className="fuel-select-content">
					<span className="filter-label">Fuel Type</span>
					<span className="filter-value">{getDisplayText()}</span>
				</div>
				{isOpen ? <ExpandLessIcon className="dropdown-icon" /> : <ExpandMoreIcon className="dropdown-icon" />}
			</div>

			<div className={`fuel-dropdown ${isOpen ? 'open' : ''}`} role="listbox" aria-label="Fuel types">
				{allFuelTypes.map((fuelType) => {
					const isSelected = selectedFuelTypes.includes(fuelType);
					return (
						<div
							key={fuelType}
							className={`fuel-option ${isSelected ? 'selected' : ''}`}
							onClick={() => handleFuelTypeToggle(fuelType)}
							onKeyDown={(e) => handleKeyDown(e, fuelType)}
							tabIndex={0}
							role="option"
							aria-selected={isSelected}
						>
							<div className="fuel-option-content">
								<div className="fuel-icon">{getFuelTypeIcon(fuelType)}</div>
								<div className="fuel-info">
									<span className="fuel-name">{fuelType}</span>
									<span className="fuel-description">{getFuelTypeDescription(fuelType)}</span>
								</div>
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

			{selectedFuelTypes.length > 0 && (
				<div className="selected-fuel-summary">
					<div className="selected-fuel-list">
						{selectedFuelTypes.map((fuelType) => (
							<span key={fuelType} className="selected-fuel-tag">
								{getFuelTypeIcon(fuelType)} {fuelType}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default FuelTypeSelect;
