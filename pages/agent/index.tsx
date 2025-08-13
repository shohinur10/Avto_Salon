import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, Typography, Container, Fab, Backdrop, Dialog, DialogContent, IconButton } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AgentCard from '../../libs/components/common/AgentCard';
import EnhancedAgentsPage from '../../libs/components/agent/EnhancedAgentsPage';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { AgentFilterState } from '../../libs/types/agent/agent-extended';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { GET_AGENTS } from '../../apollo/user/query';
import { Messages } from '../../libs/config';

import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';


export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');
	const [showAgentsMenu, setShowAgentsMenu] = useState(false);

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
	/** LIFECYCLES **/
	
		
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else if (router.isReady) {
			router.replace(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router.query.input, router.isReady]);

	/** HANDLERS **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'recent':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				setFilterSortName('Recent');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				setFilterSortName('Oldest order');
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				setFilterSortName('Likes');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				setFilterSortName('Views');
				break;
		}
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};
	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: { input: id },
			});

			await getAgentsRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error, likeCarHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};
	// Handle filter changes for enhanced page
	const handleFilterChange = (newFilters: AgentFilterState) => {
		const updatedSearchFilter = {
			...searchFilter,
			page: newFilters.page,
			limit: newFilters.limit,
			sort: newFilters.sortBy === 'rating' ? 'memberRank' : 
				  newFilters.sortBy === 'experience' ? 'createdAt' :
				  newFilters.sortBy === 'carsSold' ? 'memberViews' :
				  newFilters.sortBy,
			direction: newFilters.sortDirection.toUpperCase(),
			search: {
				...searchFilter.search,
				text: newFilters.searchText || searchFilter.search?.text
			}
		};
		
		setSearchFilter(updatedSearchFilter);
		router.push(`/agent?input=${JSON.stringify(updatedSearchFilter)}`, undefined, { scroll: false });
	};

	// Handle agent contact
	const handleAgentContact = (agentId: string, method: string) => {
		console.log(`Contacting agent ${agentId} via ${method}`);
		// Implement contact logic here
	};

	// Handle page change
	const handlePageChange = (page: number) => {
		paginationChangeHandler({} as any, page);
	};

	if (device === 'mobile') {
		return (
			<div style={{
				padding: '2rem',
				textAlign: 'center',
				background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
				minHeight: '100vh',
				color: 'white'
			}}>
				<h1>👥 Meet Our Agents</h1>
				<p>Mobile enhanced version coming soon!</p>
			</div>
		);
	} else {
		return (
			<>
				{/* Simple Agent Page Layout */}
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Stack 
						direction="row" 
						justifyContent="space-between" 
						alignItems="center" 
						mb={4}
					>
						<Typography variant="h3" fontWeight="bold" color="white">
							Our Professional Agents
						</Typography>
						
						<Button
							variant="contained"
							size="large"
							startIcon={<MenuIcon />}
							onClick={() => setShowAgentsMenu(true)}
							sx={{
								background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
								color: 'white',
								fontWeight: 600,
								padding: '12px 32px',
								borderRadius: '12px',
								textTransform: 'none',
								fontSize: '1.1rem',
								boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
								'&:hover': {
									background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
									boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5)',
									transform: 'translateY(-2px)'
								}
							}}
						>
							Browse All Agents
						</Button>
					</Stack>

					<Typography variant="h6" color="text.secondary" gutterBottom>
						Find the perfect car consultant for your needs. Click "Browse All Agents" to explore our complete team.
					</Typography>

					{/* Basic stats */}
					<Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
						<Typography variant="h5" color="primary" gutterBottom>
							Total Agents: {total}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Professional car consultants ready to help you find your perfect vehicle.
						</Typography>
					</Box>
				</Container>

				{/* Full Agents Menu Dialog */}
				<Dialog
					open={showAgentsMenu}
					onClose={() => setShowAgentsMenu(false)}
					maxWidth="xl"
					fullWidth
					fullScreen
					PaperProps={{
						sx: {
							background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
							backdropFilter: 'blur(20px)',
						}
					}}
				>
					<DialogContent sx={{ p: 0, position: 'relative' }}>
						{/* Close Button */}
						<IconButton
							onClick={() => setShowAgentsMenu(false)}
							sx={{
								position: 'absolute',
								top: 16,
								right: 16,
								zIndex: 1000,
								bgcolor: 'rgba(255, 255, 255, 0.1)',
								color: 'white',
								'&:hover': {
									bgcolor: 'rgba(255, 255, 255, 0.2)',
								}
							}}
						>
							<CloseIcon />
						</IconButton>

						{/* Enhanced Agents Page Inside Dialog */}
						<EnhancedAgentsPage
							agents={agents}
							loading={getAgentsLoading}
							total={total}
							onFilterChange={handleFilterChange}
							onAgentLike={likeMemberHandler}
							onAgentContact={handleAgentContact}
							currentPage={currentPage}
							totalPages={Math.ceil(total / searchFilter.limit)}
							onPageChange={handlePageChange}
						/>
					</DialogContent>
				</Dialog>
			</>
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
