import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { 
	Box, 
	Container, 
	Grid, 
	Typography, 
	Avatar, 
	Card, 
	CardContent, 
	Button, 
	Stack, 
	Chip, 
	Rating, 
	Divider,
	IconButton,
	Tab,
	Tabs,
	Badge,
	LinearProgress,
	List,
	ListItem,
	ListItemIcon,
	ListItemText
} from '@mui/material';
import { 
	Phone as PhoneIcon,
	Email as EmailIcon,
	WhatsApp as WhatsAppIcon,
	Chat as ChatIcon,
	LocationOn as LocationIcon,
	Language as LanguageIcon,
	AccessTime as TimeIcon,
	TrendingUp as TrendingUpIcon,
	Star as StarIcon,
	Verified as VerifiedIcon,
	DirectionsCar as CarIcon,
	People as PeopleIcon,
	Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_MEMBER, GET_CARS } from '../../apollo/user/query';
import { Member } from '../../libs/types/member/member';
import { Car } from '../../libs/types/car/car';
import { REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CarCard from '../../libs/components/car/CarCard';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';

export async function getStaticPaths() {
	// Return empty paths for now, generate pages on-demand
	return {
		paths: [],
		fallback: 'blocking'
	};
}

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface AgentDetailProps extends T {
	initialInput?: any;
}

const AgentDetail: NextPage<AgentDetailProps> = ({ initialInput, ...props }) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const user = useReactiveVar(userVar);

	const agentId = query?.id as string;

	// State
	const [agent, setAgent] = useState<Member | null>(null);
	const [agentCars, setAgentCars] = useState<Car[]>([]);
	const [activeTab, setActiveTab] = useState(0);
	const [loading, setLoading] = useState(true);

	// Mock data for enhanced features (same as in EnhancedAgentsPage)
	const [agentProfile, setAgentProfile] = useState<any>(null);

	        // GraphQL queries
        const [getAgent] = useLazyQuery(GET_MEMBER, {
                fetchPolicy: 'cache-and-network',
                onCompleted: (data) => {
                        if (data?.getMember) {
                                const foundAgent = data.getMember;
                                setAgent(foundAgent);
                                generateEnhancedProfile(foundAgent);
                        }
                        setLoading(false);
                },
                onError: (error) => {
                        console.error('Error fetching agent:', error);
                        sweetMixinErrorAlert('Failed to load agent details');
                        setLoading(false);
                }
        });

	        const [getAgentCars] = useLazyQuery(GET_CARS, {
                fetchPolicy: 'cache-and-network',
                onCompleted: (data) => {
                        if (data?.getCars?.list) {
                                setAgentCars(data.getCars.list);
                        }
                },
                onError: (error) => {
                        console.error('Error fetching agent cars:', error);
                }
        });

	// Generate enhanced profile with mock data
	const generateEnhancedProfile = (agentData: Member) => {
		const enhanced = {
			...agentData,
			title: getAgentTitle(agentData.memberType),
			experience: Math.floor(Math.random() * 15) + 2,
			languages: getRandomLanguages(),
			carsSold: Math.floor(Math.random() * 200) + 50,
			clientRating: Math.random() * 1.5 + 3.5,
			responseTime: getRandomResponseTime(),
			satisfactionRate: Math.floor(Math.random() * 20) + 80,
			brandExpertise: getRandomBrands(),
			vehicleTypes: getRandomCategories(),
			workingHours: '9 AM - 6 PM',
			timezone: 'Asia/Seoul',
			certifications: getRandomCertifications(),
			awards: getRandomAwards(),
			territory: getRandomTerritory(),
			serviceAreas: ['Seoul', 'Incheon'],
			availability: getRandomAvailability(),
			monthlyStats: {
				carsSold: Math.floor(Math.random() * 15) + 5,
				clientsMet: Math.floor(Math.random() * 30) + 20,
				responseRate: Math.floor(Math.random() * 20) + 80
			}
		};
		setAgentProfile(enhanced);
	};

	// Helper functions (same as in EnhancedAgentsPage)
	const getAgentTitle = (memberType: string) => {
		const titles = [
			'Senior Car Consultant',
			'Luxury Vehicle Specialist',
			'Electric Vehicle Expert',
			'Family Car Advisor',
			'Sports Car Specialist',
			'Commercial Vehicle Expert'
		];
		return titles[Math.floor(Math.random() * titles.length)];
	};

	const getRandomLanguages = () => {
		const languages = ['English', 'Korean', 'Russian', 'Chinese', 'Japanese'];
		const count = Math.floor(Math.random() * 3) + 2;
		return languages.slice(0, count);
	};

	const getRandomResponseTime = () => {
		const times = ['Usually responds in 30 minutes', 'Usually responds in 1 hour', 'Usually responds in 2 hours'];
		return times[Math.floor(Math.random() * times.length)];
	};

	const getRandomAvailability = () => {
		const statuses = ['online', 'busy', 'offline'];
		return statuses[Math.floor(Math.random() * statuses.length)];
	};

	const getRandomBrands = () => {
		const brands = ['BMW', 'Mercedes', 'Toyota', 'Honda', 'Ford', 'Audi', 'Volkswagen', 'Hyundai'];
		const count = Math.floor(Math.random() * 4) + 2;
		return brands.slice(0, count);
	};

	const getRandomCategories = () => {
		const categories = ['SUV', 'SEDAN', 'HATCHBACK', 'CONVERTIBLE', 'COUPE', 'PICKUP'];
		const count = Math.floor(Math.random() * 3) + 2;
		return categories.slice(0, count);
	};

	const getRandomCertifications = () => {
		const certs = ['Certified Sales Professional', 'Automotive Expert', 'Customer Service Excellence'];
		return certs.slice(0, Math.floor(Math.random() * 2) + 1);
	};

	const getRandomAwards = () => {
		const awards = ['Top Seller 2023', 'Customer Choice Award', 'Excellence in Service'];
		return awards.slice(0, Math.floor(Math.random() * 2));
	};

	const getRandomTerritory = () => {
		const territories = ['Seoul Metropolitan Area', 'Busan Region', 'Incheon Area', 'Daegu District'];
		return territories[Math.floor(Math.random() * territories.length)];
	};

	const getAvailabilityColor = (status: string) => {
		switch (status) {
			case 'online': return '#4caf50';
			case 'busy': return '#ff9800';
			case 'offline': return '#757575';
			default: return '#757575';
		}
	};

	        // Effects
        useEffect(() => {
                if (agentId) {
                        getAgent({
                                variables: {
                                        input: agentId
                                }
                        });

                        getAgentCars({
                                variables: {
                                        input: {
                                                page: 1,
                                                limit: 20,
                                                search: { memberId: agentId }
                                        }
                                }
                        });
                }
        }, [agentId]);

	// Handlers
	const handleContact = (method: string) => {
		if (method === 'phone' && agent?.memberPhone) {
			window.open(`tel:${agent.memberPhone}`);
		} else if (method === 'whatsapp' && agent?.memberPhone) {
			window.open(`https://wa.me/${agent.memberPhone}`);
		} else if (method === 'email') {
			// Handle email contact
			console.log('Email contact');
		} else if (method === 'chat') {
			// Handle chat
			console.log('Chat contact');
		}
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	if (device === 'mobile') {
		return <div>Mobile Agent Detail Page - Coming Soon</div>;
	}

	if (loading) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Typography>Loading agent details...</Typography>
			</Container>
		);
	}

	if (!agent || !agentProfile) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Typography>Agent not found</Typography>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Agent Header */}
			<Card sx={{ mb: 4 }}>
				<CardContent sx={{ p: 4 }}>
					<Grid container spacing={3}>
						{/* Avatar and Basic Info */}
						<Grid item xs={12} md={4}>
							<Stack alignItems="center" spacing={2}>
								<Badge
									overlap="circular"
									anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
									badgeContent={
										<Box
													
													
													
											sx={{
												width: 20,
												height: 20,
												borderRadius: '50%',
												backgroundColor: getAvailabilityColor(agentProfile.availability),
												border: '3px solid white'
											}}
										/>
									}
								>
									<Avatar
										src={agent.memberImage ? `${REACT_APP_API_URL}/${agent.memberImage}` : '/img/profile/defaultUser.svg'}
										alt={agent.memberNick}
										sx={{ width: 150, height: 150 }}
									/>
								</Badge>
								
								<Stack alignItems="center" spacing={1}>
									<Box component="div"    display="flex" alignItems="center" gap={1}>
										<Typography variant="h4" fontWeight="bold">
											{agent.memberFullName || agent.memberNick}
										</Typography>
										{agentProfile.certifications?.length > 0 && (
											<VerifiedIcon color="primary" />
										)}
									</Box>
									
									<Typography variant="h6" color="text.secondary">
										{agentProfile.title}
									</Typography>
									
									<Box component="div"    display="flex" alignItems="center" gap={1}>
										<Rating value={agentProfile.clientRating} precision={0.1} readOnly />
										<Typography variant="body2">
											({agentProfile.clientRating.toFixed(1)})
										</Typography>
									</Box>

									<Chip
										label={agentProfile.availability}
										sx={{
											backgroundColor: getAvailabilityColor(agentProfile.availability),
											color: 'white'
										}}
									/>
								</Stack>
							</Stack>
						</Grid>

						{/* Stats and Info */}
						<Grid item xs={12} md={8}>
							<Grid container spacing={3}>
								{/* Quick Stats */}
								<Grid item xs={6} sm={3}>
									<Card variant="outlined">
										<CardContent sx={{ textAlign: 'center', py: 2 }}>
											<Typography variant="h5" color="primary" fontWeight="bold">
												{agentProfile.experience}
											</Typography>
											<Typography variant="caption">Years Experience</Typography>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Card variant="outlined">
										<CardContent sx={{ textAlign: 'center', py: 2 }}>
											<Typography variant="h5" color="primary" fontWeight="bold">
												{agentProfile.carsSold}
											</Typography>
											<Typography variant="caption">Cars Sold</Typography>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Card variant="outlined">
										<CardContent sx={{ textAlign: 'center', py: 2 }}>
											<Typography variant="h5" color="primary" fontWeight="bold">
												{agentProfile.satisfactionRate}%
											</Typography>
											<Typography variant="caption">Satisfaction</Typography>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Card variant="outlined">
										<CardContent sx={{ textAlign: 'center', py: 2 }}>
											<Typography variant="h5" color="primary" fontWeight="bold">
												{agentProfile.monthlyStats.carsSold}
											</Typography>
											<Typography variant="caption">This Month</Typography>
										</CardContent>
									</Card>
								</Grid>

								{/* Contact Methods */}
								<Grid item xs={12}>
									<Typography variant="h6" gutterBottom>Contact Information</Typography>
									<Stack direction="row" spacing={2} flexWrap="wrap">
										<Button
											variant="contained"
											startIcon={<PhoneIcon />}
											onClick={() => handleContact('phone')}
											sx={{ minWidth: 120 }}
										>
											Call
										</Button>
										<Button
											variant="contained"
											color="success"
											startIcon={<WhatsAppIcon />}
											onClick={() => handleContact('whatsapp')}
											sx={{ minWidth: 120 }}
										>
											WhatsApp
										</Button>
										<Button
											variant="contained"
											color="info"
											startIcon={<ChatIcon />}
											onClick={() => handleContact('chat')}
											sx={{ minWidth: 120 }}
										>
											Chat
										</Button>
										<Button
											variant="outlined"
											startIcon={<EmailIcon />}
											onClick={() => handleContact('email')}
											sx={{ minWidth: 120 }}
										>
											Email
										</Button>
									</Stack>
								</Grid>

								{/* Quick Info */}
								<Grid item xs={12}>
									<Stack direction="row" spacing={3} flexWrap="wrap">
										<Box component="div"    display="flex" alignItems="center" gap={1}>
											<LocationIcon color="action" />
											<Typography variant="body2">{agentProfile.territory}</Typography>
										</Box>
										<Box component="div"    display="flex" alignItems="center" gap={1}>
											<LanguageIcon color="action" />
											<Typography variant="body2">{agentProfile.languages?.join(', ')}</Typography>
										</Box>
										<Box component="div"    display="flex" alignItems="center" gap={1}>
											<TimeIcon color="action" />
											<Typography variant="body2">{agentProfile.workingHours}</Typography>
										</Box>
									</Stack>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Tabs Section */}
			<Box component="div"    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs value={activeTab} onChange={handleTabChange}>
					<Tab label="About" />
					<Tab label={`Cars (${agentCars.length})`} />
					<Tab label="Specializations" />
					<Tab label="Reviews" />
				</Tabs>
			</Box>

			{/* Tab Content */}
			{activeTab === 0 && (
				<Grid container spacing={3}>
					{/* About Section */}
					<Grid item xs={12} md={8}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>About {agent.memberFullName || agent.memberNick}</Typography>
								<Typography variant="body1" paragraph>
									{agent.memberDesc || 'Experienced automotive professional dedicated to helping clients find their perfect vehicle.'}
								</Typography>
								
								<Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Response Time</Typography>
								<Typography variant="body2" color="text.secondary">
									{agentProfile.responseTime}
								</Typography>

								{agentProfile.certifications?.length > 0 && (
									<>
										<Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Certifications</Typography>
										<Stack direction="row" spacing={1} flexWrap="wrap">
											{agentProfile.certifications.map((cert: string, index: number) => (
												<Chip key={index} label={cert} variant="outlined" />
											))}
										</Stack>
									</>
								)}

								{agentProfile.awards?.length > 0 && (
									<>
										<Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Awards & Recognition</Typography>
										<Stack direction="row" spacing={1} flexWrap="wrap">
											{agentProfile.awards.map((award: string, index: number) => (
												<Chip key={index} label={award} color="primary" />
											))}
										</Stack>
									</>
								)}
							</CardContent>
						</Card>
					</Grid>

					{/* Sidebar */}
					<Grid item xs={12} md={4}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>Monthly Performance</Typography>
								<Stack spacing={2}>
									<Box component="div"   >
										<Box component="div"    display="flex" justifyContent="space-between" mb={1}>
											<Typography variant="body2">Cars Sold</Typography>
											<Typography variant="body2">{agentProfile.monthlyStats.carsSold}</Typography>
										</Box>
										<LinearProgress 
											variant="determinate" 
											value={(agentProfile.monthlyStats.carsSold / 20) * 100} 
										/>
									</Box>
									<Box component="div"   >
										<Box component="div"    display="flex" justifyContent="space-between" mb={1}>
											<Typography variant="body2">Response Rate</Typography>
											<Typography variant="body2">{agentProfile.monthlyStats.responseRate}%</Typography>
										</Box>
										<LinearProgress 
											variant="determinate" 
											value={agentProfile.monthlyStats.responseRate} 
										/>
									</Box>
									<Box component="div"   >
										<Box component="div"    display="flex" justifyContent="space-between" mb={1}>
											<Typography variant="body2">Client Satisfaction</Typography>
											<Typography variant="body2">{agentProfile.satisfactionRate}%</Typography>
										</Box>
										<LinearProgress 
											variant="determinate" 
											value={agentProfile.satisfactionRate} 
										/>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			)}

			{activeTab === 1 && (
				<Grid container spacing={3}>
					{agentCars.length > 0 ? (
						agentCars.map((car) => (
							<Grid item xs={12} sm={6} md={4} key={car._id}>
								<CarCard car={car} />
							</Grid>
						))
					) : (
						<Grid item xs={12}>
							<Typography variant="h6" textAlign="center" color="text.secondary">
								No cars available from this agent
							</Typography>
						</Grid>
					)}
				</Grid>
			)}

			{activeTab === 2 && (
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>Brand Expertise</Typography>
								<Stack direction="row" spacing={1} flexWrap="wrap">
									{agentProfile.brandExpertise?.map((brand: string, index: number) => (
										<Chip key={index} label={brand} color="primary" />
									))}
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} md={6}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>Vehicle Types</Typography>
								<Stack direction="row" spacing={1} flexWrap="wrap">
									{agentProfile.vehicleTypes?.map((type: string, index: number) => (
										<Chip key={index} label={type} variant="outlined" />
									))}
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			)}

			{activeTab === 3 && (
				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>Client Reviews</Typography>
						<Typography variant="body2" color="text.secondary">
							Reviews feature coming soon...
						</Typography>
					</CardContent>
				</Card>
			)}
		</Container>
	);
};

export default withLayoutBasic(AgentDetail);