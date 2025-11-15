// Create admin account using web SDK (not admin SDK)
// Run this with: node create-admin-web.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAiieziFvCjPRF0XOvDuEEZU0wCU8Fw2XM",
  authDomain: "jstfnorthwebsite.firebaseapp.com",
  projectId: "jstfnorthwebsite",
  storageBucket: "jstfnorthwebsite.firebasestorage.app",
  messagingSenderId: "722655135910",
  appId: "1:722655135910:web:e9a754e9b06c888d754c67",
  measurementId: "G-NG4JDR0RC4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  const username = 'admin';
  const password = 'Ble$$ed7';
  const email = `${username}@jstfnorth.local`;

  try {
    console.log('Creating admin user...');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Auth user created:', user.uid);
    
    // Create Firestore document
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      role: 'admin',
      disabled: false,
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Firestore document created');
    console.log('\n🎉 Admin account ready!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('\nYou can now log in at login.html');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.code);
    console.error('Message:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n⚠️  Admin account already exists. You can log in with:');
      console.log('Username: admin');
      console.log('Password: Ble$$ed7');
    }
    
    process.exit(1);
  }
}

createAdmin();
