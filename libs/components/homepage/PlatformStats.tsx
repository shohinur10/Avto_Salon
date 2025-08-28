import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useRouter } from "next/router";

const PlatformStats: React.FC = () => {
	const router = useRouter();
	
	const stats = [
		{
			number: "500+",
			label: "Premium Cars",
			description: "Curated collection of luxury vehicles",
			image: "/img/cars/bmw-x7.jpg",
			alt: "Cars in showroom",
			link: "/car"
		},
		{
			number: "50+",
			label: "Expert Agents",
			description: "Professional automotive consultants",
			image: "/img/cars/ferrari-488.jpg",
			alt: "Handshake agreement",
			link: "/agent"
		},
		{
			number: "4.9",
			label: "Rating",
			description: "Average customer satisfaction",
			image: "/img/cars/porsche-cayenne.jpg",
			alt: "Happy customers",
			link: "/about"
			},
		{
			number: "1000+",
			label: "Happy Customers",
			description: "Successful car purchases",
			image: "/img/cars/lambo-huracan.jpg",
			alt: "Customer celebration",
			link: "/about"
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
							<Box className="stat-image-card">
								<Box className="card-background">
									<img 
										src={stat.image} 
										alt={stat.alt} 
										className="card-bg-image"
									/>
									<Box className="card-overlay"></Box>
								</Box>
								<Box className="card-content">
									<Typography variant="h2" className="stat-number">
										{stat.number}
									</Typography>
									<Typography variant="h6" className="stat-label">
										{stat.label}
									</Typography>
									<Typography variant="body2" className="stat-description">
										{stat.description}
									</Typography>
									<Button 
										className="stat-cta-btn"
										variant="contained"
										onClick={() => router.push(stat.link)}
									>
										Learn More
									</Button>
								</Box>
							</Box>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default PlatformStats;
