// Firebase Configuration
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

// Elements
const noticePopup = document.getElementById('notice-popup');
const noticeOverlay = document.getElementById('notice-overlay');
const noticeMinimized = document.getElementById('notice-minimized');
const noticeText = document.getElementById('notice-text');

// Load Dynamic Data from Firestore
async function loadSiteData() {
    try {
        const docSnap = await db.collection("siteContent").doc("mainPage").get();
        if (docSnap.exists) {
            const data = docSnap.data();
            
            // Set Notice (Supports Custom HTML)
            if (data.notice && data.notice.trim() !== "") {
                noticeText.innerHTML = data.notice; 
                noticePopup.style.display = 'block';
                noticeOverlay.style.display = 'block';
            }

            // Set Main Page Content
            const pageContent = document.getElementById('page-content');
            if (pageContent && data.content) {
                pageContent.innerHTML = data.content;
            }
        }
    } catch (error) { 
        console.error("Error loading data: ", error); 
    }
}

// Notice Popup Logic
function closeNotice() {
    noticePopup.style.display = 'none';
    noticeOverlay.style.display = 'none';
    noticeMinimized.style.display = 'flex';
}

function openNotice() {
    noticePopup.style.display = 'block';
    noticeOverlay.style.display = 'block';
    noticeMinimized.style.display = 'none';
}

// Event Listeners
noticeOverlay?.addEventListener('click', closeNotice);
document.addEventListener('DOMContentLoaded', loadSiteData);

// Current Year in Footer
document.getElementById('year')?.innerText = new Date().getFullYear();