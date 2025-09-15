import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardActions,
	Box,
	Stack,
	Typography,
	Avatar,
	Button,
	Chip,
	Rating,
	IconButton,
	Badge,
	Tooltip,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	CircularProgress
} from '@mui/material';
import {
	Phone as PhoneIcon,
	Email as EmailIcon,
	WhatsApp as WhatsAppIcon,
	Chat as ChatIcon,
	Favorite as FavoriteIcon,
	FavoriteBorder as FavoriteBorderIcon,
	Visibility as ViewIcon,
	Star as StarIcon,
	LocationOn as LocationIcon,
	Language as LanguageIcon,
	AccessTime as TimeIcon,
	WorkOutline as WorkIcon,
	TrendingUp as TrendingUpIcon,
	Verified as VerifiedIcon,
	CalendarToday as CalendarIcon,
	Speed as SpeedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AgentProfile, ClientTestimonial } from '../../types/agent/agent-extended';
import { CarBrand } from '../../enums/car.enum';

interface EnhancedAgentCardProps {
	agent: AgentProfile;
	onLike?: (agentId: string) => void;
	onContact?: (agentId: string, method: 'phone' | 'email' | 'whatsapp' | 'chat') => void;
	onViewProfile?: (agentId: string) => void;
	isLiked?: boolean;
	variant?: 'default' | 'compact' | 'detailed';
}

const EnhancedAgentCard: React.FC<EnhancedAgentCardProps> = ({
	agent,
	onLike,
	onContact,
	onViewProfile,
	isLiked = false,
	variant = 'default'
}) => {
	const [contactDialogOpen, setContactDialogOpen] = useState(false);
	const [contactMessage, setContactMessage] = useState('');
	const [showTestimonials, setShowTestimonials] = useState(false);

	// Determine availability color
	const getAvailabilityColor = (status: string) => {
		switch (status) {
			case 'online': return '#4caf50';
			case 'busy': return '#ff9800';
			case 'offline': return '#757575';
			default: return '#757575';
		}
	};

	// Get specialization display
	const getTopSpecializations = () => {
		const specializations = [];
		if (agent.brandExpertise?.length) {
			specializations.push(...agent.brandExpertise.slice(0, 3));
		}
		if (agent.vehicleTypes?.length) {
			specializations.push(...agent.vehicleTypes.slice(0, 2));
		}
		return specializations.slice(0, 4);
	};

	// Handle contact methods
	const handleContact = (method: 'phone' | 'email' | 'whatsapp' | 'chat') => {
		if (method === 'chat') {
			setContactDialogOpen(true);
		} else if (method === 'phone' && agent.memberPhone) {
			window.open(`tel:${agent.memberPhone}`);
		} else if (method === 'whatsapp' && agent.whatsapp) {
			window.open(`https://wa.me/${agent.whatsapp}`);
		}
		
		onContact?.(agent._id, method);
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
		hover: { y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }
	};

	return (
		<>
			<motion.div
				variants={cardVariants}
				initial="hidden"
				animate="visible"
				whileHover="hover"
				transition={{ duration: 0.3 }}
			>
				<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
					{/* Header Section */}
					<CardContent sx={{ pb: 1 }}>
						<Box component="div"   sx={{ display: 'flex', alignItems: 'flex-start' }}>
							<Badge
								overlap="circular"
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								badgeContent={
									<Box component="div"  
										sx={{
											width: 16,
											height: 16,
											borderRadius: '50%',
											backgroundColor: getAvailabilityColor(agent.availability),
											border: '2px solid white'
										}}
									/>
								}
							>
								<Avatar
									src={agent.memberImage}
									alt={agent.memberNick}
									sx={{ width: 80, height: 80 }}
								/>
							</Badge>
							
							<Box component="div"   sx={{ ml: 2, flex: 1 }}>
								<Box component="div"   display="flex" alignItems="center" gap={1}>
									<Typography variant="h6" fontWeight="bold">
										{agent.memberFullName || agent.memberNick}
									</Typography>
									{agent.certifications?.length > 0 && (
										<Tooltip title="Certified Professional">
											<VerifiedIcon color="primary" fontSize="small" />
										</Tooltip>
									)}
								</Box>
								
								<Typography variant="body2" color="text.secondary" gutterBottom>
									{agent.title}
								</Typography>
								
								<Box component="div"   display="flex" alignItems="center" gap={2} flexWrap="wrap">
									<Box component="div"   display="flex" alignItems="center" gap={0.5}>
										<Rating value={agent.clientRating} precision={0.1} size="small" readOnly />
										<Typography variant="caption">
											({agent.clientRating.toFixed(1)})
										</Typography>
									</Box>
									
									<Box component="div"   display="flex" alignItems="center" gap={0.5}>
										<WorkIcon fontSize="small" color="action" />
										<Typography variant="caption">
											{agent.experience} years
										</Typography>
									</Box>
									
									<Box component="div"   display="flex" alignItems="center" gap={0.5}>
										<TrendingUpIcon fontSize="small" color="action" />
										<Typography variant="caption">
											{agent.carsSold} cars sold
										</Typography>
									</Box>
								</Box>
							</Box>

							{/* Action Buttons */}
							<Box component="div"   sx={{ display: 'flex', alignItems: 'center' }}>
								<IconButton
									onClick={() => onLike?.(agent._id)}
									color={isLiked ? "error" : "default"}
									size="small"
								>
									{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
								</IconButton>
							</Box>
						</Box>
					</CardContent>

					<CardContent sx={{ pt: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
						{/* Specializations */}
						<Box component="div"   mb={2}>
							<Typography variant="subtitle2" gutterBottom>
								Specializations
							</Typography>
							<Box component="div"   display="flex" gap={0.5} flexWrap="wrap">
								{getTopSpecializations().map((spec, index) => (
									<Chip
										key={`${spec}-${index}`}
										label={spec}
										size="small"
										variant="outlined"
										color="primary"
									/>
								))}
							</Box>
						</Box>

						{/* Performance Metrics */}
						{variant !== 'compact' && (
							<Box component="div"   mb={2}>
								<Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
									<Box component="div"   textAlign="center">
										<Typography variant="h6" color="primary">
											{agent.satisfactionRate}%
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Satisfaction
										</Typography>
									</Box>
									<Box component="div"   textAlign="center">
										<Typography variant="h6" color="primary">
											{agent.monthlyStats.carsSold}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											This Month
										</Typography>
									</Box>
									<Box component="div"   textAlign="center">
										<Typography variant="h6" color="primary">
											{agent.responseTime}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Response
										</Typography>
									</Box>
								</Stack>
							</Box>
						)}

						{/* Location & Languages */}
						<Box component="div"   mb={2}>
							<Stack direction="row" spacing={2} alignItems="center">
								<Box component="div"   display="flex" alignItems="center" gap={0.5}>
									<LocationIcon fontSize="small" color="action" />
									<Typography variant="caption">
										{agent.territory}
									</Typography>
								</Box>
								<Box component="div"   display="flex" alignItems="center" gap={0.5}>
									<LanguageIcon fontSize="small" color="action" />
									<Typography variant="caption">
										{agent.languages?.slice(0, 2).join(', ')}
										{agent.languages?.length > 2 && ` +${agent.languages.length - 2}`}
									</Typography>
								</Box>
							</Stack>
						</Box>

						{/* Recent Testimonial */}
						{variant === 'detailed' && agent.clientTestimonials?.length > 0 && (
							<Box component="div"   mb={2}>
								<Typography variant="subtitle2" gutterBottom>
									Recent Review
								</Typography>
								<Box component="div"   p={2} bgcolor="grey.50" borderRadius={1}>
									<Rating 
										value={agent.clientTestimonials[0].rating} 
										size="small" 
										readOnly 
									/>
									<Typography variant="body2" mt={1}>
										"{agent.clientTestimonials[0].review.slice(0, 100)}..."
									</Typography>
									<Typography variant="caption" color="text.secondary" mt={1} display="block">
										- {agent.clientTestimonials[0].clientName}
									</Typography>
								</Box>
							</Box>
						)}

						{/* Working Hours */}
						<Box component="div"   display="flex" alignItems="center" gap={0.5}>
							<TimeIcon fontSize="small" color="action" />
							<Typography variant="caption" color="text.secondary">
								{agent.workingHours} ({agent.timezone})
							</Typography>
							<Chip
								label={agent.availability}
								size="small"
								sx={{
									backgroundColor: getAvailabilityColor(agent.availability),
									color: 'white',
									ml: 1
								}}
							/>
						</Box>
						
						{/* Spacer to push actions to bottom */}
						<Box component="div"   sx={{ flex: 1 }} />
					</CardContent>

					{/* Action Buttons */}
					<CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
						<Stack direction="row" spacing={1}>
							<Tooltip title="Call">
															<IconButton 
								color="primary" 
								onClick={() => handleContact('phone')}
								size="medium"
								sx={{ width: 44, height: 44 }}
							>
								<PhoneIcon />
							</IconButton>
							</Tooltip>
							
							{agent.whatsapp && (
								<Tooltip title="WhatsApp">
																	<IconButton 
									color="success" 
									onClick={() => handleContact('whatsapp')}
									size="medium"
									sx={{ width: 44, height: 44 }}
								>
									<WhatsAppIcon />
								</IconButton>
								</Tooltip>
							)}
							
							<Tooltip title="Live Chat">
								<IconButton 
									color="info" 
									onClick={() => handleContact('chat')}
									size="medium"
									sx={{ width: 44, height: 44 }}
								>
									<ChatIcon />
								</IconButton>
							</Tooltip>
						</Stack>

											<Button
						variant="contained"
						size="medium"
						onClick={() => onViewProfile?.(agent._id)}
						startIcon={<ViewIcon />}
						sx={{
							minWidth: '120px',
							fontWeight: 600,
							textTransform: 'none'
						}}
					>
						View Profile
					</Button>
					</CardActions>
				</Card>
			</motion.div>

			{/* Contact Dialog */}
			<Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>
					Contact {agent.memberFullName || agent.memberNick}
				</DialogTitle>
				<DialogContent>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						Send a message to start a conversation about your car needs.
					</Typography>
					<TextField
						fullWidth
						multiline
						rows={4}
						placeholder="Hi, I'm interested in finding a car and would like to discuss my requirements..."
						value={contactMessage}
						onChange={(e) => setContactMessage(e.target.value)}
						sx={{ mt: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setContactDialogOpen(false)}>
						Cancel
					</Button>
					<Button 
						variant="contained" 
						onClick={() => {
							// Handle send message
							setContactDialogOpen(false);
							setContactMessage('');
						}}
						disabled={!contactMessage.trim()}
					>
						Send Message
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default EnhancedAgentCard;
