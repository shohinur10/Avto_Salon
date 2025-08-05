import React from 'react';
import { Stack, Box, Typography, Grid } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface CraftFeature {
	title: string;
	description: string;
	icon: string;
}

const craftFeatures: CraftFeature[] = [
	{
		title: 'Artisanal Craftsmanship',
		description: 'Every vehicle is meticulously handcrafted by master artisans who bring decades of expertise to each detail.',
		icon: '🎨'
	},
	{
		title: 'Bespoke Personalization',
		description: 'Create a truly unique automotive masterpiece tailored to your exact specifications and desires.',
		icon: '✨'
	},
	{
		title: 'Premium Materials',
		description: 'Only the finest materials from around the world are selected for their beauty, durability, and exclusivity.',
		icon: '💎'
	},
	{
		title: 'Heritage Excellence',
		description: 'Our commitment to excellence spans generations, building upon a legacy of automotive innovation.',
		icon: '🏛️'
	}
];

const CraftsmanshipHeritage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="craftsmanship-heritage-mobile">
				<Stack className="container">
					<Box className="header">
						<Typography variant="h3" className="title">
							The Art of Excellence
						</Typography>
						<Typography variant="body1" className="subtitle">
							Discover the meticulous craftsmanship behind every vehicle
						</Typography>
					</Box>
					<Stack className="features">
						{craftFeatures.map((feature, index) => (
							<Box key={index} className="feature-card">
								<Box className="icon">{feature.icon}</Box>
								<Box className="content">
									<Typography variant="h6" className="feature-title">
										{feature.title}
									</Typography>
									<Typography variant="body2" className="feature-description">
										{feature.description}
									</Typography>
								</Box>
							</Box>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className="craftsmanship-heritage">
			<Stack className="container">
				<Box className="section-header">
					<Typography variant="h2" className="main-title">
						The Art of Excellence
					</Typography>
					<Typography variant="h5" className="subtitle">
						Where tradition meets innovation in the pursuit of automotive perfection
					</Typography>
					<Box className="divider"></Box>
				</Box>
				
				<Grid container spacing={4} className="features-grid">
					{craftFeatures.map((feature, index) => (
						<Grid item xs={12} md={6} key={index}>
							<Box className="feature-card">
								<Box className="card-header">
									<Box className="icon-wrapper">
										<span className="icon">{feature.icon}</span>
									</Box>
									<Typography variant="h4" className="feature-title">
										{feature.title}
									</Typography>
								</Box>
								<Typography variant="body1" className="feature-description">
									{feature.description}
								</Typography>
								<Box className="feature-accent"></Box>
							</Box>
						</Grid>
					))}
				</Grid>

				<Box className="heritage-showcase">
					<Stack className="showcase-content">
						<Typography variant="h3" className="showcase-title">
							A Legacy of Innovation
						</Typography>
						<Typography variant="body1" className="showcase-description">
							For decades, we have been at the forefront of automotive excellence, 
							creating vehicles that transcend transportation to become works of art. 
							Our commitment to innovation while honoring traditional craftsmanship 
							ensures every vehicle represents the pinnacle of automotive achievement.
						</Typography>
						<Box className="stats">
							<Box className="stat">
								<Typography variant="h3" className="stat-number">25+</Typography>
								<Typography variant="body2" className="stat-label">Years of Excellence</Typography>
							</Box>
							<Box className="stat">
								<Typography variant="h3" className="stat-number">10K+</Typography>
								<Typography variant="body2" className="stat-label">Dreams Realized</Typography>
							</Box>
							<Box className="stat">
								<Typography variant="h3" className="stat-number">100%</Typography>
								<Typography variant="body2" className="stat-label">Satisfaction</Typography>
							</Box>
						</Box>
					</Stack>
				</Box>
			</Stack>
		</Stack>
	);
};

export default CraftsmanshipHeritage;