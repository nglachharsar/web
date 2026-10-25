const firebaseConfig = {
    apiKey: "AIzaSyBg0OOgrnmU5Pzao9YCeIb-DVN-zL_GdRU",
    authDomain: "nglachharsar.firebaseapp.com",
    projectId: "nglachharsar",
    storageBucket: "nglachharsar.firebasestorage.app",
    messagingSenderId: "627559530629",
    appId: "1:627559530629:web:1b1500d07d9afb29c5a9ec"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth(); // यह लाइन अब काम करेगी क्योंकि हमने HTML में auth लाइब्रेरी जोड़ी है