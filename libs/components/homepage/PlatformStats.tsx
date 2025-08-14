import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const PlatformStats: React.FC = () => {
	const stats = [
		{
			icon: <DirectionsCarIcon />,
			number: '500+',
			label: 'Premium Cars',
			description: 'Curated collection of luxury vehicles'
		},
		{
			icon: <PeopleIcon />,
			number: '50+',
			label: 'Expert Agents',
			description: 'Professional automotive consultants'
		},
		{
			icon: <StarIcon />,
			number: '4.9',
			label: 'Rating',
			description: 'Average customer satisfaction'
		},
		{
			icon: <TrendingUpIcon />,
			number: '1000+',
			label: 'Happy Customers',
			description: 'Successful car purchases'
		}
	];

	return (
		<Box className="platform-stats">
			<Box className="container">
				<Box className="stats-header">
					<Typography variant="h2" className="stats-title">
						Platform Statistics
					</Typography>
					<Typography variant="body1" className="stats-subtitle">
						Numbers that speak to our excellence and customer trust
					</Typography>
				</Box>

				<Grid container spacing={4} className="stats-grid">
					{stats.map((stat, index) => (
						<Grid item xs={12} sm={6} md={3} key={index}>
							<Card className="stat-card">
								<CardContent className="stat-content">
									<Box className="stat-icon-container">
										{stat.icon}
									</Box>
									<Typography variant="h3" className="stat-number">
										{stat.number}
									</Typography>
									<Typography variant="h6" className="stat-label">
										{stat.label}
									</Typography>
									<Typography variant="body2" className="stat-description">
										{stat.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default PlatformStats;