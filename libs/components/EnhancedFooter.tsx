import React, { useState } from 'react';
import { Stack, Box, Typography, TextField, Button, Grid, Divider,IconButton,Chip,Link} from '@mui/material';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import moment from 'moment';
// Social Media Icons
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TiktokIcon from '@mui/icons-material/MusicNote'; // Using as TikTok alternative
// Automotive Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';

const EnhancedFooter = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [subscribed, setSubscribed] = useState(false);

	const handleSubscribe = () => {
		if (email.trim()) {
			// Handle newsletter subscription
			setSubscribed(true);
			setEmail('');
		}
	};

	const popularCarBrands = [
		'Mercedes-Benz', 'BMW', 'Audi', 'Tesla', 'Porsche', 'Ferrari', 'Lamborghini', 'Bentley'
	];

	const quickLinks = [
		{ label: 'Buy Cars', href: '/car?purpose=buy' },
		{ label: 'Sell Cars', href: '/mypage?category=addCar' },
		{ label: 'Car Loans', href: '/services/loans' },
		{ label: 'Insurance', href: '/services/insurance' },
		{ label: 'Car History', href: '/services/history' },
		{ label: 'Trade-In', href: '/services/trade-in' }
	];

	const supportLinks = [
		{ label: 'Help Center', href: '/cs' },
		{ label: 'Contact Us', href: '/cs?tab=inquiry' },
		{ label: 'FAQs', href: '/cs?tab=faq' },
		{ label: 'Live Chat', href: '#' },
		{ label: 'Vehicle Reports', href: '/services/reports' },
		{ label: 'Warranty Info', href: '/services/warranty' }
	];

	const legalLinks = [
		{ label: 'Privacy Policy', href: '/legal/privacy' },
		{ label: 'Terms of Service', href: '/legal/terms' },
		{ label: 'Cookie Policy', href: '/legal/cookies' },
		{ label: 'Dealer Agreement', href: '/legal/dealer' }
	];

	const serviceAreas = [
		'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Jeju'
	];

	if (device === 'mobile') {
		return (
			<Box
				sx={{
					backgroundColor: '#0a0a0a',
					color: 'white',
					pt: 6,
					pb: 3,
					mt: 8
				}}
			>
				<div className="container">
					<Stack spacing={4}>
						{/* Logo & Brand */}
						<Stack alignItems="center" spacing={2}>
							<img 
								src="/img/logo/logoWhite.svg" 
								alt="Auto Salon Logo" 
								style={{ height: '48px' }}
							/>
							<Typography variant="h6" fontWeight={600} textAlign="center">
								Premium Auto Marketplace
							</Typography>
							<Stack direction="row" spacing={1}>
								<Chip 
									icon={<VerifiedIcon />} 
									label="Trusted Dealer" 
									color="primary" 
									size="small"
								/>
								<Chip 
									icon={<StarIcon />} 
									label="5-Star Service" 
									sx={{ backgroundColor: '#FFD700', color: '#000' }}
									size="small"
								/>
							</Stack>
						</Stack>

						{/* Newsletter */}
						<Box
							sx={{
								background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
								borderRadius: '16px',
								p: 3,
								textAlign: 'center'
							}}
						>
							<Typography variant="h6" fontWeight={600} mb={1}>
								🚗 Get Car Deals & Updates
							</Typography>
							<Typography variant="body2" mb={2} sx={{ opacity: 0.9 }}>
								Subscribe for exclusive car deals, market insights, and new arrivals
							</Typography>
							{!subscribed ? (
								<Stack spacing={2}>
									<TextField
										fullWidth
										placeholder="Your email address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										variant="outlined"
										size="small"
										sx={{
											'& .MuiOutlinedInput-root': {
												backgroundColor: 'white',
												borderRadius: '8px'
											}
										}}
									/>
									<Button
										variant="contained"
										onClick={handleSubscribe}
										sx={{
											backgroundColor: '#FFD700',
											color: '#000',
											fontWeight: 600,
											'&:hover': { backgroundColor: '#FFC107' }
										}}
									>
										Subscribe Now
									</Button>
								</Stack>
							) : (
								<Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600 }}>
									✅ Thanks for subscribing!
								</Typography>
							)}
						</Box>

						{/* Contact Info */}
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight={600}>Contact & Support</Typography>
							<Stack spacing={1}>
								<Stack direction="row" alignItems="center" spacing={1}>
									<PhoneIcon sx={{ color: '#4CAF50' }} />
									<Typography>+82 10 4867 2909</Typography>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={1}>
									<EmailIcon sx={{ color: '#2196F3' }} />
									<Typography>support@autosalon.com</Typography>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={1}>
									<SupportAgentIcon sx={{ color: '#FF9800' }} />
									<Typography>24/7 Customer Support</Typography>
								</Stack>
							</Stack>
						</Stack>

						{/* Quick Links */}
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight={600}>Quick Actions</Typography>
							<Grid container spacing={1}>
								{quickLinks.map((link, index) => (
									<Grid item xs={6} key={index}>
										<Link
											href={link.href}
											sx={{
												color: '#B0B0B0',
												textDecoration: 'none',
												'&:hover': { color: '#FFD700' }
											}}
										>
											{link.label}
										</Link>
									</Grid>
								))}
							</Grid>
						</Stack>

						{/* Popular Brands */}
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight={600}>Popular Brands</Typography>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{popularCarBrands.slice(0, 4).map((brand, index) => (
									<Chip
										key={index}
										label={brand}
										size="small"
										sx={{
											backgroundColor: '#1a1a1a',
											color: '#FFD700',
											'&:hover': { backgroundColor: '#2a2a2a' }
										}}
									/>
								))}
							</Stack>
						</Stack>

						{/* Social Media */}
						<Stack spacing={2}>
							<Typography variant="h6" fontWeight={600}>Follow Us</Typography>
							<Stack direction="row" spacing={2} justifyContent="center">
								<IconButton sx={{ color: '#1877f2' }}>
									<FacebookOutlinedIcon />
								</IconButton>
								<IconButton sx={{ color: '#E4405F' }}>
									<InstagramIcon />
								</IconButton>
								<IconButton sx={{ color: '#1DA1F2' }}>
									<TwitterIcon />
								</IconButton>
								<IconButton sx={{ color: '#FF0000' }}>
									<YouTubeIcon />
								</IconButton>
							</Stack>
						</Stack>

						<Divider sx={{ borderColor: '#2a2a2a' }} />

						{/* Copyright */}
						<Stack spacing={1} alignItems="center">
							<Typography variant="body2" color="#666" textAlign="center">
								© {moment().year()} Auto Salon. All rights reserved.
							</Typography>
							<Typography variant="caption" color="#666" textAlign="center">
								Premium automotive marketplace for luxury and quality vehicles
							</Typography>
						</Stack>
					</Stack>
				</div>
			</Box>
		);
	}

	// Desktop Version
	return (
		<Box
			sx={{
				backgroundColor: '#0a0a0a',
				color: 'white',
				pt: 8,
				pb: 4,
				mt: 8,
				position: 'relative',
				overflow: 'hidden'
			}}
		>
			{/* Background Pattern */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: 'url("/img/patterns/grid.svg")',
					opacity: 0.05,
					pointerEvents: 'none'
				}}
			/>
			
			<div className="container">
				<Grid container spacing={6}>
					{/* Company Info */}
					<Grid item xs={12} md={4}>
						<Stack spacing={3}>
							<Box>
								<img 
									src="/img/logo/logoWhite.svg" 
									alt="Auto Salon Logo" 
									style={{ height: '56px', marginBottom: '16px' }}
								/>
								<Typography variant="h5" fontWeight={700} mb={1}>
									Auto Salon
								</Typography>
								<Typography variant="body1" color="#B0B0B0" mb={2}>
									Korea's premier luxury automotive marketplace. Find, buy, and sell premium vehicles with confidence.
								</Typography>
								<Stack direction="row" spacing={1} mb={3}>
									<Chip 
										icon={<VerifiedIcon />} 
										label="Trusted Dealer Network" 
										color="primary"
									/>
									<Chip 
										icon={<SecurityIcon />} 
										label="Secure Transactions" 
										sx={{ backgroundColor: '#4CAF50', color: 'white' }}
									/>
								</Stack>
							</Box>

							{/* Newsletter Signup */}
							<Box
								sx={{
									background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
									borderRadius: '16px',
									p: 3
								}}
							>
								<Typography variant="h6" fontWeight={600} mb={1}>
									🚗 Stay Updated
								</Typography>
								<Typography variant="body2" mb={2} sx={{ opacity: 0.9 }}>
									Get exclusive deals and market insights
								</Typography>
								{!subscribed ? (
									<Stack direction="row" spacing={1}>
										<TextField
											placeholder="Enter email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											size="small"
											sx={{
												flex: 1,
												'& .MuiOutlinedInput-root': {
													backgroundColor: 'white',
													borderRadius: '8px'
												}
											}}
										/>
										<Button
											variant="contained"
											onClick={handleSubscribe}
											sx={{
												backgroundColor: '#FFD700',
												color: '#000',
												fontWeight: 600,
												'&:hover': { backgroundColor: '#FFC107' }
											}}
										>
											Subscribe
										</Button>
									</Stack>
								) : (
									<Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600 }}>
										✅ Successfully subscribed!
									</Typography>
								)}
							</Box>
						</Stack>
					</Grid>

					{/* Quick Links */}
					<Grid item xs={12} md={2}>
						<Stack spacing={3}>
							<Typography variant="h6" fontWeight={600} color="#FFD700">
								🔧 Services
							</Typography>
							<Stack spacing={1}>
								{quickLinks.map((link, index) => (
									<Link
										key={index}
										href={link.href}
										sx={{
											color: '#B0B0B0',
											textDecoration: 'none',
											fontSize: '14px',
											'&:hover': { 
												color: '#FFD700',
												transform: 'translateX(4px)',
												transition: 'all 0.2s ease'
											}
										}}
									>
										{link.label}
									</Link>
								))}
							</Stack>
						</Stack>
					</Grid>

					{/* Support */}
					<Grid item xs={12} md={2}>
						<Stack spacing={3}>
							<Typography variant="h6" fontWeight={600} color="#FFD700">
								🛠️ Support
							</Typography>
							<Stack spacing={1}>
								{supportLinks.map((link, index) => (
									<Link
										key={index}
										href={link.href}
										sx={{
											color: '#B0B0B0',
											textDecoration: 'none',
											fontSize: '14px',
											'&:hover': { 
												color: '#FFD700',
												transform: 'translateX(4px)',
												transition: 'all 0.2s ease'
											}
										}}
									>
										{link.label}
									</Link>
								))}
							</Stack>
						</Stack>
					</Grid>

					{/* Popular Brands & Service Areas */}
					<Grid item xs={12} md={4}>
						<Stack spacing={3}>
							{/* Popular Brands */}
							<Box>
								<Typography variant="h6" fontWeight={600} color="#FFD700" mb={2}>
									🏆 Popular Brands
								</Typography>
								<Stack direction="row" spacing={1} flexWrap="wrap">
									{popularCarBrands.map((brand, index) => (
										<Chip
											key={index}
											label={brand}
											size="small"
											sx={{
												backgroundColor: '#1a1a1a',
												color: '#FFD700',
												border: '1px solid #FFD700',
												mb: 1,
												'&:hover': { 
													backgroundColor: '#FFD700',
													color: '#0a0a0a'
												}
											}}
										/>
									))}
								</Stack>
							</Box>

							{/* Service Areas */}
							<Box>
								<Typography variant="h6" fontWeight={600} color="#FFD700" mb={2}>
									📍 Service Areas
								</Typography>
								<Grid container spacing={1}>
									{serviceAreas.map((area, index) => (
										<Grid item xs={6} key={index}>
											<Typography 
												variant="body2" 
												color="#B0B0B0"
												sx={{
													'&:hover': { color: '#FFD700', cursor: 'pointer' }
												}}
											>
												{area}
											</Typography>
										</Grid>
									))}
								</Grid>
							</Box>

							{/* Contact Info */}
							<Box>
								<Typography variant="h6" fontWeight={600} color="#FFD700" mb={2}>
									📞 Contact
								</Typography>
								<Stack spacing={1}>
									<Stack direction="row" alignItems="center" spacing={1}>
										<PhoneIcon sx={{ color: '#4CAF50', fontSize: 18 }} />
										<Typography variant="body2">+82 10 4867 2909</Typography>
									</Stack>
									<Stack direction="row" alignItems="center" spacing={1}>
										<EmailIcon sx={{ color: '#2196F3', fontSize: 18 }} />
										<Typography variant="body2">support@autosalon.com</Typography>
									</Stack>
									<Stack direction="row" alignItems="center" spacing={1}>
										<SupportAgentIcon sx={{ color: '#FF9800', fontSize: 18 }} />
										<Typography variant="body2">24/7 Premium Support</Typography>
									</Stack>
								</Stack>
							</Box>
						</Stack>
					</Grid>
				</Grid>

				<Divider sx={{ borderColor: '#2a2a2a', my: 4 }} />

				{/* Bottom Section */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" spacing={2}>
					<Stack direction="row" alignItems="center" spacing={4}>
						<Typography variant="body2" color="#666">
							© {moment().year()} Auto Salon Korea. All rights reserved.
						</Typography>
						<Stack direction="row" spacing={2}>
							{legalLinks.map((link, index) => (
								<Link
									key={index}
									href={link.href}
									sx={{
										color: '#666',
										textDecoration: 'none',
										fontSize: '12px',
										'&:hover': { color: '#FFD700' }
									}}
								>
									{link.label}
								</Link>
							))}
						</Stack>
					</Stack>

					{/* Social Media */}
					<Stack direction="row" spacing={1}>
						<IconButton size="small" sx={{ color: '#1877f2', '&:hover': { backgroundColor: '#1877f220' } }}>
							<FacebookOutlinedIcon />
						</IconButton>
						<IconButton size="small" sx={{ color: '#E4405F', '&:hover': { backgroundColor: '#E4405F20' } }}>
							<InstagramIcon />
						</IconButton>
						<IconButton size="small" sx={{ color: '#1DA1F2', '&:hover': { backgroundColor: '#1DA1F220' } }}>
							<TwitterIcon />
						</IconButton>
						<IconButton size="small" sx={{ color: '#FF0000', '&:hover': { backgroundColor: '#FF000020' } }}>
							<YouTubeIcon />
						</IconButton>
						<IconButton size="small" sx={{ color: '#0A66C2', '&:hover': { backgroundColor: '#0A66C220' } }}>
							<LinkedInIcon />
						</IconButton>
					</Stack>
				</Stack>
			</div>
		</Box>
	);
};

export default EnhancedFooter;
