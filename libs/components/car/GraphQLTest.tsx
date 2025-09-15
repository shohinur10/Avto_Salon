import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CARS } from '../../../apollo/user/query';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

const GraphQLTest: React.FC = () => {
  const testInput = {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    direction: 'DESC',
    search: {
      pricesRange: {
        start: 0,
        end: 1000000,
      },
      yearRange: [1990, 2024],
      minMileage: 0,
      maxMileage: 200000,
    },
  };

  const { data, loading, error, refetch } = useQuery(GET_CARS, {
    variables: { input: testInput },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('✅ GraphQL Test - Data received:', data);
    },
    onError: (error) => {
      console.error('❌ GraphQL Test - Error:', error);
    }
  });

  return (
    <Box component="div" sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        GraphQL Connection Test
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 2 }}>
        GraphQL URL: {process.env.REACT_APP_API_GRAPHQL_URL || 'Not set'}
      </Typography>

      {loading && (
        <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Loading...</Typography>
        </Box>
      )}

      {error && (
        <Box component="div" sx={{ color: 'error.main', mb: 2 }}>
          <Typography variant="body2" color="error">
            Error: {error.message}
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => refetch()}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Box>
      )}

      {data && (
        <Box component="div" sx={{ color: 'success.main' }}>
          <Typography variant="body2">
            ✅ Success! Found {data?.getCars?.list?.length || 0} cars
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Total: {data?.getCars?.metaCounter?.[0]?.total || 0}
          </Typography>
        </Box>
      )}

      <Button 
        variant="contained" 
        size="small" 
        onClick={() => refetch()}
        sx={{ mt: 1 }}
      >
        Test Query
      </Button>
    </Box>
  );
};

export default GraphQLTest;
