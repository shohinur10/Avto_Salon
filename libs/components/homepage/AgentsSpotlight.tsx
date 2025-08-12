import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Typography, Card, CardContent, Avatar, IconButton, Chip, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Member } from '../../types/member/member';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

interface AgentsSpotlightProps {
	agents: Member[];
}

const AgentsSpotlight: React.FC<AgentsSpotlightProps> = ({ agents = [] }) => {
	const router = useRouter();
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });
	const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

	const handleAgentClick = (agentId: string) => {
		router.push(`/agent/detail?id=${agentId}`);
	};

	const handleContactClick = (agentId: string, method: 'phone' | 'email', event: React.MouseEvent) => {
		event.stopPropagation();
		// Handle contact logic here
		console.log(`Contact ${agentId} via ${method}`);
	};

	if (!agents || agents.length === 0) {
		return null;
	}

	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.8 }}
			className="agents-spotlight"
		>
			<Box className="section-header">
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Typography variant="h2" className="section-title">
						Expert Agents
					</Typography>
					<Typography variant="body1" className="section-subtitle">
						Connect with our certified automotive professionals for personalized service
					</Typography>
				</motion.div>

				<Box className="navigation-controls">
					<IconButton className="nav-btn prev-btn" id="agents-prev">
						<ArrowBackIcon />
					</IconButton>
					<IconButton className="nav-btn next-btn" id="agents-next">
						<ArrowForwardIcon />
					</IconButton>
				</Box>
			</Box>

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.8, delay: 0.3 }}
				className="agents-carousel-container"
			>
				<Swiper
					spaceBetween={30}
					slidesPerView={1}
					navigation={{
						prevEl: '#agents-prev',
						nextEl: '#agents-next',
					}}
					pagination={{
						clickable: true,
						dynamicBullets: true,
					}}
					autoplay={{
						delay: 5000,
						disableOnInteraction: false,
					}}
					loop={true}
					breakpoints={{
						640: {
							slidesPerView: 2,
							spaceBetween: 20,
						},
						768: {
							slidesPerView: 2,
							spaceBetween: 25,
						},
						1024: {
							slidesPerView: 3,
							spaceBetween: 30,
						},
						1200: {
							slidesPerView: 4,
							spaceBetween: 30,
						},
					}}
					className="agents-swiper"
				>
					{agents.map((agent, index) => (
						<SwiperSlide key={agent._id}>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
								transition={{ duration: 0.6, delay: 0.1 * index }}
								whileHover={{ y: -10, scale: 1.02 }}
								onHoverStart={() => setHoveredAgent(agent._id)}
								onHoverEnd={() => setHoveredAgent(null)}
								className="agent-card-wrapper"
							>
								<Card 
									className={`agent-card ${hoveredAgent === agent._id ? 'hovered' : ''}`}
									onClick={() => handleAgentClick(agent._id)}
								>
									{/* Pulsing Border Animation */}
									<motion.div
										className="pulsing-border"
										animate={hoveredAgent === agent._id ? {
											opacity: [0, 1, 0],
											scale: [1, 1.05, 1]
										} : {}}
										transition={{ duration: 2, repeat: Infinity }}
									/>

									<CardContent className="agent-content">
										{/* Avatar Section */}
										<Box className="agent-avatar-section">
											<motion.div
												whileHover={{ scale: 1.1, rotate: 5 }}
												transition={{ type: "spring", stiffness: 300 }}
											>
												<Avatar
													src={agent.memberImage || '/img/agents/default-agent.jpg'}
													alt={agent.memberNick}
													className="agent-avatar"
												/>
											</motion.div>
											
											{/* Status Indicator */}
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ delay: 0.3 + 0.1 * index }}
												className="status-indicator online"
											/>

											{/* Rating Badge */}
											{agent.memberRank && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.4 + 0.1 * index }}
													className="rating-badge"
												>
													<StarIcon className="star-icon" />
													<Typography variant="caption">
														{agent.memberRank}
													</Typography>
												</motion.div>
											)}
										</Box>

										{/* Agent Info */}
										<Box className="agent-info">
											<Typography variant="h6" className="agent-name">
												{agent.memberNick}
											</Typography>
											<Typography variant="body2" className="agent-title">
												{agent.memberType || 'Sales Specialist'}
											</Typography>
											
											{/* Specialization Tags */}
											<Box className="specialization-tags">
												<Chip 
													label="Luxury Cars" 
													size="small" 
													className="spec-tag"
												/>
												<Chip 
													label="Expert" 
													size="small" 
													className="spec-tag"
												/>
											</Box>
										</Box>

										{/* Stats Section */}
										<Box className="agent-stats">
											<Box className="stat-item">
												<Typography variant="h6" className="stat-number">
													{agent.memberCars || 0}
												</Typography>
												<Typography variant="caption" className="stat-label">
													Cars Sold
												</Typography>
											</Box>
											<Box className="stat-item">
												<Typography variant="h6" className="stat-number">
													{agent.memberViews || 0}
												</Typography>
												<Typography variant="caption" className="stat-label">
													Profile Views
												</Typography>
											</Box>
										</Box>

										{/* Contact Actions */}
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={hoveredAgent === agent._id ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
											transition={{ duration: 0.3 }}
											className="contact-actions"
										>
											<IconButton
												size="small"
												className="contact-btn phone-btn"
												onClick={(e) => handleContactClick(agent._id, 'phone', e)}
											>
												<PhoneIcon />
											</IconButton>
											<IconButton
												size="small"
												className="contact-btn email-btn"
												onClick={(e) => handleContactClick(agent._id, 'email', e)}
											>
												<EmailIcon />
											</IconButton>
										</motion.div>

										{/* View Profile Button */}
										<motion.div
											initial={{ opacity: 0 }}
											animate={hoveredAgent === agent._id ? { opacity: 1 } : { opacity: 0 }}
											transition={{ duration: 0.3, delay: 0.1 }}
											className="view-profile-btn-container"
										>
											<Button
												variant="outlined"
												size="small"
												className="view-profile-btn"
												onClick={(e) => {
													e.stopPropagation();
													handleAgentClick(agent._id);
												}}
											>
												View Profile
											</Button>
										</motion.div>
									</CardContent>
								</Card>
							</motion.div>
						</SwiperSlide>
					))}
				</Swiper>
			</motion.div>

			{/* View All Agents Button */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
				transition={{ duration: 0.6, delay: 0.8 }}
				className="view-all-container"
			>
				<motion.button
					whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(212, 175, 55, 0.3)" }}
					whileTap={{ scale: 0.95 }}
					className="view-all-btn"
					onClick={() => router.push('/agent')}
				>
					View All Agents
				</motion.button>
			</motion.div>
		</motion.section>
	);
};

export default AgentsSpotlight;
