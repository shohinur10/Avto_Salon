import React, { useState } from 'react';
import { Stack, Box, Typography, TextField, Button, Grid, Divider, IconButton, Chip, Link } from '@mui/material';
import useDeviceDetect from '../hooks/useDeviceDetect';
import moment from 'moment';
// Social Media Icons
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // TikTok alternative
// Automotive Icons
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';

const Footer = () => {
	const device = useDeviceDetect();
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
		'Mercedes-Benz', 'BMW', 'Audi', 'Tesla', 'Porsche', 'Lexus', 'Genesis', 'Hyundai'
	];

	const carCategories = [
		{ label: 'Luxury Cars', href: '/car?category=luxury' },
		{ label: 'Electric Vehicles', href: '/car?category=electric' },
		{ label: 'SUVs & Crossovers', href: '/car?category=suv' },
		{ label: 'Sports Cars', href: '/car?category=sports' },
		{ label: 'Sedans', href: '/car?category=sedan' },
		{ label: 'Certified Pre-Owned', href: '/car?category=certified' }
	];

	const ourServices = [
		{ label: 'Buy New Cars', href: '/car?purpose=buy&type=new' },
		{ label: 'Buy Used Cars', href: '/car?purpose=buy&type=used' },
		{ label: 'Sell Your Car', href: '/mypage?category=addCar' },
		{ label: 'Car Financing', href: '/services/loans' },
		{ label: 'Detailing & Service', href: '/services/detailing' },
		{ label: 'Insurance', href: '/services/insurance' },
		{ label: 'Trade-In Value', href: '/services/trade-in' },
		{ label: 'Extended Warranty', href: '/services/warranty' },
		{ label: 'Car Inspection', href: '/services/inspection' },
		{ label: 'Delivery Service', href: '/services/delivery' }
	];

	const quickLinks = [
		{ label: 'Browse Inventory', href: '/car' },
		{ label: 'Find Dealers', href: '/agent' },
		{ label: 'Car Reviews', href: '/community?category=reviews' },
		{ label: 'Price Calculator', href: '/tools/calculator' },
		{ label: 'Schedule Test Drive', href: '/services/test-drive' },
		{ label: 'About Us', href: '/about' }
	];

	const supportLinks = [
		{ label: 'Customer Support', href: '/cs' },
		{ label: 'Live Chat (24/7)', href: '/cs?tab=chat' },
		{ label: 'FAQs', href: '/cs?tab=faq' },
		{ label: 'Financing Help', href: '/cs?tab=financing' },
		{ label: 'Vehicle History', href: '/services/history' },
		{ label: 'Service Centers', href: '/services/centers' },
		{ label: 'Warranty Claims', href: '/cs?tab=warranty' },
		{ label: 'Technical Support', href: '/cs?tab=technical' }
	];

	const legalLinks = [
		{ label: 'Privacy Policy', href: '/legal/privacy' },
		{ label: 'Terms of Service', href: '/legal/terms' },
		{ label: 'Cookie Policy', href: '/legal/cookies' },
		{ label: 'Dealer Agreement', href: '/legal/dealer' }
	];

	const serviceAreas = [
		'Seoul', 'Dubai', 'London', 'Paris', 'Tokyo', 'New York', 'Barcelona', 'Munich'
	];

	// Mobile Version
	if (device === 'mobile') {
		return (
			<Box component="div"  
				sx={{
					backgroundColor: '#121212',
					color: '#cccccc',
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
					pt: 6,
					pb: 3,
					mt: 8,
					width: '100vw',
					position: 'relative',
					left: '50%',
					right: '50%',
					marginLeft: '-50vw',
					marginRight: '-50vw'
				}}
			>
				<Box component="div"   sx={{ 
					maxWidth: '1600px', 
					margin: '0 auto', 
					px: { xs: 3, sm: 4 } // Increased padding on mobile
				}}>
					<Stack spacing={4}>
						{/* Logo & Brand */}
						<Stack alignItems="center" spacing={2}>
							<img 
								src="/img/logo/logo.png" 
								alt="Auto Salon Logo" 
								style={{ height: '60px' }}
							/>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 700, 
									textAlign: 'center',
									color: '#ffffff',
									fontSize: '18px'
								}}
							>
								Auto Salon
							</Typography>
							<Typography 
								sx={{ 
									textAlign: 'center',
									fontSize: '14px',
									lineHeight: 1.8,
									color: '#cccccc'
								}}
							>
								Premium automotive marketplace for luxury vehicles
							</Typography>
							<Stack direction="row" spacing={1}>
								<Chip 
									icon={<VerifiedIcon sx={{ fontSize: '16px' }} />} 
									label="Verified Dealer" 
									size="small"
									sx={{ 
										backgroundColor: '#2a2a2a',
										color: '#ffcc00',
										fontSize: '12px'
									}}
								/>
								<Chip 
									icon={<StarIcon sx={{ fontSize: '16px' }} />} 
									label="5-Star Service" 
									size="small"
									sx={{ 
										backgroundColor: '#ffcc00',
										color: '#121212',
										fontSize: '12px'
									}}
								/>
							</Stack>
						</Stack>

						{/* Newsletter */}
						<Box component="div"  
							sx={{
								backgroundColor: '#2a2a2a',
								borderRadius: '12px',
								p: 3,
								textAlign: 'center',
								border: '1px solid #404040'
							}}
						>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 600, 
									mb: 1,
									color: '#ffffff',
									fontSize: '16px'
								}}
							>
								Stay Connected
							</Typography>
							<Typography 
								sx={{ 
									mb: 2, 
									fontSize: '14px',
									lineHeight: 1.8,
									color: '#cccccc'
								}}
							>
								Subscribe for exclusive deals, market insights, and new arrivals
							</Typography>
							{!subscribed ? (
								<Stack spacing={2}>
									<TextField
										fullWidth
										placeholder="Enter your email address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										variant="outlined"
										size="small"
										sx={{
											'& .MuiOutlinedInput-root': {
												backgroundColor: '#121212',
												color: '#cccccc',
												fontSize: '14px',
												'& fieldset': {
													borderColor: '#404040'
												},
												'&:hover fieldset': {
													borderColor: '#ffcc00'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#ffcc00'
												}
											},
											'& .MuiInputBase-input::placeholder': {
												color: '#888888'
											}
										}}
									/>
									<Button
										variant="contained"
										onClick={handleSubscribe}
										sx={{
											backgroundColor: '#ffcc00',
											color: '#121212',
											fontWeight: 600,
											fontSize: '14px',
											'&:hover': { 
												backgroundColor: '#e6b800',
												transform: 'translateY(-1px)'
											},
											transition: 'all 0.2s ease'
										}}
									>
										Subscribe Now
									</Button>
								</Stack>
							) : (
								<Typography sx={{ color: '#4CAF50', fontWeight: 600, fontSize: '14px' }}>
									✅ Thanks for subscribing!
								</Typography>
							)}
						</Box>
						
						{/* Contact Info */}
						<Stack spacing={2}>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 700,
									color: '#ffffff',
									fontSize: '16px'
								}}
							>
								Contact & Support
							</Typography>
							<Stack spacing={1.5}>
								<Stack direction="row" alignItems="center" spacing={1}>
									<PhoneIcon sx={{ color: '#ffcc00', fontSize: 16 }} />
									<Typography sx={{ fontSize: '14px', lineHeight: 1.8 }}>
										+82 10 4867 2909
									</Typography>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={1}>
									<EmailIcon sx={{ color: '#ffcc00', fontSize: 16 }} />
									<Typography sx={{ fontSize: '14px', lineHeight: 1.8 }}>
										support@autosalon.com
									</Typography>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={1}>
									<LocationOnIcon sx={{ color: '#ffcc00', fontSize: 16 }} />
									<Typography sx={{ fontSize: '14px', lineHeight: 1.8 }}>
										Seoul, South Korea • 24/7 Support
									</Typography>
								</Stack>
							</Stack>
						</Stack>

						{/* Car Categories */}
						<Stack spacing={2}>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 700,
									color: '#ffffff',
									fontSize: '16px'
								}}
							>
								Shop by Category
							</Typography>
							<Grid container spacing={1}>
								{carCategories.slice(0, 4).map((category, index) => (
									<Grid item xs={6} key={index}>
										<Link
											href={category.href}
											sx={{
												color: '#cccccc',
												textDecoration: 'none',
												fontSize: '14px',
												lineHeight: 1.8,
												'&:hover': { color: '#ffcc00' }
											}}
										>
											{category.label}
										</Link>
									</Grid>
								))}
							</Grid>
					</Stack>

						{/* Our Services */}
						<Stack spacing={2}>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 700,
									color: '#ffffff',
									fontSize: '16px'
								}}
							>
							Our Services
						</Typography>
							<Grid container spacing={1}>
								{ourServices.slice(0, 6).map((service, index) => (
									<Grid item xs={6} key={index}>
										<Link
											href={service.href}
											sx={{
												color: '#cccccc',
												textDecoration: 'none',
												fontSize: '14px',
												lineHeight: 1.8,
												'&:hover': { color: '#ffcc00' }
											}}
										>
											{service.label}
										</Link>
									</Grid>
								))}
							</Grid>
					</Stack>

						{/* Quick Actions */}
						<Stack spacing={2}>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 700,
									color: '#ffffff',
									fontSize: '16px'
								}}
							>
								Quick Actions
						</Typography>
							<Grid container spacing={1}>
								{quickLinks.slice(0, 4).map((link, index) => (
									<Grid item xs={6} key={index}>
										<Link
											href={link.href}
											sx={{
												color: '#cccccc',
												textDecoration: 'none',
												fontSize: '14px',
												lineHeight: 1.8,
												'&:hover': { color: '#ffcc00' }
											}}
										>
											{link.label}
										</Link>
									</Grid>
								))}
							</Grid>
					</Stack>

						{/* Social Media */}
						<Stack spacing={2}>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 700,
									color: '#ffffff',
									fontSize: '16px'
								}}
							>
								Follow Us
						</Typography>
							<Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
								<IconButton 
									sx={{ 
										color: '#E4405F',
										backgroundColor: 'rgba(228, 64, 95, 0.1)',
										border: '2px solid rgba(228, 64, 95, 0.3)',
										width: 56,
										height: 56,
										'&:hover': { 
											color: '#E4405F',
											backgroundColor: 'rgba(228, 64, 95, 0.2)',
											transform: 'scale(1.1)',
											borderColor: '#E4405F'
										},
										transition: 'all 0.3s ease'
									}}
								>
									<InstagramIcon sx={{ fontSize: 28 }} />
								</IconButton>
								<IconButton 
									sx={{ 
										color: '#ff0050',
										backgroundColor: 'rgba(255, 0, 80, 0.1)',
										border: '2px solid rgba(255, 0, 80, 0.3)',
										width: 56,
										height: 56,
										'&:hover': { 
											color: '#ff0050',
											backgroundColor: 'rgba(255, 0, 80, 0.2)',
											transform: 'scale(1.1)',
											borderColor: '#ff0050'
										},
										transition: 'all 0.3s ease'
									}}
								>
									<MusicNoteIcon sx={{ fontSize: 28 }} />
								</IconButton>
								<IconButton 
									sx={{ 
										color: '#FF0000',
										backgroundColor: 'rgba(255, 0, 0, 0.1)',
										border: '2px solid rgba(255, 0, 0, 0.3)',
										width: 56,
										height: 56,
										'&:hover': { 
											color: '#FF0000',
											backgroundColor: 'rgba(255, 0, 0, 0.2)',
											transform: 'scale(1.1)',
											borderColor: '#FF0000'
										},
										transition: 'all 0.3s ease'
									}}
								>
									<YouTubeIcon sx={{ fontSize: 28 }} />
								</IconButton>
								<IconButton 
									sx={{ 
										color: '#0A66C2',
										backgroundColor: 'rgba(10, 102, 194, 0.1)',
										border: '2px solid rgba(10, 102, 194, 0.3)',
										width: 56,
										height: 56,
										'&:hover': { 
											color: '#0A66C2',
											backgroundColor: 'rgba(10, 102, 194, 0.2)',
											transform: 'scale(1.15)',
											borderColor: '#0A66C2'
										},
										transition: 'all 0.3s ease'
									}}
								>
									<LinkedInIcon sx={{ fontSize: 28 }} />
								</IconButton>
					</Stack>
							<Typography 
								sx={{ 
									fontSize: '13px', 
									textAlign: 'center',
									color: '#888888',
									mt: 2
								}}
							>
								Join 50K+ car enthusiasts
							</Typography>
				</Stack>

						<Divider sx={{ borderColor: '#404040' }} />

						{/* Copyright */}
						<Stack spacing={2} alignItems="center">
							<Typography 
								sx={{ 
									fontSize: '14px', 
									color: '#888888', 
									textAlign: 'center' 
								}}
							>
								© {moment().year()} Auto Salon Korea. All rights reserved.
							</Typography>
							<Stack direction="row" spacing={2}>
								{legalLinks.slice(0, 2).map((link, index) => (
									<Link
										key={index}
										href={link.href}
										sx={{
											color: '#888888',
											textDecoration: 'none',
											fontSize: '12px',
											'&:hover': { color: '#ffcc00' }
										}}
									>
										{link.label}
									</Link>
								))}
							</Stack>
						</Stack>
					</Stack>
				</Box>
			</Box>
		);
	}

	// Desktop Version
	return (
		<Box component="div"  
			sx={{
				backgroundColor: '#121212',
				color: '#cccccc',
				fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
				pt: 6,
				pb: 4,
				mt: 8,
				width: '100vw',
				position: 'relative',
				left: '50%',
				right: '50%',
				marginLeft: '-50vw',
				marginRight: '-50vw'
			}}
		>
			<Box component="div"   sx={{ 
				maxWidth: '1600px', 
				margin: '0 auto', 
				px: { xs: 3, sm: 4, md: 6, lg: 8 } // Responsive padding
			}}>
				{/* Main Footer Grid - Responsive Columns */}
				<Box component="div"  
					sx={{
						display: 'grid',
						gridTemplateColumns: { 
							xs: '1fr', 
							sm: 'repeat(2, 1fr)', 
							md: 'repeat(3, 1fr)',
							lg: '2fr 1fr 1fr 1fr 1.5fr' 
						},
						gap: { xs: 4, sm: 6, md: 8, lg: 12 },
						mb: 4,
						width: '100%'
					}}
				>
					{/* Column 1: Company Info & Logo */}
					<Box component="div"   sx={{ 
						gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: '1' }
					}}>
										<img 
					src="/img/logo/logo.png" 
					alt="Auto Salon Logo" 
					style={{ height: '60px', marginBottom: '20px' }}
				/>
						<Typography 
							variant="h6" 
							sx={{ 
								fontWeight: 700, 
								fontSize: '18px',
								mb: 2,
								color: '#ffffff'
							}}
						>
							Auto Salon
						</Typography>
						<Typography 
							sx={{ 
								fontSize: '14px', 
								lineHeight: 1.8,
								color: '#cccccc',
								mb: 3
							}}
						>
							Korea's premier luxury automotive marketplace. Find, buy, and sell premium vehicles with confidence. We connect buyers and sellers across Seoul, Busan, and nationwide with over 10,000+ verified luxury cars.
						</Typography>
						
						{/* Trust Signals */}
						<Stack spacing={1.5}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<PhoneIcon sx={{ color: '#ffcc00', fontSize: 16 }} />
								<Typography sx={{ fontSize: '14px', lineHeight: 1.8 }}>
									+82 10 4867 2909
								</Typography>
							</Stack>
							<Stack direction="row" alignItems="center" spacing={1}>
								<EmailIcon sx={{ color: '#ffcc00', fontSize: 16 }} />
								<Typography sx={{ fontSize: '14px', lineHeight: 1.8 }}>
									support@autosalon.com
								</Typography>
							</Stack>
							<Stack direction="row" alignItems="center" spacing={1}>
								<LocationOnIcon sx={{ color: '#ffcc00', fontSize: 16 }} />
								<Typography sx={{ fontSize: '14px', lineHeight: 1.8 }}>
									Seoul, South Korea
								</Typography>
							</Stack>
						</Stack>
					</Box>

					{/* Column 2: Car Categories */}
					<Box component="div"   sx={{ 
						gridColumn: { xs: '1', sm: '1', md: '1', lg: '2' }
					}}>
						<Typography 
							variant="h6" 
							sx={{ 
								fontWeight: 700, 
								fontSize: '16px',
								mb: 3,
								color: '#ffffff'
							}}
						>
							Shop by Category
						</Typography>
						<Stack spacing={1}>
							{carCategories.map((category, index) => (
								<Link
									key={index}
									href={category.href}
									sx={{
										color: '#cccccc',
										textDecoration: 'none',
										fontSize: '14px',
										lineHeight: 1.8,
										'&:hover': { 
											color: '#ffcc00',
											transition: 'color 0.2s ease'
										}
									}}
								>
									{category.label}
								</Link>
							))}
						</Stack>
					</Box>

					{/* Column 3: Our Services */}
					<Box component="div"   sx={{ 
						gridColumn: { xs: '1', sm: '2', md: '2', lg: '3' }
					}}>
						<Typography 
							variant="h6" 
							sx={{ 
								fontWeight: 700, 
								fontSize: '16px',
								mb: 3,
								color: '#ffffff'
							}}
						>
							Our Services
						</Typography>
						<Stack spacing={1}>
							{ourServices.map((service, index) => (
								<Link
									key={index}
									href={service.href}
									sx={{
										color: '#cccccc',
										textDecoration: 'none',
										fontSize: '14px',
										lineHeight: 1.8,
										'&:hover': { 
											color: '#ffcc00',
											transition: 'color 0.2s ease'
										}
									}}
								>
									{service.label}
								</Link>
							))}
						</Stack>
					</Box>

					{/* Column 4: Quick Actions */}
					<Box component="div"   sx={{ 
						gridColumn: { xs: '1', sm: '1', md: '3', lg: '4' }
					}}>
						<Typography 
							variant="h6" 
							sx={{ 
								fontWeight: 700, 
								fontSize: '16px',
								mb: 3,
								color: '#ffffff'
							}}
						>
							Quick Actions
						</Typography>
						<Stack spacing={1}>
							{quickLinks.map((link, index) => (
								<Link
									key={index}
									href={link.href}
									sx={{
										color: '#cccccc',
										textDecoration: 'none',
										fontSize: '14px',
										lineHeight: 1.8,
										'&:hover': { 
											color: '#ffcc00',
											transition: 'color 0.2s ease'
										}
									}}
								>
									{link.label}
								</Link>
							))}
						</Stack>
						
						{/* Support section within Quick Actions */}
						<Typography 
							variant="h6" 
							sx={{ 
								fontWeight: 700, 
								fontSize: '14px',
								mt: 3,
								mb: 2,
								color: '#ffffff'
							}}
						>
							Support
						</Typography>
						<Stack spacing={1}>
							{supportLinks.slice(0, 5).map((link, index) => (
								<Link
									key={index}
									href={link.href}
									sx={{
										color: '#cccccc',
										textDecoration: 'none',
										fontSize: '14px',
										lineHeight: 1.8,
										'&:hover': { 
											color: '#ffcc00',
											transition: 'color 0.2s ease'
										}
									}}
								>
									{link.label}
								</Link>
							))}
						</Stack>
					</Box>

					{/* Column 5: Newsletter & Social Media */}
					<Box component="div"   sx={{ 
						gridColumn: { xs: '1', sm: '2', md: 'span 3', lg: '5' }
					}}>
						<Typography 
							variant="h6" 
							sx={{ 
								fontWeight: 700, 
								fontSize: '16px',
								mb: 3,
								color: '#ffffff'
							}}
						>
							Stay Connected
						</Typography>
						
						{/* Newsletter Signup */}
						<Box component="div"   sx={{ mb: 4 }}>
							<Typography 
								sx={{ 
									fontSize: '14px', 
									lineHeight: 1.8,
									mb: 2
								}}
							>
								Subscribe for exclusive deals and market insights
							</Typography>
							{!subscribed ? (
								<Stack spacing={2}>
									<TextField
										placeholder="Enter your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										size="small"
										sx={{
											'& .MuiOutlinedInput-root': {
												backgroundColor: '#2a2a2a',
												color: '#cccccc',
												fontSize: '14px',
												'& fieldset': {
													borderColor: '#404040'
												},
												'&:hover fieldset': {
													borderColor: '#ffcc00'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#ffcc00'
												}
											},
											'& .MuiInputBase-input::placeholder': {
												color: '#888888'
											}
										}}
									/>
									<Button
										variant="contained"
										onClick={handleSubscribe}
										sx={{
											backgroundColor: '#ffcc00',
											color: '#121212',
											fontWeight: 600,
											fontSize: '14px',
											'&:hover': { 
												backgroundColor: '#e6b800',
												transform: 'translateY(-1px)'
											},
											transition: 'all 0.2s ease'
										}}
									>
										Subscribe
									</Button>
								</Stack>
							) : (
								<Typography sx={{ color: '#4CAF50', fontWeight: 600, fontSize: '14px' }}>
									✅ Successfully subscribed!
								</Typography>
							)}
						</Box>

						{/* Social Media Icons */}
						<Box component="div"  >
							<Typography 
								sx={{ 
									fontSize: '16px', 
									fontWeight: 600,
									lineHeight: 1.8,
									mb: 3,
									color: '#ffffff'
								}}
							>
									Follow Our Journey
							</Typography>
							<Stack spacing={2}>
								<Stack direction="row" spacing={2} justifyContent="center">
									<IconButton 
										sx={{ 
											color: '#E4405F',
											backgroundColor: 'rgba(228, 64, 95, 0.1)',
											border: '2px solid rgba(228, 64, 95, 0.3)',
											width: 48,
											height: 48,
											'&:hover': { 
												color: '#E4405F',
												backgroundColor: 'rgba(228, 64, 95, 0.2)',
												transform: 'scale(1.15)',
												borderColor: '#E4405F'
											},
											transition: 'all 0.3s ease'
										}}
									>
										<InstagramIcon sx={{ fontSize: 24 }} />
									</IconButton>
									<IconButton 
										sx={{ 
											color: '#ff0050',
											backgroundColor: 'rgba(255, 0, 80, 0.1)',
											border: '2px solid rgba(255, 0, 80, 0.3)',
											width: 48,
											height: 48,
											'&:hover': { 
												color: '#ff0050',
												backgroundColor: 'rgba(255, 0, 80, 0.2)',
												transform: 'scale(1.15)',
												borderColor: '#ff0050'
											},
											transition: 'all 0.3s ease'
										}}
									>
										<MusicNoteIcon sx={{ fontSize: 24 }} />
									</IconButton>
								</Stack>
								<Stack direction="row" spacing={2} justifyContent="center">
									<IconButton 
										sx={{ 
											color: '#FF0000',
											backgroundColor: 'rgba(255, 0, 0, 0.1)',
											border: '2px solid rgba(255, 0, 0, 0.3)',
											width: 48,
											height: 48,
											'&:hover': { 
												color: '#FF0000',
												backgroundColor: 'rgba(255, 0, 0, 0.2)',
												transform: 'scale(1.15)',
												borderColor: '#FF0000'
											},
											transition: 'all 0.3s ease'
										}}
									>
										<YouTubeIcon sx={{ fontSize: 24 }} />
									</IconButton>
									<IconButton 
										sx={{ 
											color: '#0A66C2',
											backgroundColor: 'rgba(10, 102, 194, 0.1)',
											border: '2px solid rgba(10, 102, 194, 0.3)',
											width: 48,
											height: 48,
											'&:hover': { 
												color: '#0A66C2',
												backgroundColor: 'rgba(10, 102, 194, 0.2)',
												transform: 'scale(1.15)',
												borderColor: '#0A66C2'
											},
											transition: 'all 0.3s ease'
										}}
									>
										<LinkedInIcon sx={{ fontSize: 24 }} />
									</IconButton>
								</Stack>
								<Typography 
									sx={{ 
										fontSize: '13px', 
										textAlign: 'center',
										color: '#888888',
										mt: 2
									}}
								>
									Join 50K+ car enthusiasts
								</Typography>
							</Stack>
						</Box>
					</Box>
				</Box>

				<Divider sx={{ borderColor: '#404040', my: 3 }} />

				{/* Bottom Section */}
				<Stack 
					direction={{ xs: 'column', md: 'row' }} 
					alignItems="center" 
					justifyContent="space-between" 
					spacing={2}
					sx={{ width: '100%' }}
				>
					<Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={3}>
						<Typography sx={{ fontSize: '14px', color: '#888888' }}>
							© {moment().year()} Auto Salon Korea. All rights reserved.
						</Typography>
						<Stack direction="row" spacing={2}>
							{legalLinks.map((link, index) => (
								<Link
									key={index}
									href={link.href}
									sx={{
										color: '#888888',
										textDecoration: 'none',
										fontSize: '12px',
										'&:hover': { color: '#ffcc00' }
									}}
								>
									{link.label}
								</Link>
							))}
						</Stack>
					</Stack>

					{/* Trust Badges */}
					<Stack direction="row" spacing={1} alignItems="center">
						<Chip 
							icon={<VerifiedIcon sx={{ fontSize: '16px' }} />} 
							label="Verified Dealer" 
							size="small"
							sx={{ 
								backgroundColor: '#2a2a2a',
								color: '#ffcc00',
								fontSize: '12px'
							}}
						/>
						<Chip 
							icon={<StarIcon sx={{ fontSize: '16px' }} />} 
							label="5-Star Service" 
							size="small"
							sx={{ 
								backgroundColor: '#ffcc00',
								color: '#121212',
								fontSize: '12px'
							}}
						/>
					</Stack>
				</Stack>
			</Box>
		</Box>
		);
};

export default Footer;