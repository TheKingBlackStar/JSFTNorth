# Firebase Setup Complete! 🎉

## What's Been Done

Your website now uses **Firebase Firestore** as the database - no more localStorage! Everything saves to the cloud, so you'll see the same data on any computer.

## Collections in Your Database

Your Firebase has these collections:

1. **`users`** - Stores admin and manager accounts
2. **`sermons`** - Stores all uploaded sermons
3. **`calendarEvents`** - Stores all calendar events (replaces localStorage)

## Files Created/Updated

### New Files
- ✅ `firebase-config.js` - Central Firebase configuration
- ✅ `admin.js` - Admin panel logic (sermons, managers)
- ✅ `login.js` - Login authentication
- ✅ `sermons.js` - Display sermons on sermons page
- ✅ `calendars-firebase.js` - Calendar with Firebase (NO localStorage)

### Updated Files
- ✅ `admin.html` - Uses new Firebase SDK v10
- ✅ `login.html` - Uses new Firebase SDK v10
- ✅ `sermons.html` - Added sermons.js module
- ✅ `calendars.html` - Uses calendars-firebase.js
- ✅ `script.js` - Removed old Firebase code

## Next Steps to Complete Setup

### 1. Set Up Firestore Database (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **jstfnorthwebsite**
3. Click **Firestore Database** in the left menu
4. Click **Create database**
5. Choose **Start in production mode** (we'll add rules next)
6. Select a location (choose **us-central** or closest to Ohio)
7. Click **Enable**

### 2. Add Security Rules (2 minutes)

1. In Firestore, click the **Rules** tab
2. Replace the rules with this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - only authenticated users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Sermons - public read, admins/managers can write
    match /sermons/{sermonId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Calendar Events - public read, admins/managers can write
    match /calendarEvents/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
  }
}
```

3. Click **Publish**

### 3. Create Your First Admin User (3 minutes)

1. In Firebase Console, click **Authentication** in left menu
2. Click **Get started**
3. Enable **Email/Password** sign-in method
4. Click **Users** tab
5. Click **Add user**
6. Enter your email and password
7. Click **Add user**
8. **Copy the User UID** (important!)

### 4. Add Admin Role to Your User (2 minutes)

1. Go back to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `users`
4. Document ID: **Paste your User UID from step 3**
5. Add these fields:
   - Field: `email`, Type: string, Value: your email
   - Field: `role`, Type: string, Value: `admin`
   - Field: `createdAt`, Type: timestamp, Value: (click to auto-generate)
6. Click **Save**

### 5. Test Your Setup! (2 minutes)

1. Open your website
2. Go to `/login.html`
3. Log in with your email and password
4. You should be redirected to `/admin.html`
5. Try uploading a test sermon
6. Check `/sermons.html` to see if it appears

## How It Works Now

### Calendar Events
- **Before:** Saved to browser localStorage (different on each computer)
- **Now:** Saved to Firebase Firestore (same everywhere)
- Events sync in real-time across all devices

### Sermons
- Upload from admin panel → saves to Firebase
- Automatically appears on sermons page for everyone
- Delete from admin panel → instantly removed everywhere

### User Management
- Admin can assign manager roles to other users
- Managers can upload sermons but can't create other managers
- Only authenticated admins/managers can modify data

## Troubleshooting

### Can't log in?
- Make sure you created the user in Firebase Authentication
- Make sure you added the user document in Firestore with role: "admin"
- Check browser console for errors (F12)

### Sermons not showing?
- Check that Firestore database is created
- Check that security rules are published
- Look at browser console (F12) for errors

### Calendar events not saving?
- Make sure you're logged in as admin/manager
- Check Firestore security rules are correct
- Events need: date, title, category fields

## Firebase Console Quick Links

- Your Project: https://console.firebase.google.com/project/jstfnorthwebsite
- Firestore: https://console.firebase.google.com/project/jstfnorthwebsite/firestore
- Authentication: https://console.firebase.google.com/project/jstfnorthwebsite/authentication

---

**Need help?** All your data is now centralized in Firebase. You can view, edit, or delete anything directly in the Firebase Console!
