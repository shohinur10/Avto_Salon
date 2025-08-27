PORT_API=3005
PORT_BATCH=3006

NODE_ENV=development
MONGO_DEV=mongodb+srv://Adam:uXxanQ7wECkOgqgT@cluster0.fme80.mongodb.net/Brand?retryWrites=true&w=majority
MONGO_PROD=mongodb+srv://Adam:uXxanQ7wECkOgqgT@cluster0.fme80.mongodb.net/Brand?retryWrites=true&w=majority

SECRET_TOKEN=123ndnn3u437392jshdsdkldakdd@1w!import { CarTransactionType, CarCategory, CarStatus, CarLocation } from '../../enums/car.enum';
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

	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}


export interface Cars {
	list: Car[];
	metaCounter: TotalCounter[];
}
