import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDgQRvvNbr8tY4OP0Ky-6Uy6LI1gWFlAXM",
    authDomain: "makerlee.firebaseapp.com",
    projectId: "makerlee",
    storageBucket: "makerlee.firebasestorage.app",
    messagingSenderId: "730881046345",
    appId: "1:730881046345:web:bf0fb8862db08de7604c98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// UI Elements
const authBtn = document.getElementById('auth-btn');
const userLedgerBody = document.getElementById('user-ledger-body');
const marqueeText = document.getElementById('marquee-text');

// --- AUTH LOGIC ---

authBtn.onclick = () => {
    if (auth.currentUser) {
        signOut(auth);
    } else {
        signInWithPopup(auth, provider);
    }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        authBtn.innerText = "LOGOUT";
        updateUserProfileUI(user);
        
        // Save user to Firestore "Members" list
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            lastSeen: new Date().toISOString(),
            role: "Member"
        }, { merge: true });

        checkConsent(user.uid);
    } else {
        authBtn.innerText = "LOGIN WITH GOOGLE";
        resetProfileUI();
    }
});

// --- REAL-TIME LISTENERS ---

// Listen for Marquee Updates
onSnapshot(doc(db, "settings", "broadcast"), (doc) => {
    if (doc.exists()) {
        marqueeText.innerText = doc.data().text.toUpperCase() + " — ";
    }
});

// Listen for All Members (The "Real hints" part)
onSnapshot(collection(db, "users"), (snapshot) => {
    userLedgerBody.innerHTML = "";
    document.getElementById('user-count').innerText = snapshot.size;
    
    snapshot.forEach((userDoc) => {
        const data = userDoc.data();
        userLedgerBody.innerHTML += `
            <tr class="border-b border-white/5 hover:bg-white/5 transition">
                <td class="py-4 flex items-center gap-3">
                    <img src="${data.photo}" class="w-6 h-6 rounded-full border border-zinc-700">
                    <span class="font-bold">${data.name || 'Anonymous'}</span>
                </td>
                <td class="py-4 font-mono text-[10px] text-zinc-500">${userDoc.id.substring(0, 8)}...</td>
                <td class="py-4 text-right">
                    <span class="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 font-bold uppercase">${data.role}</span>
                </td>
            </tr>
        `;
    });
});

// --- UI FUNCTIONS ---

window.showSection = (id) => {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`view-${id}`).classList.remove('hidden');
};

function updateUserProfileUI(user) {
    document.getElementById('profile-username').innerText = user.displayName.toUpperCase();
    document.getElementById('profile-email').innerText = user.email;
    const img = document.getElementById('profile-img');
    img.src = user.photoURL;
    img.classList.remove('hidden');
    document.getElementById('profile-icon-placeholder').classList.add('hidden');
}

function resetProfileUI() {
    document.getElementById('profile-username').innerText = "GUEST_USER";
    document.getElementById('profile-img').classList.add('hidden');
    document.getElementById('profile-icon-placeholder').classList.remove('hidden');
}

// Staff Marquee Update
document.getElementById('update-marquee-btn').onclick = async () => {
    const text = document.getElementById('marquee-input').value;
    if (text) {
        await updateDoc(doc(db, "settings", "broadcast"), { text: text });
        alert("Broadcast Updated!");
    }
};

// Consent Logic
const checkConsent = (uid) => {
    if (!localStorage.getItem(`consent_${uid}`)) {
        document.getElementById('consent-modal').classList.remove('hidden');
    } else {
        setConsentVerified();
    }
};

document.getElementById('submit-consent-btn').onclick = () => {
    if (document.getElementById('consent-check').checked) {
        localStorage.setItem(`consent_${auth.currentUser.uid}`, 'true');
        document.getElementById('consent-modal').classList.add('hidden');
        setConsentVerified();
    }
};

function setConsentVerified() {
    const badge = document.getElementById('consent-badge');
    badge.innerText = "VERIFIED";
    badge.className = "px-3 py-1 rounded-full text-xs font-black uppercase bg-green-500/20 text-green-400 border border-green-500/50";
}

// Generate Hubs
const grid = document.getElementById('hubs-grid');
for(let i=0; i<8; i++) {
    const code = Math.floor(100000 + Math.random() * 900000);
    grid.innerHTML += `
        <div class="glass p-6 rounded-3xl border-white/5 hover:border-yellow-500 transition cursor-pointer group">
            <p class="text-zinc-500 font-black text-[10px] mb-1">HUB CODE</p>
            <h4 class="text-2xl font-black italic tracking-tighter">${code}</h4>
            <div class="mt-4 flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span class="text-[10px] font-black text-zinc-400 uppercase">Secure</span>
            </div>
        </div>
    `;
}

lucide.createIcons();
