import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { TotalCounter } from '../car/car';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	noticeViews: number;
	isEvent: boolean;
	eventDate?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notices {
	list: Notice[];
	metaCounter: TotalCounter[];
}

export interface NoticesInquiry {
	page: number;
	limit: number;
	sort: string;
	direction: string;
	search: {
		noticeCategory?: NoticeCategory;
		noticeStatus?: NoticeStatus;
		text?: string;
	};
}
