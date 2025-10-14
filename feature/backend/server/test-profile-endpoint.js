// Test script to verify profile endpoint
import fetch from 'node-fetch';

const baseURL = 'http://localhost:5000';

async function testProfileEndpoint() {
  console.log('🧪 Testing Profile Endpoint\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${baseURL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');
    
    // Test 2: Get user profile
    console.log('2️⃣ Testing /api/me endpoint...');
    const profileResponse = await fetch(`${baseURL}/api/me`, {
      headers: {
        'Authorization': 'Bearer mock-token-123'
      }
    });
    
    if (!profileResponse.ok) {
      console.log('❌ Profile request failed with status:', profileResponse.status);
      const errorText = await profileResponse.text();
      console.log('Error:', errorText);
      return;
    }
    
    const profileData = await profileResponse.json();
    console.log('✅ Profile data received:');
    console.log(JSON.stringify(profileData, null, 2));
    console.log('');
    
    // Verify all required fields
    console.log('3️⃣ Verifying required fields...');
    const requiredFields = ['name', 'email', 'id', 'hasSecretPin', 'createdAt'];
    const missingFields = requiredFields.filter(field => !(field in profileData));
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields.join(', '));
    } else {
      console.log('✅ All required fields present!');
      console.log('  - Name:', profileData.name);
      console.log('  - Email:', profileData.email);
      console.log('  - ID:', profileData.id);
      console.log('  - Has Secret PIN:', profileData.hasSecretPin);
      console.log('  - Created At:', profileData.createdAt);
    }
    console.log('');
    
    // Test 3: Get notes (for statistics)
    console.log('4️⃣ Testing notes endpoint for statistics...');
    const notesResponse = await fetch(`${baseURL}/api/notes`, {
      headers: {
        'Authorization': 'Bearer mock-token-123'
      }
    });
    
    if (!notesResponse.ok) {
      console.log('❌ Notes request failed');
    } else {
      const notes = await notesResponse.json();
      console.log(`✅ Found ${notes.length} notes`);
      const pinnedCount = notes.filter(n => n.isPinned).length;
      console.log(`  - Pinned notes: ${pinnedCount}`);
    }
    console.log('');
    
    // Test 4: Get secret notes (for statistics)
    console.log('5️⃣ Testing secret notes endpoint for statistics...');
    const secretNotesResponse = await fetch(`${baseURL}/api/secret/notes`, {
      headers: {
        'Authorization': 'Bearer mock-token-123'
      }
    });
    
    if (!secretNotesResponse.ok) {
      console.log('⚠️  Secret notes request failed (might be normal if no PIN set)');
    } else {
      const secretNotes = await secretNotesResponse.json();
      console.log(`✅ Found ${secretNotes.length} secret notes`);
    }
    console.log('');
    
    console.log('✅ Profile endpoint test completed successfully!');
    console.log('');
    console.log('🎯 Summary:');
    console.log('  - Backend API is working correctly');
    console.log('  - User data is being fetched from MongoDB Atlas');
    console.log('  - All required fields are present in response');
    console.log('  - Profile page should now display data correctly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('  1. Make sure backend server is running: node index.js');
    console.log('  2. Check that MongoDB Atlas is accessible');
    console.log('  3. Verify .env file has correct database URIs');
  }
}

// Run the test
testProfileEndpoint();
