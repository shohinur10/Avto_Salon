import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/car':
					title = 'Car Search';
					desc = 'Find your perfect vehicle';
					bgImage = '/img/mainBanner/main.jpg';
					break;
				case '/agent':
					title = 'Agents';
					desc = 'Professional car dealers';
					bgImage = '/img/mainBanner/main.jpg';
					break;
				case '/agent/detail':
					title = 'Agent Details';
					desc = 'Professional dealer profile';
					bgImage = '/img/mainBanner/main.jpg';
					break;
				case '/mypage':
					title = 'My Dashboard';
					desc = 'Manage your cars and profile';
					bgImage = '/img/mainBanner/main.jpg';
					break;
				case '/community':
					title = 'Community';
					desc = 'Connect with car enthusiasts';
					bgImage = '/img/mainBanner/main.jpg';
					break;
				case '/community/detail':
					title = 'Community Article';
					desc = 'Community discussions';
					bgImage = '/img/mainBanner/main.jpg';
					break;
				case '/cs':
					title = 'Customer Support';
					desc = 'We are here to help you';
					bgImage = '/img/mainBanner/main.jpg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Join our automotive community';
					bgImage = '/img/mainBanner/main.jpg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Profile';
					desc = 'View member details';
					bgImage = '/img/mainBanner/main.jpg';
					break;
				default:
					title = 'Avto Salon';
					desc = 'Premium automotive experience';
					bgImage = '/img/mainBanner/main.jpg';
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
								boxShadow: 'inset 0px 0px 100px 20px rgba(0, 0, 0, 0.3)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
