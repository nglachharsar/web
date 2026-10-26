// ==========================================
// admin.js - एडमिन पैनल का पूरा लॉजिक (नया और अपडेटेड)
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

// Auth State चेक करना
auth.onAuthStateChanged(async (user) => {
    if (user && user.email === ADMIN_EMAIL) {
        // सही एडमिन लॉगिन है
        if (loginSection) loginSection.classList.add('hidden');
        if (adminSection) adminSection.classList.remove('hidden');
        if (userEmailSpan) userEmailSpan.innerText = "लॉगिन: " + user.email;
        
        await loadContentData();
    } else {
        // गलत यूजर या लॉगआउट
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
    tabContentBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition rounded-t-lg";
    tabDonationsBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition rounded-t-lg";
    tabMessagesBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition rounded-t-lg";
}

if (tabContentBtn) {
    tabContentBtn.addEventListener('click', () => {
        hideAllTabs();
        contentTab.classList.remove('hidden');
        tabContentBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition bg-orange-50 rounded-t-lg";
    });

    tabDonationsBtn.addEventListener('click', () => {
        hideAllTabs();
        donationsTab.classList.remove('hidden');
        tabDonationsBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition bg-orange-50 rounded-t-lg";
        loadDonationsData();
    });

    tabMessagesBtn.addEventListener('click', () => {
        hideAllTabs();
        messagesTab.classList.remove('hidden');
        tabMessagesBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition bg-orange-50 rounded-t-lg";
        loadMessagesData();
    });
}

// ==========================================
// 3. कंटेंट लोड और सेव करना (कस्टम HTML सपोर्ट के साथ)
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
                notice: noticeInput.value, // कस्टम HTML सेव होगा
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
// 4. दान की लिस्ट लोड करना (डिलीट ऑप्शन के साथ)
// ==========================================
async function loadDonationsData() {
    const tbody = document.getElementById('donations-list');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> लोड हो रहा है...</td></tr>`;

    try {
        const snapshot = await db.collection("donations").get();
        tbody.innerHTML = "";
        
        if (snapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">कोई दान नहीं मिला।</td></tr>`;
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            let dateStr = "N/A";
            if (data.timestamp) {
                try {
                    const date = data.timestamp.toDate();
                    dateStr = date.toLocaleDateString('hi-IN') + " <br><span class='text-xs text-gray-400'>" + date.toLocaleTimeString('hi-IN', {hour: '2-digit', minute:'2-digit'}) + "</span>";
                } catch(e) { console.log("Date error", e); }
            }
            
            tbody.innerHTML += `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="p-4 text-sm text-gray-600">${dateStr}</td>
                    <td class="p-4 font-bold text-gray-800">${data.name}</td>
                    <td class="p-4 font-bold text-green-600">₹${data.amount}</td>
                    <td class="p-4 text-sm text-gray-500">${data.message || '-'}</td>
                    <td class="p-4 text-center">
                        <button onclick="deleteRecord('donations', '${doc.id}')" class="text-red-500 hover:text-red-700 transition" title="डिलीट करें">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-red-500">त्रुटि: ${error.message}</td></tr>`;
    }
}

// ==========================================
// 5. संपर्क संदेश (Messages) लोड करना (डिलीट ऑप्शन के साथ)
// ==========================================
async function loadMessagesData() {
    const tbody = document.getElementById('messages-list');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> लोड हो रहा है...</td></tr>`;

    try {
        const snapshot = await db.collection("messages").get();
        tbody.innerHTML = "";
        
        if (snapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">कोई संदेश नहीं मिला।</td></tr>`;
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            let dateStr = "N/A";
            if (data.timestamp) {
                try {
                    const date = data.timestamp.toDate();
                    dateStr = date.toLocaleDateString('hi-IN') + " <br><span class='text-xs text-gray-400'>" + date.toLocaleTimeString('hi-IN', {hour: '2-digit', minute:'2-digit'}) + "</span>";
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
                    <td class="p-4 text-center">
                        <button onclick="deleteRecord('messages', '${doc.id}')" class="text-red-500 hover:text-red-700 transition" title="डिलीट करें">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-red-500">त्रुटि: ${error.message}</td></tr>`;
    }
}

// ==========================================
// 6. डिलीट करने का फंक्शन (नया)
// ==========================================
window.deleteRecord = async function(collectionName, docId) {
    if(confirm("क्या आप वाकई इस रिकॉर्ड को डिलीट करना चाहते हैं? इसे वापस नहीं लाया जा सकता।")) {
        try {
            await db.collection(collectionName).doc(docId).delete();
            alert("✅ रिकॉर्ड सफलतापूर्वक डिलीट हो गया!");
            // डिलीट के बाद लिस्ट को फिर से लोड करें
            if(collectionName === 'donations') loadDonationsData();
            if(collectionName === 'messages') loadMessagesData();
        } catch (error) {
            alert("❌ डिलीट करने में त्रुटि: " + error.message);
        }
    }
}