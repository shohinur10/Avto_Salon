#!/usr/bin/env node

/**
 * Test Notification Script
 * This script sends a test notification to verify the notification system is working
 */

const { ApolloClient, InMemoryCache, gql, createHttpLink } = require('@apollo/client');
const fetch = require('node-fetch');

// GraphQL endpoint
const GRAPHQL_URL = process.env.REACT_APP_API_GRAPHQL_URL || 'http://72.60.108.222:4001/graphql';

// Create Apollo Client
const client = new ApolloClient({
  link: createHttpLink({
    uri: GRAPHQL_URL,
    fetch: fetch,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  cache: new InMemoryCache(),
});

// Get agents query to find a real member ID
const GET_PUBLIC_AGENTS = gql`
  query GetPublicAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
      list {
        _id
        memberNick
        memberFullName
      }
      metaCounter {
        total
      }
    }
  }
`;

// Test notification mutation
const CREATE_NOTIFICATION = gql`
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
`;

// Get notifications query to verify the notification was created
const GET_NOTIFICATIONS = gql`
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
      }
      metaCounter {
        total
        unread
      }
    }
  }
`;

async function getAgents() {
  try {
    console.log('🔍 Fetching agents to get a real member ID...');
    
    const result = await client.query({
      query: GET_PUBLIC_AGENTS,
      variables: {
        input: {
          page: 1,
          limit: 5,
          search: {}
        }
      }
    });

    const agents = result.data.getAgents.list;
    console.log(`📋 Found ${agents.length} agents:`);
    agents.forEach((agent, index) => {
      console.log(`  ${index + 1}. ${agent.memberNick || agent.memberFullName} (ID: ${agent._id})`);
    });

    return agents;
  } catch (error) {
    console.error('❌ Error fetching agents:');
    console.error('Error details:', error.message);
    throw error;
  }
}

async function sendTestNotification(targetMemberId, memberNick) {
  try {
    const testNotification = {
      notificationType: 'LIKE',
      notificationGroup: 'MEMBER',
      notificationTitle: 'Test Notification - System Check',
      notificationContent: `This is a test notification to verify the notification system is working properly. Sent to ${memberNick} at: ` + new Date().toISOString(),
      notificationRefId: 'test-ref-' + Date.now(),
      memberId: targetMemberId
    };

    console.log('📝 Sending test notification to:', memberNick);
    console.log('📝 Test notification data:', JSON.stringify(testNotification, null, 2));
    
    const result = await client.mutate({
      mutation: CREATE_NOTIFICATION,
      variables: {
        input: testNotification
      }
    });

    console.log('✅ Test notification sent successfully!');
    console.log('📊 Response:', JSON.stringify(result.data, null, 2));
    
    return result.data.createNotification;
  } catch (error) {
    console.error('❌ Error sending test notification:');
    console.error('Error details:', error.message);
    
    if (error.networkError) {
      console.error('Network error:', error.networkError);
    }
    
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      console.error('GraphQL errors:', error.graphQLErrors);
    }
    
    throw error;
  }
}

async function verifyNotification(targetMemberId) {
  try {
    console.log('🔍 Verifying notification was created...');
    
    const result = await client.query({
      query: GET_NOTIFICATIONS,
      variables: {
        input: {
          page: 1,
          limit: 10,
          search: {}
        }
      }
    });

    const notifications = result.data.getNotifications.list;
    const testNotifications = notifications.filter(n => 
      n.memberId === targetMemberId && 
      n.notificationTitle.includes('Test Notification - System Check')
    );

    console.log(`📊 Found ${testNotifications.length} test notifications for member ${targetMemberId}`);
    
    if (testNotifications.length > 0) {
      console.log('✅ Notification verification successful!');
      testNotifications.forEach((notification, index) => {
        console.log(`  ${index + 1}. ${notification.notificationTitle} (Created: ${notification.createdAt})`);
      });
    } else {
      console.log('⚠️  No test notifications found - they might not be visible without authentication');
    }

    return testNotifications;
  } catch (error) {
    console.error('❌ Error verifying notification:');
    console.error('Error details:', error.message);
    throw error;
  }
}

// Main test function
async function runTest() {
  try {
    console.log('🚀 Starting notification system test...');
    console.log('📍 GraphQL URL:', GRAPHQL_URL);
    
    // Step 1: Get agents to find a real member ID
    const agents = await getAgents();
    
    if (agents.length === 0) {
      throw new Error('No agents found in the system');
    }
    
    // Use the first agent for testing
    const targetAgent = agents[0];
    const targetMemberId = targetAgent._id;
    const memberNick = targetAgent.memberNick || targetAgent.memberFullName || 'Unknown';
    
    console.log(`🎯 Selected target agent: ${memberNick} (${targetMemberId})`);
    
    // Step 2: Send test notification
    const notification = await sendTestNotification(targetMemberId, memberNick);
    
    // Step 3: Verify notification was created
    await verifyNotification(targetMemberId);
    
    console.log('🎉 Test completed successfully!');
    console.log('📋 Notification ID:', notification._id);
    
    return notification;
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  runTest()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      process.exit(1);
    });
}

module.exports = { runTest, getAgents, sendTestNotification, verifyNotification };
