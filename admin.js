const ADMIN_EMAIL = "ngl.raj.in@gmail.com"; // अपनी सही ईमेल यहाँ डालें

const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const userEmailSpan = document.getElementById('user-email');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginMsg = document.getElementById('login-msg');

const tabContentBtn = document.getElementById('tab-content');
const tabDonationsBtn = document.getElementById('tab-donations');
const contentTab = document.getElementById('content-tab');
const donationsTab = document.getElementById('donations-tab');

loginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => alert(err.message));
});
logoutBtn.addEventListener('click', () => auth.signOut());

auth.onAuthStateChanged(async (user) => {
    if (user && user.email === ADMIN_EMAIL) {
        loginSection.classList.add('hidden');
        adminSection.classList.remove('hidden');
        userEmailSpan.innerText = user.email;
        loadContentData();
    } else {
        loginSection.classList.remove('hidden');
        adminSection.classList.add('hidden');
        if (user) { loginMsg.innerText = "आपके पास एडमिन एक्सेस नहीं है!"; auth.signOut(); }
    }
});

tabContentBtn.addEventListener('click', () => {
    contentTab.classList.remove('hidden'); donationsTab.classList.add('hidden');
    tabContentBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition";
    tabDonationsBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition";
});
tabDonationsBtn.addEventListener('click', () => {
    contentTab.classList.add('hidden'); donationsTab.classList.remove('hidden');
    tabDonationsBtn.className = "px-6 py-3 font-bold text-orange-600 border-b-2 border-orange-600 transition";
    tabContentBtn.className = "px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition";
    loadDonationsData();
});

async function loadContentData() {
    const docSnap = await db.collection("siteContent").doc("mainPage").get();
    if (docSnap.exists) {
        document.getElementById('noticeInput').value = docSnap.data().notice || "";
        document.getElementById('contentInput').value = docSnap.data().content || "";
    }
}

document.getElementById('adminForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('save-msg');
    msg.innerText = "सेव हो रहा है..."; msg.className = "font-bold mt-2 text-blue-600";
    await db.collection("siteContent").doc("mainPage").set({
        notice: document.getElementById('noticeInput').value,
        content: document.getElementById('contentInput').value,
        lastUpdated: new Date()
    });
    msg.innerText = "✅ सफलतापूर्वक पब्लिश हो गया!"; msg.className = "font-bold mt-2 text-green-600";
});

async function loadDonationsData() {
    const tbody = document.getElementById('donations-list');
    tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center">लोड हो रहा है...</td></tr>`;
    const snapshot = await db.collection("donations").orderBy("timestamp", "desc").get();
    tbody.innerHTML = "";
    if (snapshot.empty) { tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center">कोई दान नहीं मिला।</td></tr>`; return; }
    snapshot.forEach(doc => {
        const data = doc.data();
        let date = data.timestamp ? data.timestamp.toDate().toLocaleDateString('hi-IN') : "N/A";
        tbody.innerHTML += `<tr class="border-b hover:bg-gray-50"><td class="p-4">${date}</td><td class="p-4 font-bold">${data.name}</td><td class="p-4 text-green-600 font-bold">₹${data.amount}</td><td class="p-4 text-gray-600">${data.message || '-'}</td></tr>`;
    });
}