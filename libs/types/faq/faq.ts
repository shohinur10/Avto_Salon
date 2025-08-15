import { TotalCounter } from '../car/car';

export enum FaqCategory {
	CARS = 'CARS',
	PAYMENT = 'PAYMENT',
	BUYERS = 'BUYERS',
	SELLERS = 'SELLERS',
	AGENTS = 'AGENTS',
	MEMBERSHIP = 'MEMBERSHIP',
	COMMUNITY = 'COMMUNITY',
	TECHNICAL = 'TECHNICAL',
	OTHER = 'OTHER',
}

export enum FaqStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	DELETE = 'DELETE',
}

export interface Faq {
	_id: string;
	faqCategory: FaqCategory;
	faqStatus: FaqStatus;
	faqQuestion: string;
	faqAnswer: string;
	faqViews: number;
	faqLikes: number;
	isHelpful: boolean;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Faqs {
	list: Faq[];
	metaCounter: TotalCounter[];
}

export interface FaqsInquiry {
	page: number;
	limit: number;
	sort: string;
	direction: string;
	search: {
		faqCategory?: FaqCategory;
		faqStatus?: FaqStatus;
		text?: string;
		tags?: string[];
	};
}
