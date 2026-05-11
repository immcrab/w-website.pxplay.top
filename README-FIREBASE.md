# Firebase Integration Guide

This website now uses Firebase for authentication and real-time database functionality!

## 🔧 Setup Instructions

### Prerequisites
- GitHub Pages repository (already set up ✅)
- Firebase project (already configured ✅)
- Google credentials configured

### Files Added

1. **firebase-config.js** - Firebase initialization and SDK imports
2. **firebase-auth.js** - Google Authentication functions
3. **firebase-db.js** - Realtime Database helper functions
4. **firebase-styles.css** - UI styling for Firebase components
5. **Updated HTML pages** - Integrated Firebase functionality

## 🚀 Features

### 1. Google Authentication
Users can sign in with their Google account:
```javascript
// Sign in
await window.signInWithGoogle();

// Sign out
await window.signOutUser();

// Get current user
const user = window.getCurrentUser();
```

### 2. Realtime Database
Save and retrieve data from Firebase:

```javascript
// Write data
await window.writeToDatabase('users/user123/profile', { name: 'John' });

// Read data (one-time)
const data = await window.readFromDatabase('users/user123/profile');

// Listen to real-time changes
const unsubscribe = window.listenToDatabase('users/user123', (data) => {
  console.log('Data changed:', data);
});

// Add new entry (generates unique ID)
const id = await window.addToDatabase('submissions', { name: 'John', email: 'john@example.com' });

// Update data
await window.updateDatabase('users/user123/profile', { name: 'Jane' });

// Delete data
await window.deleteFromDatabase('users/user123/profile');
```

### 3. Form Submission Example
The **Apply page** now saves form submissions to Firebase:

```javascript
// Auto-saves when form is submitted with user authentication
await window.saveFormSubmission({
  name: 'John',
  email: 'john@example.com',
  message: 'I want to join!'
});
```

## 📋 How to Use

### On the Home Page
- Users can click "Sign in with Google" to authenticate
- User profile info displays after login
- Authentication state persists between page visits

### On the Apply Page
- Form is only visible when user is logged in
- Form data automatically saves to Firebase with user ID and timestamp
- Submissions appear in real-time in Firebase console

### Custom Usage

#### Example 1: Listen to Form Submissions
```javascript
window.listenToSubmissions((submissions) => {
  if (submissions) {
    console.log('All submissions:', submissions);
    // Update UI with submissions
  }
});
```

#### Example 2: Save User Profile After Login
```javascript
import { initAuthListener } from './firebase-auth.js';
import { saveUserProfile } from './firebase-db.js';

initAuthListener((user) => {
  if (user) {
    saveUserProfile(user.uid, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });
  }
});
```

#### Example 3: Real-time User Presence
```javascript
import { getCurrentUser } from './firebase-auth.js';
import { writeToDatabase } from './firebase-db.js';

const user = getCurrentUser();
if (user) {
  await writeToDatabase(`presence/${user.uid}`, {
    online: true,
    lastSeen: new Date().toISOString()
  });
}
```

## 🔐 Firebase Security Rules

For public read access and authenticated write access:

```json
{
  "rules": {
    "submissions": {
      ".read": "root.child('users').child(auth.uid).exists()",
      ".write": "auth != null",
      "$uid": {
        ".validate": "auth.uid == $uid"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth.uid == $uid || root.child('admins').child(auth.uid).exists()",
        ".write": "auth.uid == $uid"
      }
    },
    "presence": {
      "$uid": {
        ".read": true,
        ".write": "auth.uid == $uid"
      }
    }
  }
}
```

## 🛡️ Important Notes

1. **API Keys**: Your Firebase config is public (this is normal - it's not a security issue)
2. **Authentication**: Only authenticated users can write to most data
3. **CORS**: GitHub Pages works fine with Firebase - no special configuration needed
4. **Persistence**: User login state persists between page visits using browser local storage

## 📊 View Data in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "makerlee" project
3. Click "Realtime Database" in the left sidebar
4. Browse data in real-time as users interact with your site

## 🐛 Debugging

Enable console logging:
```javascript
// Open browser DevTools (F12) → Console tab
// You'll see Firebase operations logged automatically
```

Check authentication:
```javascript
import { auth } from './firebase-config.js';
console.log(auth.currentUser); // Current user or null
```

Check database:
```javascript
window.readFromDatabase('submissions').then(console.log);
```

## 📝 Examples for Other Pages

### Example: Add to socials.html
```html
<div id="social-followers" class="card bg-blue"></div>

<script type="module">
  import { listenToDatabase } from './firebase-db.js';
  
  listenToDatabase('stats/followers', (count) => {
    document.getElementById('social-followers').innerText = 
      `Total Followers: ${count || 0}`;
  });
</script>
```

### Example: Add to developers.html
```html
<div id="dev-status"></div>

<script type="module">
  import { readFromDatabase } from './firebase-db.js';
  
  async function showDevStatus() {
    const devs = await readFromDatabase('team/developers');
    // Display developer info
  }
  
  showDevStatus();
</script>
```

## 🎉 You're all set!

Your website now has:
- ✅ Google Authentication
- ✅ Real-time Database
- ✅ Form Submissions
- ✅ User Profiles
- ✅ Real-time Data Sync
- ✅ GitHub Pages Compatible

Enjoy! 🚀
