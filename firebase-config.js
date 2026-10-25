// ==========================================
// firebase-config.js - फायरबेस कॉन्फ़िगरेशन
// ==========================================

// 1. आपके प्रोजेक्ट की डिटेल्स (Firebase Console से)
const firebaseConfig = {
    apiKey: "AIzaSyBg0OOgrnmU5Pzao9YCeIb-DVN-zL_GdRU",
    authDomain: "nglachharsar.firebaseapp.com",
    projectId: "nglachharsar",
    storageBucket: "nglachharsar.firebasestorage.app",
    messagingSenderId: "627559530629",
    appId: "1:627559530629:web:1b1500d07d9afb29c5a9ec"
};

// 2. फायरबेस को इनिशियलाइज़ करें
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase सफलतापूर्वक कनेक्ट हो गया है!");
} else {
    console.log("⚠️ Firebase पहले से कनेक्टेड है।");
}

// 3. डेटाबेस और लॉगिन के वेरिएबल्स बनाएं
// (इन्हीं वेरिएबल्स का इस्तेमाल हम बाकी सभी JS फाइलों में करेंगे)
const db = firebase.firestore();
const auth = firebase.auth();