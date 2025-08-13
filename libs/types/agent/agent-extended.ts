import { Member } from '../member/member';
import { CarBrand, CarCategory, FuelType } from '../../enums/car.enum';

// Extended agent profile with car sales specific data
export interface AgentProfile extends Member {
	// Professional Information
	title: string; // "Senior Car Consultant", "Luxury Vehicle Specialist"
	experience: number; // years in business
	languages: string[]; // ["English", "Korean", "Russian"]
	
	// Performance Metrics
	carsSold: number;
	clientRating: number; // 1-5 stars
	responseTime: string; // "Usually responds in 2 hours"
	satisfactionRate: number; // percentage 0-100
	
	// Specializations
	brandExpertise: string[]; // BMW, Mercedes, etc.
	vehicleTypes: string[]; // SUV, Sedan, Sports, etc.
	fuelExpertise: string[]; // GASOLINE, ELECTRIC, HYBRID
	priceRange: { min: number; max: number };
	
	// Contact & Availability
	whatsapp?: string;
	availability: 'online' | 'busy' | 'offline';
	workingHours: string; // "9 AM - 6 PM"
	timezone: string; // "Asia/Seoul"
	
	// Trust Building
	certifications: string[];
	awards: string[];
	recentSales: AgentSale[];
	clientTestimonials: ClientTestimonial[];
	
	// Location & Territory
	territory: string; // "Seoul Metropolitan Area"
	officeLocation?: string;
	serviceAreas: string[];
	
	// Social & Professional
	socialMedia?: {
		linkedin?: string;
		facebook?: string;
		instagram?: string;
	};
	
	// Statistics
	monthlyStats: {
		carsSold: number;
		clientsMet: number;
		responseRate: number;
	};
}

export interface AgentSale {
	_id: string;
	carBrand: string;
	carModel: string;
	carImage: string;
	salePrice: number;
	saleDate: Date;
	clientReview?: string;
}

export interface ClientTestimonial {
	_id: string;
	clientName: string;
	clientImage?: string;
	rating: number; // 1-5
	review: string;
	date: Date;
	carPurchased: string; // "BMW X7 2023"
	verified: boolean;
}

export interface AgentFilterState {
	// Basic Search
	searchText: string;
	
	// Location Filters
	location?: string;
	serviceArea?: string;
	
	// Expertise Filters
	brandExpertise?: string[];
	vehicleTypes?: string[];
	fuelExpertise?: string[];
	
	// Experience & Performance
	minExperience?: number;
	minRating?: number;
	priceRange?: { min: number; max: number };
	
	// Availability
	availability?: string[];
	languages?: string[];
	
	// Sorting
	sortBy: 'rating' | 'experience' | 'carsSold' | 'recent' | 'responseTime';
	sortDirection: 'asc' | 'desc';
	
	// Pagination
	page: number;
	limit: number;
}

export interface AgentMatchingCriteria {
	userPreferences: {
		carBrand?: string;
		carCategory?: string;
		fuelType?: string;
		priceRange?: { min: number; max: number };
		location?: string;
		language?: string;
	};
	priorityFactors: {
		expertise: number; // weight 0-1
		rating: number; // weight 0-1
		availability: number; // weight 0-1
		responseTime: number; // weight 0-1
		location: number; // weight 0-1
	};
}

export interface AgentSearchResult {
	agents: AgentProfile[];
	total: number;
	page: number;
	totalPages: number;
	recommended?: AgentProfile[]; // AI-recommended based on user preferences
}

