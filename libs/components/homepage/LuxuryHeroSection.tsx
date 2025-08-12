import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';

const LuxuryHeroSection: React.FC = () => {
	const router = useRouter();

	const handleExploreClick = () => {
		router.push('/car');
	};

	const handleContactClick = () => {
		router.push('/agent');
	};

	return (
		<Box className="luxury-hero-section">
			{/* Background Video/Image */}
			<Box className="hero-background">
				<video 
					autoPlay 
					muted 
					loop 
					playsInline
					className="hero-video"
				>
					<source src="/videos/porsche-hero.mp4" type="video/mp4" />
				</video>
				<Box className="hero-overlay" />
			</Box>

			{/* Hero Content */}
			<Box className="hero-content">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.5 }}
					className="hero-text-container"
				>
					<Typography variant="h1" className="hero-title">
						<motion.span
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.7 }}
						>
							Luxury
						</motion.span>
						<motion.span
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.9 }}
							className="hero-title-accent"
						>
							Redefined
						</motion.span>
					</Typography>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.1 }}
					>
						<Typography variant="h4" className="hero-subtitle">
							Discover extraordinary vehicles that embody elegance, 
							performance, and uncompromising quality.
						</Typography>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.3 }}
						className="hero-actions"
					>
						<Button
							variant="contained"
							size="large"
							onClick={handleExploreClick}
							className="hero-btn hero-btn-primary"
							component={motion.button}
							whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(212, 175, 55, 0.4)" }}
							whileTap={{ scale: 0.95 }}
						>
							Explore Collection
						</Button>
						
						<Button
							variant="outlined"
							size="large"
							onClick={handleContactClick}
							className="hero-btn hero-btn-secondary"
							component={motion.button}
							whileHover={{ scale: 1.05, borderColor: "#D4AF37" }}
							whileTap={{ scale: 0.95 }}
						>
							Contact Expert
						</Button>
					</motion.div>
				</motion.div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 2 }}
					className="scroll-indicator"
				>
					<motion.div
						animate={{ y: [0, 10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="scroll-arrow"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path 
								d="M7 10L12 15L17 10" 
								stroke="currentColor" 
								strokeWidth="2" 
								strokeLinecap="round" 
								strokeLinejoin="round"
							/>
						</svg>
					</motion.div>
					<Typography variant="caption" className="scroll-text">
						Scroll to explore
					</Typography>
				</motion.div>
			</Box>

			{/* Floating Elements */}
			<motion.div
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, delay: 1.5 }}
				className="floating-stats"
			>
				<Box className="stat-item">
					<Typography variant="h3" className="stat-number">500+</Typography>
					<Typography variant="body2" className="stat-label">Premium Cars</Typography>
				</Box>
				<Box className="stat-item">
					<Typography variant="h3" className="stat-number">50+</Typography>
					<Typography variant="body2" className="stat-label">Luxury Brands</Typography>
				</Box>
				<Box className="stat-item">
					<Typography variant="h3" className="stat-number">24/7</Typography>
					<Typography variant="body2" className="stat-label">Expert Support</Typography>
				</Box>
			</motion.div>
		</Box>
	);
};

export default LuxuryHeroSection;
