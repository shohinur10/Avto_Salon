import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import CommunityCard from '../common/CommunityCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { BoardArticle } from '../../types/board-article/board-article';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const MyArticles: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [searchCommunity, setSearchCommunity] = useState({
		...initialInput,
		search: { memberId: user._id },
	});
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: getboardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProperty({
				variables: { input: id },
			});

			await boardArticlesRefetch({ input: searchCommunity });

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('Error, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <>ARTICLE PAGE MOBILE</>;
	} else
		return (
			<div id="my-articles-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Article</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="article-list-box">
					{boardArticles?.length > 0 ? (
						boardArticles?.map((boardArticle: BoardArticle) => {
							return (
								<CommunityCard
									likeArticleHandler={likePropertyHandler}
									boardArticle={boardArticle}
									key={boardArticle?._id}
									size={'small'}
								/>
							);
						})
					) : (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No Articles found!</p>
						</div>
					)}
				</Stack>

				{boardArticles?.length > 0 && (
					<Stack className="pagination-conf">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total">
							<Typography>Total {totalCount ?? 0} article(s) available</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
};

MyArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MyArticles;