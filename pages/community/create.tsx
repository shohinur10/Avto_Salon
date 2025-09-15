import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { 
	Box, 
	Container, 
	Typography, 
	Button, 
	Card, 
	CardContent, 
	TextField, 
	Stack, 
	Grid, 
	Chip, 
	IconButton,
	Paper,
	Stepper,
	Step,
	StepLabel,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Divider,
	Avatar,
	ImageList,
	ImageListItem,
	Tooltip
} from '@mui/material';
import {
	Add as AddIcon,
	PhotoCamera as PhotoIcon,
	VideoLibrary as VideoIcon,
	Poll as PollIcon,
	Event as EventIcon,
	LocationOn as LocationIcon,
	Tag as TagIcon,
	Preview as PreviewIcon,
	Publish as PublishIcon,
	ArrowBack as BackIcon,
	Close as CloseIcon,
	CloudUpload as UploadIcon,
	Help as HelpIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { REACT_APP_API_URL } from '../../libs/config';
import dynamic from 'next/dynamic';

// Dynamic import for rich text editor
const RichTextEditor = dynamic(() => import('../../libs/components/community/RichTextEditor'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Post types with templates
const postTypes = [
	{
		type: 'REVIEW',
		icon: <PhotoIcon />,
		title: 'Car Review',
		description: 'Share your experience with a car',
		color: '#4CAF50',
		template: `## Car Details
- **Make & Model:** 
- **Year:** 
- **Trim:** 
- **Price Paid:** 

## Performance
How does it drive? Acceleration, handling, braking...

## Interior & Comfort
Describe the interior quality, comfort, space...

## Technology & Features
Infotainment, safety features, convenience...

## Fuel Economy
Real-world fuel consumption...

## Pros & Cons
**Pros:**
- 
- 

**Cons:**
- 
- 

## Final Verdict
Would you recommend this car? Overall rating: ⭐⭐⭐⭐⭐`
	},
	{
		type: 'QA',
		icon: <HelpIcon />,
		title: 'Ask Question',
		description: 'Get help from the community',
		color: '#2196F3',
		template: `## My Question

## Background/Context
Provide some context about your situation...

## What I've Tried
List any solutions you've already attempted...

## Additional Details
- **Car:** 
- **Year:** 
- **Mileage:** 
- **Budget:** (if relevant)`
	},
	{
		type: 'SHOWCASE',
		icon: <PhotoIcon />,
		title: 'Car Showcase',
		description: 'Show off your ride',
		color: '#FF9800',
		template: `## Meet My [Car Name]

## Car Details
- **Make & Model:** 
- **Year:** 
- **Color:** 
- **Engine:** 

## Modifications
List any modifications or upgrades...

## Story
How did you acquire this car? What makes it special?

## Future Plans
Any upcoming modifications or plans?`
	},
	{
		type: 'EVENT',
		icon: <EventIcon />,
		title: 'Event/Meetup',
		description: 'Organize or share events',
		color: '#F44336',
		template: `## Event Details
- **Event Name:** 
- **Date:** 
- **Time:** 
- **Location:** 
- **Entry Fee:** 

## Description
What's this event about?

## What to Expect
- 
- 

## Registration
How to register or RSVP...

## Contact
Contact information for questions...`
	}
];

const categories = [
	{ value: 'REVIEWS', label: 'Reviews & Experiences' },
	{ value: 'QA', label: 'Questions & Help' },
	{ value: 'SHOWCASE', label: 'Car Showcase' },
	{ value: 'TECH', label: 'Technical Discussion' },
	{ value: 'EVENTS', label: 'Events & Meetups' },
	{ value: 'GENERAL', label: 'General Discussion' }
];

const CreatePost: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [activeStep, setActiveStep] = useState<number>(0);
	const [selectedType, setSelectedType] = useState<string>('');
	const [postData, setPostData] = useState({
		title: '',
		content: '',
		category: '',
		tags: [] as string[],
		images: [] as File[],
		location: ''
	});
	const [newTag, setNewTag] = useState<string>('');
	const [isPreview, setIsPreview] = useState<boolean>(false);

	const steps = ['Choose Type', 'Write Content', 'Add Details', 'Preview & Publish'];

	const handleTypeSelect = (type: string) => {
		setSelectedType(type);
		const template = postTypes.find(pt => pt.type === type)?.template || '';
		setPostData(prev => ({ ...prev, content: template }));
		setActiveStep(1);
	};

	const handleContentChange = (content: string) => {
		console.log('Parent component received content:', content);
		console.log('Content length:', content.length);
		console.log('Content contains spaces:', content.includes(' '));
		console.log('Content contains multiple words:', content.split(' ').length > 1);
		
		setPostData(prev => ({ ...prev, content }));
	};

	const handleAddTag = () => {
		if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
			setPostData(prev => ({
				...prev,
				tags: [...prev.tags, newTag.trim()]
			}));
			setNewTag('');
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setPostData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove)
		}));
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setPostData(prev => ({
			...prev,
			images: [...prev.images, ...files].slice(0, 5) // Max 5 images
		}));
	};

	const handleSubmit = async () => {
		try {
			// Here you would typically call your create post mutation
			console.log('Creating post:', postData);
			
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Redirect to community with success message
			router.push('/community');
		} catch (error) {
			console.error('Error creating post:', error);
		}
	};

	// Step 1: Choose Post Type
	const TypeSelectionStep = () => (
		<Grid container spacing={3}>
			{postTypes.map((type) => (
				<Grid item xs={12} sm={6} md={3} key={type.type}>
					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<Card
							sx={{
								cursor: 'pointer',
								borderRadius: '20px',
								height: '200px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
								border: selectedType === type.type ? `3px solid ${type.color}` : '1px solid #e0e0e0',
								bgcolor: selectedType === type.type ? `${type.color}10` : 'white',
								transition: 'all 0.3s ease',
								'&:hover': {
									boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
									bgcolor: `${type.color}08`
								}
							}}
							onClick={() => handleTypeSelect(type.type)}
						>
							<CardContent>
								<Box component="div"   sx={{ color: type.color, mb: 2 }}>
									{React.cloneElement(type.icon, { fontSize: 'large' })}
								</Box>
								<Typography variant="h6" fontWeight={700} mb={1}>
									{type.title}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{type.description}
								</Typography>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>
			))}
		</Grid>
	);

	// Step 2: Write Content
	const ContentStep = () => (
		<Stack spacing={3}>
			<TextField
				fullWidth
				label="Post Title"
				placeholder="Enter an engaging title for your post..."
				value={postData.title}
				onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
				variant="outlined"
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: '12px',
					}
				}}
			/>
			<Box component="div"  >
				<Typography variant="h6" mb={2}>Content</Typography>
				<RichTextEditor
					value={postData.content}
					onChange={handleContentChange}
					placeholder="Share your thoughts, experiences, or questions..."
				/>
				{/* Debug display */}
				<Box component="div"   sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, fontSize: '12px' }}>
					<Typography variant="caption" color="text.secondary">
						Debug Info:
					</Typography>
					<Typography variant="caption" display="block">
						Content Length: {postData.content.length}
					</Typography>
					<Typography variant="caption" display="block">
						Contains Spaces: {postData.content.includes(' ') ? 'Yes' : 'No'}
					</Typography>
					<Typography variant="caption" display="block">
						Word Count: {postData.content.split(' ').filter(word => word.trim().length > 0).length}
					</Typography>
					<Typography variant="caption" display="block">
						Raw Content: {postData.content.substring(0, 100)}{postData.content.length > 100 ? '...' : ''}
					</Typography>
				</Box>
			</Box>
		</Stack>
	);

	// Step 3: Add Details
	const DetailsStep = () => (
		<Stack spacing={3}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<FormControl fullWidth>
						<InputLabel>Category</InputLabel>
						<Select
							value={postData.category}
							label="Category"
							onChange={(e) => setPostData(prev => ({ ...prev, category: e.target.value }))}
							sx={{ borderRadius: '12px' }}
						>
							{categories.map((cat) => (
								<MenuItem key={cat.value} value={cat.value}>
									{cat.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						fullWidth
						label="Location (Optional)"
						placeholder="e.g., Los Angeles, CA"
						value={postData.location}
						onChange={(e) => setPostData(prev => ({ ...prev, location: e.target.value }))}
						InputProps={{
							startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '12px',
							}
						}}
					/>
				</Grid>
			</Grid>

			{/* Tags */}
			<Box component="div"  >
				<Typography variant="h6" mb={2}>Tags</Typography>
				<Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
					{postData.tags.map((tag) => (
						<Chip
							key={tag}
							label={tag}
							onDelete={() => handleRemoveTag(tag)}
							color="primary"
							variant="outlined"
						/>
					))}
				</Stack>
				<Stack direction="row" spacing={2}>
					<TextField
						label="Add Tag"
						placeholder="e.g., BMW, M3, Performance"
						value={newTag}
						onChange={(e) => setNewTag(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
						size="small"
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '12px',
							}
						}}
					/>
					<Button
						variant="outlined"
						onClick={handleAddTag}
						startIcon={<TagIcon />}
						disabled={!newTag.trim()}
						sx={{ borderRadius: '12px' }}
					>
						Add
					</Button>
				</Stack>
			</Box>

			{/* Image Upload */}
			<Box component="div"  >
				<Typography variant="h6" mb={2}>Images (Optional)</Typography>
				<input
					accept="image/*"
					style={{ display: 'none' }}
					id="image-upload"
					type="file"
					multiple
					onChange={handleImageUpload}
				/>
				<label htmlFor="image-upload">
					<Paper
						sx={{
							p: 4,
							textAlign: 'center',
							border: '2px dashed #ccc',
							borderRadius: '12px',
							cursor: 'pointer',
							'&:hover': {
								bgcolor: 'grey.50',
								borderColor: 'primary.main'
							}
						}}
					>
						<UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
						<Typography variant="body1" color="text.secondary">
							Click to upload images (Max 5)
						</Typography>
					</Paper>
				</label>
				{postData.images.length > 0 && (
					<ImageList cols={3} rowHeight={100} sx={{ mt: 2 }}>
						{postData.images.map((image, index) => (
							<ImageListItem key={index}>
								<img
									src={URL.createObjectURL(image)}
									alt={`Upload ${index + 1}`}
									style={{ borderRadius: '8px' }}
								/>
								<IconButton
									sx={{
										position: 'absolute',
										top: 4,
										right: 4,
										bgcolor: 'rgba(0,0,0,0.7)',
										color: 'white',
										'&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
									}}
									size="small"
									onClick={() => {
										setPostData(prev => ({
											...prev,
											images: prev.images.filter((_, i) => i !== index)
										}));
									}}
								>
									<CloseIcon fontSize="small" />
								</IconButton>
							</ImageListItem>
						))}
					</ImageList>
				)}
			</Box>
		</Stack>
	);

	// Step 4: Preview
	const PreviewStep = () => (
		<Card sx={{ borderRadius: '16px' }}>
			<CardContent sx={{ p: 4 }}>
				<Stack direction="row" alignItems="center" spacing={2} mb={3}>
					<Avatar 
						src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'}
						sx={{ width: 48, height: 48 }}
					/>
					<Stack>
						<Typography variant="subtitle1" fontWeight={600}>
							{user?.memberNick}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Just now • {postData.category}
						</Typography>
					</Stack>
				</Stack>
				
				<Typography variant="h5" fontWeight={700} mb={2}>
					{postData.title}
				</Typography>
				
				<Box
													component="div"
													
													
					sx={{
						mb: 3,
						'& h2, & h3': { fontWeight: 700, mb: 1, mt: 2 },
						'& p': { mb: 1 },
						'& ul, & ol': { pl: 3 }
					}}
					dangerouslySetInnerHTML={{ __html: postData.content }}
				/>
				
				{postData.tags.length > 0 && (
					<Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
						{postData.tags.map((tag) => (
							<Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
						))}
					</Stack>
				)}
				
				{postData.location && (
					<Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<LocationIcon fontSize="small" />
						{postData.location}
					</Typography>
				)}
			</CardContent>
		</Card>
	);

	if (device === 'mobile') {
		return <Typography variant="h4">Mobile Create Post Coming Soon</Typography>;
	}

	return (
		<Box component="div"   sx={{ 
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			minHeight: '100vh',
			py: 4
		}}>
			<Container maxWidth="lg">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Stack direction="row" alignItems="center" spacing={2} mb={4}>
						<IconButton
							onClick={() => router.push('/community')}
							sx={{
								bgcolor: 'rgba(255,255,255,0.2)',
								color: 'white',
								'&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
							}}
						>
							<BackIcon />
						</IconButton>
						<Typography variant="h4" color="white" fontWeight={700}>
							Create New Post
						</Typography>
					</Stack>
				</motion.div>

				{/* Stepper */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<Card sx={{ borderRadius: '16px', mb: 4 }}>
						<CardContent>
							<Stepper activeStep={activeStep} alternativeLabel>
								{steps.map((label) => (
									<Step key={label}>
										<StepLabel>{label}</StepLabel>
									</Step>
								))}
							</Stepper>
						</CardContent>
					</Card>
				</motion.div>

				{/* Main Content */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Card sx={{ borderRadius: '20px', mb: 4 }}>
						<CardContent sx={{ p: 4 }}>
							{activeStep === 0 && <TypeSelectionStep />}
							{activeStep === 1 && <ContentStep />}
							{activeStep === 2 && <DetailsStep />}
							{activeStep === 3 && <PreviewStep />}
						</CardContent>
					</Card>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Button
							disabled={activeStep === 0}
							onClick={() => setActiveStep(prev => prev - 1)}
							variant="outlined"
							size="large"
							sx={{
								borderColor: 'rgba(255,255,255,0.5)',
								color: 'white',
								borderRadius: '24px',
								'&:hover': {
									borderColor: 'white',
									bgcolor: 'rgba(255,255,255,0.1)'
								}
							}}
						>
							Back
						</Button>

						<Stack direction="row" spacing={2}>
							{activeStep === 3 && (
								<Button
									variant="outlined"
									size="large"
									startIcon={<PreviewIcon />}
									onClick={() => setIsPreview(!isPreview)}
									sx={{
										borderColor: 'rgba(255,255,255,0.5)',
										color: 'white',
										borderRadius: '24px',
										'&:hover': {
											borderColor: 'white',
											bgcolor: 'rgba(255,255,255,0.1)'
										}
									}}
								>
									{isPreview ? 'Edit' : 'Preview'}
								</Button>
							)}
							
							<Button
								variant="contained"
								size="large"
								onClick={activeStep === 3 ? handleSubmit : () => setActiveStep(prev => prev + 1)}
								disabled={
									(activeStep === 1 && (!postData.title.trim() || !postData.content.trim())) ||
									(activeStep === 2 && !postData.category)
								}
								startIcon={activeStep === 3 ? <PublishIcon /> : undefined}
								sx={{
									bgcolor: 'white',
									color: 'primary.main',
									borderRadius: '24px',
									px: 4,
									'&:hover': {
										bgcolor: 'grey.100',
										transform: 'translateY(-1px)',
										boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
									}
								}}
							>
								{activeStep === 3 ? 'Publish Post' : 'Next'}
							</Button>
						</Stack>
					</Stack>
				</motion.div>
			</Container>
		</Box>
	);
};

export default withLayoutBasic(CreatePost);

