import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProperties from '../libs/components/homepage/PopularCars';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendProperties from '../libs/components/homepage/TrendCars';
import TopProperties from '../libs/components/homepage/TopCars';
import InspiringExcellence from '../libs/components/homepage/InspiringExcellence';
import CraftsmanshipHeritage from '../libs/components/homepage/CraftsmanshipHeritage';
import SignatureExperience from '../libs/components/homepage/SignatureExperience';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TrendCars from '../libs/components/homepage/TrendCars';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<InspiringExcellence />
				<TrendProperties />
				<PopularProperties />
				<CraftsmanshipHeritage />
				<TopProperties />
				<TopAgents />
				<SignatureExperience />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<InspiringExcellence />
				<TrendCars />
				<PopularProperties />
				<CraftsmanshipHeritage />
				<TopProperties />
				<TopAgents />
				<Events />
				<SignatureExperience />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
