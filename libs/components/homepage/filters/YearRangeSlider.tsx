import React, { useState, useEffect, useCallback } from 'react';
import { Slider, Box, Typography } from '@mui/material';

interface YearRangeSliderProps {
	minYear: number;
	maxYear: number;
	onYearChange: (min: number, max: number) => void;
	className?: string;
}

const YearRangeSlider: React.FC<YearRangeSliderProps> = ({
	minYear,
	maxYear,
	onYearChange,
	className = ''
}) => {
	const [yearRange, setYearRange] = useState<number[]>([minYear, maxYear]);
	const [isDragging, setIsDragging] = useState(false);

	const MIN_YEAR = 1990;
	const MAX_YEAR = new Date().getFullYear();

	useEffect(() => {
		setYearRange([minYear, maxYear]);
	}, [minYear, maxYear]);

	const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
		const value = newValue as number[];
		setYearRange(value);
	}, []);

	const handleSliderChangeCommitted = useCallback((event: Event, newValue: number | number[]) => {
		const value = newValue as number[];
		setIsDragging(false);
		onYearChange(value[0], value[1]);
	}, [onYearChange]);

	const handleSliderChangeStart = useCallback(() => {
		setIsDragging(true);
	}, []);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
		}
	};

	const getYearCategory = (year: number) => {
		const currentYear = new Date().getFullYear();
		if (year >= currentYear - 2) return 'Brand New';
		if (year >= currentYear - 5) return 'Recent';
		if (year >= currentYear - 10) return 'Modern';
		if (year >= 2000) return 'Classic';
		return 'Vintage';
	};

	return (
		<div className={`year-range-slider ${className} ${isDragging ? 'dragging' : ''}`}>
			<div className="year-slider-header">
				<span className="filter-label">Year Range</span>
				<div className="year-display">
					<span className="year-value">
						{yearRange[0]} - {yearRange[1]}
					</span>
					<span className="year-category">
						{yearRange[0] === yearRange[1] 
							? getYearCategory(yearRange[0])
							: `${getYearCategory(yearRange[0])} to ${getYearCategory(yearRange[1])}`
						}
					</span>
				</div>
			</div>

			<Box className="slider-container" sx={{ px: 2, py: 3 }}>
				<Slider
					value={yearRange}
					onChange={handleSliderChange}
					onChangeCommitted={handleSliderChangeCommitted}
					onMouseDown={handleSliderChangeStart}
					valueLabelDisplay="auto"
					min={MIN_YEAR}
					max={MAX_YEAR}
					step={1}
					marks={[
						{ value: 1990, label: '1990' },
						{ value: 2000, label: '2000' },
						{ value: 2010, label: '2010' },
						{ value: 2020, label: '2020' },
						{ value: MAX_YEAR, label: MAX_YEAR.toString() }
					]}
					sx={{
						color: '#2c2c2c',
						height: 8,
						'& .MuiSlider-track': {
							border: 'none',
							background: 'linear-gradient(90deg, #2c2c2c 0%, #666666 100%)',
						},
						'& .MuiSlider-thumb': {
							height: 24,
							width: 24,
							backgroundColor: '#fff',
							border: '3px solid #2c2c2c',
							boxShadow: '0 4px 12px rgba(44, 44, 44, 0.3)',
							'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
								boxShadow: '0 6px 20px rgba(44, 44, 44, 0.4)',
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
							backgroundColor: '#2c2c2c',
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
					aria-labelledby="year-range-slider"
					aria-label="Year range"
				/>
			</Box>

			<div className="year-range-footer">
				<Typography variant="caption" className="year-hint">
					Select the manufacturing year range
				</Typography>
			</div>
		</div>
	);
};

export default YearRangeSlider;
