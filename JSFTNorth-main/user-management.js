// User Management Functions for Admin Panel
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';
import { getFirestore, collection, query, onSnapshot, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const functions = getFunctions(undefined, 'us-central1');
const db = getFirestore();

let selectedUser = null;

// Load and display all users
export function loadUsers() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;

    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    onSnapshot(usersQuery, (snapshot) => {
        let html = '';
        
        if (snapshot.empty) {
            html = '<tr><td colspan="5" class="text-center text-muted">No users found</td></tr>';
        } else {
            snapshot.forEach((docSnap) => {
                const user = docSnap.data();
                const uid = docSnap.id;
                const username = user.username || user.email || 'Unknown';
                const role = user.role || 'manager';
                const disabled = user.disabled || false;
                const createdDate = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A';
                
                const statusBadge = disabled 
                    ? '<span class="badge bg-danger">Disabled</span>'
                    : '<span class="badge bg-success">Active</span>';
                
                html += `
                    <tr>
                        <td><strong>${username}</strong></td>
                        <td><span class="badge bg-primary">${role}</span></td>
                        <td>${statusBadge}</td>
                        <td><small class="text-muted">${createdDate}</small></td>
                        <td class="text-end">
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary change-password-btn" 
                                        data-uid="${uid}" 
                                        data-username="${username}"
                                        title="Change Password">
                                    <i class="fas fa-key"></i>
                                </button>
                                <button class="btn btn-outline-${disabled ? 'success' : 'warning'} toggle-status-btn" 
                                        data-uid="${uid}" 
                                        data-disabled="${disabled}"
                                        data-username="${username}"
                                        title="${disabled ? 'Enable' : 'Disable'} Account">
                                    <i class="fas fa-${disabled ? 'check' : 'ban'}"></i>
                                </button>
                                <button class="btn btn-outline-danger delete-user-btn" 
                                        data-uid="${uid}"
                                        data-username="${username}"
                                        title="Delete Account">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
        
        usersTableBody.innerHTML = html;
        attachUserManagementListeners();
    });
}

// Attach event listeners to user management buttons
function attachUserManagementListeners() {
    // Change Password buttons
    document.querySelectorAll('.change-password-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedUser = {
                uid: btn.dataset.uid,
                username: btn.dataset.username
            };
            
            document.getElementById('change-password-username').textContent = selectedUser.username;
            document.getElementById('new-password').value = '';
            
            const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
            modal.show();
        });
    });
    
    // Toggle Status buttons
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const uid = btn.dataset.uid;
            const username = btn.dataset.username;
            const currentlyDisabled = btn.dataset.disabled === 'true';
            const action = currentlyDisabled ? 'enable' : 'disable';
            
            if (confirm(`Are you sure you want to ${action} the account for "${username}"?`)) {
                try {
                    btn.disabled = true;
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    
                    const toggleStatus = httpsCallable(functions, 'toggleUserStatus');
                    await toggleStatus({ uid: uid, disabled: !currentlyDisabled });
                    
                    // Will auto-update via snapshot listener
                } catch (error) {
                    console.error('Error toggling user status:', error);
                    alert('Error: ' + error.message);
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                }
            }
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const uid = btn.dataset.uid;
            const username = btn.dataset.username;
            
            if (confirm(`⚠️ WARNING: Delete account for "${username}"?\n\nThis action CANNOT be undone!`)) {
                try {
                    btn.disabled = true;
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    
                    const deleteUser = httpsCallable(functions, 'deleteUser');
                    await deleteUser({ uid: uid });
                    
                    alert(`Account "${username}" deleted successfully.`);
                    // Will auto-update via snapshot listener
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user: ' + error.message);
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                }
            }
        });
    });
}

// Confirm password change
export function initPasswordChange() {
    const confirmBtn = document.getElementById('confirm-password-change');
    if (!confirmBtn) return;
    
    confirmBtn.addEventListener('click', async () => {
        const newPassword = document.getElementById('new-password').value;
        
        if (!newPassword || newPassword.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        
        if (!selectedUser) {
            alert('No user selected.');
            return;
        }
        
        try {
            confirmBtn.disabled = true;
            const originalHTML = confirmBtn.innerHTML;
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Changing...';
            
            const updatePassword = httpsCallable(functions, 'updateUserPassword');
            await updatePassword({ 
                uid: selectedUser.uid, 
                newPassword: newPassword 
            });
            
            alert(`Password changed successfully for "${selectedUser.username}"!\n\nNew Password: ${newPassword}\n\nMake sure to share this with the user.`);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
            modal.hide();
            
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error changing password: ' + error.message);
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalHTML;
        }
    });
}

// Refresh users button
export function initRefreshButton() {
    const refreshBtn = document.getElementById('refresh-users-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadUsers();
        });
    }
}
