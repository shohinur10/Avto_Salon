import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import CarListPage from '../../libs/components/car/CarListPage';
import { useRouter } from 'next/router';
import { CarsInquiry } from '../../libs/types/car/car.input';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CarList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [initialFilters, setInitialFilters] = useState<Partial<CarsInquiry>>({});

	useEffect(() => {
		// Parse URL parameters to set initial filters
		if (router.query.input) {
			try {
				const inputObj = JSON.parse(router.query.input as string);
				setInitialFilters(inputObj);
			} catch (error) {
				console.error('Error parsing URL input:', error);
			}
		} else {
			setInitialFilters(initialInput);
		}
	}, [router.query.input, initialInput]);

	if (device === 'mobile') {
					return (
			<div style={{ 
				padding: '2rem', 
				textAlign: 'center',
				background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
				minHeight: '100vh',
				color: 'white'
			}}>
				<h1>🚗 Browse Cars</h1>
				<p>Mobile version coming soon with advanced filters!</p>
			</div>
		);
	} else {
		return <CarListPage initialFilters={initialFilters} />;
	}
};

CarList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 12,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 1000000,
			},
			yearRange: [1990, 2024],
			minMileage: 0,
			maxMileage: 200000,
		},
	},
};

export default withLayoutBasic(CarList);
