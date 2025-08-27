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
  InputAdornment
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
  LocalGasStation as FuelIcon,
  Settings as SettingsIcon,
  AttachMoney as PriceIcon,
  CalendarToday as YearIcon,
  Straighten as MileageIcon
} from '@mui/icons-material';

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
import { 
  CarBrand, 
  CarCategory, 
  FuelType, 
  TransmissionType, 
  CarCondition, 
  CarLocation 
} from '../../enums/car.enum';

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string>('Any');
  const [selectedDoors, setSelectedDoors] = useState<string>('Any');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2024]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, 200000]);
  
  const [searchInput, setSearchInput] = useState<CarsInquiry>({
    page: currentPage,
    limit: itemsPerPage,
    search: {
      pricesRange: {
        start: 0,
        end: 1000000,
      },
      yearRange: [1990, 2024],
      minMileage: 0,
      maxMileage: 200000,
    },
    sort: 'createdAt',
    direction: 'DESC',
    ...initialFilters
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
  const handleFilterChange = () => {
    const newSearchInput = {
      ...searchInput,
      page: 1,
      search: {
        searchText: searchText || undefined,
        locationList: selectedLocations.length > 0 ? selectedLocations : undefined,
        carCategoryList: selectedCategories.length > 0 ? selectedCategories : undefined,
        pricesRange: {
          start: priceRange[0],
          end: priceRange[1]
        },
        yearRange: yearRange,
        minMileage: mileageRange[0],
        maxMileage: mileageRange[1]
      },
      sort: 'createdAt',
      direction: 'DESC'
    };

    setSearchInput(newSearchInput);
    setCurrentPage(1);
  };

  // Apply filters
  const applyFilters = () => {
    handleFilterChange();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText('');
    setSelectedLocations([]);
    setSelectedCategories([]);
    setSelectedSeats('Any');
    setSelectedDoors('Any');
    setSelectedOptions([]);
    setPriceRange([0, 1000000]);
    setYearRange([1990, 2024]);
    setMileageRange([0, 200000]);
  };

  // Pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setSearchInput(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Items per page change
  const handleItemsPerPageChange = (event: any) => {
    const newLimit = event.target.value;
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
      onClick={(e) => {
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
          className="filter-sidebar"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box className="filter-container">
            <Typography variant="h5" className="filter-title">
              Find Your Car
            </Typography>

            {/* Search Bar */}
            <Box className="search-section">
              <TextField
                fullWidth
                placeholder="What are you looking for?"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="search-input"
              />
            </Box>

            {/* Location Filter */}
            <Box className="filter-section">
              <Typography variant="h6" className="section-title">
                <LocationIcon className="section-icon" />
                Location
              </Typography>
              <Box className="checkbox-group">
                {Object.values(CarLocation).map((location) => (
                  <FormControlLabel
                    key={location}
                    control={
                      <Checkbox
                        checked={selectedLocations.includes(location)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLocations([...selectedLocations, location]);
                          } else {
                            setSelectedLocations(selectedLocations.filter(l => l !== location));
                          }
                        }}
                        color="primary"
                      />
                    }
                    label={location}
                    className="filter-checkbox"
                  />
                ))}
              </Box>
            </Box>

            {/* Car Type Filter */}
            <Box className="filter-section">
              <Typography variant="h6" className="section-title">
                <CarIcon className="section-icon" />
                Car Type
              </Typography>
              <Box className="checkbox-group">
                {Object.values(CarCategory).map((category) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          }
                        }}
                        color="primary"
                      />
                    }
                    label={category}
                    className="filter-checkbox"
                  />
                ))}
              </Box>
            </Box>

            {/* Seats Filter */}
            <Box className="filter-section">
              <Typography variant="h6" className="section-title">
                <SpeedIcon className="section-icon" />
                Seats
              </Typography>
              <Box className="button-group">
                {['Any', '2', '4', '5', '6', '7+'].map((seat) => (
                  <Button
                    key={seat}
                    variant={selectedSeats === seat ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setSelectedSeats(seat)}
                    className="filter-button"
                  >
                    {seat}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Doors Filter */}
            <Box className="filter-section">
              <Typography variant="h6" className="section-title">
                <CarIcon className="section-icon" />
                Doors
              </Typography>
              <Box className="button-group">
                {['Any', '2', '3', '4', '5'].map((door) => (
                  <Button
                    key={door}
                    variant={selectedDoors === door ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setSelectedDoors(door)}
                    className="filter-button"
                  >
                    {door}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Options Filter */}
            <Box className="filter-section">
              <Typography variant="h6" className="section-title">
                <SettingsIcon className="section-icon" />
                Options
              </Typography>
              <Box className="checkbox-group">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedOptions.includes('Rent')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOptions([...selectedOptions, 'Rent']);
                        } else {
                          setSelectedOptions(selectedOptions.filter(o => o !== 'Rent'));
                        }
                      }}
                      color="primary"
                    />
                  }
                  label="Rent"
                  className="filter-checkbox"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedOptions.includes('Barter')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOptions([...selectedOptions, 'Barter']);
                        } else {
                          setSelectedOptions(selectedOptions.filter(o => o !== 'Barter'));
                        }
                      }}
                      color="primary"
                    />
                  }
                  label="Barter"
                  className="filter-checkbox"
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box className="filter-actions">
              <Button
                variant="contained"
                fullWidth
                onClick={applyFilters}
                className="apply-filters-btn"
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                Clear All
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Right Panel - Car Listings */}
        <motion.div
          className="listings-panel"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Results Header */}
          <Box className="results-header">
            <Box className="results-info">
              <Typography variant="h4" className="results-title">
                {totalCount > 0 ? (
                  <>
                    <motion.span
                      key={totalCount}
                      initial={{ scale: 1.2, color: '#D4AF37' }}
                      animate={{ scale: 1, color: 'inherit' }}
                      transition={{ duration: 0.5 }}
                    >
                      {totalCount.toLocaleString()}
                    </motion.span>
                    {' '}Cars Found
                  </>
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

            {/* Sort Controls */}
            <Box className="sort-controls">
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
                  <Grid 
                    container 
                    spacing={3}
                    className="cars-grid"
                  >
                    {cars.map((car, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        key={car._id}
                      >
                        <motion.div
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
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!carsLoading && cars.length === 0 && !carsError && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MockCarData />
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
        </motion.div>
      </Box>
      </motion.div>
    </ErrorBoundary>
  );
};

export default CarListPage;

