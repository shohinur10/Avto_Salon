import React, { useState, useRef } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Stack,
	TextField,
	Button,
	Avatar,
	Typography,
	Box,
	IconButton,
	Chip,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	LinearProgress,
	Divider
} from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { BoardArticleCategory } from '../../enums/board-article.enum';

// Icons
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

interface CreatePostModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (postData: any) => void;
	defaultCategory?: BoardArticleCategory;
}

const CreatePostModal = (props: CreatePostModalProps) => {
	const { open, onClose, onSubmit, defaultCategory = BoardArticleCategory.FREE } = props;
	const user = useReactiveVar(userVar);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Form state
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState<BoardArticleCategory>(defaultCategory);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [uploading, setUploading] = useState(false);
	const [location, setLocation] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');

	const userImagePath = user?.memberImage 
		? `${REACT_APP_API_URL}/${user.memberImage}` 
		: '/img/profile/defaultUser.svg';

	// Category configurations
	const categoryConfigs = {
		REVIEWS: {
			icon: '🚗',
			placeholder: 'Share your honest review and experience...',
			titlePlaceholder: 'What car are you reviewing?',
			color: '#FF6B6B'
		},
		QNA: {
			icon: '❓',
			placeholder: 'Ask your question or share knowledge...',
			titlePlaceholder: 'What would you like to know?',
			color: '#4ECDC4'
		},
		EVENTS: {
			icon: '📅',
			placeholder: 'Describe your event, location, and time...',
			titlePlaceholder: 'What event are you organizing?',
			color: '#45B7D1'
		},
		CAR_NEWS: {
			icon: '📰',
			placeholder: 'Share the latest automotive news...',
			titlePlaceholder: 'What\'s the news?',
			color: '#FFA726'
		},
		SHOWCASE: {
			icon: '📸',
			placeholder: 'Tell us about your amazing car...',
			titlePlaceholder: 'Show off your ride!',
			color: '#AB47BC'
		},
		FREE: {
			icon: '💬',
			placeholder: 'What\'s on your mind?',
			titlePlaceholder: 'Share your thoughts...',
			color: '#66BB6A'
		},
		RECOMMEND: {
			icon: '⭐',
			placeholder: 'Why do you recommend this?',
			titlePlaceholder: 'What would you recommend?',
			color: '#FF7043'
		},
		HUMOR: {
			icon: '😄',
			placeholder: 'Share something funny...',
			titlePlaceholder: 'Make us laugh!',
			color: '#FFCA28'
		},
		NEWS: {
			icon: '📰',
			placeholder: 'Share the latest news...',
			titlePlaceholder: 'What\'s the news?',
			color: '#2196F3'
		}
	};

	const currentConfig = categoryConfigs[category];

	// Handle image upload
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const fileArray = Array.from(files);
			const validFiles = fileArray.filter(file => 
				file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
			);

			setSelectedImages(prev => [...prev, ...validFiles]);

			// Generate previews
			validFiles.forEach(file => {
				const reader = new FileReader();
				reader.onload = (e) => {
					setImagePreviews(prev => [...prev, e.target?.result as string]);
				};
				reader.readAsDataURL(file);
			});
		}
	};

	// Remove image
	const removeImage = (index: number) => {
		setSelectedImages(prev => prev.filter((_, i) => i !== index));
		setImagePreviews(prev => prev.filter((_, i) => i !== index));
	};

	// Handle tag input
	const handleTagKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' && tagInput.trim()) {
			event.preventDefault();
			if (!tags.includes(tagInput.trim()) && tags.length < 5) {
				setTags(prev => [...prev, tagInput.trim()]);
				setTagInput('');
			}
		}
	};

	// Remove tag
	const removeTag = (tagToRemove: string) => {
		setTags(prev => prev.filter(tag => tag !== tagToRemove));
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (!title.trim() || !content.trim()) return;

		setUploading(true);
		
		const postData = {
			articleTitle: title,
			articleContent: content,
			articleCategory: category,
			articleImages: selectedImages,
			location: location || undefined,
			tags: tags.length > 0 ? tags : undefined
		};

		try {
			await onSubmit(postData);
			handleClose();
		} catch (error) {
			console.error('Error creating post:', error);
		} finally {
			setUploading(false);
		}
	};

	// Reset form and close
	const handleClose = () => {
		setTitle('');
		setContent('');
		setCategory(defaultCategory);
		setSelectedImages([]);
		setImagePreviews([]);
		setLocation('');
		setTags([]);
		setTagInput('');
		setUploading(false);
		onClose();
	};

	return (
		<Dialog 
			open={open} 
			onClose={handleClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: '16px',
					maxHeight: '90vh'
				}
			}}
		>
			<DialogTitle sx={{ pb: 1 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="h5" fontWeight={700}>
						Create Post
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Stack>
			</DialogTitle>

			<Divider />

			<DialogContent sx={{ px: 3, py: 3 }}>
				<Stack spacing={3}>
					{/* User Info & Category */}
					<Stack direction="row" alignItems="center" spacing={2}>
						<Avatar src={userImagePath} sx={{ width: 48, height: 48 }} />
						<Stack flex={1}>
							<Typography variant="h6" fontWeight={600}>
								{user?.memberNick}
							</Typography>
							<FormControl size="small" sx={{ minWidth: 200 }}>
								<Select
									value={category}
									onChange={(e) => setCategory(e.target.value as BoardArticleCategory)}
									sx={{
										borderRadius: '20px',
										backgroundColor: `${currentConfig.color}15`,
										border: `1px solid ${currentConfig.color}30`,
										'& .MuiOutlinedInput-notchedOutline': { border: 'none' }
									}}
								>
									{Object.entries(categoryConfigs).map(([key, config]) => (
										<MenuItem key={key} value={key}>
											<Stack direction="row" alignItems="center" spacing={1}>
												<span>{config.icon}</span>
												<span>{key.replace('_', ' ')}</span>
											</Stack>
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Stack>
					</Stack>

					{/* Title Input */}
					<TextField
						placeholder={currentConfig.titlePlaceholder}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						variant="outlined"
						fullWidth
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '12px',
								fontSize: '1.2rem',
								fontWeight: 600
							}
						}}
					/>

					{/* Content Input */}
					<TextField
						placeholder={currentConfig.placeholder}
						value={content}
						onChange={(e) => setContent(e.target.value)}
						multiline
						rows={4}
						variant="outlined"
						fullWidth
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '12px'
							}
						}}
					/>

					{/* Image Previews */}
					{imagePreviews.length > 0 && (
						<Grid container spacing={2}>
							{imagePreviews.map((preview, index) => (
								<Grid item xs={12} sm={6} md={4} key={index}>
									<Box component="div"
										sx={{
											position: 'relative',
											borderRadius: '12px',
											overflow: 'hidden',
											aspectRatio: '16/9'
										}}
									>
										<img
											src={preview}
											alt={`Preview ${index + 1}`}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover'
											}}
										/>
										<IconButton
											onClick={() => removeImage(index)}
											sx={{
												position: 'absolute',
												top: 8,
												right: 8,
												backgroundColor: 'rgba(0,0,0,0.7)',
												color: 'white',
												'&:hover': {
													backgroundColor: 'rgba(0,0,0,0.9)'
												}
											}}
											size="small"
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Box>
								</Grid>
							))}
						</Grid>
					)}

					{/* Location Input */}
					<TextField
						placeholder="Add location (optional)"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						variant="outlined"
						fullWidth
						InputProps={{
							startAdornment: <LocationOnIcon sx={{ color: '#666', mr: 1 }} />
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '12px'
							}
						}}
					/>

					{/* Tags Input */}
					<Stack spacing={2}>
						<TextField
							placeholder="Add tags (press Enter to add)"
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyPress={handleTagKeyPress}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: <LocalOfferIcon sx={{ color: '#666', mr: 1 }} />
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: '12px'
								}
							}}
						/>
						
						{/* Tags Display */}
						{tags.length > 0 && (
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{tags.map((tag, index) => (
									<Chip
										key={index}
										label={`#${tag}`}
										onDelete={() => removeTag(tag)}
										color="primary"
										variant="outlined"
										size="small"
									/>
								))}
							</Stack>
						)}
					</Stack>

					{/* Progress Bar */}
					{uploading && (
                                                <Box component="div"  sx={{ width: '100%' }}>
							<LinearProgress />
							<Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
								Creating your post...
							</Typography>
						</Box>
					)}
				</Stack>
			</DialogContent>

			<Divider />

			<DialogActions sx={{ p: 3 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
					{/* Media Upload Button */}
					<Stack direction="row" spacing={1}>
						<IconButton
							onClick={() => fileInputRef.current?.click()}
							sx={{
								color: currentConfig.color,
								backgroundColor: `${currentConfig.color}15`,
								'&:hover': {
									backgroundColor: `${currentConfig.color}25`
								}
							}}
						>
							<PhotoCameraIcon />
						</IconButton>
						<IconButton sx={{ color: '#666' }}>
							<EmojiEmotionsIcon />
						</IconButton>
					</Stack>

					{/* Submit Button */}
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={!title.trim() || !content.trim() || uploading}
						endIcon={<SendIcon />}
						sx={{
							borderRadius: '20px',
							textTransform: 'none',
							fontWeight: 600,
							px: 4,
							background: `linear-gradient(45deg, ${currentConfig.color}, ${currentConfig.color}CC)`,
							'&:hover': {
								background: `linear-gradient(45deg, ${currentConfig.color}DD, ${currentConfig.color})`
							}
						}}
					>
						Post
					</Button>
				</Stack>

				{/* Hidden File Input */}
				<input
					type="file"
					ref={fileInputRef}
					multiple
					accept="image/*"
					style={{ display: 'none' }}
					onChange={handleImageUpload}
				/>
			</DialogActions>
		</Dialog>
	);
};

export default CreatePostModal;
