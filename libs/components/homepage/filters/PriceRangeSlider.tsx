import React, { useState, useEffect, useCallback } from 'react';
import { Slider, Box, Typography } from '@mui/material';

interface PriceRangeSliderProps {
	minPrice: number;
	maxPrice: number;
	onPriceChange: (min: number, max: number) => void;
	className?: string;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
	minPrice,
	maxPrice,
	onPriceChange,
	className = ''
}) => {
	const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice]);
	const [isDragging, setIsDragging] = useState(false);

	const MIN_PRICE = 0;
	const MAX_PRICE = 500000;

	useEffect(() => {
		setPriceRange([minPrice, maxPrice]);
	}, [minPrice, maxPrice]);

	const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
		const value = newValue as number[];
		setPriceRange(value);
	}, []);

	const handleSliderChangeCommitted = useCallback((event: Event, newValue: number | number[]) => {
		const value = newValue as number[];
		setIsDragging(false);
		onPriceChange(value[0], value[1]);
	}, [onPriceChange]);

	const handleSliderChangeStart = useCallback(() => {
		setIsDragging(true);
	}, []);

	const formatPrice = (price: number) => {
		if (price >= 1000000) {
			return `$${(price / 1000000).toFixed(1)}M`;
		} else if (price >= 1000) {
			return `$${(price / 1000).toFixed(0)}K`;
		}
		return `$${price}`;
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
		}
	};

	return (
		<div className={`price-range-slider ${className} ${isDragging ? 'dragging' : ''}`}>
			<div className="price-slider-header">
				<span className="filter-label">Price Range</span>
				<div className="price-display">
					<span className="price-value">
						{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
					</span>
				</div>
			</div>

			<Box className="slider-container" sx={{ px: 2, py: 3 }}>
				<Slider
					value={priceRange}
					onChange={handleSliderChange}
					onChangeCommitted={handleSliderChangeCommitted}
					onMouseDown={handleSliderChangeStart}
					valueLabelDisplay="auto"
					valueLabelFormat={formatPrice}
					min={MIN_PRICE}
					max={MAX_PRICE}
					step={5000}
					marks={[
						{ value: 0, label: '$0' },
						{ value: 100000, label: '$100K' },
						{ value: 250000, label: '$250K' },
						{ value: 500000, label: '$500K' }
					]}
					sx={{
						color: '#D4AF37',
						height: 8,
						'& .MuiSlider-track': {
							border: 'none',
							background: 'linear-gradient(90deg, #D4AF37 0%, #F4E5A3 100%)',
						},
						'& .MuiSlider-thumb': {
							height: 24,
							width: 24,
							backgroundColor: '#fff',
							border: '3px solid #D4AF37',
							boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
							'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
								boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
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
							backgroundColor: '#D4AF37',
							transformOrigin: 'bottom left',
							transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
							'&:before': { display: 'none' },
							'&.MuiSlider-valueLabelOpen': {
								transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
							},
							'& > *': {
								transform: 'rotate(45deg)',
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
					aria-labelledby="price-range-slider"
					aria-label="Price range"
				/>
			</Box>

			<div className="price-range-footer">
				<Typography variant="caption" className="price-hint">
					Use the slider to adjust your budget range
				</Typography>
			</div>
		</div>
	);
};

export default PriceRangeSlider;
