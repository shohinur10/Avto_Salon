import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Typography, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface EventsTeaserProps {
	events: BoardArticle[];
}

const EventsTeaser: React.FC<EventsTeaserProps> = ({ events = [] }) => {
	const router = useRouter();
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });

	const handleEventClick = (eventId: string) => {
		router.push(`/community?articleCategory=EVENT&id=${eventId}`);
	};

	const handleSeeAllClick = () => {
		router.push('/community?articleCategory=EVENT');
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	};

	if (!events || events.length === 0) {
		return null;
	}

	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.8 }}
			className="events-teaser"
		>
			<Box className="section-header">
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="header-content"
				>
					<Typography variant="h2" className="section-title">
						Upcoming Events
					</Typography>
					<Typography variant="body1" className="section-subtitle">
						Join our exclusive automotive events and connect with fellow enthusiasts
					</Typography>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 30 }}
					animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<motion.button
						whileHover={{ 
							scale: 1.05, 
							boxShadow: "0 15px 35px rgba(212, 175, 55, 0.4)",
							background: "linear-gradient(135deg, #D4AF37 0%, #F4E5A3 100%)"
						}}
						whileTap={{ scale: 0.95 }}
						className="see-all-events-btn"
						onClick={handleSeeAllClick}
					>
						<span>See All Events</span>
						<ArrowForwardIcon className="btn-icon" />
					</motion.button>
				</motion.div>
			</Box>

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.8, delay: 0.4 }}
				className="events-carousel-container"
			>
				<Swiper
					modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
					effect="coverflow"
					grabCursor={true}
					centeredSlides={true}
					slidesPerView="auto"
					coverflowEffect={{
						rotate: 15,
						stretch: 0,
						depth: 200,
						modifier: 1,
						slideShadows: true,
					}}
					pagination={{
						clickable: true,
						dynamicBullets: true,
					}}
					autoplay={{
						delay: 4000,
						disableOnInteraction: false,
					}}
					loop={true}
					className="events-swiper"
				>
					{events.map((event, index) => (
						<SwiperSlide key={event._id} className="event-slide">
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
								transition={{ duration: 0.6, delay: 0.1 * index }}
								whileHover={{ 
									y: -10, 
									scale: 1.02,
									rotateY: 5,
									transition: { duration: 0.3 }
								}}
								className="event-card-wrapper"
							>
								<Card 
									className="event-card"
									onClick={() => handleEventClick(event._id)}
								>
									<Box className="card-image-container">
										<CardMedia
											component="img"
											height="200"
											image={event.articleImage || '/img/events/default-event.jpg'}
											alt={event.articleTitle}
											className="event-image"
										/>
										
										{/* Overlay Effects */}
										<Box className="image-overlay" />
										<Box className="hover-overlay" />
										
										{/* Event Category Badge */}
										<motion.div
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.3 + 0.1 * index }}
											className="category-badge"
										>
											<Chip 
												label={event.articleCategory || 'EVENT'}
												className="category-chip"
												size="small"
											/>
										</motion.div>

										{/* Date Badge */}
										<motion.div
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.4 + 0.1 * index }}
											className="date-badge"
										>
											<Typography variant="caption" className="date-text">
												{formatDate(event.createdAt)}
											</Typography>
										</motion.div>
									</Box>

									<CardContent className="event-content">
										<Box className="event-header">
											<Typography variant="h6" className="event-title">
												{event.articleTitle}
											</Typography>
											<Typography 
												variant="body2" 
												className="event-description"
												sx={{
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
												}}
											>
												{event.articleContent}
											</Typography>
										</Box>

										<Box className="event-details">
											<Box className="detail-item">
												<CalendarTodayIcon className="detail-icon" />
												<Typography variant="caption" className="detail-text">
													{formatDate(event.createdAt)}
												</Typography>
											</Box>
											
											<Box className="detail-item">
												<LocationOnIcon className="detail-icon" />
												<Typography variant="caption" className="detail-text">
													Showroom
												</Typography>
											</Box>
											
											<Box className="detail-item">
												<PeopleIcon className="detail-icon" />
												<Typography variant="caption" className="detail-text">
													{event.articleViews || 0} interested
												</Typography>
											</Box>
										</Box>

										<Box className="event-footer">
											<Box className="event-stats">
												<Typography variant="caption" className="views-count">
													{event.articleViews || 0} views
												</Typography>
												<Typography variant="caption" className="likes-count">
													{event.articleLikes || 0} likes
												</Typography>
											</Box>
											
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												className="learn-more-btn"
												onClick={(e) => {
													e.stopPropagation();
													handleEventClick(event._id);
												}}
											>
												Learn More
											</motion.button>
										</Box>
									</CardContent>
								</Card>
							</motion.div>
						</SwiperSlide>
					))}
				</Swiper>
			</motion.div>

			{/* Background Decoration */}
			<motion.div
				initial={{ opacity: 0, scale: 0 }}
				animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
				transition={{ duration: 1, delay: 0.8 }}
				className="background-decoration"
			>
				<Box className="decoration-circle circle-1" />
				<Box className="decoration-circle circle-2" />
				<Box className="decoration-circle circle-3" />
			</motion.div>
		</motion.section>
	);
};

export default EventsTeaser;
