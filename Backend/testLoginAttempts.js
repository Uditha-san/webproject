// Test script to verify login attempts functionality
// Run this with: node testLoginAttempts.js

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api/user';

async function testLoginAttempts() {
  console.log('🧪 Testing Login Attempts Functionality');
  console.log('=======================================\n');

  const testEmail = 'test@example.com';
  const wrongPassword = 'wrongpassword';
  const correctPassword = 'TestPassword123!';

  try {
    // First, try to register a test user
    console.log('1. Registering test user...');
    const registerResponse = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: correctPassword
      })
    });

    if (registerResponse.ok) {
      console.log('✅ Test user registered successfully\n');
    } else {
      console.log('ℹ️ Test user may already exist, continuing...\n');
    }

    // Test failed login attempts
    console.log('2. Testing failed login attempts...');
    for (let i = 1; i <= 6; i++) {
      console.log(`   Attempt ${i}:`);
      
      const loginResponse = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: wrongPassword
        })
      });

      const data = await loginResponse.json();
      
      if (loginResponse.status === 423) {
        console.log(`   🔒 LOCKED: ${data.message}`);
        break;
      } else if (loginResponse.status === 401) {
        console.log(`   ❌ FAILED: ${data.message}`);
        if (data.attemptsLeft !== undefined) {
          console.log(`   📊 Attempts left: ${data.attemptsLeft}`);
        }
      }
    }

    console.log('\n3. Testing successful login (should fail if locked)...');
    const correctLoginResponse = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: correctPassword
      })
    });

    const correctData = await correctLoginResponse.json();
    
    if (correctLoginResponse.status === 423) {
      console.log(`   🔒 LOCKED (as expected): ${correctData.message}`);
    } else if (correctLoginResponse.ok) {
      console.log('   ✅ SUCCESS: Login successful - attempts reset');
    } else {
      console.log(`   ❌ UNEXPECTED: ${correctData.message}`);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testLoginAttempts();
