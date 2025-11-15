# Firebase Cloud Functions Setup - Create Managers from Admin Panel

## What This Does
Allows you to create manager accounts **directly from your admin panel** - no need to go to Firebase Console!

## One-Time Setup (10 minutes)

### Step 1: Install Firebase CLI (if not already installed)
Open PowerShell and run:
```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```powershell
firebase login
```
- This will open your browser
- Sign in with your Google account that has access to the Firebase project

### Step 3: Initialize Functions
```powershell
cd C:\Users\p_gre\OneDrive\Documents\GitHub\JSFTNorth\JSFTNorth-main\functions
npm install
```

### Step 4: Deploy the Cloud Function
```powershell
cd C:\Users\p_gre\OneDrive\Documents\GitHub\JSFTNorth
firebase deploy --only functions
```

This will:
- Upload your function to Firebase
- Make it available to your website
- Take about 2-3 minutes

### Step 5: Enable Billing (Free Tier)
Cloud Functions require the Blaze (pay-as-you-go) plan, but it has a **generous free tier**:
- First 2 million function invocations/month: **FREE**
- For a church website, you'll likely stay in the free tier

1. Go to https://console.firebase.google.com/project/jstfnorthwebsite/overview
2. Click "Upgrade" if prompted
3. Enter payment info (won't be charged unless you exceed free limits)

## How to Use After Setup

### Creating Managers from Admin Panel
1. Log into your admin panel: `/admin`
2. Scroll to "Create Manager Account" card
3. Enter manager's email
4. Create a temporary password
5. Click "Create Manager Account"
6. ✅ Done! Share the credentials with the manager

### What Happens Behind the Scenes
1. Cloud Function creates user in Firebase Authentication
2. Cloud Function creates user document in Firestore with "manager" role
3. Manager can immediately log in with those credentials
4. Manager can access admin panel to upload sermons

## Benefits
- ✅ No more going to Firebase Console
- ✅ One-click manager creation
- ✅ Automatic role assignment
- ✅ Secure (only authenticated admins can create managers)

## Troubleshooting

### "Functions not deployed"
Run: `firebase deploy --only functions`

### "Billing not enabled"
You need to upgrade to Blaze plan (still free for normal use)

### "Permission denied"
Make sure you're logged in as admin in your website

## Cost Estimate
For a typical church website:
- **Expected cost: $0/month**
- Free tier includes 2M invocations
- Creating managers = maybe 10-20 times per year
- You'll never hit the limit

## Files Created
- `functions/index.js` - Cloud Function code
- `functions/package.json` - Dependencies
- `firebase.json` - Updated configuration

---

**After deploying once, you'll never need to go to Firebase Console to create users again!** 🎉
