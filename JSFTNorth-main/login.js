// Login page functionality
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const db = getFirestore();
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const errorMessage = document.getElementById('error-message');

function showError(message) {
    if (errorMessage && loginError) {
        errorMessage.textContent = message;
        loginError.style.display = 'block';
    }
}

function hideError() {
    if (loginError) {
        loginError.style.display = 'none';
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();
        
        let username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // If user entered an email, extract username
        if (username.includes('@')) {
            const parts = username.split('@');
            username = parts[0];
            console.log('Extracted username from email:', username);
        }
        
        // Convert username to internal email format
        const email = `${username}@jstfnorth.local`;
        const originalText = loginBtn.innerHTML;

        try {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...';
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Redirect to admin panel
            window.location.href = 'admin.html';
            
        } catch (error) {
            console.error('Login error:', error);
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalText;
            
            if (error.code === 'auth/wrong-password') {
                showError('Incorrect password. Please try again.');
            } else if (error.code === 'auth/user-not-found') {
                showError('Username not found. Please check your username.');
            } else if (error.code === 'auth/invalid-email') {
                showError('Invalid username format.');
            } else if (error.code === 'auth/too-many-requests') {
                showError('Too many failed attempts. Please try again later.');
            } else if (error.code === 'auth/invalid-credential') {
                showError('Invalid username or password.');
            } else {
                showError('Login failed: ' + error.message);
            }
        }
    });
}
