// ==========================================
// admin.js - एडमिन पैनल का पूरा लॉजिक
// ==========================================

const ADMIN_EMAIL = "ngl.raj.in@gmail.com"; // <--- यहाँ अपनी सही ईमेल डालें

// UI एलिमेंट्स
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const userEmailSpan = document.getElementById('user-email');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginMsg = document.getElementById('login-msg');

// टैब्स
const tabContentBtn = document.getElementById('tab-content');
const tabDonationsBtn = document.getElementById('tab-donations');
const tabMessagesBtn = document.getElementById('tab-messages');

const contentTab = document.getElementById('content-tab');
const donationsTab = document.getElementById('donations-tab');
const messagesTab = document.getElementById('messages-tab');

// फॉर्म और इनपुट्स
const adminForm = document.getElementById('adminForm');
const noticeInput = document.getElementById('noticeInput');
const contentInput = document.getElementById('contentInput');
const saveMsg = document.getElementById('save-msg');

// ==========================================
// 1. लॉगिन और लॉगआउट लॉजिक
// ==========================================
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch((error) => {
            console.error("Login Error:", error);
            if (loginMsg) loginMsg.innerText = "लॉगिन विफल: " + error.message;
        });
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut();
    });
}

// Auth State
auth.onAuthStateChanged(async (user) => {
    if (user && user.email === ADMIN_EMAIL) {
        if (loginSection) loginSection.classList.add('hidden');
        if (adminSection) adminSection.classList.remove('hidden');
        if (userEmailSpan) userEmailSpan.innerText = "लॉगिन: " + user.email;
        
        await loadContentData();
    } else {
        if (loginSection) loginSection.classList.remove('hidden');
        if (adminSection) adminSection.classList.add('hidden');
        
        if (user && user.email !== ADMIN_EMAIL) {
            if (loginMsg) loginMsg.innerText = "आपके पास एडमिन एक्सेस नहीं है!";
            auth.signOut();
        }
    }
});

// ==========================================
// 2. टैब स्विचिंग (कंटेंट, दान और मैसेज)
// ==========================================
function hideAllTabs() {
    contentTab.classList.add('hidden');
    donationsTab.classList.add('hidden');
    messagesTab.classList.add('hidden');
    
    // टैब बटन का कलर रीसेट करें
    tabContentBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition";
    tabDonationsBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition";
    tabMessagesBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition";
}

if (tabContentBtn) {
    tabContentBtn.addEventListener('click', () => {
        hideAllTabs();
        contentTab.classList.remove('hidden');
        tabContentBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition";
    });

    tabDonationsBtn.addEventListener('click', () => {
        hideAllTabs();
        donationsTab.classList.remove('hidden');
        tabDonationsBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition";
        loadDonationsData();
    });

    tabMessagesBtn.addEventListener('click', () => {
        hideAllTabs();
        messagesTab.classList.remove('hidden');
        tabMessagesBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition";
        loadMessagesData();
    });
}

// ==========================================
// 3. कंटेंट लोड और सेव करना
// ==========================================
async function loadContentData() {
    try {
        const docSnap = await db.collection("siteContent").doc("mainPage").get();
        if (docSnap.exists) {
            const data = docSnap.data();
            if (noticeInput) noticeInput.value = data.notice || "";
            if (contentInput) contentInput.value = data.content || "";
        }
    } catch (error) {
        console.error("Error loading content: ", error);
    }
}

if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (saveMsg) {
            saveMsg.innerText = "सेव हो रहा है...";
            saveMsg.className = "font-bold mt-4 text-center text-blue-600";
        }

        try {
            await db.collection("siteContent").doc("mainPage").set({
                notice: noticeInput.value,
                content: contentInput.value,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            if (saveMsg) {
                saveMsg.innerText = "✅ सफलतापूर्वक पब्लिश हो गया!";
                saveMsg.className = "font-bold mt-4 text-center text-green-600";
                setTimeout(() => { saveMsg.innerText = ""; }, 3000);
            }
        } catch (error) {
            if (saveMsg) {
                saveMsg.innerText = "❌ त्रुटि: " + error.message;
                saveMsg.className = "font-bold mt-4 text-center text-red-600";
            }
        }
    });
}

// ==========================================
// 4. दान की लिस्ट लोड करना
// ==========================================
async function loadDonationsData() {
    const tbody = document.getElementById('donations-list');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">लोड हो रहा है...</td></tr>`;

    try {
        // यहाँ orderBy हटा दिया गया है ताकि इंडेक्स की समस्या न आए
        const snapshot = await db.collection("donations").get();
        tbody.innerHTML = "";
        
        if (snapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">कोई दान नहीं मिला।</td></tr>`;
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            // अगर टाइमस्टैम्प है तो दिखाएं, नहीं तो 'N/A'
            let dateStr = "N/A";
            if (data.timestamp) {
                try {
                    dateStr = data.timestamp.toDate().toLocaleDateString('hi-IN');
                } catch(e) { console.log("Date error", e); }
            }
            
            tbody.innerHTML += `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="p-4 text-sm text-gray-600">${dateStr}</td>
                    <td class="p-4 font-bold text-gray-800">${data.name}</td>
                    <td class="p-4 font-bold text-green-600">₹${data.amount}</td>
                    <td class="p-4 text-sm text-gray-500">${data.message || '-'}</td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-red-500">त्रुटि: ${error.message}</td></tr>`;
    }
}

// ==========================================
// 5. संपर्क संदेश (Messages) लोड करना
// ==========================================
async function loadMessagesData() {
    const tbody = document.getElementById('messages-list');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-500">लोड हो रहा है...</td></tr>`;

    try {
        // यहाँ भी orderBy हटा दिया गया है
        const snapshot = await db.collection("messages").get();
        tbody.innerHTML = "";
        
        if (snapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-500">कोई संदेश नहीं मिला।</td></tr>`;
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            let dateStr = "N/A";
            if (data.timestamp) {
                try {
                    dateStr = data.timestamp.toDate().toLocaleDateString('hi-IN');
                } catch(e) { console.log("Date error", e); }
            }
            
            tbody.innerHTML += `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="p-4 text-sm text-gray-600">${dateStr}</td>
                    <td class="p-4">
                        <div class="font-bold text-gray-800">${data.name}</div>
                        <div class="text-xs text-blue-600">${data.phone}</div>
                        <div class="text-xs text-gray-500">${data.email || '-'}</div>
                    </td>
                    <td class="p-4 text-sm text-gray-700">${data.message}</td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-red-500">त्रुटि: ${error.message}</td></tr>`;
    }
}