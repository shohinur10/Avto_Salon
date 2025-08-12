import React from 'react';
import { CarCategory } from '../../../enums/car.enum';

interface CarTypeToggleProps {
	selectedTypes: CarCategory[];
	onTypeChange: (types: CarCategory[]) => void;
	className?: string;
}

const CarTypeToggle: React.FC<CarTypeToggleProps> = ({
	selectedTypes,
	onTypeChange,
	className = ''
}) => {
	const allTypes = Object.values(CarCategory);

	const handleTypeToggle = (type: CarCategory) => {
		const newSelection = selectedTypes.includes(type)
			? selectedTypes.filter(t => t !== type)
			: [...selectedTypes, type];
		onTypeChange(newSelection);
	};

	const handleKeyDown = (event: React.KeyboardEvent, type: CarCategory) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleTypeToggle(type);
		}
	};

	const getTypeIcon = (type: CarCategory) => {
		const iconMap: Record<CarCategory, string> = {
			[CarCategory.SEDAN]: '🚗',
			[CarCategory.SUV]: '🚙',
			[CarCategory.COUPE]: '🏎️',
			[CarCategory.LUXURY]: '✨',
			[CarCategory.HATCHBACK]: '🚐',
			[CarCategory.TRUCK]: '🚛'
		};
		return iconMap[type] || '🚗';
	};

	return (
		<div className={`car-type-toggle ${className}`}>
			<div className="car-type-header">
				<span className="filter-label">Car Type</span>
				<span className="selection-count">
					{selectedTypes.length > 0 ? `${selectedTypes.length} selected` : 'Any type'}
				</span>
			</div>

			<div className="car-type-grid" role="group" aria-labelledby="car-type-label">
				{allTypes.map((type) => {
					const isSelected = selectedTypes.includes(type);
					return (
						<button
							key={type}
							className={`car-type-button ${isSelected ? 'selected' : ''}`}
							onClick={() => handleTypeToggle(type)}
							onKeyDown={(e) => handleKeyDown(e, type)}
							type="button"
							role="checkbox"
							aria-checked={isSelected}
							aria-label={`Select ${type} cars`}
						>
							<div className="car-type-icon">{getTypeIcon(type)}</div>
							<span className="car-type-name">{type}</span>
							<div className={`selection-indicator ${isSelected ? 'selected' : ''}`}>
								{isSelected && <div className="checkmark">✓</div>}
							</div>
						</button>
					);
				})}
			</div>

			{selectedTypes.length > 0 && (
				<div className="selected-types-summary">
					<span className="summary-label">Selected:</span>
					<div className="selected-types-list">
						{selectedTypes.map((type, index) => (
							<span key={type} className="selected-type-tag">
								{getTypeIcon(type)} {type}
								{index < selectedTypes.length - 1 && <span className="separator">·</span>}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default CarTypeToggle;
