import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Slider,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Tune as TuneIcon,
  DirectionsCar as CarIcon,
  LocalGasStation as FuelIcon,
  Speed as SpeedIcon,
  DateRange as YearIcon,
  AttachMoney as PriceIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

// Import actual enums from your project
import { 
  CarBrand, 
  CarCategory, 
  FuelType, 
  TransmissionType, 
  CarCondition, 
  CarLocation 
} from '../../enums/car.enum';

interface FilterState {
  searchText: string;
  brands: CarBrand[];
  categories: CarCategory[];
  fuelTypes: FuelType[];
  transmissions: TransmissionType[];
  conditions: CarCondition[];
  locations: CarLocation[];
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  isLuxuryOnly: boolean;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
}

interface AdvancedCarFilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  totalCars?: number;
}

const AdvancedCarFilter: React.FC<AdvancedCarFilterProps> = ({
  onFilterChange,
  initialFilters = {},
  totalCars = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    searchText: '',
    brands: [],
    categories: [],
    fuelTypes: [],
    transmissions: [],
    conditions: [],
    locations: [],
    priceRange: [0, 1000000],
    yearRange: [1990, 2024],
    mileageRange: [0, 200000],
    isLuxuryOnly: false,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
    ...initialFilters
  });

  const [searchFocused, setSearchFocused] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Brand icons mapping
  const brandIcons: { [key in CarBrand]: string } = {
    [CarBrand.TOYOTA]: '/img/brands/TOYOTA.svg',
    [CarBrand.BMW]: '/img/brands/BMW.svg',
    [CarBrand.MERCEDES]: '/img/brands/MERCEDES.svg',
    [CarBrand.AUDI]: '/img/brands/AUDI.svg',
    [CarBrand.VOLKSWAGEN]: '/img/brands/VOLKSWAGEN.svg',
    [CarBrand.HONDA]: '/img/brands/HONDA.svg',
    [CarBrand.NISSAN]: '/img/brands/NISSAN.svg',
    [CarBrand.HYUNDAI]: '/img/brands/HYUNDAI.svg',
    [CarBrand.KIA]: '/img/brands/KIA.svg',
    [CarBrand.FORD]: '/img/brands/FORD.svg',
    [CarBrand.CHEVROLET]: '/img/brands/CHEVROLET.svg',
    [CarBrand.LEXUS]: '/img/brands/LEXUS.svg',
    [CarBrand.PORSCHE]: '/img/brands/PORSCHE.svg',
    [CarBrand.FERRARI]: '/img/brands/FERRARI.svg',
    [CarBrand.LAMBORGHINI]: '/img/brands/LAMBORGHINI.svg',
    [CarBrand.BENTLEY]: '/img/brands/BENTLEY.svg',
    [CarBrand.ROLLS_ROYCE]: '/img/brands/ROLLS_ROYCE.svg',
    [CarBrand.OTHER]: '/img/brands/OTHER.svg'
  };

  // Color mappings for categories
  const categoryColors: { [key in CarCategory]: string } = {
    [CarCategory.SEDAN]: '#1976d2',
    [CarCategory.SUV]: '#388e3c',
    [CarCategory.HATCHBACK]: '#f57c00',
    [CarCategory.COUPE]: '#d32f2f',
    [CarCategory.LUXURY]: '#d4af37',
    [CarCategory.TRUCK]: '#616161',
    [CarCategory.CAR]: '#9c27b0'
  };

  useEffect(() => {
    onFilterChange(activeFilters);
  }, [activeFilters, onFilterChange]);

  const handleArrayFilter = <T,>(
    field: keyof FilterState,
    value: T,
    currentArray: T[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setActiveFilters(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleRangeChange = (
    field: keyof FilterState,
    value: [number, number]
  ) => {
    setActiveFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      searchText: '',
      brands: [],
      categories: [],
      fuelTypes: [],
      transmissions: [],
      conditions: [],
      locations: [],
      priceRange: [0, 1000000],
      yearRange: [1990, 2024],
      mileageRange: [0, 200000],
      isLuxuryOnly: false,
      sortBy: 'createdAt',
      sortDirection: 'DESC'
    });
  };

  const getActiveFilterCount = () => {
    return (
      activeFilters.brands.length +
      activeFilters.categories.length +
      activeFilters.fuelTypes.length +
      activeFilters.transmissions.length +
      activeFilters.conditions.length +
      activeFilters.locations.length +
      (activeFilters.searchText ? 1 : 0) +
      (activeFilters.isLuxuryOnly ? 1 : 0) +
      (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000000 ? 1 : 0) +
      (activeFilters.yearRange[0] > 1990 || activeFilters.yearRange[1] < 2024 ? 1 : 0) +
      (activeFilters.mileageRange[0] > 0 || activeFilters.mileageRange[1] < 200000 ? 1 : 0)
    );
  };

  return (
    <motion.div
      ref={filterRef}
      className="advanced-car-filter"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filter Header */}
      <motion.div 
        className="filter-header"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Box component="div"   className="filter-header-content">
          {/* Search Bar */}
          <motion.div
            className="search-container"
            animate={{
              scale: searchFocused ? 1.02 : 1,
              boxShadow: searchFocused 
                ? "0 8px 32px rgba(212, 175, 55, 0.3)" 
                : "0 4px 16px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <SearchIcon className="search-icon" />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by brand, model, or keyword..."
              value={activeFilters.searchText}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, searchText: e.target.value }))}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="search-input"
            />
            {activeFilters.searchText && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <IconButton
                  size="small"
                  onClick={() => setActiveFilters(prev => ({ ...prev, searchText: '' }))}
                  className="clear-search-btn"
                >
                  <ClearIcon />
                </IconButton>
              </motion.div>
            )}
          </motion.div>

          {/* Filter Toggle & Stats */}
          <Box component="div"   className="filter-controls">
            <motion.div
              className="filter-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="body2" className="total-cars">
                {totalCars.toLocaleString()} cars found
              </Typography>
            </motion.div>

            <Badge badgeContent={getActiveFilterCount()} color="primary" className="filter-badge">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<TuneIcon />}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="filter-toggle-btn"
                >
                  Advanced Filters
                </Button>
              </motion.div>
            </Badge>

            {getActiveFilterCount() > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearAllFilters}
                  className="clear-filters-btn"
                >
                  Clear All
                </Button>
              </motion.div>
            )}
          </Box>
        </Box>
      </motion.div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Box component="div"   className="filter-content">
              {/* Quick Sort Options */}
              <motion.div
                className="quick-sort-section"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Typography variant="h6" className="section-title">
                  <SpeedIcon className="section-icon" />
                  Quick Sort
                </Typography>
                <Box component="div"   className="sort-options">
                  {[
                    { label: 'Newest First', value: 'createdAt', direction: 'DESC' },
                    { label: 'Price: Low to High', value: 'carPrice', direction: 'ASC' },
                    { label: 'Price: High to Low', value: 'carPrice', direction: 'DESC' },
                    { label: 'Most Popular', value: 'carViews', direction: 'DESC' },
                    { label: 'Lowest Mileage', value: 'carMileage', direction: 'ASC' }
                  ].map((sort, index) => (
                    <motion.div
                      key={sort.label}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Chip
                        label={sort.label}
                        onClick={() => setActiveFilters(prev => ({
                          ...prev,
                          sortBy: sort.value,
                          sortDirection: sort.direction as 'ASC' | 'DESC'
                        }))}
                        variant={
                          activeFilters.sortBy === sort.value && 
                          activeFilters.sortDirection === sort.direction 
                            ? "filled" : "outlined"
                        }
                        className="sort-chip"
                      />
                    </motion.div>
                  ))}
                </Box>
              </motion.div>

              <Grid container spacing={3} className="filter-sections">
                {/* Brand Selection */}
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Accordion className="filter-accordion">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box component="div"   className="accordion-header">
                          <CarIcon className="section-icon" />
                          <Typography variant="h6">
                            Brands ({activeFilters.brands.length})
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box component="div"   className="brand-grid">
                          {Object.values(CarBrand).map((brand, index) => (
                            <motion.div
                              key={brand}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.05 * index, type: "spring", stiffness: 300 }}
                            >
                              <Tooltip title={brand} arrow>
                                <motion.div
                                  className={`brand-option ${activeFilters.brands.includes(brand) ? 'selected' : ''}`}
                                  onClick={() => handleArrayFilter('brands', brand, activeFilters.brands)}
                                  whileHover={{ scale: 1.1, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <img 
                                    src={brandIcons[brand]} 
                                    alt={brand}
                                    className="brand-icon"
                                  />
                                  <Typography variant="caption" className="brand-name">
                                    {brand}
                                  </Typography>
                                </motion.div>
                              </Tooltip>
                            </motion.div>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
                </Grid>

                {/* Category Selection */}
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Accordion className="filter-accordion">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box component="div"   className="accordion-header">
                          <CarIcon className="section-icon" />
                          <Typography variant="h6">
                            Categories ({activeFilters.categories.length})
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box component="div"   className="category-chips">
                          {Object.values(CarCategory).map((category, index) => (
                            <motion.div
                              key={category}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.05 * index }}
                            >
                              <Chip
                                label={category}
                                onClick={() => handleArrayFilter('categories', category, activeFilters.categories)}
                                variant={activeFilters.categories.includes(category) ? "filled" : "outlined"}
                                style={{
                                  backgroundColor: activeFilters.categories.includes(category) 
                                    ? categoryColors[category] 
                                    : 'transparent',
                                  borderColor: categoryColors[category],
                                  color: activeFilters.categories.includes(category) ? 'white' : categoryColors[category]
                                }}
                                className="category-chip"
                              />
                            </motion.div>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
                </Grid>

                {/* Price Range */}
                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="range-section"
                  >
                    <Typography variant="h6" className="section-title">
                      <PriceIcon className="section-icon" />
                      Price Range
                    </Typography>
                    <Box component="div"   className="range-container">
                      <Slider
                        value={activeFilters.priceRange}
                        onChange={(_: Event, value: number | number[]) => handleRangeChange('priceRange', value as [number, number])}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value: number) => `$${value.toLocaleString()}`}
                        min={0}
                        max={1000000}
                        step={5000}
                        className="price-slider"
                      />
                      <Box component="div"   className="range-labels">
                        <Typography variant="caption">
                          ${activeFilters.priceRange[0].toLocaleString()}
                        </Typography>
                        <Typography variant="caption">
                          ${activeFilters.priceRange[1].toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>

                {/* Year Range */}
                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="range-section"
                  >
                    <Typography variant="h6" className="section-title">
                      <YearIcon className="section-icon" />
                      Year Range
                    </Typography>
                    <Box component="div"   className="range-container">
                      <Slider
                        value={activeFilters.yearRange}
                        onChange={(_: Event, value: number | number[]) => handleRangeChange('yearRange', value as [number, number])}
                        valueLabelDisplay="auto"
                        min={1990}
                        max={2024}
                        step={1}
                        className="year-slider"
                      />
                      <Box component="div"   className="range-labels">
                        <Typography variant="caption">
                          {activeFilters.yearRange[0]}
                        </Typography>
                        <Typography variant="caption">
                          {activeFilters.yearRange[1]}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>

                {/* Mileage Range */}
                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="range-section"
                  >
                    <Typography variant="h6" className="section-title">
                      <SpeedIcon className="section-icon" />
                      Mileage Range
                    </Typography>
                    <Box component="div"   className="range-container">
                      <Slider
                        value={activeFilters.mileageRange}
                        onChange={(_: Event, value: number | number[]) => handleRangeChange('mileageRange', value as [number, number])}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value: number) => `${value.toLocaleString()} mi`}
                        min={0}
                        max={200000}
                        step={1000}
                        className="mileage-slider"
                      />
                      <Box component="div"   className="range-labels">
                        <Typography variant="caption">
                          {activeFilters.mileageRange[0].toLocaleString()} mi
                        </Typography>
                        <Typography variant="caption">
                          {activeFilters.mileageRange[1].toLocaleString()} mi
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>

                {/* Additional Filters */}
                <Grid item xs={12}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Typography variant="h6" className="section-title">
                      <FilterIcon className="section-icon" />
                      Additional Filters
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {/* Fuel Type */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Fuel Type</InputLabel>
                          <Select
                            multiple
                            value={activeFilters.fuelTypes}
                            onChange={(e) => setActiveFilters(prev => ({ 
                              ...prev, 
                              fuelTypes: e.target.value as FuelType[] 
                            }))}
                            renderValue={(selected) => (
                              <Box component="div"   sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {Object.values(FuelType).map((fuel) => (
                              <MenuItem key={fuel} value={fuel}>
                                {fuel}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Transmission */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Transmission</InputLabel>
                          <Select
                            multiple
                            value={activeFilters.transmissions}
                            onChange={(e) => setActiveFilters(prev => ({ 
                              ...prev, 
                              transmissions: e.target.value as TransmissionType[] 
                            }))}
                            renderValue={(selected) => (
                              <Box component="div"   sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {Object.values(TransmissionType).map((transmission) => (
                              <MenuItem key={transmission} value={transmission}>
                                {transmission}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Condition */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Condition</InputLabel>
                          <Select
                            multiple
                            value={activeFilters.conditions}
                            onChange={(e) => setActiveFilters(prev => ({ 
                              ...prev, 
                              conditions: e.target.value as CarCondition[] 
                            }))}
                            renderValue={(selected) => (
                              <Box component="div"   sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {Object.values(CarCondition).map((condition) => (
                              <MenuItem key={condition} value={condition}>
                                {condition}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Location */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Location</InputLabel>
                          <Select
                            multiple
                            value={activeFilters.locations}
                            onChange={(e) => setActiveFilters(prev => ({ 
                              ...prev, 
                              locations: e.target.value as CarLocation[] 
                            }))}
                            renderValue={(selected) => (
                              <Box component="div"   sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {Object.entries(CarLocation).map(([key, value]) => (
                              <MenuItem key={key} value={key}>
                                <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Luxury Toggle */}
                    <Box component="div"   className="luxury-toggle" sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={activeFilters.isLuxuryOnly}
                            onChange={(e) => setActiveFilters(prev => ({ 
                              ...prev, 
                              isLuxuryOnly: e.target.checked 
                            }))}
                            color="primary"
                          />
                        }
                        label="Luxury Cars Only"
                      />
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdvancedCarFilter;

