// Admin panel functionality
import { auth } from './firebase-config.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    deleteDoc, 
    doc, 
    getDoc,
    query, 
    where, 
    getDocs, 
    updateDoc, 
    onSnapshot, 
    orderBy, 
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';
import { loadUsers, initPasswordChange, initRefreshButton } from './user-management.js';
import { storage } from './firebase-config.js';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

const db = getFirestore();
const functions = getFunctions(undefined, 'us-central1');

// Store current user ID for management
let currentUserUid = null;

// Check authentication and permissions
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in - allow access for now
        console.log('User authenticated:', user.email);
        currentUserUid = user.uid;
        
        // Get user role from Firestore
        let userRole = 'manager'; // default
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                userRole = userDoc.data().role || 'manager';
            }
        } catch (error) {
            console.error('Error getting user role:', error);
        }
        
        // Display user email
        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement) {
            // Try to get username from Firestore, otherwise show email
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().username) {
                    userEmailElement.textContent = userDoc.data().username;
                } else {
                    userEmailElement.textContent = user.email;
                }
            } catch (error) {
                userEmailElement.textContent = user.email;
            }
        }
        
        // Show admin-only sections if user is admin
        if (userRole === 'admin') {
            document.querySelectorAll('.admin-only').forEach(el => { el.style.display = ''; });
        }
        // Show manager-plus sections for admin or manager
        if (userRole === 'admin' || userRole === 'manager') {
            document.querySelectorAll('.manager-plus').forEach(el => { el.style.display = ''; });
        }
        
        // Load stats
        loadStats();
        
        // Load user management (only if admin)
        if (userRole === 'admin') {
            loadUsers(); initPasswordChange(); initRefreshButton();
        }
        // Load featured events list (admins & managers)
        loadFeaturedEvents();
    } else {
        // User is signed out - redirect to login
        window.location.href = 'login.html';
    }
});

// ====================================
// Calendar Event Management
// ====================================

let currentEventFilter = 'all';

// Add Event Form
const addEventForm = document.getElementById('add-event-form');
if (addEventForm) {
    // Dynamic food field handling
    const categorySelect = document.getElementById('event-category');
    const foodExtra = document.getElementById('food-extra-fields');
    if (categorySelect && foodExtra) {
        const toggleFoodFields = () => {
            foodExtra.style.display = categorySelect.value === 'food' ? '' : 'none';
        };
        categorySelect.addEventListener('change', toggleFoodFields);
        toggleFoodFields();
    }
    addEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        const dateStr = document.getElementById('event-date').value;
        const category = document.getElementById('event-category').value;
        const description = document.getElementById('event-description').value;
        const foodItem = document.getElementById('event-food-item')?.value || '';
        const cook = document.getElementById('event-cook')?.value || '';
        const submitBtn = addEventForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding...';
            
            // Parse date
            const [year, month, day] = dateStr.split('-').map(Number);
            
            await addDoc(collection(db, 'calendarEvents'), {
                title: title,
                date: dateStr, // YYYY-MM-DD string used by calendars-firebase.js
                year: year,
                month: month,
                day: day,
                category: category,
                description: description || '',
                food: category === 'food' ? foodItem : '',
                cook: category === 'food' ? cook : '',
                createdAt: serverTimestamp()
            });
            
            alert('✅ Event added successfully!');
            addEventForm.reset();
            loadStats(); // Refresh event count
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Error adding event: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Event Filter
const eventFilter = document.getElementById('event-filter');
if (eventFilter) {
    eventFilter.addEventListener('change', (e) => {
        currentEventFilter = e.target.value;
        // Events list will auto-update via snapshot listener
    });
}

// Display and manage events list
const eventsList = document.getElementById('events-list');
if (eventsList) {
    const eventsQuery = query(collection(db, 'calendarEvents'), orderBy('date', 'desc'));
    
    onSnapshot(eventsQuery, (snapshot) => {
        const allEvents = [];
        snapshot.forEach((docSnap) => {
            allEvents.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });
        
        // Filter events
        const filteredEvents = currentEventFilter === 'all' 
            ? allEvents 
            : allEvents.filter(event => event.category === currentEventFilter);
        
        let html = '';
        
        if (filteredEvents.length === 0) {
            html = '<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>No events found</div>';
        } else {
            filteredEvents.forEach((event) => {
                const categoryColors = {
                    food: 'danger',
                    transportation: 'info',
                    volunteer: 'success',
                    activities: 'warning',
                    maintenance: 'primary'
                };
                const badgeColor = categoryColors[event.category] || 'secondary';
                const dateStr = event.date || `${event.month}/${event.day}/${event.year}`;
                
                const foodLine = event.category === 'food' && (event.food || event.cook)
                    ? `<div class=\"mt-1 small\"><span class=\"text-danger fw-semibold\">${event.food ? event.food : ''}</span>${event.food && event.cook ? ' • ' : ''}<span class=\"text-primary\">${event.cook ? 'Cook: ' + event.cook : ''}</span></div>`
                    : '';
                html += `
                    <div class="card mb-2">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">${event.title}</h6>
                                    <div class="mb-1">
                                        <span class="badge bg-${badgeColor} me-2">${event.category}</span>
                                        <small class="text-muted"><i class="far fa-calendar me-1"></i>${dateStr}</small>
                                    </div>
                                    ${event.description ? `<small class="text-muted">${event.description}</small>` : ''}
                                    ${foodLine}
                                </div>
                                <div class="d-flex align-items-center">
                                    <button class="btn btn-outline-secondary btn-sm edit-event ms-2" data-id="${event.id}" data-title="${event.title}" data-date="${event.date || ''}" data-year="${event.year || ''}" data-month="${event.month || ''}" data-day="${event.day || ''}" data-category="${event.category}" data-description="${event.description || ''}" data-food="${event.food || ''}" data-cook="${event.cook || ''}" title="Edit event">
                                        <i class="fas fa-pen"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm delete-event ms-2" data-id="${event.id}" title="Delete event">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        eventsList.innerHTML = html;
        
        // Update stats
        const totalEventsEl = document.getElementById('total-events');
        if (totalEventsEl) totalEventsEl.textContent = allEvents.length;
        
        // Add edit event listeners
        const editButtons = document.querySelectorAll('.edit-event');
        editButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const btn = e.currentTarget;
                const id = btn.dataset.id;
                const title = btn.dataset.title || '';
                const category = btn.dataset.category || 'food';
                const description = btn.dataset.description || '';
                const dateStr = btn.dataset.date || '';
                const foodItem = btn.dataset.food || '';
                const cook = btn.dataset.cook || '';
                let y = btn.dataset.year, m = btn.dataset.month, d = btn.dataset.day;
                let dateForInput = dateStr;
                if (!dateForInput && y && m && d) {
                    // m stored as number, ensure two-digit month/day
                    const mm = String(m).padStart(2, '0');
                    const dd = String(d).padStart(2, '0');
                    dateForInput = `${y}-${mm}-${dd}`;
                }

                const idInput = document.getElementById('edit-event-id');
                const titleInput = document.getElementById('edit-event-title');
                const categoryInput = document.getElementById('edit-event-category');
                const descInput = document.getElementById('edit-event-description');
                const dateInput = document.getElementById('edit-event-date');
                const foodInput = document.getElementById('edit-event-food-item');
                const cookInput = document.getElementById('edit-event-cook');
                if (!idInput || !titleInput || !categoryInput || !descInput || !dateInput) return;

                idInput.value = id;
                titleInput.value = title;
                categoryInput.value = category;
                descInput.value = description;
                dateInput.value = dateForInput || '';
                if (foodInput) foodInput.value = foodItem;
                if (cookInput) cookInput.value = cook;
                const editFoodExtra = document.getElementById('edit-food-extra-fields');
                if (editFoodExtra) editFoodExtra.style.display = category === 'food' ? '' : 'none';

                if (window.bootstrap && document.getElementById('editEventModal')) {
                    const modal = new bootstrap.Modal(document.getElementById('editEventModal'));
                    modal.show();
                }
            });
        });

        // Add delete event listeners
        const deleteButtons = document.querySelectorAll('.delete-event');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.closest('button').dataset.id;
                if (confirm('Are you sure you want to delete this event?')) {
                    try {
                        await deleteDoc(doc(db, 'calendarEvents', id));
                        // Stats and list will auto-update via snapshot listener
                    } catch (error) {
                        console.error('Error deleting event:', error);
                        alert('Error deleting event: ' + error.message);
                    }
                }
            });
        });
    });
}

// Save changes for Edit Event
const saveEventChangesBtn = document.getElementById('save-event-changes');
if (saveEventChangesBtn) {
    // Dynamic toggle inside edit modal
    const editCategorySelect = document.getElementById('edit-event-category');
    const editFoodExtra = document.getElementById('edit-food-extra-fields');
    if (editCategorySelect && editFoodExtra) {
        editCategorySelect.addEventListener('change', () => {
            editFoodExtra.style.display = editCategorySelect.value === 'food' ? '' : 'none';
        });
    }
    saveEventChangesBtn.addEventListener('click', async () => {
        const id = document.getElementById('edit-event-id')?.value;
        const title = document.getElementById('edit-event-title')?.value;
        const category = document.getElementById('edit-event-category')?.value;
        const description = document.getElementById('edit-event-description')?.value;
        const dateStr = document.getElementById('edit-event-date')?.value;
        const foodItem = document.getElementById('edit-event-food-item')?.value || '';
        const cook = document.getElementById('edit-event-cook')?.value || '';
        if (!id || !title || !category || !dateStr) return;
        try {
            const [year, month, day] = dateStr.split('-').map(Number);
            await updateDoc(doc(db, 'calendarEvents', id), {
                title,
                category,
                description: description || '',
                date: dateStr,
                year, month, day,
                food: category === 'food' ? foodItem : '',
                cook: category === 'food' ? cook : ''
            });
            showToast('Event updated', 'success');
            if (window.bootstrap && document.getElementById('editEventModal')) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('editEventModal'));
                if (modal) modal.hide();
            }
        } catch (error) {
            console.error('Error updating event:', error);
            showToast('Error updating event', 'danger');
        }
    });
}

// Simple toast helper
function showToast(message, variant = 'primary') {
    const toastEl = document.getElementById('adminToast');
    const toastBody = document.getElementById('adminToastBody');
    if (!toastEl || !toastBody || !window.bootstrap) return alert(message);
    toastBody.textContent = message;
    toastEl.className = `toast align-items-center text-white bg-${variant} border-0`;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// ====================================
// Featured Events Management (Admins & Managers)
// ====================================

const featuredListEl = document.getElementById('featured-events-list');
const addFeaturedForm = document.getElementById('add-featured-event-form');
const refreshFeaturedBtn = document.getElementById('refresh-featured-btn');

async function loadFeaturedEvents() {
    if (!featuredListEl) return;
    try {
        const q = query(collection(db, 'featuredEvents'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        if (snap.empty) {
            featuredListEl.innerHTML = '<div class="alert alert-info">No featured events yet</div>';
            return;
        }
        let html = '';
        snap.forEach(docSnap => {
            const fe = docSnap.data();
            const dateStr = fe.date || ''; 
            const img = fe.imageUrl ? `<div class=\"ratio ratio-4x3 mb-2 bg-light rounded\" style=\"background:url('${fe.imageUrl}') center/cover no-repeat;\"></div>` : '<div class="ratio ratio-4x3 mb-2 bg-light rounded d-flex align-items-center justify-content-center text-muted" style="font-size:.8rem;">No Image</div>';
            html += `
            <div class="card mb-2">
              <div class="card-body p-3">
                <div class="d-flex">
                  <div style="width:110px;" class="me-3">${img}</div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1">${fe.title || 'Untitled'}</h6>
                    <div class="small text-muted mb-1"><i class="far fa-calendar me-1"></i>${dateStr} • ${fe.category || 'event'}</div>
                    ${fe.description ? `<div class="small">${fe.description}</div>` : ''}
                  </div>
                  <div class="ms-2 d-flex flex-column justify-content-start">
                    <button class="btn btn-outline-danger btn-sm mb-2 delete-featured" data-id="${docSnap.id}" data-image="${fe.imagePath || ''}" title="Delete"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>`;
        });
        featuredListEl.innerHTML = html;
        document.querySelectorAll('.delete-featured').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id; const imagePath = btn.dataset.image;
                if (!confirm('Delete this featured event?')) return;
                try {
                    await deleteDoc(doc(db, 'featuredEvents', id));
                    if (imagePath) {
                        try { await deleteObject(storageRef(storage, imagePath)); } catch (e) {}
                    }
                    loadFeaturedEvents();
                    showToast('Featured event deleted', 'success');
                } catch (err) {
                    console.error(err);
                    showToast('Delete failed', 'danger');
                }
            });
        });
    } catch (error) {
        console.error('Error loading featured events:', error);
        featuredListEl.innerHTML = '<div class="alert alert-danger">Failed to load featured events</div>';
    }
}

if (refreshFeaturedBtn) {
    refreshFeaturedBtn.addEventListener('click', () => loadFeaturedEvents());
}

if (addFeaturedForm) {
    addFeaturedForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('featured-title').value.trim();
        const dateStr = document.getElementById('featured-date').value;
        const category = document.getElementById('featured-category').value;
        const description = document.getElementById('featured-description').value.trim();
        const fileInput = document.getElementById('featured-image');
        const submitBtn = addFeaturedForm.querySelector('button[type="submit"]');
        const original = submitBtn.innerHTML;
        try {
            submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
            let imageUrl = ''; let imagePath = '';
            if (fileInput && fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                imagePath = `featuredEvents/${Date.now()}_${file.name}`;
                const refObj = storageRef(storage, imagePath);
                await uploadBytes(refObj, file);
                imageUrl = await getDownloadURL(refObj);
            }
            await addDoc(collection(db, 'featuredEvents'), {
                title,
                date: dateStr,
                category,
                description,
                imageUrl,
                imagePath,
                createdAt: serverTimestamp()
            });
            addFeaturedForm.reset();
            loadFeaturedEvents();
            showToast('Featured event added', 'success');
        } catch (error) {
            console.error('Add featured error:', error);
            showToast('Failed to add featured event', 'danger');
        } finally {
            submitBtn.disabled = false; submitBtn.innerHTML = original;
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error logging out: ' + error.message);
        }
    });
}

// Load statistics
async function loadStats() {
    try {
        // Count sermons
        const sermonsSnapshot = await getDocs(collection(db, 'sermons'));
        const sermonCount = sermonsSnapshot.size;
        
        const totalSermonsEl = document.getElementById('total-sermons');
        const sermonCountEl = document.getElementById('sermon-count');
        if (totalSermonsEl) totalSermonsEl.textContent = sermonCount;
        if (sermonCountEl) sermonCountEl.textContent = sermonCount;
        
        // Count calendar events
        const eventsSnapshot = await getDocs(collection(db, 'calendarEvents'));
        const eventsCount = eventsSnapshot.size;
        
        const totalEventsEl = document.getElementById('total-events');
        if (totalEventsEl) totalEventsEl.textContent = eventsCount;
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Create Manager functionality
const createManagerForm = document.getElementById('create-manager-form');
if (createManagerForm) {
    createManagerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('manager-username').value.trim();
        const password = document.getElementById('manager-password').value;
        const submitBtn = createManagerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        console.log('Creating manager with username:', username);
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating account...';
            
            // Call Cloud Function to create manager
            const createManager = httpsCallable(functions, 'createManager');
            console.log('Calling createManager function...');
            
            const result = await createManager({ 
                username: username, 
                password: password,
                role: 'manager'
            });
            
            console.log('Manager created successfully:', result);
            
            showToast(`Manager '${username}' created successfully!`, 'success');
            alert(`✅ Success!\n\nManager account created!\n\nCredentials:\nUsername: ${username}\nPassword: ${password}\n\nSend these to the manager so they can log in.`);
            
            createManagerForm.reset();
        } catch (error) {
            console.error('Error creating manager:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            let errorMessage = 'Error creating manager account.';
            if (error.code === 'functions/already-exists') {
                errorMessage = 'A manager with this username already exists.';
            } else if (error.code === 'functions/invalid-argument') {
                errorMessage = 'Please provide both username and password.';
            } else if (error.code === 'functions/unauthenticated') {
                errorMessage = 'You must be logged in to create managers.';
            } else if (error.code === 'functions/not-found') {
                errorMessage = 'Cloud Function not found. Make sure functions are deployed.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showToast(errorMessage, 'danger');
            alert('❌ ' + errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Upload Sermon functionality
const uploadSermonForm = document.getElementById('upload-sermon-form');
if (uploadSermonForm) {
    uploadSermonForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('sermon-title').value;
        const youtubeLink = document.getElementById('youtube-link').value;
        const submitBtn = uploadSermonForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Uploading...';
            
            const tagsInput = document.getElementById('sermon-tags');
            const tags = tagsInput && tagsInput.value
                ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
                : [];

            await addDoc(collection(db, 'sermons'), {
                title: title,
                youtubeLink: youtubeLink,
                tags: tags,
                createdAt: serverTimestamp()
            });
            
            alert('Sermon uploaded successfully!');
            uploadSermonForm.reset();
            loadStats(); // Refresh stats
        } catch (error) {
            console.error('Error uploading sermon:', error);
            alert('Error uploading sermon: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Display and manage sermons list
const sermonsList = document.getElementById('sermons-list');
if (sermonsList) {
    const sermonsQuery = query(collection(db, 'sermons'), orderBy('createdAt', 'desc'));
    
    onSnapshot(sermonsQuery, (snapshot) => {
        let html = '';
        
        if (snapshot.empty) {
            html = '<li class="list-group-item text-center text-muted"><i class="fas fa-inbox me-2"></i>No sermons uploaded yet</li>';
        } else {
            snapshot.forEach((docSnap) => {
                const sermon = docSnap.data();
                const date = sermon.createdAt?.toDate ? sermon.createdAt.toDate().toLocaleDateString() : 'Recently';
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="fw-semibold">${sermon.title}</div>
                            <small class="text-muted"><i class="far fa-calendar me-1"></i>${date}</small>
                        </div>
                        <button class="btn btn-danger btn-sm delete-sermon ms-2" data-id="${docSnap.id}" title="Delete sermon">
                            <i class="fas fa-trash"></i>
                        </button>
                    </li>
                `;
            });
        }
        
        sermonsList.innerHTML = html;
        
        // Update stats
        const sermonCountEl = document.getElementById('sermon-count');
        if (sermonCountEl) sermonCountEl.textContent = snapshot.size;
        const totalSermonsEl = document.getElementById('total-sermons');
        if (totalSermonsEl) totalSermonsEl.textContent = snapshot.size;

        // Add delete event listeners
        const deleteButtons = document.querySelectorAll('.delete-sermon');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.closest('button').dataset.id;
                if (confirm('Are you sure you want to delete this sermon?')) {
                    try {
                        await deleteDoc(doc(db, 'sermons', id));
                        // Stats will auto-update via snapshot listener
                    } catch (error) {
                        console.error('Error deleting sermon:', error);
                        alert('Error deleting sermon: ' + error.message);
                    }
                }
            });
        });
    });
}
