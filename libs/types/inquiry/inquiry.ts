import { TotalCounter } from '../car/car';

export enum InquiryCategory {
	GENERAL = 'GENERAL',
	TECHNICAL = 'TECHNICAL',
	BILLING = 'BILLING',
	CAR_RELATED = 'CAR_RELATED',
	ACCOUNT = 'ACCOUNT',
	COMPLAINT = 'COMPLAINT',
	SUGGESTION = 'SUGGESTION',
	OTHER = 'OTHER',
}

export enum InquiryStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	RESOLVED = 'RESOLVED',
	CLOSED = 'CLOSED',
}

export enum InquiryPriority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	URGENT = 'URGENT',
}

export interface Inquiry {
	_id: string;
	inquiryCategory: InquiryCategory;
	inquiryStatus: InquiryStatus;
	inquiryPriority: InquiryPriority;
	inquirySubject: string;
	inquiryContent: string;
	inquirerName: string;
	inquirerEmail: string;
	inquirerPhone?: string;
	memberId?: string;
	adminResponse?: string;
	responseDate?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Inquiries {
	list: Inquiry[];
	metaCounter: TotalCounter[];
}

export interface InquiriesInquiry {
	page: number;
	limit: number;
	sort: string;
	direction: string;
	search: {
		inquiryCategory?: InquiryCategory;
		inquiryStatus?: InquiryStatus;
		inquiryPriority?: InquiryPriority;
		text?: string;
	};
}

export interface CreateInquiryInput {
	inquiryCategory: InquiryCategory;
	inquirySubject: string;
	inquiryContent: string;
	inquirerName: string;
	inquirerEmail: string;
	inquirerPhone?: string;
}
