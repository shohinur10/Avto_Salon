import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const InspiringExcellence = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="inspiring-excellence-mobile">
				<Stack className="container">
					<Stack className="content">
						<Typography variant="h2" className="main-title">
							Inspiring Excellence
						</Typography>
						<Typography variant="h6" className="subtitle">
							Where automotive dreams become reality through unparalleled craftsmanship and personalized service.
						</Typography>
						<Stack className="cta-buttons">
							<Button variant="contained" className="primary-btn">
								Explore Collection
							</Button>
							<Button variant="outlined" className="secondary-btn">
								Bespoke Service
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className="inspiring-excellence">
			<Stack className="container">
				<Stack className="content-wrapper">
					<Box className="content">
						<Typography variant="h1" className="main-title">
							Inspiring Excellence
						</Typography>
						<Typography variant="h4" className="subtitle">
							Where automotive dreams become reality through unparalleled craftsmanship and personalized service.
						</Typography>
						<Typography variant="body1" className="description">
							Each vehicle in our collection represents the pinnacle of automotive artistry, 
							meticulously curated for those who recognize true excellence. Experience a world where 
							every detail is crafted to perfection, and every journey becomes extraordinary.
						</Typography>
						<Stack className="cta-section">
							<Stack className="cta-buttons">
								<Button variant="contained" size="large" className="primary-btn">
									Explore Collection
								</Button>
								<Button variant="outlined" size="large" className="secondary-btn">
									Bespoke Service
								</Button>
							</Stack>
							<Typography variant="body2" className="legacy-text">
								Continuing a legacy of automotive excellence since our founding
							</Typography>
						</Stack>
					</Box>
					<Box className="visual-element">
						<div className="premium-accent"></div>
						<div className="floating-elements">
							<div className="element element-1"></div>
							<div className="element element-2"></div>
							<div className="element element-3"></div>
						</div>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default InspiringExcellence;