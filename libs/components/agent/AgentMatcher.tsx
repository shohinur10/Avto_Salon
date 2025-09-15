import React, { useState, useEffect } from 'react';
import {
	Box,
	Stack,
	Typography,
	Card,
	CardContent,
	Button,
	Stepper,
	Step,
	StepLabel,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Slider,
	Chip,
	LinearProgress,
	Avatar,
	Rating,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions
} from '@mui/material';
import {
	Psychology as PsychologyIcon,
	AutoAwesome as AutoAwesomeIcon,
	CheckCircle as CheckCircleIcon,
	Star as StarIcon
} from '@mui/icons-material';
import { CarBrand, CarCategory, FuelType } from '../../enums/car.enum';
import { AgentProfile, AgentMatchingCriteria } from '../../types/agent/agent-extended';

interface AgentMatcherProps {
	agents: AgentProfile[];
	onAgentSelect: (agent: AgentProfile) => void;
	open: boolean;
	onClose: () => void;
}

const AgentMatcher: React.FC<AgentMatcherProps> = ({
	agents,
	onAgentSelect,
	open,
	onClose
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const [userPreferences, setUserPreferences] = useState({
		carBrand: undefined as CarBrand | undefined,
		carCategory: undefined as CarCategory | undefined,
		fuelType: undefined as FuelType | undefined,
		priceRange: { min: 0, max: 100000 },
		location: '',
		language: ''
	});
	
	const [priorityFactors, setPriorityFactors] = useState({
		expertise: 0.3,
		rating: 0.25,
		availability: 0.2,
		responseTime: 0.15,
		location: 0.1
	});

	const [matchedAgents, setMatchedAgents] = useState<(AgentProfile & { matchScore: number })[]>([]);
	const [isCalculating, setIsCalculating] = useState(false);

	const steps = [
		'Your Car Preferences',
		'Priority Factors',
		'Perfect Matches'
	];

	const locations = ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju'];
	const languages = ['English', 'Korean', 'Russian', 'Chinese', 'Japanese'];

	// Calculate agent match score
	const calculateMatchScore = (agent: AgentProfile): number => {
		let score = 0;
		let maxScore = 0;

		// Expertise match (brand, category, fuel type)
		const expertiseWeight = priorityFactors.expertise;
		let expertiseScore = 0;
		let expertiseMax = 0;

		if (userPreferences.carBrand) {
			expertiseMax += 1;
			if (agent.brandExpertise?.includes(userPreferences.carBrand)) {
				expertiseScore += 1;
			}
		}

		if (userPreferences.carCategory) {
			expertiseMax += 1;
			if (agent.vehicleTypes?.includes(userPreferences.carCategory)) {
				expertiseScore += 1;
			}
		}

		if (userPreferences.fuelType) {
			expertiseMax += 1;
			if (agent.fuelExpertise?.includes(userPreferences.fuelType)) {
				expertiseScore += 1;
			}
		}

		if (expertiseMax > 0) {
			score += (expertiseScore / expertiseMax) * expertiseWeight;
		}
		maxScore += expertiseWeight;

		// Rating score
		const ratingWeight = priorityFactors.rating;
		score += (agent.clientRating / 5) * ratingWeight;
		maxScore += ratingWeight;

		// Availability score
		const availabilityWeight = priorityFactors.availability;
		const availabilityScore = agent.availability === 'online' ? 1 : 
								 agent.availability === 'busy' ? 0.6 : 0.2;
		score += availabilityScore * availabilityWeight;
		maxScore += availabilityWeight;

		// Response time score (assuming faster is better)
		const responseWeight = priorityFactors.responseTime;
		const responseScore = agent.responseTime.includes('minutes') ? 1 :
							 agent.responseTime.includes('hour') ? 0.7 : 0.4;
		score += responseScore * responseWeight;
		maxScore += responseWeight;

		// Location match
		const locationWeight = priorityFactors.location;
		if (userPreferences.location) {
			const locationMatch = agent.territory.includes(userPreferences.location) ? 1 : 0;
			score += locationMatch * locationWeight;
		} else {
			score += 0.5 * locationWeight; // Neutral if no preference
		}
		maxScore += locationWeight;

		// Language match
		if (userPreferences.language) {
			if (agent.languages?.includes(userPreferences.language)) {
				score += 0.1; // Bonus for language match
			}
		}

		// Price range compatibility
		if (agent.priceRange) {
			const priceOverlap = Math.min(userPreferences.priceRange.max, agent.priceRange.max) - 
								Math.max(userPreferences.priceRange.min, agent.priceRange.min);
			if (priceOverlap > 0) {
				score += 0.1; // Bonus for price range compatibility
			}
		}

		return Math.min(score / maxScore, 1); // Normalize to 0-1
	};

	// Handle step navigation
	const handleNext = () => {
		if (activeStep === steps.length - 2) {
			// Calculate matches before showing results
			setIsCalculating(true);
			setTimeout(() => {
				const scored = agents.map(agent => ({
					...agent,
					matchScore: calculateMatchScore(agent)
				})).sort((a, b) => b.matchScore - a.matchScore);
				
				setMatchedAgents(scored.slice(0, 5)); // Top 5 matches
				setIsCalculating(false);
				setActiveStep(activeStep + 1);
			}, 2000);
		} else {
			setActiveStep(activeStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		setUserPreferences({
			carBrand: undefined,
			carCategory: undefined,
			fuelType: undefined,
			priceRange: { min: 0, max: 100000 },
			location: '',
			language: ''
		});
		setMatchedAgents([]);
	};

	// Render step content
	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (
					<Stack spacing={3}>
						<Typography variant="body1" color="text.secondary">
							Tell us about your car preferences to find the perfect agent for you.
						</Typography>
						
						<FormControl fullWidth>
							<InputLabel>Preferred Brand</InputLabel>
							<Select
								value={userPreferences.carBrand || ''}
								onChange={(e) => setUserPreferences(prev => ({
									...prev,
									carBrand: e.target.value as CarBrand
								}))}
							>
								<MenuItem value="">Any Brand</MenuItem>
								{['BMW', 'Mercedes', 'Toyota', 'Honda', 'Ford', 'Audi', 'Volkswagen', 'Hyundai'].map(brand => (
									<MenuItem key={brand} value={brand}>{brand}</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel>Vehicle Category</InputLabel>
							<Select
								value={userPreferences.carCategory || ''}
								onChange={(e) => setUserPreferences(prev => ({
									...prev,
									carCategory: e.target.value as CarCategory
								}))}
							>
								<MenuItem value="">Any Category</MenuItem>
								{['SUV', 'SEDAN', 'HATCHBACK', 'CONVERTIBLE', 'COUPE', 'PICKUP'].map(category => (
									<MenuItem key={category} value={category}>{category}</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel>Fuel Type</InputLabel>
							<Select
								value={userPreferences.fuelType || ''}
								onChange={(e) => setUserPreferences(prev => ({
									...prev,
									fuelType: e.target.value as FuelType
								}))}
							>
								<MenuItem value="">Any Fuel Type</MenuItem>
								{['GASOLINE', 'ELECTRIC', 'HYBRID', 'DIESEL'].map(fuel => (
									<MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
								))}
							</Select>
						</FormControl>

						<Box component="div"  >
							<Typography gutterBottom>
								Budget Range: ${userPreferences.priceRange.min.toLocaleString()} - ${userPreferences.priceRange.max.toLocaleString()}
							</Typography>
							<Slider
								value={[userPreferences.priceRange.min, userPreferences.priceRange.max]}
								onChange={(_, newValue) => {
									const [min, max] = newValue as number[];
									setUserPreferences(prev => ({
										...prev,
										priceRange: { min, max }
									}));
								}}
								valueLabelDisplay="auto"
								min={0}
								max={200000}
								step={5000}
								valueLabelFormat={(value) => `$${value.toLocaleString()}`}
							/>
						</Box>

						<FormControl fullWidth>
							<InputLabel>Preferred Location</InputLabel>
							<Select
								value={userPreferences.location}
								onChange={(e) => setUserPreferences(prev => ({
									...prev,
									location: e.target.value as string
								}))}
							>
								<MenuItem value="">Any Location</MenuItem>
								{locations.map(location => (
									<MenuItem key={location} value={location}>{location}</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel>Preferred Language</InputLabel>
							<Select
								value={userPreferences.language}
								onChange={(e) => setUserPreferences(prev => ({
									...prev,
									language: e.target.value as string
								}))}
							>
								<MenuItem value="">Any Language</MenuItem>
								{languages.map(language => (
									<MenuItem key={language} value={language}>{language}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				);

			case 1:
				return (
					<Stack spacing={3}>
						<Typography variant="body1" color="text.secondary">
							What's most important to you when choosing an agent?
						</Typography>
						
						{Object.entries(priorityFactors).map(([factor, value]) => (
							<Box component="div"   key={factor}>
								<Typography gutterBottom>
									{factor.charAt(0).toUpperCase() + factor.slice(1)}: {(value * 100).toFixed(0)}%
								</Typography>
								<Slider
									value={value}
									onChange={(_, newValue) => {
										setPriorityFactors(prev => ({
											...prev,
											[factor]: newValue as number
										}));
									}}
									min={0}
									max={1}
									step={0.05}
									valueLabelDisplay="auto"
									valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
								/>
							</Box>
						))}
						
						<Typography variant="caption" color="text.secondary">
							Adjust the importance of each factor. Total doesn't need to equal 100%.
						</Typography>
					</Stack>
				);

			case 2:
				return (
					<Stack spacing={2}>
						{isCalculating ? (
							<Box component="div"   textAlign="center" py={4}>
								<PsychologyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
								<Typography variant="h6" gutterBottom>
									Finding Your Perfect Matches...
								</Typography>
								<LinearProgress sx={{ mt: 2, mb: 2 }} />
								<Typography variant="body2" color="text.secondary">
									Analyzing agent expertise, availability, and compatibility
								</Typography>
							</Box>
						) : (
							<>
								<Box component="div"   textAlign="center" mb={2}>
									<AutoAwesomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
									<Typography variant="h6" gutterBottom>
										Your Top Agent Matches
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Based on your preferences and priorities
									</Typography>
								</Box>

								{matchedAgents.map((agent, index) => (
									<Card key={agent._id} variant="outlined">
										<CardContent>
											<Box component="div"   display="flex" alignItems="center" gap={2}>
												<Box component="div"   position="relative">
													<Avatar src={agent.memberImage} sx={{ width: 60, height: 60 }} />
													<Chip
														label={`#${index + 1}`}
														size="small"
														color="primary"
														sx={{
															position: 'absolute',
															top: -8,
															right: -8
														}}
													/>
												</Box>
												
												<Box component="div"   flex={1}>
													<Typography variant="h6">
														{agent.memberFullName || agent.memberNick}
													</Typography>
													<Typography variant="body2" color="text.secondary">
														{agent.title}
													</Typography>
													<Box component="div"   display="flex" alignItems="center" gap={1} mt={1}>
														<Rating value={agent.clientRating} size="small" readOnly />
														<Typography variant="caption">
															({agent.clientRating})
														</Typography>
														<Chip
															label={`${(agent.matchScore * 100).toFixed(0)}% Match`}
															size="small"
															color="success"
														/>
													</Box>
												</Box>
												
												<Button
													variant="contained"
													size="medium"
													startIcon={<CheckCircleIcon />}
													onClick={() => {
														onAgentSelect(agent);
														onClose();
													}}
													sx={{
														fontWeight: 600,
														textTransform: 'none',
														borderRadius: '8px',
														padding: '8px 20px'
													}}
												>
													Select Agent
												</Button>
											</Box>
										</CardContent>
									</Card>
								))}
							</>
						)}
					</Stack>
				);

			default:
				return 'Unknown step';
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>
				<Box component="div"   display="flex" alignItems="center" gap={1}>
					<PsychologyIcon color="primary" />
					<Typography variant="h6">Find Your Perfect Agent</Typography>
				</Box>
			</DialogTitle>
			
			<DialogContent>
				<Box component="div"   sx={{ width: '100%', mt: 2 }}>
					<Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					
					<Box component="div"   sx={{ mt: 4, mb: 2 }}>
						{renderStepContent(activeStep)}
					</Box>
				</Box>
			</DialogContent>
			
			<DialogActions>
				<Button onClick={onClose}>
					Cancel
				</Button>
				
				{activeStep === steps.length - 1 ? (
					<Button onClick={handleReset} variant="outlined">
						Start Over
					</Button>
				) : (
					<>
						<Button 
							disabled={activeStep === 0} 
							onClick={handleBack}
						>
							Back
						</Button>
						<Button 
							variant="contained" 
							onClick={handleNext}
							disabled={isCalculating}
						>
							{activeStep === steps.length - 2 ? 'Find Matches' : 'Next'}
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default AgentMatcher;
