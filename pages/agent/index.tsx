import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { 
	Stack, 
	Box, 
	Button, 
	Pagination, 
	Typography, 
	Container, 
	TextField,
	InputAdornment,
	Grid,
	Card,
	CardContent,
	Avatar,
	Chip,
	Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import VideocamIcon from '@mui/icons-material/Videocam';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { GET_AGENTS } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { REACT_APP_API_URL } from '../../libs/config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import Link from 'next/link';

import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';


export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<any>(initialInput);
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgents(data?.getAgents?.list);
			setTotal(data?.getAgents?.metaCounter[0]?.total);
		},
	});
	/** HANDLERS **/
	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchText(value);
		
		const newFilter = {
			...searchFilter,
			search: { text: value },
			page: 1
		};
		setSearchFilter(newFilter);
		setCurrentPage(1);
	};

	const paginationChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
		const newFilter = { ...searchFilter, page: value };
		setSearchFilter(newFilter);
		setCurrentPage(value);
	};
	const likeMemberHandler = async (id: string) => {
		try {
			if (!id) return;
			if (!user?._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: { input: id },
			});

			await getAgentsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error, likeMemberHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// Handle agent contact methods
	const handleAgentContact = (agent: Member, method: string) => {
		try {
			switch (method) {
				case 'whatsapp':
					if (agent?.memberPhone) {
						const cleanPhone = agent.memberPhone.replace(/[^\d]/g, '');
						window.open(`https://wa.me/${cleanPhone}`, '_blank');
					}
					break;
				case 'telegram':
					if (agent?.memberPhone) {
						window.open(`https://t.me/share/url?url=Contact Agent: ${agent?.memberNick}`, '_blank');
					}
					break;
				case 'facetime':
					if (agent?.memberPhone) {
						window.open(`facetime://${agent.memberPhone}`, '_blank');
					}
					break;
				case 'phone':
					if (agent?.memberPhone) {
						window.open(`tel:${agent.memberPhone}`, '_blank');
					}
					break;
				case 'email':
					if (agent?.memberEmail) {
						window.open(`mailto:${agent.memberEmail}`, '_blank');
					}
					break;
				default:
					console.log(`Contact method ${method} not implemented`);
			}
		} catch (err: any) {
			sweetMixinErrorAlert('Failed to initiate contact').then();
		}
	};

	// Simple Agent Card Component
	const SimpleAgentCard = ({ agent }: { agent: Member }) => {
		const imagePath = agent?.memberImage
			? `${REACT_APP_API_URL}/${agent?.memberImage}`
			: '/img/profile/defaultUser.svg';

		return (
			<Card
				sx={{
					height: '100%',
					background: 'linear-gradient(135deg, rgba(128, 128, 128, 0.15) 0%, rgba(96, 96, 96, 0.1) 100%)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(128, 128, 128, 0.2)',
					borderRadius: 3,
					overflow: 'hidden',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-8px)',
						boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
						border: '1px solid rgba(128, 128, 128, 0.4)',
						background: 'linear-gradient(135deg, rgba(128, 128, 128, 0.2) 0%, rgba(96, 96, 96, 0.15) 100%)',
					}
				}}
			>
				<Box sx={{ position: 'relative', textAlign: 'center', pt: 3 }}>
					<Link href={`/agent/${agent?._id}`} style={{ textDecoration: 'none' }}>
						<Avatar
							src={imagePath}
							sx={{
								width: 80,
								height: 80,
								margin: '0 auto',
								border: '3px solid rgba(128, 128, 128, 0.3)',
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
								cursor: 'pointer',
								transition: 'all 0.3s ease',
								'&:hover': {
									border: '3px solid rgba(128, 128, 128, 0.5)',
									transform: 'scale(1.05)',
								}
							}}
						/>
					</Link>
					<Box
						onClick={() => likeMemberHandler(agent?._id)}
						sx={{
							position: 'absolute',
							top: 16,
							right: 16,
							cursor: 'pointer',
							color: agent?.meLiked && agent?.meLiked[0]?.myFavorite ? '#FF6B6B' : 'rgba(128, 128, 128, 0.8)',
							'&:hover': { color: '#FF6B6B', transform: 'scale(1.1)' },
							transition: 'all 0.2s ease'
						}}
					>
						{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon />
						) : (
							<FavoriteBorderIcon />
						)}
					</Box>
				</Box>

				<CardContent sx={{ p: 3, color: 'white' }}>
					<Link href={`/agent/${agent?._id}`} style={{ textDecoration: 'none' }}>
						<Typography 
							variant="h6" 
							sx={{ 
								fontWeight: 600, 
								mb: 1, 
								textAlign: 'center',
								color: 'white',
								cursor: 'pointer',
								'&:hover': { 
									color: 'rgba(128, 128, 128, 0.9)',
									textDecoration: 'underline'
								},
								transition: 'all 0.2s ease'
							}}
						>
							{agent?.memberFullName || agent?.memberNick}
						</Typography>
					</Link>
					
					<Typography variant="body2" sx={{ color: 'rgba(128, 128, 128, 0.9)', textAlign: 'center', mb: 2 }}>
						Professional Car Consultant
					</Typography>

					<Stack direction="row" spacing={1} justifyContent="center" mb={2}>
						<Chip
							icon={<StarIcon />}
							label={`${agent?.memberRank || 4.5}`}
							size="small"
							sx={{ 
								bgcolor: 'rgba(255, 215, 0, 0.25)', 
								color: '#FFD700',
								border: '1px solid rgba(255, 215, 0, 0.4)',
								fontWeight: 600
							}}
						/>
						<Chip
							label={`${agent?.memberCars || 0} Cars`}
							size="small"
							sx={{ 
								bgcolor: 'rgba(128, 128, 128, 0.25)', 
								color: 'rgba(255, 255, 255, 0.9)',
								border: '1px solid rgba(128, 128, 128, 0.4)',
								fontWeight: 600
							}}
						/>
					</Stack>

					{/* Followers and Following Section */}
					<Stack direction="row" spacing={2} justifyContent="center" mb={2}>
						<Link href={`/member?memberId=${agent?._id}`} style={{ textDecoration: 'none' }}>
							<Box sx={{ 
								textAlign: 'center', 
								cursor: 'pointer',
								'&:hover': { transform: 'scale(1.05)' },
								transition: 'all 0.2s ease'
							}}>
								<Typography variant="body2" sx={{ color: 'rgba(128, 128, 128, 0.7)', fontSize: '0.75rem' }}>
									Followers
								</Typography>
								<Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
									{agent?.memberFollowers || 0}
								</Typography>
							</Box>
						</Link>
						<Box sx={{ width: '1px', bgcolor: 'rgba(128, 128, 128, 0.3)', mx: 1 }} />
						<Link href={`/member?memberId=${agent?._id}`} style={{ textDecoration: 'none' }}>
							<Box sx={{ 
								textAlign: 'center', 
								cursor: 'pointer',
								'&:hover': { transform: 'scale(1.05)' },
								transition: 'all 0.2s ease'
							}}>
								<Typography variant="body2" sx={{ color: 'rgba(128, 128, 128, 0.7)', fontSize: '0.75rem' }}>
									Following
								</Typography>
								<Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
									{agent?.memberFollowings || 0}
								</Typography>
							</Box>
						</Link>
					</Stack>

					{/* Views and Likes */}
					<Stack direction="row" spacing={2} justifyContent="center" mb={2}>
						<Typography variant="body2" sx={{ color: 'rgba(128, 128, 128, 0.8)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
							👁 {agent?.memberViews || 0}
						</Typography>
						<Typography variant="body2" sx={{ color: 'rgba(128, 128, 128, 0.8)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
							❤️ {agent?.memberLikes || 0}
						</Typography>
					</Stack>

					<Divider sx={{ my: 2, borderColor: 'rgba(128, 128, 128, 0.2)' }} />

					<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, mb: 1, textAlign: 'center' }}>
						Contact Methods
					</Typography>

					<Grid container spacing={1}>
						{agent?.memberPhone && (
							<Grid item xs={6}>
								<Button
									fullWidth
									size="small"
									startIcon={<WhatsAppIcon />}
									onClick={() => handleAgentContact(agent, 'whatsapp')}
									sx={{
										bgcolor: 'rgba(37, 211, 102, 0.15)',
										color: '#25D366',
										border: '1px solid rgba(37, 211, 102, 0.25)',
										fontSize: '0.75rem',
										'&:hover': { 
											bgcolor: 'rgba(37, 211, 102, 0.25)',
											transform: 'translateY(-1px)',
											boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
										},
										transition: 'all 0.2s ease'
									}}
								>
									WhatsApp
								</Button>
							</Grid>
						)}
						{agent?.memberPhone && (
							<Grid item xs={6}>
								<Button
									fullWidth
									size="small"
									startIcon={<TelegramIcon />}
									onClick={() => handleAgentContact(agent, 'telegram')}
									sx={{
										bgcolor: 'rgba(0, 136, 204, 0.15)',
										color: '#0088CC',
										border: '1px solid rgba(0, 136, 204, 0.25)',
										fontSize: '0.75rem',
										'&:hover': { 
											bgcolor: 'rgba(0, 136, 204, 0.25)',
											transform: 'translateY(-1px)',
											boxShadow: '0 4px 12px rgba(0, 136, 204, 0.3)'
										},
										transition: 'all 0.2s ease'
									}}
								>
									Telegram
								</Button>
							</Grid>
						)}
						{agent?.memberPhone && (
							<Grid item xs={6}>
								<Button
									fullWidth
									size="small"
									startIcon={<VideocamIcon />}
									onClick={() => handleAgentContact(agent, 'facetime')}
									sx={{
										bgcolor: 'rgba(0, 122, 255, 0.15)',
										color: '#007AFF',
										border: '1px solid rgba(0, 122, 255, 0.25)',
										fontSize: '0.75rem',
										'&:hover': { 
											bgcolor: 'rgba(0, 122, 255, 0.25)',
											transform: 'translateY(-1px)',
											boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
										},
										transition: 'all 0.2s ease'
									}}
								>
									FaceTime
								</Button>
							</Grid>
						)}
						{agent?.memberPhone && (
							<Grid item xs={6}>
								<Button
									fullWidth
									size="small"
									startIcon={<PhoneIcon />}
									onClick={() => handleAgentContact(agent, 'phone')}
									sx={{
										bgcolor: 'rgba(128, 128, 128, 0.2)',
										color: 'rgba(255, 255, 255, 0.9)',
										border: '1px solid rgba(128, 128, 128, 0.3)',
										fontSize: '0.75rem',
										'&:hover': { 
											bgcolor: 'rgba(128, 128, 128, 0.3)',
											transform: 'translateY(-1px)',
											boxShadow: '0 4px 12px rgba(128, 128, 128, 0.4)'
										},
										transition: 'all 0.2s ease'
									}}
								>
									Call
								</Button>
							</Grid>
						)}
					</Grid>
				</CardContent>
			</Card>
		);
	};

	if (device === 'mobile') {
		return (
			<Container maxWidth="sm" sx={{ py: 4, minHeight: '100vh' }}>
				<Typography variant="h4" sx={{ color: 'white', textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
					👥 Our Agents
				</Typography>
				<Stack spacing={3}>
					{agents.map((agent) => (
						<SimpleAgentCard key={agent._id} agent={agent} />
					))}
				</Stack>
				{total > searchFilter.limit && (
					<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
						<Pagination
							count={Math.ceil(total / searchFilter.limit)}
							page={currentPage}
							onChange={paginationChangeHandler}
							sx={{
								'& .MuiPaginationItem-root': {
									color: 'white',
									borderColor: 'rgba(255, 255, 255, 0.3)',
								},
								'& .Mui-selected': {
									bgcolor: 'rgba(59, 130, 246, 0.3) !important',
									color: 'white !important',
								}
							}}
						/>
					</Box>
				)}
			</Container>
		);
	} else {
		return (
			<Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
					<Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
						🚗 Our Professional Agents
						</Typography>
					<Chip
						label={`${total} Total Agents`}
						sx={{
							bgcolor: 'rgba(59, 130, 246, 0.2)',
							color: '#3B82F6',
							fontWeight: 600,
							border: '1px solid rgba(59, 130, 246, 0.3)'
						}}
					/>
				</Stack>

								{/* Search Section */}
				<Box sx={{ mb: 4 }}>
					<Stack direction="row" spacing={2} alignItems="center">
						<TextField
							fullWidth
							placeholder="Search agents by name, location, or specialty..."
							value={searchText}
							onChange={handleSearch}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
									</InputAdornment>
								),
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									backgroundColor: 'rgba(255, 255, 255, 0.1)',
									borderRadius: 2,
									color: 'white',
									'& fieldset': {
										borderColor: 'rgba(255, 255, 255, 0.3)',
									},
									'&:hover fieldset': {
										borderColor: 'rgba(255, 255, 255, 0.5)',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#3B82F6',
									},
								},
								'& .MuiInputBase-input::placeholder': {
									color: 'rgba(255, 255, 255, 0.7)',
								},
							}}
						/>
						<Button
							variant="contained"
							size="large"
							onClick={() => {
								// Trigger search with current searchText
								const newFilter = {
									...searchFilter,
									search: { text: searchText },
									page: 1
								};
								setSearchFilter(newFilter);
								setCurrentPage(1);
							}}
							sx={{
								minWidth: '120px',
								height: '56px',
								backgroundColor: '#3B82F6',
								color: 'white',
								fontWeight: 600,
								borderRadius: 2,
								textTransform: 'none',
								'&:hover': {
									backgroundColor: '#2563EB',
									transform: 'translateY(-1px)',
									boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
								}
							}}
						>
							Search
						</Button>
						<Button
							variant="outlined"
							size="large"
							onClick={() => {
								setSearchText('');
								const newFilter = {
									...searchFilter,
									search: { text: '' },
									page: 1
								};
								setSearchFilter(newFilter);
								setCurrentPage(1);
							}}
							sx={{
								minWidth: '100px',
								height: '56px',
								borderColor: 'rgba(255, 255, 255, 0.3)',
								color: 'rgba(255, 255, 255, 0.8)',
								fontWeight: 600,
								borderRadius: 2,
								textTransform: 'none',
								'&:hover': {
									borderColor: 'rgba(255, 255, 255, 0.5)',
									backgroundColor: 'rgba(255, 255, 255, 0.05)',
								}
							}}
						>
							Clear
						</Button>
					</Stack>
				</Box>

				{/* Agents Grid */}
				{getAgentsLoading ? (
					<Box sx={{ textAlign: 'center', py: 8 }}>
						<Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
							Loading our amazing agents...
						</Typography>
					</Box>
				) : agents.length === 0 ? (
					<Box sx={{ textAlign: 'center', py: 8 }}>
						<Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
							No agents found. Try adjusting your search.
						</Typography>
					</Box>
				) : (
					<Grid container spacing={3}>
						{agents.map((agent) => (
							<Grid item xs={12} sm={6} md={4} lg={3} key={agent._id}>
								<SimpleAgentCard agent={agent} />
							</Grid>
						))}
					</Grid>
				)}

				{/* Pagination */}
				{total > searchFilter.limit && (
					<Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
						<Pagination
							count={Math.ceil(total / searchFilter.limit)}
							page={currentPage}
							onChange={paginationChangeHandler}
							size="large"
							sx={{
								'& .MuiPaginationItem-root': {
								color: 'white',
									borderColor: 'rgba(255, 255, 255, 0.3)',
									backgroundColor: 'rgba(255, 255, 255, 0.05)',
								'&:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.1)',
									}
								},
								'& .Mui-selected': {
									bgcolor: 'rgba(59, 130, 246, 0.3) !important',
									color: 'white !important',
									borderColor: '#3B82F6 !important',
								}
							}}
						/>
					</Box>
				)}
			</Container>
		);
	}
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
