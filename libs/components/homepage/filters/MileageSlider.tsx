import React, { useState, useEffect, useCallback } from 'react';
import { Slider, Box, Typography } from '@mui/material';

interface MileageSliderProps {
	minMileage: number;
	maxMileage: number;
	onMileageChange: (min: number, max: number) => void;
	className?: string;
}

const MileageSlider: React.FC<MileageSliderProps> = ({
	minMileage,
	maxMileage,
	onMileageChange,
	className = ''
}) => {
	const [mileageRange, setMileageRange] = useState<number[]>([minMileage, maxMileage]);
	const [isDragging, setIsDragging] = useState(false);

	const MIN_MILEAGE = 0;
	const MAX_MILEAGE = 200000;

	useEffect(() => {
		setMileageRange([minMileage, maxMileage]);
	}, [minMileage, maxMileage]);

	const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
		const value = newValue as number[];
		setMileageRange(value);
	}, []);

	const handleSliderChangeCommitted = useCallback((event: Event, newValue: number | number[]) => {
		const value = newValue as number[];
		setIsDragging(false);
		onMileageChange(value[0], value[1]);
	}, [onMileageChange]);

	const handleSliderChangeStart = useCallback(() => {
		setIsDragging(true);
	}, []);

	const formatMileage = (mileage: number) => {
		if (mileage >= 1000) {
			return `${(mileage / 1000).toFixed(0)}K mi`;
		}
		return `${mileage} mi`;
	};

	const getMileageCondition = (mileage: number) => {
		if (mileage < 10000) return 'Like New';
		if (mileage < 30000) return 'Excellent';
		if (mileage < 60000) return 'Good';
		if (mileage < 100000) return 'Fair';
		return 'High Mileage';
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
		}
	};

	return (
		<div className={`mileage-slider ${className} ${isDragging ? 'dragging' : ''}`}>
			<div className="mileage-slider-header">
				<span className="filter-label">Mileage Range</span>
				<div className="mileage-display">
					<span className="mileage-value">
						{formatMileage(mileageRange[0])} - {formatMileage(mileageRange[1])}
					</span>
					<span className="mileage-condition">
						{mileageRange[0] === mileageRange[1] 
							? getMileageCondition(mileageRange[0])
							: `${getMileageCondition(mileageRange[0])} to ${getMileageCondition(mileageRange[1])}`
						}
					</span>
				</div>
			</div>

			<Box className="slider-container" sx={{ px: 2, py: 3 }}>
				<Slider
					value={mileageRange}
					onChange={handleSliderChange}
					onChangeCommitted={handleSliderChangeCommitted}
					onMouseDown={handleSliderChangeStart}
					valueLabelDisplay="auto"
					valueLabelFormat={formatMileage}
					min={MIN_MILEAGE}
					max={MAX_MILEAGE}
					step={1000}
					marks={[
						{ value: 0, label: '0' },
						{ value: 50000, label: '50K' },
						{ value: 100000, label: '100K' },
						{ value: 150000, label: '150K' },
						{ value: 200000, label: '200K' }
					]}
					sx={{
						color: '#666666',
						height: 8,
						'& .MuiSlider-track': {
							border: 'none',
							background: 'linear-gradient(90deg, #666666 0%, #999999 100%)',
						},
						'& .MuiSlider-thumb': {
							height: 24,
							width: 24,
							backgroundColor: '#fff',
							border: '3px solid #666666',
							boxShadow: '0 4px 12px rgba(102, 102, 102, 0.3)',
							'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
								boxShadow: '0 6px 20px rgba(102, 102, 102, 0.4)',
								transform: 'scale(1.1)',
							},
							'&:before': {
								display: 'none',
							},
						},
						'& .MuiSlider-valueLabel': {
							lineHeight: 1.2,
							fontSize: 12,
							background: 'unset',
							padding: 0,
							width: 32,
							height: 32,
							borderRadius: '50% 50% 50% 0',
							backgroundColor: '#666666',
							transformOrigin: 'bottom left',
							transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
							'&:before': { display: 'none' },
							'&.MuiSlider-valueLabelOpen': {
								transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
							},
							'& > *': {
								transform: 'rotate(45deg)',
								color: '#fff',
							},
						},
						'& .MuiSlider-mark': {
							backgroundColor: '#bfbfbf',
							height: 8,
							width: 1,
							'&.MuiSlider-markActive': {
								opacity: 1,
								backgroundColor: 'currentColor',
							},
						},
						'& .MuiSlider-markLabel': {
							fontSize: '0.75rem',
							color: '#666',
							marginTop: '8px',
						},
					}}
					onKeyDown={handleKeyDown}
					aria-labelledby="mileage-range-slider"
					aria-label="Mileage range"
				/>
			</Box>

			<div className="mileage-range-footer">
				<Typography variant="caption" className="mileage-hint">
					Lower mileage typically indicates better condition
				</Typography>
			</div>
		</div>
	);
};

export default MileageSlider;
