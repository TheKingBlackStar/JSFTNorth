// Auth Navigation - Shows Admin link when logged in
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Check authentication and show/hide Admin link
onAuthStateChanged(auth, (user) => {
    const adminLinks = document.querySelectorAll('#admin-nav-link, #admin-link');
    
    if (user) {
        // User is logged in - show Admin link in navbar
        const adminNavLink = document.getElementById('admin-nav-link');
        if (adminNavLink) {
            adminNavLink.style.display = 'block';
        }
        
        // Hide Admin link in footer when logged in
        const adminFooterLink = document.getElementById('admin-link');
        if (adminFooterLink) {
            adminFooterLink.style.display = 'none';
        }
    } else {
        // User is not logged in - hide Admin link in navbar
        const adminNavLink = document.getElementById('admin-nav-link');
        if (adminNavLink) {
            adminNavLink.style.display = 'none';
        }
        
        // Show Admin link in footer for guests
        const adminFooterLink = document.getElementById('admin-link');
        if (adminFooterLink) {
            adminFooterLink.style.display = 'inline';
        }
    }
});
