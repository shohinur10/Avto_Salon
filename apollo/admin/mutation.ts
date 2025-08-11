import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberCars
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *          CAR           *
 **************************/

export const UPDATE_CAR_BY_ADMIN = gql`
	mutation UpdateCarByAdmin($input: CarUpdate!) {
		updateCarByAdmin(input: $input) {
			_id
			carTransactionType
			carCategory
			carStatus
			carLocation
			carAddress
			carTitle
			carPrice
			carYear
			carSeats
			carDoors
			carViews
			carLikes
			carComments
			carRank
			carImages
			carDesc
			isBarterAvailable
			isForRent
			discountPercent
			discountedPrice
			brand
			memberId
			soldAt
			deletedAt
			registeredAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_CAR_BY_ADMIN = gql`
	mutation RemoveCarByAdmin($input: String!) {
		removeCarByAdmin(carId: $input) {
			_id
			carTransactionType
			carCategory
			carStatus
			carLocation
			carAddress
			carTitle
			carPrice
			carYear
			carSeats
			carDoors
			carViews
			carLikes
			carComments
			carRank
			carImages
			carDesc
			isBarterAvailable
			isForRent
			discountPercent
			discountedPrice
			brand
			memberId
			soldAt
			deletedAt
			registeredAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;
