const {onCall} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

admin.initializeApp();

// Create a new user with username and password (2nd Gen Function)
exports.createManager = onCall(async (request) => {
  // Check if user is authenticated
  if (!request.auth) {
    throw new Error('You must be logged in to create managers.');
  }

  const { username, password, role } = request.data;

  // Validate input
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }

  // Create a fake email from username (Firebase requires email)
  const email = `${username}@jstfnorth.local`;

  try {
    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
      emailVerified: true,
      disabled: false
    });

    // Create user document in Firestore with username
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      username: username,
      email: email,
      role: role || 'manager',
      createdBy: request.auth.uid,
      disabled: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: `Manager account created successfully for ${username}`,
      uid: userRecord.uid,
      username: username
    };

  } catch (error) {
    console.error('Error creating manager:', error);
    
    if (error.code === 'auth/email-already-exists') {
      throw new Error('A manager with this username already exists.');
    }
    
    throw new Error('Error creating manager: ' + error.message);
  }
});

// Update user password
exports.updateUserPassword = onCall(async (request) => {
  if (!request.auth) {
    throw new Error('You must be logged in.');
  }

  const { uid, newPassword } = request.data;

  if (!uid || !newPassword) {
    throw new Error('User ID and new password are required.');
  }

  try {
    await admin.auth().updateUser(uid, {
      password: newPassword
    });

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    throw new Error('Error updating password: ' + error.message);
  }
});

// Enable/Disable user account
exports.toggleUserStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new Error('You must be logged in.');
  }

  const { uid, disabled } = request.data;

  if (!uid || disabled === undefined) {
    throw new Error('User ID and status are required.');
  }

  try {
    await admin.auth().updateUser(uid, { disabled });
    
    await admin.firestore().collection('users').doc(uid).update({
      disabled: disabled,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: disabled ? 'User disabled successfully' : 'User enabled successfully'
    };
  } catch (error) {
    throw new Error('Error updating user status: ' + error.message);
  }
});

// Delete user account
exports.deleteUser = onCall(async (request) => {
  if (!request.auth) {
    throw new Error('You must be logged in.');
  }

  const { uid } = request.data;

  if (!uid) {
    throw new Error('User ID is required.');
  }

  try {
    // Delete from Authentication
    await admin.auth().deleteUser(uid);
    
    // Delete from Firestore
    await admin.firestore().collection('users').doc(uid).delete();

    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
});
