// Create initial admin account
const admin = require('firebase-admin');

// Initialize Firebase Admin with explicit project config
admin.initializeApp({
  projectId: 'jstfnorthwebsite'
});

async function createAdmin() {
  const username = 'admin';
  const password = 'Ble$$ed7';
  const email = `${username}@jstfnorth.local`;

  try {
    // Try to get existing user first
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log('User already exists:', userRecord.uid);
      
      // Update password
      await admin.auth().updateUser(userRecord.uid, {
        password: password
      });
      console.log('✅ Password updated for existing admin account');
      
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          displayName: username,
          emailVerified: true,
          disabled: false
        });
        console.log('✅ New admin account created:', userRecord.uid);
      } else {
        throw error;
      }
    }

    // Create/update Firestore document
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      username: username,
      email: email,
      role: 'admin',
      disabled: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('\n✅ ADMIN ACCOUNT READY!');
    console.log('==================');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('==================');
    console.log('\nYou can now log in at: http://localhost:5500/login.html');
    console.log('Or: http://127.0.0.1:5500/login.html');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit();
}

createAdmin();
