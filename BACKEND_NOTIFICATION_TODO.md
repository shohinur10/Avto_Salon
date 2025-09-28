# Backend Notification System - TODO List

## 🚨 URGENT: Backend Notification Queries Missing

**CRITICAL ISSUE**: The backend is missing the `getNotifications` query entirely. The frontend is getting 400 errors because the query doesn't exist.

**Error**: `Cannot query field "getNotifications" on type "Query"`

## 📋 Backend Tasks Needed

### 1. Implement getNotifications Query (URGENT)
**Priority: HIGH**

Add the following GraphQL query to the backend:

```graphql
type Query {
  getNotifications(input: NotificationInquiry!): NotificationResponse
}

input NotificationInquiry {
  page: Int!
  limit: Int!
  search: NotificationSearch
}

input NotificationSearch {
  notificationStatus: NotificationStatus
  notificationType: NotificationType
  notificationGroup: NotificationGroup
}

type NotificationResponse {
  list: [Notification!]!
  metaCounter: NotificationMetaCounter!
}

type NotificationMetaCounter {
  total: Int!
  unread: Int!
}

type Notification {
  _id: ID!
  notificationType: NotificationType!
  notificationStatus: NotificationStatus!
  notificationGroup: NotificationGroup!
  notificationTitle: String!
  notificationContent: String!
  notificationRefId: String!
  memberId: String!
  createdAt: String!
  updatedAt: String!
  memberData: MemberData
}

type MemberData {
  _id: ID!
  memberNick: String!
  memberFullName: String!
  memberImage: String
}

enum NotificationStatus {
  READ
  UNREAD
}

enum NotificationType {
  LIKE
  COMMENT
  FOLLOW
  SYSTEM
}

enum NotificationGroup {
  CAR
  ARTICLE
  MEMBER
  SYSTEM
}
```

**Implementation needed:**
- Create resolver for `getNotifications`
- Implement authentication check (user must be logged in)
- Return notifications for the current authenticated user
- Implement pagination and filtering
- Return proper meta counter with total and unread counts

### 2. Implement getNotificationCount Query
**Priority: Medium**

Add the following GraphQL query to the backend:

```graphql
type Query {
  getNotificationCount: NotificationCount
}

type NotificationCount {
  total: Int!
  unread: Int!
}
```

**Implementation needed:**
- Create resolver for `getNotificationCount`
- Return total count and unread count for the current user
- Optimize with database aggregation queries

### 2. Notification System Backend Requirements

**Current Status:** Frontend works with existing `getNotifications` query
**Backend Queries Working:**
- ✅ `getNotifications` - Returns notification list
- ✅ `markNotificationAsRead` - Mark single notification as read
- ✅ `markAllNotificationsAsRead` - Mark all notifications as read
- ✅ `deleteNotification` - Delete notification

**Backend Queries Missing:**
- ❌ `getNotificationCount` - Returns total and unread counts

### 3. Performance Optimization

**Current Workaround:** Frontend calculates counts from notification list
**Recommended:** Implement dedicated count query for better performance

**Benefits of implementing getNotificationCount:**
- Faster loading (no need to fetch all notifications for count)
- Better performance for notification badges
- Reduced data transfer
- More efficient polling

### 4. Database Schema Requirements

Ensure the notification collection/table has:
- `notificationStatus` field (READ/UNREAD)
- `memberId` field for user association
- Proper indexing on `memberId` and `notificationStatus`

### 5. Testing

**Frontend Testing:**
- ✅ Notification icon displays correctly
- ✅ Notification dropdown works
- ✅ Count calculation from list works
- ✅ No more GraphQL errors

**Backend Testing Needed:**
- Test `getNotificationCount` query
- Test performance with large notification datasets
- Test real-time updates

## 🔧 Implementation Priority

1. **High Priority:** Implement `getNotificationCount` query
2. **Medium Priority:** Add database indexes for performance
3. **Low Priority:** Add real-time notification updates

## 📝 Notes

- Frontend is now working without errors
- Notification system is functional using existing queries
- Performance can be improved once backend count query is implemented
- No breaking changes needed in frontend when backend is ready
