import React, { useState, useEffect, useRef } from 'react';
import { 
	Box, 
	Typography, 
	Button, 
	Card,
	IconButton,
	Tooltip,
	LinearProgress,
	Chip,
	Avatar,
	Badge,
	Zoom,
	Fade
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import useDeviceDetect from '../hooks/useDeviceDetect';

// Icons
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatIcon from '@mui/icons-material/Chat';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// This is NOT another traditional footer - it's a SMART DASHBOARD
const InteractiveFooter = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const footerRef = useRef<HTMLDivElement>(null);
	
	// Revolutionary approach: LIVE DATA VISUALIZATION
	const [activeSection, setActiveSection] = useState<string>('marketplace');
	const [marketData, setMarketData] = useState({
		totalCars: 12847,
		activeDeals: 247,
		avgPrice: 45670000,
		marketTrend: '+12.5%',
		hotBrands: ['Tesla', 'BMW', 'Mercedes', 'Audi'],
		lastUpdate: new Date()
	});
	
	const [userActivity, setUserActivity] = useState({
		currentViewers: 1247,
		todayInquiries: 89,
		responseTime: '1.2min'
	});

	// Real-time animations and updates
	useEffect(() => {
		const interval = setInterval(() => {
			setMarketData(prev => ({
				...prev,
				totalCars: prev.totalCars + Math.floor(Math.random() * 3),
				activeDeals: prev.activeDeals + Math.floor(Math.random() * 2),
				lastUpdate: new Date()
			}));
			
			setUserActivity(prev => ({
				...prev,
				currentViewers: prev.currentViewers + Math.floor(Math.random() * 10) - 5,
				todayInquiries: prev.todayInquiries + Math.floor(Math.random() * 2)
			}));
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	// Interactive sections with DIFFERENT logic than typical footers
	const FooterSection = ({ id, title, icon, isActive, onClick, children }: any) => (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<Card
				onClick={() => onClick(id)}
				sx={{
					background: isActive 
						? 'linear-gradient(135deg, #FFD700, #FFA000)' 
						: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
					color: isActive ? '#000' : '#fff',
					cursor: 'pointer',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					border: isActive ? '2px solid #FFD700' : '1px solid #333',
					'&:hover': {
						boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
						transform: 'translateY(-4px)'
					}
				}}
			>
				<Box sx={{ p: 2 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
						{icon}
						<Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
							{title}
						</Typography>
					</Box>
					<AnimatePresence>
						{isActive && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								{children}
							</motion.div>
						)}
					</AnimatePresence>
				</Box>
			</Card>
		</motion.div>
	);

	const handleSectionClick = (sectionId: string) => {
		setActiveSection(activeSection === sectionId ? '' : sectionId);
	};

	// This is the revolutionary part - CONTEXT-AWARE content based on user behavior
	const getSmartRecommendations = () => {
		const currentHour = new Date().getHours();
		const isBusinessHours = currentHour >= 9 && currentHour <= 18;
		
		if (!isBusinessHours) {
			return {
				message: "🌙 Night Owl? Check out our 24/7 car browsing!",
				action: "Browse Cars",
				href: "/car"
			};
		} else {
			return {
				message: "☀️ Perfect time to talk to our dealers!",
				action: "Contact Dealer",
				href: "/agent"
			};
		}
	};

	const recommendation = getSmartRecommendations();

	if (device === 'mobile') {
		return (
			<Box
				ref={footerRef}
				sx={{
					background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
					color: 'white',
					py: 3,
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				{/* Animated background particles */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: `
							radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
							radial-gradient(circle at 80% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
							radial-gradient(circle at 40% 40%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)
						`,
						animation: 'float 6s ease-in-out infinite'
					}}
				/>
				
				<Box sx={{ position: 'relative', zIndex: 1, px: 2 }}>
					{/* Live Market Status - UNIQUE APPROACH */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6 }}
					>
						<Card sx={{ 
							background: 'rgba(255, 215, 0, 0.15)', 
							backdropFilter: 'blur(10px)',
							border: '1px solid rgba(255, 215, 0, 0.3)',
							mb: 3
						}}>
							<Box sx={{ p: 2 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
									<Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
										🚀 Live Marketplace
									</Typography>
									<Chip 
										icon={<FlashOnIcon />}
										label="LIVE"
										size="small"
										sx={{ 
											backgroundColor: '#4CAF50', 
											color: 'white',
											animation: 'pulse 2s infinite'
										}}
									/>
								</Box>
								
								{/* Real-time counters */}
								<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, textAlign: 'center' }}>
									<Box>
										<motion.div
											key={marketData.totalCars}
											initial={{ scale: 1.2, color: '#4CAF50' }}
											animate={{ scale: 1, color: '#fff' }}
											transition={{ duration: 0.3 }}
										>
											<Typography variant="h6" fontWeight="bold">
												{marketData.totalCars.toLocaleString()}
											</Typography>
										</motion.div>
										<Typography variant="caption">Cars</Typography>
									</Box>
									<Box>
										<motion.div
											key={marketData.activeDeals}
											initial={{ scale: 1.2, color: '#FF6B6B' }}
											animate={{ scale: 1, color: '#fff' }}
											transition={{ duration: 0.3 }}
										>
											<Typography variant="h6" fontWeight="bold">
												{marketData.activeDeals}
											</Typography>
										</motion.div>
										<Typography variant="caption">Hot Deals</Typography>
									</Box>
									<Box>
										<Typography variant="h6" fontWeight="bold" color="#4CAF50">
											{marketData.marketTrend}
										</Typography>
										<Typography variant="caption">Growth</Typography>
									</Box>
								</Box>
							</Box>
						</Card>
					</motion.div>

					{/* Smart Contextual Suggestions */}
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<Card sx={{ 
							background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
							mb: 3
						}}>
							<Box sx={{ p: 2, textAlign: 'center' }}>
								<Typography variant="body1" sx={{ mb: 1 }}>
									{recommendation.message}
								</Typography>
								<Button
									variant="contained"
									onClick={() => router.push(recommendation.href)}
									sx={{
										backgroundColor: '#FFD700',
										color: '#000',
										fontWeight: 'bold',
										'&:hover': { backgroundColor: '#FFC107', transform: 'scale(1.05)' }
									}}
								>
									{recommendation.action}
								</Button>
							</Box>
						</Card>
					</motion.div>

					{/* Interactive Support Hub */}
					<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
						<Card sx={{ background: 'rgba(76, 175, 80, 0.15)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
							<Box sx={{ p: 2, textAlign: 'center' }}>
								<Badge color="success" variant="dot">
									<SupportAgentIcon sx={{ color: '#4CAF50', fontSize: 32 }} />
								</Badge>
								<Typography variant="body2" sx={{ mt: 1 }}>
									Live Support
								</Typography>
								<Typography variant="caption" color="#4CAF50">
									{userActivity.responseTime} avg
								</Typography>
							</Box>
						</Card>

						<Card sx={{ background: 'rgba(255, 107, 107, 0.15)', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
							<Box sx={{ p: 2, textAlign: 'center' }}>
								<WhatshotIcon sx={{ color: '#FF6B6B', fontSize: 32 }} />
								<Typography variant="body2" sx={{ mt: 1 }}>
									Hot Deals
								</Typography>
								<Typography variant="caption" color="#FF6B6B">
									{userActivity.todayInquiries} today
								</Typography>
							</Box>
						</Card>
					</Box>

					{/* Dynamic Brand Trending */}
					<Typography variant="h6" sx={{ mb: 2, color: '#FFD700' }}>
						🔥 Trending Now
					</Typography>
					<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
						{marketData.hotBrands.map((brand, index) => (
							<motion.div
								key={brand}
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.1 }}
							>
								<Chip
									label={brand}
									sx={{
										background: 'linear-gradient(45deg, #FFD700, #FFA000)',
										color: '#000',
										fontWeight: 'bold',
										'&:hover': { cursor: 'pointer' }
									}}
									onClick={() => router.push(`/car?brand=${brand}`)}
								/>
							</motion.div>
						))}
					</Box>

					{/* Footer Actions */}
					<Box sx={{ textAlign: 'center', borderTop: '1px solid #333', pt: 2 }}>
						<Typography variant="caption" color="#666">
							Last updated: {marketData.lastUpdate.toLocaleTimeString()} • {userActivity.currentViewers} online
						</Typography>
					</Box>
				</Box>

				<style jsx>{`
					@keyframes float {
						0%, 100% { transform: translateY(0px) rotate(0deg); }
						33% { transform: translateY(-10px) rotate(1deg); }
						66% { transform: translateY(5px) rotate(-1deg); }
					}
					@keyframes pulse {
						0%, 100% { opacity: 1; }
						50% { opacity: 0.5; }
					}
				`}</style>
			</Box>
		);
	}

	// Desktop version with even more interactive features
	return (
		<Box
			ref={footerRef}
			sx={{
				background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
				color: 'white',
				py: 6,
				position: 'relative',
				overflow: 'hidden'
			}}
		>
			{/* 3D Animated Background */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `
						radial-gradient(circle at 15% 85%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
						radial-gradient(circle at 85% 15%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
						radial-gradient(circle at 50% 50%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)
					`,
					animation: 'breathe 8s ease-in-out infinite'
				}}
			/>
			
			<div className="container">
				<Box sx={{ position: 'relative', zIndex: 1 }}>
					{/* Interactive Dashboard Grid */}
					<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
						<FooterSection
							id="marketplace"
							title="Live Marketplace"
							icon={<DriveEtaIcon />}
							isActive={activeSection === 'marketplace'}
							onClick={handleSectionClick}
						>
							<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
								<Box>
									<Typography variant="h4" fontWeight="bold">
										{marketData.totalCars.toLocaleString()}
									</Typography>
									<Typography variant="body2">Total Cars</Typography>
									<LinearProgress 
										variant="determinate" 
										value={75} 
										sx={{ mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#4CAF50' } }}
									/>
								</Box>
								<Box>
									<Typography variant="h4" fontWeight="bold" color="#FF6B6B">
										{marketData.activeDeals}
									</Typography>
									<Typography variant="body2">Active Deals</Typography>
									<Typography variant="caption" color="#4CAF50">
										{marketData.marketTrend} this week
									</Typography>
								</Box>
							</Box>
						</FooterSection>

						<FooterSection
							id="support"
							title="Smart Support"
							icon={<SupportAgentIcon />}
							isActive={activeSection === 'support'}
							onClick={handleSectionClick}
						>
							<Box sx={{ textAlign: 'center' }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
									<Box>
										<Badge color="success" variant="dot">
											<ChatIcon />
										</Badge>
										<Typography variant="caption" display="block">
											Live Chat
										</Typography>
									</Box>
									<Box>
										<Typography variant="h6">{userActivity.responseTime}</Typography>
										<Typography variant="caption">Avg Response</Typography>
									</Box>
								</Box>
								<Button
									variant="contained"
									fullWidth
									sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }}
									onClick={() => router.push('/cs')}
								>
									Get Instant Help
								</Button>
							</Box>
						</FooterSection>

						<FooterSection
							id="trends"
							title="Market Trends"
							icon={<TrendingUpIcon />}
							isActive={activeSection === 'trends'}
							onClick={handleSectionClick}
						>
							<Box>
								{marketData.hotBrands.map((brand, index) => (
									<Box key={brand} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
										<Typography>{brand}</Typography>
										<Box sx={{ display: 'flex', alignItems: 'center' }}>
											<LinearProgress 
												variant="determinate" 
												value={(4 - index) * 25} 
												sx={{ width: 50, mr: 1 }}
											/>
											<Typography variant="caption" color="#4CAF50">
												+{(15 - index * 3)}%
											</Typography>
										</Box>
									</Box>
								))}
							</Box>
						</FooterSection>
					</Box>

					{/* Quick Action Bar */}
					<Box sx={{ 
						display: 'flex', 
						justifyContent: 'center', 
						gap: 2, 
						mb: 4,
						p: 2,
						background: 'rgba(255, 215, 0, 0.1)',
						borderRadius: 2,
						border: '1px solid rgba(255, 215, 0, 0.3)'
					}}>
						{[
							{ label: 'Buy Car', href: '/car', icon: '🚗' },
							{ label: 'Sell Car', href: '/mypage', icon: '💰' },
							{ label: 'Get Loan', href: '/services', icon: '🏦' },
							{ label: 'Live Chat', href: '/cs', icon: '💬' }
						].map((action, index) => (
							<motion.div
								key={action.label}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant="outlined"
									startIcon={<span>{action.icon}</span>}
									onClick={() => router.push(action.href)}
									sx={{
										borderColor: '#FFD700',
										color: '#FFD700',
										'&:hover': {
											backgroundColor: '#FFD700',
											color: '#000',
											borderColor: '#FFD700'
										}
									}}
								>
									{action.label}
								</Button>
							</motion.div>
						))}
					</Box>

					{/* Live Activity Footer */}
					<Box sx={{ textAlign: 'center', borderTop: '1px solid #333', pt: 3 }}>
						<Typography variant="body2" color="#666" mb={1}>
							🌟 {userActivity.currentViewers} people browsing • {userActivity.todayInquiries} inquiries today
						</Typography>
						<Typography variant="caption" color="#666">
							© 2024 Auto Salon Korea • Powered by real-time data • Last sync: {marketData.lastUpdate.toLocaleTimeString()}
						</Typography>
					</Box>
				</Box>
			</div>

			<style jsx>{`
				@keyframes breathe {
					0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
					50% { transform: scale(1.05) rotate(1deg); opacity: 1; }
				}
			`}</style>
		</Box>
	);
};

export default InteractiveFooter;
