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
  Link
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  Home as HomeIcon
} from '@mui/icons-material';

import AdvancedCarFilter from './AdvancedCarFilter';
import CarCard from './CarCard';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
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
    onCompleted: (data) => {
      setCars(data?.getCars?.list || []);
      setTotalCount(data?.getCars?.metaCounter?.[0]?.total || 0);
    },
  });

  // Update search when filters change
  const handleFilterChange = (filters: any) => {
    const newSearchInput = {
      ...searchInput,
      page: 1,
      search: {
        searchText: filters.searchText || undefined,
        brands: filters.brands.length > 0 ? filters.brands : undefined,
        carCategoryList: filters.categories.length > 0 ? filters.categories : undefined,
        fuelTypes: filters.fuelTypes.length > 0 ? filters.fuelTypes : undefined,
        locationList: filters.locations.length > 0 ? filters.locations : undefined,
        pricesRange: {
          start: filters.priceRange[0],
          end: filters.priceRange[1]
        },
        yearRange: filters.yearRange,
        minMileage: filters.mileageRange[0],
        maxMileage: filters.mileageRange[1]
      },
      sort: filters.sortBy,
      direction: filters.sortDirection
    };

    setSearchInput(newSearchInput);
    setCurrentPage(1);
  };

  // Pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setSearchInput(prev => ({ ...prev, page }));
    
    // Smooth scroll to top
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
    <motion.div
      className="car-list-page"
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
            Premium Car Collection
          </Typography>
          
          <Typography variant="body1" className="page-subtitle">
            Discover exceptional vehicles from the world's finest automotive brands
          </Typography>
        </Box>

        {/* View Controls */}
        <motion.div
          className="view-controls"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Box className="view-mode-toggle">
            <motion.button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GridViewIcon />
            </motion.button>
            <motion.button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ListViewIcon />
            </motion.button>
          </Box>

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
        </motion.div>
      </motion.div>

      {/* Advanced Filter */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AdvancedCarFilter
          onFilterChange={handleFilterChange}
          initialFilters={initialFilters}
          totalCars={totalCount}
        />
      </motion.div>

      {/* Results Section */}
      <motion.div
        className="results-section"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Results Header */}
        <Box className="results-header">
          <Typography variant="h3" className="results-title">
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
          </motion.div>
        )}

        {/* Cars Grid/List */}
        {!carsLoading && cars.length > 0 && (
          <motion.div
            className={`cars-container ${viewMode}-view`}
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
                  spacing={viewMode === 'grid' ? 3 : 2}
                  className="cars-grid"
                >
                  {cars.map((car, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={viewMode === 'grid' ? 6 : 12}
                      md={viewMode === 'grid' ? 4 : 12}
                      lg={viewMode === 'grid' ? 3 : 12}
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
            <img 
              src="/img/empty-state.svg" 
              alt="No cars found" 
              className="empty-image"
            />
            <Typography variant="h4" className="empty-title">
              No Cars Match Your Criteria
            </Typography>
            <Typography variant="body1" className="empty-subtitle">
              Try adjusting your filters to see more results
            </Typography>
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

      {/* Floating Filter Button (Mobile) */}
      <Zoom in={!showFilters}>
        <Fab
          color="primary"
          aria-label="show filters"
          className="floating-filter-btn"
          onClick={() => setShowFilters(true)}
        >
          <FilterIcon />
        </Fab>
      </Zoom>
    </motion.div>
  );
};

export default CarListPage;

