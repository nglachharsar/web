// ==========================================
// admin.js - एडमिन पैनल का पूरा लॉजिक
// ==========================================

// 1. एडमिन की ईमेल आईडी (यहाँ अपनी सही Gmail डालें)
const ADMIN_EMAIL = "ngl.raj.in@gmail.com"; 

// 2. UI एलिमेंट्स को सेलेक्ट करना
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const userEmailSpan = document.getElementById('user-email');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginMsg = document.getElementById('login-msg');

// टैब्स
const tabContentBtn = document.getElementById('tab-content');
const tabDonationsBtn = document.getElementById('tab-donations');
const contentTab = document.getElementById('content-tab');
const donationsTab = document.getElementById('donations-tab');

// फॉर्म और इनपुट्स
const adminForm = document.getElementById('adminForm');
const noticeInput = document.getElementById('noticeInput');
const contentInput = document.getElementById('contentInput');
const saveMsg = document.getElementById('save-msg');

// ==========================================
// 3. लॉगिन और लॉगआउट लॉजिक
// ==========================================
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        // Google पॉपअप खोलें
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

// ==========================================
// 4. यूजर की स्थिति (Auth State) चेक करना
// ==========================================
auth.onAuthStateChanged(async (user) => {
    if (user && user.email === ADMIN_EMAIL) {
        // सही एडमिन लॉगिन है
        if (loginSection) loginSection.classList.add('hidden');
        if (adminSection) adminSection.classList.remove('hidden');
        if (userEmailSpan) userEmailSpan.innerText = "लॉगिन: " + user.email;
        
        // डेटा लोड करें
        await loadContentData();
    } else {
        // कोई लॉगिन नहीं है या गलत ईमेल है
        if (loginSection) loginSection.classList.remove('hidden');
        if (adminSection) adminSection.classList.add('hidden');
        
        if (user && user.email !== ADMIN_EMAIL) {
            if (loginMsg) loginMsg.innerText = "आपके पास एडमिन एक्सेस नहीं है!";
            auth.signOut(); // गलत यूजर को बाहर निकाल दें
        }
    }
});

// ==========================================
// 5. टैब स्विचिंग (कंटेंट और दान लिस्ट के बीच)
// ==========================================
if (tabContentBtn && tabDonationsBtn) {
    tabContentBtn.addEventListener('click', () => {
        contentTab.classList.remove('hidden');
        donationsTab.classList.add('hidden');
        tabContentBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition";
        tabDonationsBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition";
    });

    tabDonationsBtn.addEventListener('click', () => {
        contentTab.classList.add('hidden');
        donationsTab.classList.remove('hidden');
        tabDonationsBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition";
        tabContentBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition";
        loadDonationsData(); // दान लिस्ट लोड करें
    });
}

// ==========================================
// 6. कंटेंट लोड करना (Firestore से)
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

// ==========================================
// 7. कंटेंट सेव करना (Firestore में)
// ==========================================
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
            console.error("Error saving content: ", error);
            if (saveMsg) {
                saveMsg.innerText = "❌ त्रुटि: " + error.message;
                saveMsg.className = "font-bold mt-4 text-center text-red-600";
            }
        }
    });
}

// ==========================================
// 8. दान की लिस्ट लोड करना (Firestore से)
// ==========================================
async function loadDonationsData() {
    const tbody = document.getElementById('donations-list');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">लोड हो रहा है...</td></tr>`;

    try {
        // टाइमस्टैम्प के हिसाब से नए दान सबसे ऊपर (descending order)
        const snapshot = await db.collection("donations").orderBy("timestamp", "desc").get();
        
        tbody.innerHTML = "";
        
        if (snapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">अभी तक कोई दान नहीं आया है।</td></tr>`;
            return;
        }

        // लूप चलाकर सारे दान दिखाएं
        snapshot.forEach(doc => {
            const data = doc.data();
            
            // तारीख फॉर्मेट करें
            let dateStr = "अभी-अभी";
            if (data.timestamp) {
                dateStr = data.timestamp.toDate().toLocaleDateString('hi-IN', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            }
            
            // टेबल रो बनाएं
            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-100 hover:bg-gray-50 transition";
            tr.innerHTML = `
                <td class="p-4 text-sm text-gray-600">${dateStr}</td>
                <td class="p-4 font-bold text-gray-800">${data.name}</td>
                <td class="p-4 font-bold text-green-600">₹${data.amount}</td>
                <td class="p-4 text-sm text-gray-500">${data.message || '-'}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading donations: ", error);
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-red-500">डेटा लोड करने में त्रुटि: ${error.message}</td></tr>`;
    }
}