import { CarTransactionType, CarCategory, CarStatus, CarLocation } from '../../enums/car.enum';
import { Direction } from '../../enums/common.enum';

export interface CarInput {
  carTransactionType: CarTransactionType;
  carCategory: CarCategory;
  carStatus?: CarStatus;
  carLocation: CarLocation;
  carAddress: string;
  carTitle: string;
  brand: string; // ✅ Added brand field
  carPrice: number;
  carYear: number;
  carSeats: number;
  carDoors: number;
  carViews?: number;
  carLikes?: number;
  carComments?: number;
  carRank?: number;
  carImages: string[];
  carDesc?: string;
  isBarterAvailable?: boolean;
  isForRent?: boolean;
  memberId?: string;
  soldAt?: Date | string;
  deletedAt?: Date | string;
  registeredAt?: Date | string;
  discountPercent?: number;
  discountedPrice?: number;
}


interface PricesRange {
  start: number;
  end: number;
}

interface PeriodsRange {
  start: number;  // e.g., month or timestamp
  end: number;
}

interface YearRange {
  startYear: number;
  endYear: number;
}

export interface PISearch {
  doorsList: any;
  memberId?: string;
  locationList?: CarLocation[];
  typeList?: CarTransactionType[];
  carCategoryList?: CarCategory[];
  yearRange?: number[];  // [startYear, endYear]
  fuelTypes?: string[];
  brands?: string[];
  pricesRange?: PricesRange;
  periodsRange?: PeriodsRange;
  minMileage?: number;
  maxMileage?: number;
  options?: string[];  // like CarLoan, CarInsurance
  searchText?: string;
}

export interface CarsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: PISearch;
}

interface APISearch {
  carStatus?: CarStatus;
}

export interface AgentCarsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: APISearch;
}

interface ALPISearch {
  carStatus?: CarStatus;
  carLocationList?: CarLocation[];
}

export interface AllCarsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ALPISearch;
}

export interface OrdinaryInquiry {
  page: number;
  limit: number;
}
