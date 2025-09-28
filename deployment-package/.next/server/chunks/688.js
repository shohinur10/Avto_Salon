"use strict";exports.id=688,exports.ids=[688],exports.modules={23550:(e,r,t)=>{t.d(r,{$S:()=>m,BG:()=>u,D7:()=>h,IW:()=>s,Ie:()=>d,MN:()=>x,TX:()=>n,VZ:()=>g,au:()=>c,h6:()=>l,sk:()=>f,w4:()=>a,ym:()=>i,yt:()=>b});var o=t(29114);let i=(0,o.gql)`
query GetAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`,n=(0,o.gql)`
query GetPublicAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
        list {
            _id
            memberType
            memberStatus
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
            createdAt
            updatedAt
        }
        metaCounter {
            total
        }
    }
}
`,a=(0,o.gql)(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`),s=(0,o.gql)`
	query GetCar($input: String!) {
    getCar(carId: $input) {
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
        brand
        fuelType
        transmissionType
        carCondition
        carColor
        model
        carMileage
    }
}
`,l=(0,o.gql)`
	query GetCars($input: CarsInquiry!) {
    getCars(input: $input) {
        list {
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
            brand
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
            # Temporarily removing problematic fields until backend schema is updated
            # fuelType
            # transmissionType
            # carCondition
            # carColor
            # model
            # carMileage
        }
        metaCounter {
            total
        }
    }
}
`,c=(0,o.gql)`
query GetAgentCars($input:AgentCarsInquiry!) {
    getAgentCars(input:$input) {
        list {
            _id
            carTransactionType
            carCategory
            carStatus
            carLocation
            brand
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
        metaCounter {
            total
        }
    }
}

`,m=(0,o.gql)`
	query GetFavorites($input: OrdinaryInquiry!) {
    getFavorites(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}

`,d=(0,o.gql)`
	query GetVisited($input: OrdinaryInquiry!) {
    getVisited(input: $input) {
        list {
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
            brand
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
        metaCounter {
            total
        }
    }
}


`,f=(0,o.gql)`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
        list {
            _id
            articleCategory
            articleStatus
            articleTitle
            articleContent
            articleImage
            articleViews
            articleLikes
            articleComments
            memberId
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
        metaCounter {
            total
        }
    }
}


`,x=(0,o.gql)`
	query GetComments($input:CommentsInquiry!) {
    getComments(input: $input) {
        list {
            _id
            commentStatus
            commentGroup
            commentContent
            commentRefId
            memberId
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
        metaCounter {
            total
        }
    }
}

`,b=(0,o.gql)`
	query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
        list {
            _id
            followingId
            followerId
            createdAt
            updatedAt
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
            followerData {
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
        metaCounter {
            total
        }
    }
}
`,g=(0,o.gql)`
	query GetNotifications($input: NotificationInquiry!) {
    getNotifications(input: $input) {
        list {
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
            memberData {
                _id
                memberNick
                memberFullName
                memberImage
            }
        }
        metaCounter {
            total
            unread
        }
    }
}
`,u=(0,o.gql)`
	query GetNotificationCount {
    getNotificationCount {
        total
        unread
    }
}
`,h=(0,o.gql)`
	query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
        list {
            _id
            followingId
            followerId
            createdAt
            updatedAt
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
            followingData {
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
        metaCounter {
            total
        }
    }
}

`},34200:(e,r,t)=>{t.d(r,{Z:()=>V});var o=t(20997),i=t(16689),n=t(26337),a=t(34638),s=t(3828),l=t.n(s),c=t(94508),m=t.n(c),d=t(28697),f=t.n(d),x=t(23890),b=t.n(x),g=t(24965),u=t.n(g),h=t(41470),p=t.n(h),j=t(80601),y=t.n(j),C=t(34224),w=t.n(C),S=t(24917),v=t(32245),A=t.n(v),k=t(73281),I=t.n(k),F=t(50375),z=t.n(F),T=t(95939),N=t.n(T),R=t(4878),E=t.n(R),D=t(86872),P=t.n(D),L=t(89226),M=t.n(L),W=t(72625),Z=t.n(W),B=t(65107),q=t.n(B),_=t(77849),$=t.n(_);let V=()=>{let e=(0,S.Z)(),[r,t]=(0,i.useState)(""),[s,c]=(0,i.useState)(!1),d=()=>{r.trim()&&(c(!0),t(""))},x=[{label:"Luxury Cars",href:"/car?category=luxury"},{label:"Electric Vehicles",href:"/car?category=electric"},{label:"SUVs & Crossovers",href:"/car?category=suv"},{label:"Sports Cars",href:"/car?category=sports"},{label:"Sedans",href:"/car?category=sedan"},{label:"Certified Pre-Owned",href:"/car?category=certified"}],g=[{label:"Buy New Cars",href:"/car?purpose=buy&type=new"},{label:"Buy Used Cars",href:"/car?purpose=buy&type=used"},{label:"Sell Your Car",href:"/mypage?category=addCar"},{label:"Car Financing",href:"/services/loans"},{label:"Detailing & Service",href:"/services/detailing"},{label:"Insurance",href:"/services/insurance"},{label:"Trade-In Value",href:"/services/trade-in"},{label:"Extended Warranty",href:"/services/warranty"},{label:"Car Inspection",href:"/services/inspection"},{label:"Delivery Service",href:"/services/delivery"}],h=[{label:"Browse Inventory",href:"/car"},{label:"Find Dealers",href:"/agent"},{label:"Car Reviews",href:"/community?category=reviews"},{label:"Price Calculator",href:"/tools/calculator"},{label:"Schedule Test Drive",href:"/services/test-drive"},{label:"About Us",href:"/about"}],j=[{label:"Privacy Policy",href:"/legal/privacy"},{label:"Terms of Service",href:"/legal/terms"},{label:"Cookie Policy",href:"/legal/cookies"},{label:"Dealer Agreement",href:"/legal/dealer"}];return"mobile"===e?o.jsx(n.Z,{component:"div",sx:{backgroundColor:"#121212",color:"#cccccc",fontFamily:"Inter, -apple-system, BlinkMacSystemFont, sans-serif",pt:6,pb:3,mt:8,width:"100vw",position:"relative",left:"50%",right:"50%",marginLeft:"-50vw",marginRight:"-50vw"},children:o.jsx(n.Z,{component:"div",sx:{maxWidth:"1600px",margin:"0 auto",px:{xs:3,sm:4}},children:(0,o.jsxs)(a.default,{spacing:4,children:[(0,o.jsxs)(a.default,{alignItems:"center",spacing:2,children:[o.jsx("img",{src:"/img/logo/logo.png",alt:"Auto Salon Logo",style:{height:"60px"}}),o.jsx(l(),{variant:"h6",sx:{fontWeight:700,textAlign:"center",color:"#ffffff",fontSize:"18px"},children:"Auto Salon"}),o.jsx(l(),{sx:{textAlign:"center",fontSize:"14px",lineHeight:1.8,color:"#cccccc"},children:"Premium automotive marketplace for luxury vehicles"}),(0,o.jsxs)(a.default,{direction:"row",spacing:1,children:[o.jsx(m(),{icon:o.jsx(q(),{sx:{fontSize:"16px"}}),label:"Verified Dealer",size:"small",sx:{backgroundColor:"#2a2a2a",color:"#ffcc00",fontSize:"12px"}}),o.jsx(m(),{icon:o.jsx($(),{sx:{fontSize:"16px"}}),label:"5-Star Service",size:"small",sx:{backgroundColor:"#ffcc00",color:"#121212",fontSize:"12px"}})]})]}),(0,o.jsxs)(n.Z,{component:"div",sx:{backgroundColor:"#2a2a2a",borderRadius:"12px",p:3,textAlign:"center",border:"1px solid #404040"},children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:600,mb:1,color:"#ffffff",fontSize:"16px"},children:"Stay Connected"}),o.jsx(l(),{sx:{mb:2,fontSize:"14px",lineHeight:1.8,color:"#cccccc"},children:"Subscribe for exclusive deals, market insights, and new arrivals"}),s?o.jsx(l(),{sx:{color:"#4CAF50",fontWeight:600,fontSize:"14px"},children:"✅ Thanks for subscribing!"}):(0,o.jsxs)(a.default,{spacing:2,children:[o.jsx(f(),{fullWidth:!0,placeholder:"Enter your email address",value:r,onChange:e=>t(e.target.value),variant:"outlined",size:"small",sx:{"& .MuiOutlinedInput-root":{backgroundColor:"#121212",color:"#cccccc",fontSize:"14px","& fieldset":{borderColor:"#404040"},"&:hover fieldset":{borderColor:"#ffcc00"},"&.Mui-focused fieldset":{borderColor:"#ffcc00"}},"& .MuiInputBase-input::placeholder":{color:"#888888"}}}),o.jsx(b(),{variant:"contained",onClick:d,sx:{backgroundColor:"#ffcc00",color:"#121212",fontWeight:600,fontSize:"14px","&:hover":{backgroundColor:"#e6b800",transform:"translateY(-1px)"},transition:"all 0.2s ease"},children:"Subscribe Now"})]})]}),(0,o.jsxs)(a.default,{spacing:2,children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,color:"#ffffff",fontSize:"16px"},children:"Contact & Support"}),(0,o.jsxs)(a.default,{spacing:1.5,children:[(0,o.jsxs)(a.default,{direction:"row",alignItems:"center",spacing:1,children:[o.jsx(P(),{sx:{color:"#ffcc00",fontSize:16}}),o.jsx(l(),{sx:{fontSize:"14px",lineHeight:1.8},children:"+82 10 4867 2909"})]}),(0,o.jsxs)(a.default,{direction:"row",alignItems:"center",spacing:1,children:[o.jsx(M(),{sx:{color:"#ffcc00",fontSize:16}}),o.jsx(l(),{sx:{fontSize:"14px",lineHeight:1.8},children:"support@autosalon.com"})]}),(0,o.jsxs)(a.default,{direction:"row",alignItems:"center",spacing:1,children:[o.jsx(Z(),{sx:{color:"#ffcc00",fontSize:16}}),o.jsx(l(),{sx:{fontSize:"14px",lineHeight:1.8},children:"Seoul, South Korea • 24/7 Support"})]})]})]}),(0,o.jsxs)(a.default,{spacing:2,children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,color:"#ffffff",fontSize:"16px"},children:"Shop by Category"}),o.jsx(u(),{container:!0,spacing:1,children:x.slice(0,4).map((e,r)=>o.jsx(u(),{item:!0,xs:6,children:o.jsx(p(),{href:e.href,sx:{color:"#cccccc",textDecoration:"none",fontSize:"14px",lineHeight:1.8,"&:hover":{color:"#ffcc00"}},children:e.label})},r))})]}),(0,o.jsxs)(a.default,{spacing:2,children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,color:"#ffffff",fontSize:"16px"},children:"Our Services"}),o.jsx(u(),{container:!0,spacing:1,children:g.slice(0,6).map((e,r)=>o.jsx(u(),{item:!0,xs:6,children:o.jsx(p(),{href:e.href,sx:{color:"#cccccc",textDecoration:"none",fontSize:"14px",lineHeight:1.8,"&:hover":{color:"#ffcc00"}},children:e.label})},r))})]}),(0,o.jsxs)(a.default,{spacing:2,children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,color:"#ffffff",fontSize:"16px"},children:"Quick Actions"}),o.jsx(u(),{container:!0,spacing:1,children:h.slice(0,4).map((e,r)=>o.jsx(u(),{item:!0,xs:6,children:o.jsx(p(),{href:e.href,sx:{color:"#cccccc",textDecoration:"none",fontSize:"14px",lineHeight:1.8,"&:hover":{color:"#ffcc00"}},children:e.label})},r))})]}),(0,o.jsxs)(a.default,{spacing:2,children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,color:"#ffffff",fontSize:"16px"},children:"Follow Us"}),(0,o.jsxs)(a.default,{direction:"row",spacing:3,justifyContent:"center",flexWrap:"wrap",children:[o.jsx(y(),{sx:{color:"#E4405F",backgroundColor:"rgba(228, 64, 95, 0.1)",border:"2px solid rgba(228, 64, 95, 0.3)",width:56,height:56,"&:hover":{color:"#E4405F",backgroundColor:"rgba(228, 64, 95, 0.2)",transform:"scale(1.1)",borderColor:"#E4405F"},transition:"all 0.3s ease"},children:o.jsx(I(),{sx:{fontSize:28}})}),o.jsx(y(),{sx:{color:"#ff0050",backgroundColor:"rgba(255, 0, 80, 0.1)",border:"2px solid rgba(255, 0, 80, 0.3)",width:56,height:56,"&:hover":{color:"#ff0050",backgroundColor:"rgba(255, 0, 80, 0.2)",transform:"scale(1.1)",borderColor:"#ff0050"},transition:"all 0.3s ease"},children:o.jsx(E(),{sx:{fontSize:28}})}),o.jsx(y(),{sx:{color:"#FF0000",backgroundColor:"rgba(255, 0, 0, 0.1)",border:"2px solid rgba(255, 0, 0, 0.3)",width:56,height:56,"&:hover":{color:"#FF0000",backgroundColor:"rgba(255, 0, 0, 0.2)",transform:"scale(1.1)",borderColor:"#FF0000"},transition:"all 0.3s ease"},children:o.jsx(z(),{sx:{fontSize:28}})}),o.jsx(y(),{sx:{color:"#0A66C2",backgroundColor:"rgba(10, 102, 194, 0.1)",border:"2px solid rgba(10, 102, 194, 0.3)",width:56,height:56,"&:hover":{color:"#0A66C2",backgroundColor:"rgba(10, 102, 194, 0.2)",transform:"scale(1.15)",borderColor:"#0A66C2"},transition:"all 0.3s ease"},children:o.jsx(N(),{sx:{fontSize:28}})})]}),o.jsx(l(),{sx:{fontSize:"13px",textAlign:"center",color:"#888888",mt:2},children:"Join 50K+ car enthusiasts"})]}),o.jsx(w(),{sx:{borderColor:"#404040"}}),(0,o.jsxs)(a.default,{spacing:2,alignItems:"center",children:[(0,o.jsxs)(l(),{sx:{fontSize:"14px",color:"#888888",textAlign:"center"},children:["\xa9 ",A()().year()," Auto Salon Korea. All rights reserved."]}),o.jsx(a.default,{direction:"row",spacing:2,children:j.slice(0,2).map((e,r)=>o.jsx(p(),{href:e.href,sx:{color:"#888888",textDecoration:"none",fontSize:"12px","&:hover":{color:"#ffcc00"}},children:e.label},r))})]})]})})}):o.jsx(n.Z,{component:"div",sx:{backgroundColor:"#121212",color:"#cccccc",fontFamily:"Inter, -apple-system, BlinkMacSystemFont, sans-serif",pt:6,pb:4,mt:8,width:"100vw",position:"relative",left:"50%",right:"50%",marginLeft:"-50vw",marginRight:"-50vw"},children:(0,o.jsxs)(n.Z,{component:"div",sx:{maxWidth:"1600px",margin:"0 auto",px:{xs:3,sm:4,md:6,lg:8}},children:[(0,o.jsxs)(n.Z,{component:"div",sx:{display:"grid",gridTemplateColumns:{xs:"1fr",sm:"repeat(2, 1fr)",md:"repeat(3, 1fr)",lg:"2fr 1fr 1fr 1fr 1.5fr"},gap:{xs:4,sm:6,md:8,lg:12},mb:4,width:"100%"},children:[(0,o.jsxs)(n.Z,{component:"div",sx:{gridColumn:{xs:"1",sm:"span 2",md:"span 3",lg:"1"}},children:[o.jsx("img",{src:"/img/logo/logo.png",alt:"Auto Salon Logo",style:{height:"60px",marginBottom:"20px"}}),o.jsx(l(),{variant:"h6",sx:{fontWeight:700,fontSize:"18px",mb:2,color:"#ffffff"},children:"Auto Salon"}),o.jsx(l(),{sx:{fontSize:"14px",lineHeight:1.8,color:"#cccccc",mb:3},children:"Korea's premier luxury automotive marketplace. Find, buy, and sell premium vehicles with confidence. We connect buyers and sellers across Seoul, Busan, and nationwide with over 10,000+ verified luxury cars."}),(0,o.jsxs)(a.default,{spacing:1.5,children:[(0,o.jsxs)(a.default,{direction:"row",alignItems:"center",spacing:1,children:[o.jsx(P(),{sx:{color:"#ffcc00",fontSize:16}}),o.jsx(l(),{sx:{fontSize:"14px",lineHeight:1.8},children:"+82 10 4867 2909"})]}),(0,o.jsxs)(a.default,{direction:"row",alignItems:"center",spacing:1,children:[o.jsx(M(),{sx:{color:"#ffcc00",fontSize:16}}),o.jsx(l(),{sx:{fontSize:"14px",lineHeight:1.8},children:"support@autosalon.com"})]}),(0,o.jsxs)(a.default,{direction:"row",alignItems:"center",spacing:1,children:[o.jsx(Z(),{sx:{color:"#ffcc00",fontSize:16}}),o.jsx(l(),{sx:{fontSize:"14px",lineHeight:1.8},children:"Seoul, South Korea"})]})]})]}),(0,o.jsxs)(n.Z,{component:"div",sx:{gridColumn:{xs:"1",sm:"1",md:"1",lg:"2"}},children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,fontSize:"16px",mb:3,color:"#ffffff"},children:"Shop by Category"}),o.jsx(a.default,{spacing:1,children:x.map((e,r)=>o.jsx(p(),{href:e.href,sx:{color:"#cccccc",textDecoration:"none",fontSize:"14px",lineHeight:1.8,"&:hover":{color:"#ffcc00",transition:"color 0.2s ease"}},children:e.label},r))})]}),(0,o.jsxs)(n.Z,{component:"div",sx:{gridColumn:{xs:"1",sm:"2",md:"2",lg:"3"}},children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,fontSize:"16px",mb:3,color:"#ffffff"},children:"Our Services"}),o.jsx(a.default,{spacing:1,children:g.map((e,r)=>o.jsx(p(),{href:e.href,sx:{color:"#cccccc",textDecoration:"none",fontSize:"14px",lineHeight:1.8,"&:hover":{color:"#ffcc00",transition:"color 0.2s ease"}},children:e.label},r))})]}),(0,o.jsxs)(n.Z,{component:"div",sx:{gridColumn:{xs:"1",sm:"1",md:"3",lg:"4"}},children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,fontSize:"16px",mb:3,color:"#ffffff"},children:"Quick Actions"}),o.jsx(a.default,{spacing:1,children:h.map((e,r)=>o.jsx(p(),{href:e.href,sx:{color:"#cccccc",textDecoration:"none",fontSize:"14px",lineHeight:1.8,"&:hover":{color:"#ffcc00",transition:"color 0.2s ease"}},children:e.label},r))}),o.jsx(l(),{variant:"h6",sx:{fontWeight:700,fontSize:"14px",mt:3,mb:2,color:"#ffffff"},children:"Support"}),o.jsx(a.default,{spacing:1,children:[{label:"Customer Support",href:"/cs"},{label:"Live Chat (24/7)",href:"/cs?tab=chat"},{label:"FAQs",href:"/cs?tab=faq"},{label:"Financing Help",href:"/cs?tab=financing"},{label:"Vehicle History",href:"/services/history"}].map((e,r)=>o.jsx(p(),{href:e.href,sx:{color:"#cccccc",textDecoration:"none",fontSize:"14px",lineHeight:1.8,"&:hover":{color:"#ffcc00",transition:"color 0.2s ease"}},children:e.label},r))})]}),(0,o.jsxs)(n.Z,{component:"div",sx:{gridColumn:{xs:"1",sm:"2",md:"span 3",lg:"5"}},children:[o.jsx(l(),{variant:"h6",sx:{fontWeight:700,fontSize:"16px",mb:3,color:"#ffffff"},children:"Stay Connected"}),(0,o.jsxs)(n.Z,{component:"div",sx:{mb:4},children:[o.jsx(l(),{sx:{fontSize:"14px",lineHeight:1.8,mb:2},children:"Subscribe for exclusive deals and market insights"}),s?o.jsx(l(),{sx:{color:"#4CAF50",fontWeight:600,fontSize:"14px"},children:"✅ Successfully subscribed!"}):(0,o.jsxs)(a.default,{spacing:2,children:[o.jsx(f(),{placeholder:"Enter your email",value:r,onChange:e=>t(e.target.value),size:"small",sx:{"& .MuiOutlinedInput-root":{backgroundColor:"#2a2a2a",color:"#cccccc",fontSize:"14px","& fieldset":{borderColor:"#404040"},"&:hover fieldset":{borderColor:"#ffcc00"},"&.Mui-focused fieldset":{borderColor:"#ffcc00"}},"& .MuiInputBase-input::placeholder":{color:"#888888"}}}),o.jsx(b(),{variant:"contained",onClick:d,sx:{backgroundColor:"#ffcc00",color:"#121212",fontWeight:600,fontSize:"14px","&:hover":{backgroundColor:"#e6b800",transform:"translateY(-1px)"},transition:"all 0.2s ease"},children:"Subscribe"})]})]}),(0,o.jsxs)(n.Z,{component:"div",children:[o.jsx(l(),{sx:{fontSize:"16px",fontWeight:600,lineHeight:1.8,mb:3,color:"#ffffff"},children:"Follow Our Journey"}),(0,o.jsxs)(a.default,{spacing:2,children:[(0,o.jsxs)(a.default,{direction:"row",spacing:2,justifyContent:"center",children:[o.jsx(y(),{sx:{color:"#E4405F",backgroundColor:"rgba(228, 64, 95, 0.1)",border:"2px solid rgba(228, 64, 95, 0.3)",width:48,height:48,"&:hover":{color:"#E4405F",backgroundColor:"rgba(228, 64, 95, 0.2)",transform:"scale(1.15)",borderColor:"#E4405F"},transition:"all 0.3s ease"},children:o.jsx(I(),{sx:{fontSize:24}})}),o.jsx(y(),{sx:{color:"#ff0050",backgroundColor:"rgba(255, 0, 80, 0.1)",border:"2px solid rgba(255, 0, 80, 0.3)",width:48,height:48,"&:hover":{color:"#ff0050",backgroundColor:"rgba(255, 0, 80, 0.2)",transform:"scale(1.15)",borderColor:"#ff0050"},transition:"all 0.3s ease"},children:o.jsx(E(),{sx:{fontSize:24}})})]}),(0,o.jsxs)(a.default,{direction:"row",spacing:2,justifyContent:"center",children:[o.jsx(y(),{sx:{color:"#FF0000",backgroundColor:"rgba(255, 0, 0, 0.1)",border:"2px solid rgba(255, 0, 0, 0.3)",width:48,height:48,"&:hover":{color:"#FF0000",backgroundColor:"rgba(255, 0, 0, 0.2)",transform:"scale(1.15)",borderColor:"#FF0000"},transition:"all 0.3s ease"},children:o.jsx(z(),{sx:{fontSize:24}})}),o.jsx(y(),{sx:{color:"#0A66C2",backgroundColor:"rgba(10, 102, 194, 0.1)",border:"2px solid rgba(10, 102, 194, 0.3)",width:48,height:48,"&:hover":{color:"#0A66C2",backgroundColor:"rgba(10, 102, 194, 0.2)",transform:"scale(1.15)",borderColor:"#0A66C2"},transition:"all 0.3s ease"},children:o.jsx(N(),{sx:{fontSize:24}})})]}),o.jsx(l(),{sx:{fontSize:"13px",textAlign:"center",color:"#888888",mt:2},children:"Join 50K+ car enthusiasts"})]})]})]})]}),o.jsx(w(),{sx:{borderColor:"#404040",my:3}}),(0,o.jsxs)(a.default,{direction:{xs:"column",md:"row"},alignItems:"center",justifyContent:"space-between",spacing:2,sx:{width:"100%"},children:[(0,o.jsxs)(a.default,{direction:{xs:"column",md:"row"},alignItems:"center",spacing:3,children:[(0,o.jsxs)(l(),{sx:{fontSize:"14px",color:"#888888"},children:["\xa9 ",A()().year()," Auto Salon Korea. All rights reserved."]}),o.jsx(a.default,{direction:"row",spacing:2,children:j.map((e,r)=>o.jsx(p(),{href:e.href,sx:{color:"#888888",textDecoration:"none",fontSize:"12px","&:hover":{color:"#ffcc00"}},children:e.label},r))})]}),(0,o.jsxs)(a.default,{direction:"row",spacing:1,alignItems:"center",children:[o.jsx(m(),{icon:o.jsx(q(),{sx:{fontSize:"16px"}}),label:"Verified Dealer",size:"small",sx:{backgroundColor:"#2a2a2a",color:"#ffcc00",fontSize:"12px"}}),o.jsx(m(),{icon:o.jsx($(),{sx:{fontSize:"16px"}}),label:"5-Star Service",size:"small",sx:{backgroundColor:"#ffcc00",color:"#121212",fontSize:"12px"}})]})]})]})})}},85777:(e,r,t)=>{t.d(r,{Z:()=>ey});var o=t(20997),i=t(16689),n=t.n(i),a=t(11163),s=t(11377),l=t(61067),c=t(34638),m=t(26337),d=t(29271),f=t.n(d),x=t(53819),b=t.n(x),g=t(18442),u=t(48125),h=t.n(u),p=t(514),j=t.n(p),y=t(29628),C=t(24917),w=t(41664),S=t.n(w),v=t(29114),A=t(69641),k=t(26076),I=t(38350),F=t(39573),z=t.n(F),T=t(80601),N=t.n(T),R=t(14245),E=t.n(R),D=t(62938),P=t(30777),L=t(96763),M=t.n(L),W=t(3828),Z=t.n(W),B=t(23890),q=t.n(B),_=t(86059),$=t.n(_),V=t(87717),H=t.n(V),G=t(49366),O=t.n(G),K=t(40802),Y=t.n(K),Q=t(46485),U=t.n(Q),J=t(81795),X=t.n(J),ee=t(94508),er=t.n(ee),et=t(34224),eo=t.n(et),ei=t(69217),en=t(87680),ea=t(97181),es=t(91964),el=t(38162),ec=t(55114),em=t(14905),ed=t(23550),ef=t(6049),ex=t(5222),eb=t(38807),eg=t(30661),eu=t.n(eg);let eh=({anchorEl:e,open:r,onClose:t})=>{let[a,s]=(0,i.useState)([]),[l,d]=(0,i.useState)({total:0,unread:0}),[f,x]=(0,i.useState)(!1),[b,g]=(0,i.useState)(1),[u,h]=(0,i.useState)(!0),{data:p,loading:j,refetch:y}=(0,v.useQuery)(ed.VZ,{variables:{input:{page:1,limit:10,search:{}}},skip:!r,onCompleted:e=>{e?.getNotifications&&(s(e.getNotifications.list||[]),h(e.getNotifications.list?.length===10))}}),{data:C,refetch:w}=(0,v.useQuery)(ed.BG,{pollInterval:3e4,onCompleted:e=>{e?.getNotificationCount&&d(e.getNotificationCount)}}),[S]=(0,v.useMutation)(ef.GF),[A]=(0,v.useMutation)(ef.lv),[k]=(0,v.useMutation)(ef.g$),F=async()=>{if(!f&&u){x(!0);try{let e=await y({input:{page:b+1,limit:10,search:{}}});if(e.data?.getNotifications){let r=e.data.getNotifications.list||[];s(e=>[...e,...r]),g(e=>e+1),h(10===r.length)}}catch(e){console.error("Error loading more notifications:",e)}finally{x(!1)}}},T=async e=>{try{await S({variables:{input:e}}),s(r=>r.map(r=>r._id===e?{...r,notificationStatus:ex.Ez.READ}:r)),d(e=>({...e,unread:Math.max(0,e.unread-1)})),await (0,eb.Tb)("Marked as read",1e3)}catch(e){(0,eb.cj)(e.message)}},R=async()=>{try{await A(),s(e=>e.map(e=>({...e,notificationStatus:ex.Ez.READ}))),d(e=>({...e,unread:0})),await (0,eb.Tb)("All notifications marked as read",1e3)}catch(e){(0,eb.cj)(e.message)}},E=async e=>{try{await k({variables:{input:e}}),s(r=>r.filter(r=>r._id!==e)),d(e=>({...e,total:Math.max(0,e.total-1)})),await (0,eb.Tb)("Notification deleted",1e3)}catch(e){(0,eb.cj)(e.message)}},D=(e,r)=>{switch(e){case ex.k$.LIKE:return o.jsx(ei.Z,{color:"error",fontSize:"small"});case ex.k$.COMMENT:return o.jsx(en.Z,{color:"primary",fontSize:"small"});default:switch(r){case ex.Ne.MEMBER:return o.jsx(ea.Z,{color:"info",fontSize:"small"});case ex.Ne.CAR:return o.jsx(es.Z,{color:"warning",fontSize:"small"});case ex.Ne.ARTICLE:return o.jsx(el.Z,{color:"success",fontSize:"small"});default:return o.jsx(P.Z,{fontSize:"small"})}}};return(0,o.jsxs)(M(),{anchorEl:e,open:r,onClose:t,PaperProps:{sx:{width:400,maxHeight:600,mt:1,borderRadius:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)"}},transformOrigin:{horizontal:"right",vertical:"top"},anchorOrigin:{horizontal:"right",vertical:"bottom"},children:[(0,o.jsxs)(m.Z,{sx:{p:2,borderBottom:"1px solid #e0e0e0"},children:[(0,o.jsxs)(c.default,{direction:"row",justifyContent:"space-between",alignItems:"center",children:[o.jsx(Z(),{variant:"h6",fontWeight:600,children:"Notifications"}),o.jsx(c.default,{direction:"row",spacing:1,children:l.unread>0&&o.jsx(q(),{size:"small",startIcon:o.jsx(ec.Z,{}),onClick:R,sx:{textTransform:"none"},children:"Mark all read"})})]}),l.total>0&&(0,o.jsxs)(Z(),{variant:"caption",color:"text.secondary",children:[l.unread," unread of ",l.total," total"]})]}),o.jsx(m.Z,{sx:{maxHeight:400,overflow:"auto"},children:j?o.jsx(m.Z,{sx:{display:"flex",justifyContent:"center",p:3},children:o.jsx($(),{size:24})}):0===a.length?(0,o.jsxs)(m.Z,{sx:{p:3,textAlign:"center"},children:[o.jsx(P.Z,{sx:{fontSize:48,color:"text.secondary",mb:1}}),o.jsx(Z(),{variant:"body2",color:"text.secondary",children:"No notifications yet"})]}):o.jsx(H(),{sx:{p:0},children:a.map((e,r)=>(0,o.jsxs)(n().Fragment,{children:[(0,o.jsxs)(O(),{sx:{py:1.5,px:2,"&:hover":{bgcolor:"action.hover"},bgcolor:e.notificationStatus===ex.Ez.WAIT?"action.selected":"transparent"},children:[o.jsx(Y(),{children:o.jsx(U(),{src:e.memberData?.memberImage?`${I.Wx}/${e.memberData.memberImage}`:void 0,sx:{width:40,height:40},children:D(e.notificationType,e.notificationGroup)})}),o.jsx(X(),{primary:(0,o.jsxs)(c.default,{direction:"row",alignItems:"center",spacing:1,children:[o.jsx(Z(),{variant:"body2",fontWeight:e.notificationStatus===ex.Ez.WAIT?600:400,sx:{flex:1},children:e.notificationTitle}),e.notificationStatus===ex.Ez.WAIT&&o.jsx(er(),{label:"New",size:"small",color:"primary",sx:{height:16,fontSize:"0.7rem"}})]}),secondary:(0,o.jsxs)(c.default,{spacing:.5,children:[o.jsx(Z(),{variant:"caption",color:"text.secondary",children:e.notificationContent}),o.jsx(Z(),{variant:"caption",color:"text.secondary",children:o.jsx(eu(),{fromNow:!0,children:e.createdAt})})]})}),(0,o.jsxs)(c.default,{direction:"row",spacing:.5,children:[e.notificationStatus===ex.Ez.WAIT&&o.jsx(z(),{title:"Mark as read",children:o.jsx(N(),{size:"small",onClick:()=>T(e._id),children:o.jsx(ec.Z,{fontSize:"small"})})}),o.jsx(z(),{title:"Delete",children:o.jsx(N(),{size:"small",onClick:()=>E(e._id),children:o.jsx(em.Z,{fontSize:"small"})})})]})]}),r<a.length-1&&o.jsx(eo(),{})]},e._id))})}),u&&a.length>0&&o.jsx(m.Z,{sx:{p:2,borderTop:"1px solid",borderColor:"divider"},children:o.jsx(q(),{fullWidth:!0,variant:"outlined",onClick:F,disabled:f,startIcon:f?o.jsx($(),{size:16}):null,children:f?"Loading...":"Load More"})})]})},ep=()=>{let e=(0,v.useReactiveVar)(A.E_),[r,t]=(0,i.useState)({total:0,unread:0}),[o,n]=(0,i.useState)(new Date),{data:a,refetch:s}=(0,v.useQuery)(ed.BG,{pollInterval:3e4,skip:!e?._id,onCompleted:e=>{e?.getNotificationCount&&(t(e.getNotificationCount),n(new Date))},onError:e=>{console.error("Error fetching notification count:",e)}}),l=(0,i.useCallback)(async()=>{try{await s()}catch(e){console.error("Error refreshing notifications:",e)}},[s]);return(0,i.useEffect)(()=>{a?.getNotificationCount&&t(a.getNotificationCount)},[a]),(0,i.useEffect)(()=>{e?._id||t({total:0,unread:0})},[e?._id]),{notificationCount:r,lastUpdate:o,refreshNotifications:l,isLoading:!a&&e?._id}},ej=({className:e})=>{let[r,t]=(0,i.useState)(null),{notificationCount:n}=ep();return(0,o.jsxs)(o.Fragment,{children:[o.jsx(z(),{title:"Notifications",children:o.jsx(N(),{className:e,onClick:e=>{t(e.currentTarget)},sx:{color:"inherit","&:hover":{backgroundColor:"rgba(255, 255, 255, 0.1)"}},children:o.jsx(E(),{badgeContent:n.unread,color:"error",max:99,sx:{"& .MuiBadge-badge":{fontSize:"0.7rem",height:18,minWidth:18,top:2,right:2}},children:n.unread>0?o.jsx(D.Z,{}):o.jsx(P.Z,{})})})}),o.jsx(eh,{anchorEl:r,open:!!r,onClose:()=>{t(null)}})]})},ey=(0,a.withRouter)(()=>{let e=(0,C.Z)(),r=(0,v.useReactiveVar)(A.E_),{t,i18n:n}=(0,s.useTranslation)("common"),d=(0,a.useRouter)(),[x,u]=(0,i.useState)(null),[p,w]=(0,i.useState)("en"),[F,z]=(0,i.useState)(!1),[T,N]=(0,i.useState)(null),[R,E]=(0,i.useState)(!1),[D,P]=(0,i.useState)(null);(0,i.useEffect)(()=>{null===localStorage.getItem("locale")?(localStorage.setItem("locale","en"),w("en")):w(localStorage.getItem("locale"))},[d]),(0,i.useEffect)(()=>{"/car/detail"===d.pathname?E(!0):E(!1)},[d]),(0,i.useEffect)(()=>{let e=(0,l.rS)();e&&(0,l.gS)(e)},[]),(0,i.useEffect)(()=>{let e=()=>{window.scrollY>=50?z(!0):z(!1)};return window.addEventListener("scroll",e),()=>{window.removeEventListener("scroll",e)}},[]);let L=(0,i.useCallback)(async e=>{w(e.target.id),localStorage.setItem("locale",e.target.id),u(null),await d.push(d.asPath,d.asPath,{locale:e.target.id})},[d]),M=(0,g.styled)(e=>o.jsx(h(),{elevation:0,anchorOrigin:{vertical:"bottom",horizontal:"right"},transformOrigin:{vertical:"top",horizontal:"right"},...e}))(({theme:e})=>({"& .MuiPaper-root":{top:"109px",borderRadius:6,marginTop:e.spacing(1),minWidth:160,color:"light"===e.palette.mode?"rgb(55, 65, 81)":e.palette.grey[300],boxShadow:"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px","& .MuiMenu-list":{padding:"4px 0"},"& .MuiMenuItem-root":{"& .MuiSvgIcon-root":{fontSize:18,color:e.palette.text.secondary,marginRight:e.spacing(1.5)},"&:active":{backgroundColor:(0,g.alpha)(e.palette.primary.main,e.palette.action.selectedOpacity)}}}}));if("mobile"===e)return(0,o.jsxs)(c.default,{className:"top",children:[o.jsx(S(),{href:"/",children:o.jsx("div",{children:t("Home")})}),o.jsx(S(),{href:"/car",children:o.jsx("div",{children:t("Cars")})}),o.jsx(S(),{href:"/agent",children:(0,o.jsxs)("div",{children:[" ",t("Agents")," "]})}),o.jsx(S(),{href:"/community?articleCategory=FREE",children:(0,o.jsxs)("div",{children:[" ",t("Community")," "]})}),o.jsx(S(),{href:"/cs",children:(0,o.jsxs)("div",{children:[" ",t("CS")," "]})})]});{let e=["navbar-main"];return F&&e.push("transparent"),R&&e.push("transparent"),o.jsx(c.default,{className:"navbar",children:o.jsx(c.default,{className:e.join(" "),children:(0,o.jsxs)(c.default,{className:"container",children:[o.jsx(m.Z,{component:"div",className:"logo-box",children:o.jsx(S(),{href:"/",children:o.jsx("img",{src:"/img/logo/logo.png",alt:"",style:{height:"50px"}})})}),(0,o.jsxs)(m.Z,{component:"div",className:"router-box",children:[o.jsx(S(),{href:"/",children:o.jsx("div",{children:t("Home")})}),o.jsx(S(),{href:"/car",children:o.jsx("div",{children:t("Cars")})}),o.jsx(S(),{href:"/agent",children:(0,o.jsxs)("div",{children:[" ",t("Agents")," "]})}),o.jsx(S(),{href:"/community?articleCategory=FREE",children:(0,o.jsxs)("div",{children:[" ",t("Community")," "]})}),r?._id&&o.jsx(S(),{href:"/mypage",children:(0,o.jsxs)("div",{children:[" ",t("My Page")," "]})}),o.jsx(S(),{href:"/cs",children:(0,o.jsxs)("div",{children:[" ",t("CS")," "]})})]}),(0,o.jsxs)(m.Z,{component:"div",className:"user-box",children:[r?._id?(0,o.jsxs)(o.Fragment,{children:[o.jsx("div",{className:"login-user",onClick:e=>P(e.currentTarget),children:o.jsx("img",{src:r?.memberImage?`${I.Wx}/${r?.memberImage}`:"/img/profile/defaultUser.svg",alt:""})}),o.jsx(h(),{id:"basic-menu",anchorEl:D,open:!!D,onClose:()=>P(null),sx:{mt:"5px"},children:(0,o.jsxs)(f(),{onClick:()=>(0,l.ni)(),children:[o.jsx(k.Z,{fontSize:"small",style:{color:"blue",marginRight:"10px"}}),"Logout"]})})]}):o.jsx(S(),{href:"/account/join",children:(0,o.jsxs)("div",{className:"join-box",children:[o.jsx(j(),{}),(0,o.jsxs)("span",{children:[t("Login")," / ",t("Register")]})]})}),(0,o.jsxs)("div",{className:"lan-box",children:[r?._id&&o.jsx(ej,{className:"notification-icon"}),o.jsx(b(),{disableRipple:!0,className:"btn-lang",onClick:e=>{u(e.currentTarget)},endIcon:o.jsx(y.CaretDown,{size:14,color:"#616161",weight:"fill"}),children:o.jsx(m.Z,{component:"div",className:"flag",children:o.jsx("img",{src:`/img/flag/lang${p||"en"}.png`,alt:"language"})})}),(0,o.jsxs)(M,{anchorEl:x,open:!!x,onClose:()=>{u(null)},children:[(0,o.jsxs)(f(),{disableRipple:!0,onClick:L,id:"en",children:[o.jsx("img",{className:"img-flag",src:"/img/flag/langen.png",id:"en",alt:"English"}),t("English")]}),(0,o.jsxs)(f(),{disableRipple:!0,onClick:L,id:"kr",children:[o.jsx("img",{className:"img-flag",src:"/img/flag/langkr.png",id:"kr",alt:"Korean"}),t("Korean")]}),(0,o.jsxs)(f(),{disableRipple:!0,onClick:L,id:"ru",children:[o.jsx("img",{className:"img-flag",src:"/img/flag/langru.png",id:"ru",alt:"Russian"}),t("Russian")]})]})]})]})]})})})}})},5222:(e,r,t)=>{var o,i,n;t.d(r,{Ez:()=>i,Ne:()=>n,k$:()=>o}),function(e){e.LIKE="LIKE",e.COMMENT="COMMENT"}(o||(o={})),function(e){e.WAIT="WAIT",e.READ="READ"}(i||(i={})),function(e){e.MEMBER="MEMBER",e.ARTICLE="ARTICLE",e.CAR="CAR"}(n||(n={}))},24917:(e,r,t)=>{t.d(r,{Z:()=>i});var o=t(16689);let i=()=>{let[e,r]=(0,o.useState)("desktop");return(0,o.useEffect)(()=>{let e=navigator.userAgent;r(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(e)?"mobile":"desktop")},[]),e}},7645:(e,r,t)=>{t.r(r),t.d(r,{default:()=>n});var o=t(20997),i=t(56859);function n(){return(0,o.jsxs)(i.Html,{lang:"en",children:[(0,o.jsxs)(i.Head,{children:[o.jsx("meta",{name:"robots",content:"index,follow"}),o.jsx("link",{rel:"icon",type:"image/png",href:"/img/logo/logo.png"}),o.jsx("meta",{name:"keyword",content:"nestar, nestar.uz, devex mern, mern nestjs fullstack"}),o.jsx("meta",{name:"description",content:"Buy and sell properties anywhere anytime in South Korea. Best Properties at Best prices on nestar.uz | Покупайте и продавайте недвижимость в любой точке Южной Кореи в любое время. Лучшая недвижимость по лучшим ценам на nestar.uz | 대한민국 언제 어디서나 부동산을 사고팔 수 있습니다. Nestar.uz에서 최적의 가격으로 최고의 부동산을 만나보세요"})]}),(0,o.jsxs)("body",{children:[o.jsx(i.Main,{}),o.jsx(i.NextScript,{})]})]})}}};