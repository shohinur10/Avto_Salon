#!/usr/bin/env node

/**
 * Test Notification Service Script
 * This script uses the existing NotificationService to send test notifications
 */

const NotificationService = require('./libs/services/notificationService.ts');

async function testNotificationService() {
  try {
    console.log('🚀 Testing NotificationService...');
    
    // Test member ID (using the first agent we found)
    const targetMemberId = '68cb7134072bd2940db53913'; // Justin's ID
    const refId = 'test-car-' + Date.now();
    
    console.log('📝 Testing like notification...');
    await NotificationService.createLikeNotification(
      targetMemberId,
      refId,
      'CAR',
      'Test User',
      'Test Car Listing'
    );
    
    console.log('✅ Like notification test completed!');
    
    console.log('📝 Testing comment notification...');
    await NotificationService.createCommentNotification(
      targetMemberId,
      refId,
      'CAR',
      'Test User',
      'Test Car Listing',
      'This is a test comment'
    );
    
    console.log('✅ Comment notification test completed!');
    
    console.log('📝 Testing custom notification...');
    await NotificationService.createCustomNotification(
      targetMemberId,
      'System Test Notification',
      'This is a test notification to verify the notification system is working properly.',
      'LIKE',
      'MEMBER',
      'test-ref-' + Date.now()
    );
    
    console.log('✅ Custom notification test completed!');
    
    console.log('🎉 All notification tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing notification service:');
    console.error('Error details:', error.message);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testNotificationService()
    .then(() => {
      console.log('🎉 Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testNotificationService };
