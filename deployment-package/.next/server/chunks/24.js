exports.id=24,exports.ids=[24],exports.modules={13562:(e,r,t)=>{"use strict";let i;t.d(r,{U:()=>s,i:()=>n});var a=t(16689),o=t(29114);t(64791),t(38005),t(7596),t(79114),t(61067);var m=t(6629);function n(e=null){let r=i??new o.ApolloClient({ssrMode:!0,link:void 0,cache:new o.InMemoryCache,resolvers:{}});return e&&r.cache.restore(e),r}function s(e){return(0,a.useMemo)(()=>n(e),[e])}t(38807),t(69641),new m.TokenRefreshLink({accessTokenField:"accessToken",isTokenValidOrUndefined:()=>!0,fetchAccessToken:()=>null})},69641:(e,r,t)=>{"use strict";t.d(r,{E_:()=>a});var i=t(29114);(0,i.makeVar)({});let a=(0,i.makeVar)({_id:"",memberType:"",memberStatus:"",memberAuthType:"",memberPhone:"",memberNick:"",memberFullName:"",memberImage:"",memberAddress:"",memberDesc:"",memberCars:0,memberRank:0,memberArticles:0,memberPoints:0,memberLikes:0,memberViews:0,memberWarnings:0,memberBlocks:0});(0,i.makeVar)()},6049:(e,r,t)=>{"use strict";t.d(r,{A2:()=>s,By:()=>x,C9:()=>d,Fx:()=>c,GF:()=>g,Hy:()=>l,_5:()=>a,aF:()=>u,fx:()=>b,g$:()=>h,kD:()=>p,lv:()=>f,rn:()=>m,xO:()=>n,ym:()=>o});var i=t(29114);let a=(0,i.gql)`
	mutation Signup ($input:MemberInput!){
    signup(input: $input) {
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
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberBlocks
        memberWarnings
        deletedAt
        createdAt
        updatedAt
        accessToken
    }
}
`,o=(0,i.gql)`
	mutation Login ($input:LoginInput!){
    login(input:$input) {
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
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberBlocks
        memberWarnings
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
    }
}
`,m=(0,i.gql)`
	mutation UpdateMember($input:MemberUpdate!){
    updateMember(input:$input) {
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
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberBlocks
        memberWarnings
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
    }
}

`,n=(0,i.gql)`
	mutation LikeTargetMember ($input:String!){
    likeTargetMember(memberId:$input) {
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
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberBlocks
        memberWarnings
        deletedAt
        createdAt
        updatedAt
        accessToken
    }
}

`,s=(0,i.gql)`
	mutation CreateCar ($input:CarInput!){
    createCar(input: $input) {
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
        memberId
        soldAt
        deletedAt
        registeredAt
        createdAt
        updatedAt
        memberData {
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
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`,l=(0,i.gql)`
	mutation UpdateCar($input: CarUpdate!) {
    updateCar(input: $input) {
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
        memberId
        soldAt
        deletedAt
        registeredAt
        createdAt
        updatedAt
        memberData {
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
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}


`,c=(0,i.gql)`
	mutation LikeTargetCar($input:String!) {
    likeTargetCar(carId: $input) {
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
        memberId
        soldAt
        deletedAt
        registeredAt
        createdAt
        updatedAt
        memberData {
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
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;(0,i.gql)`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
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
`,(0,i.gql)`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
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
`;let d=(0,i.gql)`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
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
`,b=(0,i.gql)`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
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
`;(0,i.gql)`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
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
`;let p=(0,i.gql)`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`,u=(0,i.gql)`
	mutation CreateNotification($input: NotificationInput!) {
		createNotification(input: $input) {
			_id
			notificationType
			notificationStatus
			notificationGroup
			notificationTitle
			notificationContent
			notificationRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;(0,i.gql)`
	mutation UpdateNotification($input: NotificationUpdate!) {
		updateNotification(input: $input) {
			_id
			notificationType
			notificationStatus
			notificationGroup
			notificationTitle
			notificationContent
			notificationRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;let g=(0,i.gql)`
	mutation MarkNotificationAsRead($input: String!) {
		markNotificationAsRead(notificationId: $input) {
			_id
			notificationStatus
			updatedAt
		}
	}
`,f=(0,i.gql)`
	mutation MarkAllNotificationsAsRead {
		markAllNotificationsAsRead {
			success
			message
		}
	}
`,h=(0,i.gql)`
	mutation DeleteNotification($input: String!) {
		deleteNotification(notificationId: $input) {
			success
			message
		}
	}
`,x=(0,i.gql)`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`},61067:(e,r,t)=>{"use strict";t.d(r,{Hc:()=>u,Ib:()=>c,gS:()=>g,ni:()=>f,rS:()=>l,y1:()=>b});var i=t(45567),a=t.n(i),o=t(13562),m=t(69641),n=t(38807),s=t(6049);function l(){}let c=async(e,r)=>{try{console.log("Starting login process for:",e);let{jwtToken:t}=await d({nick:e,password:r});if(t)console.log("JWT token received, updating storage and user info"),u({jwtToken:t}),g(t),console.log("Login process completed successfully");else throw console.error("No JWT token received"),Error("No token received from server")}catch(e){throw console.warn("login err",e),f(),Error("Login failed. Please check your credentials.")}},d=async({nick:e,password:r})=>{let t=await (0,o.i)();try{let i=await t.mutate({mutation:s.ym,variables:{input:{memberNick:e,memberPassword:r}},fetchPolicy:"network-only"});console.log("---------- login ----------");let{accessToken:a}=i?.data?.login;return{jwtToken:a}}catch(e){if(console.log("request token err",e),e.graphQLErrors&&e.graphQLErrors.length>0){let r=e.graphQLErrors[0].message;switch(r){case"Definer: login and password do not match":await (0,n.cj)("Please check your password again");break;case"Definer: user has been blocked!":await (0,n.cj)("User has been blocked!");break;case"No member nick found":await (0,n.cj)("User not found. Please check your nickname.");break;default:await (0,n.cj)(r)}}else e.networkError?await (0,n.cj)("Network error. Please check your connection."):await (0,n.cj)("Login failed. Please try again.");throw Error("Login failed")}},b=async(e,r,t,i)=>{try{let{jwtToken:a}=await p({nick:e,password:r,phone:t,type:i});a&&(u({jwtToken:a}),g(a))}catch(e){throw console.warn("signup err",e),f(),Error("Signup failed. Please try again.")}},p=async({nick:e,password:r,phone:t,type:i})=>{let a=await (0,o.i)();try{let o=await a.mutate({mutation:s._5,variables:{input:{memberNick:e,memberPassword:r,memberPhone:t,memberType:i}},fetchPolicy:"network-only"});console.log("---------- signup ----------");let{accessToken:m}=o?.data?.signup;return{jwtToken:m}}catch(e){if(console.log("request signup token err",e),e.graphQLErrors&&e.graphQLErrors.length>0){let r=e.graphQLErrors[0].message;switch(r){case"Definer: login and password do not match":await (0,n.cj)("Please check your password again");break;case"Definer: user has been blocked!":await (0,n.cj)("User has been blocked!");break;case"No member nick found":await (0,n.cj)("User not found. Please check your nickname.");break;default:await (0,n.cj)(r)}}else e.networkError?await (0,n.cj)("Network error. Please check your connection."):await (0,n.cj)("Signup failed. Please try again.");throw Error("Signup failed")}},u=({jwtToken:e})=>{window.localStorage.setItem("login",Date.now().toString())},g=e=>{if(!e)return!1;let r=a()(e);(0,m.E_)({_id:r._id??"",memberType:r.memberType??"",memberStatus:r.memberStatus??"",memberAuthType:r.memberAuthType,memberPhone:r.memberPhone??"",memberNick:r.memberNick??"",memberFullName:r.memberFullName??"",memberImage:null===r.memberImage||void 0===r.memberImage?"/img/profile/defaultUser.svg":`${r.memberImage}`,memberAddress:r.memberAddress??"",memberDesc:r.memberDesc??"",memberCars:r.memberCars,memberRank:r.memberRank,memberArticles:r.memberArticles,memberPoints:r.memberPoints,memberLikes:r.memberLikes,memberViews:r.memberViews,memberWarnings:r.memberWarnings,memberBlocks:r.memberBlocks})},f=()=>{h(),x(),window.location.reload()},h=()=>{localStorage.removeItem("accessToken"),window.localStorage.setItem("logout",Date.now().toString())},x=()=>{(0,m.E_)({_id:"",memberType:"",memberStatus:"",memberAuthType:"",memberPhone:"",memberNick:"",memberFullName:"",memberImage:"",memberAddress:"",memberDesc:"",memberCars:0,memberRank:0,memberArticles:0,memberPoints:0,memberLikes:0,memberViews:0,memberWarnings:0,memberBlocks:0})}},38350:(e,r,t)=>{"use strict";t.d(r,{Vm:()=>n,Wx:()=>i,mW:()=>s});let i="http://72.60.108.222:4001",a=new Date().getFullYear(),o=[];for(let e=1900;e<=a;e++)o.push(String(e));let m=[];for(let e=1900;e<=a;e++)m.push(e);let n={error1:"Something went wrong!",error2:"Please login first!",error3:"Please fulfill all inputs!",error4:"Message is empty!",error5:"Only images with jpeg, jpg, png format allowed!"},s=2},38807:(e,r,t)=>{"use strict";t.d(r,{Iu:()=>s,P:()=>o,Tb:()=>l,cj:()=>n,d8:()=>m});var i=t(20271),a=t.n(i);t(65544),t(38350);let o=async e=>{await a().fire({icon:"error",text:e.message,showConfirmButton:!1})},m=e=>new Promise(async(r,t)=>{await a().fire({icon:"question",text:e,showClass:{popup:"animate__bounceIn"},showCancelButton:!0,showConfirmButton:!0,confirmButtonColor:"#e92C28",cancelButtonColor:"#bdbdbd"}).then(e=>{e?.isConfirmed?r(!0):r(!1)})}),n=async(e,r=3e3)=>{await a().fire({icon:"error",title:e,showConfirmButton:!1,timer:r})},s=async(e,r=2e3)=>{await a().fire({icon:"success",title:e,showConfirmButton:!1,timer:r})},l=async(e,r=2e3,t=!1)=>{a().mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:r,timerProgressBar:!0}).fire({icon:"success",title:e}).then(e=>{t&&window.location.reload()})}},80024:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>g});var i=t(20997),a=t(18442),o=t(68653),m=t(16689),n=t(75574);let s={palette:{type:"light",background:{default:"#f4f6f8",paper:n.common.white},primary:{contrastText:"#ffffff",main:"#E92C28"},secondary:{main:"#1646C1"},text:{primary:"#212121",secondary:"#616161",dark:n.common.black}},components:{MuiTypography:{styleOverrides:{root:{letterSpacing:"0"}},defaultProps:{variantMapping:{h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"p",subtitle2:"p",subtitle3:"p",body1:"p",body2:"p"}}},MuiLink:{styleOverrides:{root:{color:"#757575",textDecoration:"none"}}},MuiDivider:{styleOverrides:{root:{borderColor:"#eee"}}},MuiBox:{styleOverrides:{root:{padding:"0"}},makeStyles:{root:{padding:0}},sx:{"&.MuiBox-root":{component:"div"}}},MuiContainer:{styleOverrides:{root:{maxWidth:"inherit",padding:"0","@media (min-width: 600px)":{paddingLeft:0,paddingRight:0}}}},MuiCssBaseline:{styleOverrides:{html:{height:"100%"},body:{background:"#fff",height:"100%",minHeight:"100%"},p:{margin:"0"}}},MuiAvatar:{styleOverrides:{root:{marginLeft:"0"}}},MuiButton:{styleOverrides:{root:{color:"#212121",minWidth:"auto",lineHeight:"1.2",boxShadow:"none",ButtonText:{color:"#212121"}}}},MuiIconButton:{styleOverrides:{root:{}}},MuiListItemButton:{styleOverrides:{root:{padding:"0"}}},MuiList:{styleOverrides:{root:{padding:"0"}}},MuiListItem:{styleOverrides:{root:{MuiSelect:{backgroundColor:"#fafafa"},padding:"0"}}},MuiFormControl:{styleOverrides:{root:{width:"100%"}}},MuiFormControlLabel:{styleOverrides:{root:{marginRight:"0"}}},MuiSelect:{styleOverrides:{root:{},select:{textAlign:"left"}}},MuiInputBase:{styleOverrides:{root:{input:{}}}},MuiOutlinedInput:{styleOverrides:{root:{height:"48px",width:"100%",backgroundColor:"#fff",input:{}},notchedOutline:{padding:"8px",top:"-9px",border:"1px solid #eee"}}},MuiFormHelperText:{styleOverrides:{root:{margin:"5px 0 0 2px",lineHeight:"1.2"}}},MuiStepper:{styleOverrides:{root:{alignItems:"center"}}},MuiTabPanel:{styleOverrides:{root:{padding:"0"}}},MuiSvgIcon:{styleOverrides:{root:{}}},MuiStepIcon:{styleOverrides:{root:{color:"#fff",borderRadius:"50%",border:"1px solid #eee"},text:{fill:"#bdbdbd"}}},MuiStepConnector:{styleOverrides:{line:{borderColor:"#eee"}}},MuiStepLabel:{styleOverrides:{label:{fontSize:"14px"}}},MuiCheckbox:{styleOverrides:{root:{"&.Mui-checked":{color:"black"}}}},MuiFab:{styleOverrides:{root:{width:"40px",height:"40px",background:"#fff",color:"#212121"},hover:{background:"#fff"}}},MuiPaper:{styleOverrides:{root:{MuiMenu:{boxShadow:"rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px"}}}},MuiMenuItem:{styleOverrides:{root:{padding:"6px 8px"}}},MuiAlert:{styleOverrides:{root:{boxShadow:"none"}}},MuiChip:{styleOverrides:{root:{border:"1px solid #ddd",color:"#212121"}}}},shadow:["none","0 0 0 1px rgba(63,63,68,0.05), 0 1px 2px 0 rgba(63,63,68,0.15)","0 0 1px 0 rgba(0,0,0,0.31), 0 2px 2px -2px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 4px 8px -2px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 5px 8px -2px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 6px 12px -4px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 7px 12px -4px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 6px 16px -4px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 7px 16px -4px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 8px 18px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 9px 18px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 10px 20px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 11px 20px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 12px 22px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 13px 22px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 14px 24px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 16px 28px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 18px 30px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 20px 32px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 22px 34px -8px rgba(0,0,0,0.25)","0 0 1px 0 rgba(0,0,0,0.31), 0 24px 36px -8px rgba(0,0,0,0.25)"],typography:{h1:{fontSize:36,fontWeight:700},h2:{fontSize:24,fontWeight:500},h3:{fontSize:20,fontWeight:500},h4:{fontSize:18,fontWeight:500},h5:{fontSize:16,fontWeight:500},h6:{fontSize:14,fontWeight:500},subtitle1:{fontSize:14,fontWeight:400},subtitle2:{fontSize:13,fontWeight:400},body1:{fontSize:16,fontWeight:400},body2:{fontSize:15,fontWeight:400},body3:{fontSize:12,fontWeight:400},caption:{fontSize:12,fontWeight:400},overline:{fontWeight:500},inputLabel:{fontSize:12,fontWeight:400},helperText:{fontSize:13,fontWeight:400},inputText:{fontSize:12,fontWeight:400},button:{fontSize:14,fontWeight:400,textTransform:"none"}}};var l=t(29114),c=t(13562),d=t(11377),b=t(69641);t(61067);let p=()=>{let e=(0,l.useReactiveVar)(b.E_);return(0,m.useEffect)(()=>{},[]),e};t(967),t(49143),t(263),t(45172);let u=({children:e})=>(p(),i.jsx(i.Fragment,{children:e})),g=(0,d.appWithTranslation)(({Component:e,pageProps:r})=>{let[t,n]=(0,m.useState)((0,a.createTheme)(s)),d=(0,c.U)(r.initialApolloState);return i.jsx(l.ApolloProvider,{client:d,children:(0,i.jsxs)(a.ThemeProvider,{theme:t,children:[i.jsx(o.Z,{}),i.jsx(u,{children:i.jsx(e,{...r})})]})})})},967:()=>{},263:()=>{},45172:()=>{},49143:()=>{}};