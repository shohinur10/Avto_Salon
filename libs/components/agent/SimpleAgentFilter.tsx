import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

interface SimpleAgentFilterProps {
	onFilterChange: (filters: any) => void;
	initialFilters?: any;
	loading?: boolean;
}

const SimpleAgentFilter: React.FC<SimpleAgentFilterProps> = ({
	onFilterChange,
	initialFilters = {},
	loading = false
}) => {
	const [searchText, setSearchText] = useState(initialFilters.searchText || '');

	useEffect(() => {
		onFilterChange({
			searchText,
			sortBy: 'rating',
			sortDirection: 'desc',
			page: 1,
			limit: 12,
			...initialFilters
		});
	}, [searchText, onFilterChange, initialFilters]);

	const clearFilters = () => {
		setSearchText('');
	};

	return (
		<Box style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '1rem' }}>
			<Typography variant="h6" style={{ marginBottom: '1rem' }}>
				Agent Filters
			</Typography>
			
			<TextField
				fullWidth
				variant="outlined"
				placeholder="Search agents..."
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
				style={{ marginBottom: '1rem' }}
			/>
			
			<Button
				variant="outlined"
				onClick={clearFilters}
				disabled={loading}
				style={{ fontSize: '0.8rem' }}
			>
				Clear All
			</Button>
		</Box>
	);
};

export default SimpleAgentFilter;
export { SimpleAgentFilter as AdvancedAgentFilter };
