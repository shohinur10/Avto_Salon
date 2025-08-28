
import { CarTransactionType, CarCategory, CarStatus, CarLocation, FuelType, TransmissionType, CarCondition, CarColor } from '../../enums/car.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Car {
	_id: string;
	carTransactionType: CarTransactionType;
	carCategory: CarCategory;
	carStatus?: CarStatus;
	carLocation: CarLocation;
	carAddress: string;
	carTitle: string;
	brand: string; // ✅ Added brand field
	carPrice: number;
	carYear: number;
	carMileage?: number; // Added mileage field
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
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	registeredAt?: Date;
	discountPercent?: number;
	discountedPrice?: number;
	createdAt: Date;
	updatedAt: Date;

	// Additional fields from GraphQL query (currently commented out due to backend schema issues)
	// fuelType?: FuelType;
	// transmissionType?: TransmissionType;
	// carCondition?: CarCondition;
	// carColor?: CarColor;
	// model?: string;

	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}


export interface Cars {
	list: Car[];
	metaCounter: TotalCounter[];
}
