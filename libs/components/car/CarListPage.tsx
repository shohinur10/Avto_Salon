import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Fab,
  Zoom,
  Breadcrumbs,
  Link,
  Checkbox,
  FormControlLabel,
  Button,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

import { 
  CarBrand, 
  CarCategory, 
  FuelType, 
  CarLocation,
  CarTransactionType
} from '../../enums/car.enum';

import CarCard from './CarCard';
import GraphQLTest from './GraphQLTest';
import MockCarData from './MockCarData';
import ErrorBoundary from './ErrorBoundary';
import { GET_CARS } from '../../../apollo/user/query';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';
import { Car } from '../../types/car/car';
import { CarsInquiry } from '../../types/car/car.input';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { useReactiveVar, useMutation } from '@apollo/client';
import { userVar } from '../../../apollo/store';


interface CarListPageProps {
  initialFilters?: Partial<any>;
}

const CarListPage: React.FC<CarListPageProps> = ({ initialFilters = {} }) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleRouteChange = () => {
      setIsMounted(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      setIsMounted(false);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CarCategory[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<CarTransactionType[]>([]);
  // Remove seats and doors state since they're not supported by GraphQL schema
  // const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  // const [selectedDoors, setSelectedDoors] = useState<number[]>([]);

  const [expandedSections, setExpandedSections] = useState({
    location: true,
    carType: true,
    brand: true,
    fuelType: true,
    transactionType: true,
    // Remove seats and doors from expanded sections
    // seats: true,
    // doors: true,
  });
  
  const [searchInput, setSearchInput] = useState<CarsInquiry>({
    page: 1,
    limit: 12,
    search: {
      searchText: '',
      locationList: [],
      carCategoryList: [],
      brands: [],
      fuelTypes: [],
      typeList: [],
      yearRange: [1990, 2024],
      minMileage: 0,
      maxMileage: 200000,
      // Remove seatsList and doorsList since they're not supported by GraphQL schema
      // seatsList: [],
      // doorsList: [],
    },
  });

  const [cars, setCars] = useState<Car[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // GraphQL Mutations & Queries
  const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);
  
  const { 
    data: carsData, 
    loading: carsLoading, 
    error: carsError,
    refetch: refetchCars 
  } = useQuery(GET_CARS, {
    variables: { input: searchInput },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    onCompleted: (data) => {
      console.log('Cars data received:', data);
      console.log('GraphQL URL:', process.env.REACT_APP_API_GRAPHQL_URL);
      if (data?.getCars?.list && isMounted) {
        setCars(data.getCars.list);
        setTotalCount(data.getCars.metaCounter?.[0]?.total || 0);
      }
    },
    onError: (error) => {
      console.error('Error fetching cars:', error);
      console.error('GraphQL URL:', process.env.REACT_APP_API_GRAPHQL_URL);
      console.error('Search input:', searchInput);
      // Don't throw error, just log it
    }
  });

  // Debug logging
  useEffect(() => {
    console.log('CarListPage mounted');
    console.log('Initial filters:', initialFilters);
    console.log('Search input:', searchInput);
    console.log('GraphQL URL:', process.env.REACT_APP_API_GRAPHQL_URL);
  }, []);

  // Update search when filters change
  const handleFilterChange = (filterType: string, value: any) => {
    setSearchInput(prev => ({
      ...prev,
      search: {
        ...prev.search,
        [filterType]: value,
      },
    }));
  };

  // Apply filters
  const applyFilters = () => {
    // This function is not currently used but kept for future implementation
    // handleFilterChange is called directly in the filter change handlers
    // No parameters needed as filters are applied immediately when changed
  };

  // Toggle filter section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedFuelTypes([]);
    setSelectedTransactionTypes([]);
    // Remove seats and doors clearing
    // setSelectedSeats([]);
    // setSelectedDoors([]);
    
    setSearchInput(prev => ({
      ...prev,
      search: {
        searchText: '',
        locationList: [],
        carCategoryList: [],
        brands: [],
        fuelTypes: [],
        typeList: [],
        yearRange: [1990, 2024],
        minMileage: 0,
        maxMileage: 200000,
        // Remove seatsList and doorsList clearing
        // seatsList: [],
        // doorsList: [],
      },
    }));
  };

  // Pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setSearchInput(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Items per page change
  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newLimit = event.target.value as number;
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    setSearchInput(prev => ({ 
      ...prev, 
      page: 1, 
      limit: newLimit 
    }));
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Handle car click
  const handleCarClick = (carId: string) => {
    router.push(`/car/detail?id=${carId}`);
  };

  // Handle like car
  const likeCarHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await likeTargetCar({
        variables: { input: id },
      });

      await refetchCars();
      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      console.log('Error, likeCarHandler', err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  // Breadcrumb navigation
  const breadcrumbs = [
    <Link
      key="home"
      color="inherit"
      href="/"
      onClick={(e: any) => {
        e.preventDefault();
        router.push('/');
      }}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
    >
      <HomeIcon fontSize="small" />
      Home
    </Link>,
    <Typography key="cars" color="primary" sx={{ fontWeight: 600 }}>
      Cars
    </Typography>,
  ];

  return (
    <ErrorBoundary>
      <motion.div
        className="car-list-page-new"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
      {/* Page Header */}
      <motion.div
        className="page-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Box className="header-content">
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
            {breadcrumbs}
          </Breadcrumbs>
          
          <Typography variant="h1" className="page-title">
            Find Your Perfect Car
          </Typography>
          
          <Typography variant="body1" className="page-subtitle">
            Discover premium vehicles from luxury brands worldwide
          </Typography>
        </Box>

        {/* GraphQL Test Component for Debugging */}
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <GraphQLTest />
        </Box>
      </motion.div>

      {/* Main Content */}
      <Box className="main-content">
        {/* Left Sidebar - Filters */}
        <motion.div
          className="filter-sidebar filters"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box className="filter-container">
            <Box className="filter-header">
            <Typography variant="h5" className="filter-title">
                <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Filters
            </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={clearFilters}
                sx={{ fontSize: '0.75rem' }}
              >
                Clear All
              </Button>
            </Box>

            {/* Search Bar */}
            <Box className="search-section">
              <TextField
                fullWidth
                placeholder="Search cars..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  handleFilterChange('searchText', e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>

            {/* Location Filter */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={() => toggleSection('location')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Location
              </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedLocations.length > 0 && (
                    <Chip
                      label={selectedLocations.length}
                      size="small"
                      color="primary"
                    />
                  )}
                  {expandedSections.location ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Box>
              
              {expandedSections.location && (
                <Box sx={{ mt: 2, pl: 2 }}>
                {Object.values(CarLocation).map((location) => (
                  <FormControlLabel
                    key={location}
                    control={
                      <Checkbox
                        checked={selectedLocations.includes(location)}
                        onChange={(e) => {
                          if (e.target.checked) {
                              const newLocations = [...selectedLocations, location];
                              setSelectedLocations(newLocations);
                              handleFilterChange('locationList', newLocations);
                          } else {
                              const filtered = selectedLocations.filter(l => l !== location);
                              setSelectedLocations(filtered);
                              handleFilterChange('locationList', filtered);
                          }
                        }}
                      />
                    }
                    label={location}
                  />
                ))}
              </Box>
              )}
            </Box>

            {/* Car Type Filter */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={() => toggleSection('carType')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CarIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Car Type
              </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedCategories.length > 0 && (
                    <Chip
                      label={selectedCategories.length}
                      size="small"
                      color="primary"
                    />
                  )}
                  {expandedSections.carType ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Box>
              
              {expandedSections.carType && (
                <Box sx={{ mt: 2, pl: 2 }}>
                {Object.values(CarCategory).map((category) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                              const newCategories = [...selectedCategories, category];
                              setSelectedCategories(newCategories);
                              handleFilterChange('carCategoryList', newCategories);
                          } else {
                              const filtered = selectedCategories.filter(c => c !== category);
                              setSelectedCategories(filtered);
                              handleFilterChange('carCategoryList', filtered);
                          }
                        }}
                      />
                    }
                    label={category}
                  />
                ))}
              </Box>
              )}
            </Box>

            {/* Brand Filter */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={() => toggleSection('brand')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CarIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Brand
              </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedBrands.length > 0 && (
                    <Chip
                      label={selectedBrands.length}
                    size="small"
                      color="primary"
                    />
                  )}
                  {expandedSections.brand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Box>
              
              {expandedSections.brand && (
                <Box sx={{ mt: 2, pl: 2 }}>
                  {Object.values(CarBrand).map((brand) => (
                    <FormControlLabel
                      key={brand}
                      control={
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newBrands = [...selectedBrands, brand];
                              setSelectedBrands(newBrands);
                              handleFilterChange('brands', newBrands);
                            } else {
                              const filtered = selectedBrands.filter(b => b !== brand);
                              setSelectedBrands(filtered);
                              handleFilterChange('brands', filtered);
                            }
                          }}
                        />
                      }
                      label={brand}
                    />
                ))}
              </Box>
              )}
            </Box>

            {/* Fuel Type Filter */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={() => toggleSection('fuelType')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SpeedIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Fuel Type
              </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedFuelTypes.length > 0 && (
                    <Chip
                      label={selectedFuelTypes.length}
                    size="small"
                      color="primary"
                    />
                  )}
                  {expandedSections.fuelType ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            </Box>

              {expandedSections.fuelType && (
                <Box sx={{ mt: 2, pl: 2 }}>
                  {Object.values(FuelType).map((fuelType) => (
                <FormControlLabel
                      key={fuelType}
                  control={
                    <Checkbox
                          checked={selectedFuelTypes.includes(fuelType)}
                      onChange={(e) => {
                        if (e.target.checked) {
                              const newFuelTypes = [...selectedFuelTypes, fuelType];
                              setSelectedFuelTypes(newFuelTypes);
                              handleFilterChange('fuelTypes', newFuelTypes);
                        } else {
                              const filtered = selectedFuelTypes.filter(f => f !== fuelType);
                              setSelectedFuelTypes(filtered);
                              handleFilterChange('fuelTypes', filtered);
                            }
                          }}
                        />
                      }
                      label={fuelType}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Transaction Type Filter */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={() => toggleSection('transactionType')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Transaction Type
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedTransactionTypes.length > 0 && (
                    <Chip
                      label={selectedTransactionTypes.length}
                      size="small"
                      color="primary"
                    />
                  )}
                  {expandedSections.transactionType ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Box>
              
              {expandedSections.transactionType && (
                <Box sx={{ mt: 2, pl: 2 }}>
                  {Object.values(CarTransactionType).map((type) => (
                <FormControlLabel
                      key={type}
                  control={
                    <Checkbox
                          checked={selectedTransactionTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                              const newTypes = [...selectedTransactionTypes, type];
                              setSelectedTransactionTypes(newTypes);
                              handleFilterChange('typeList', newTypes);
                        } else {
                              const filtered = selectedTransactionTypes.filter(t => t !== type);
                              setSelectedTransactionTypes(filtered);
                              handleFilterChange('typeList', filtered);
                        }
                      }}
                    />
                  }
                      label={type}
                />
                  ))}
              </Box>
              )}
            </Box>

            {/* Year Range Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, p: 2 }}>
                Year Range
              </Typography>
              <Box sx={{ px: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="From"
                      type="number"
                      value={searchInput.search.yearRange?.[0] || 1990}
                      onChange={(e) => {
                        const newYearRange = [
                          parseInt(e.target.value) || 1990,
                          searchInput.search.yearRange?.[1] || 2024
                        ];
                        handleFilterChange('yearRange', newYearRange);
                      }}
                      size="small"
                fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="To"
                      type="number"
                      value={searchInput.search.yearRange?.[1] || 2024}
                      onChange={(e) => {
                        const newYearRange = [
                          searchInput.search.yearRange?.[0] || 1990,
                          parseInt(e.target.value) || 2024
                        ];
                        handleFilterChange('yearRange', newYearRange);
                      }}
                      size="small"
                fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Mileage Range Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, p: 2 }}>
                Mileage Range
              </Typography>
              <Box sx={{ px: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Min"
                      type="number"
                      value={searchInput.search.minMileage || 0}
                      onChange={(e) => {
                        handleFilterChange('minMileage', parseInt(e.target.value) || 0);
                      }}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Max"
                      type="number"
                      value={searchInput.search.maxMileage || 200000}
                      onChange={(e) => {
                        handleFilterChange('maxMileage', parseInt(e.target.value) || 200000);
                      }}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Main Content Area with Cars Grid */}
        <Box className="content-area cars-list">
          {/* Top Controls Bar */}
          <Box className="top-controls">
            {/* Results Info */}
            <Box className="results-info">
              <Typography variant="h6" className="results-count">
                {carsLoading ? (
                  'Loading...'
                ) : cars.length > 0 ? (
                  <>
                    <motion.span
                      initial={{ scale: 1.2, color: '#D4AF37' }}
                      animate={{ scale: 1, color: 'inherit' }}
                      transition={{ duration: 0.5 }}
                    >
                      {totalCount.toLocaleString()}
                    </motion.span>
                    {' '}Cars Found {!carsError ? '(Backend Connected ✅)' : ''}
                  </>
                ) : carsError ? (
                  '6 Sample Cars (Backend Offline 📡)'
                ) : (
                  'No Cars Found'
                )}
              </Typography>
              {currentPage > 1 && (
                <Typography variant="body2" className="page-info">
                  Page {currentPage} of {totalPages}
                </Typography>
              )}
            </Box>

            {/* View Mode and Sort Controls */}
            <Box className="controls-group">
              {/* View Mode Toggle */}
              <Box className="view-mode-toggle">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  size="small"
                >
                  <GridViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  size="small"
                >
                  <ListViewIcon />
                </IconButton>
            </Box>

            {/* Sort Controls */}
              <FormControl size="small" className="sort-select">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value="new"
                  onChange={() => {}}
                  label="Sort by"
                >
                  <MenuItem value="new">Sort by New</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="popular">Most Popular</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" className="items-per-page">
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  label="Per Page"
                >
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={48}>48</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Loading State */}
          <AnimatePresence>
            {carsLoading && (
              <motion.div
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CircularProgress size={60} className="loading-spinner" />
                <Typography variant="body1" className="loading-text">
                  Loading premium cars...
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {carsError && (
            <motion.div
              className="error-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Typography variant="h6" color="error">
                Failed to load cars
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {carsError.message}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => refetchCars()}
                sx={{ mt: 2 }}
              >
                Retry
              </Button>
            </motion.div>
          )}

          {/* Cars Grid */}
          {!carsLoading && cars.length > 0 && (
            <motion.div
              className="cars-grid-container"
              layout
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewMode}-${currentPage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="cars-grid">
                    {cars.map((car, index) => (
                        <motion.div
                        key={car._id}
                        className="car-card-wrapper"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                          }}
                          whileHover={{ y: -8 }}
                        >
                          <CarCard
                            car={car}
                            likeCarHandler={likeCarHandler}
                          />
                        </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Fallback State - Show Mock Data when backend is not available */}
          {!carsLoading && cars.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {carsError ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    🚀 Using Sample Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Backend server not connected. Showing sample cars for preview.
                  </Typography>
              <MockCarData />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Typography variant="h6" color="text.secondary">
                    No cars found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search filters
                  </Typography>
                </div>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {!carsLoading && cars.length > 0 && totalPages > 1 && (
            <motion.div
              className="pagination-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                className="pagination"
              />
            </motion.div>
          )}
        </Box>


      </Box>
      </motion.div>
    </ErrorBoundary>
  );
};

export default CarListPage;

