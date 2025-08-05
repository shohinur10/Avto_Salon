import React from 'react';
import { Stack, Box, Typography, Button, Grid } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface ExperienceService {
	title: string;
	description: string;
	features: string[];
}

const experienceServices: ExperienceService[] = [
	{
		title: 'Personal Consultation',
		description: 'Our expert consultants provide personalized guidance to help you find the perfect vehicle for your lifestyle.',
		features: ['One-on-one consultation', 'Lifestyle assessment', 'Personalized recommendations', 'Expert guidance']
	},
	{
		title: 'Bespoke Customization',
		description: 'Create a truly unique vehicle tailored to your exact specifications and personal preferences.',
		features: ['Custom interior design', 'Exterior modifications', 'Performance tuning', 'Unique features']
	},
	{
		title: 'Concierge Service',
		description: 'Enjoy premium concierge services throughout your ownership journey with white-glove treatment.',
		features: ['24/7 support', 'Maintenance scheduling', 'Insurance assistance', 'Lifestyle services']
	}
];

const SignatureExperience = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="signature-experience-mobile">
				<Stack className="container">
					<Box className="header">
						<Typography variant="h3" className="title">
							Signature Experience
						</Typography>
						<Typography variant="body1" className="subtitle">
							Elevating automotive excellence through personalized service
						</Typography>
					</Box>
					<Stack className="services">
						{experienceServices.map((service, index) => (
							<Box key={index} className="service-card">
								<Typography variant="h5" className="service-title">
									{service.title}
								</Typography>
								<Typography variant="body2" className="service-description">
									{service.description}
								</Typography>
								<Box className="features">
									{service.features.map((feature, idx) => (
										<Typography key={idx} variant="body2" className="feature">
											• {feature}
										</Typography>
									))}
								</Box>
							</Box>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className="signature-experience">
			<Stack className="container">
				<Box className="section-header">
					<Typography variant="h2" className="main-title">
						Signature Experience
					</Typography>
					<Typography variant="h5" className="subtitle">
						Where exceptional service meets automotive excellence
					</Typography>
					<Box className="divider"></Box>
				</Box>

				<Grid container spacing={4} className="services-grid">
					{experienceServices.map((service, index) => (
						<Grid item xs={12} md={4} key={index}>
							<Box className="service-card">
								<Box className="card-number">
									{String(index + 1).padStart(2, '0')}
								</Box>
								<Typography variant="h4" className="service-title">
									{service.title}
								</Typography>
								<Typography variant="body1" className="service-description">
									{service.description}
								</Typography>
								<Box className="features-list">
									{service.features.map((feature, idx) => (
										<Typography key={idx} variant="body2" className="feature-item">
											{feature}
										</Typography>
									))}
								</Box>
								<Box className="card-accent"></Box>
							</Box>
						</Grid>
					))}
				</Grid>

				<Box className="cta-section">
					<Typography variant="h3" className="cta-title">
						Begin Your Journey
					</Typography>
					<Typography variant="body1" className="cta-description">
						Experience the pinnacle of automotive excellence with our signature personalized service. 
						Let us craft the perfect automotive experience tailored exclusively for you.
					</Typography>
					<Stack className="cta-buttons">
						<Button variant="contained" size="large" className="primary-cta">
							Schedule Consultation
						</Button>
						<Button variant="outlined" size="large" className="secondary-cta">
							Learn More
						</Button>
					</Stack>
				</Box>
			</Stack>
		</Stack>
	);
};

export default SignatureExperience;