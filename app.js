// 1. Page Loader Hide
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { 
            loader.style.display = 'none'; 
        }, 500);
    }
});

// 2. Notice Elements
const noticePopup = document.getElementById('notice-popup');
const noticeOverlay = document.getElementById('notice-overlay');
const noticeMinimized = document.getElementById('notice-minimized');
const noticeText = document.getElementById('notice-text');

// 3. Load Dynamic Data
async function loadSiteData() {
    try {
        const docSnap = await db.collection("siteContent").doc("mainPage").get();
        if (docSnap.exists) {
            const data = docSnap.data();
            
            // Notice Popup Logic
            if (data.notice && data.notice.trim() !== "") {
                if (noticeText) noticeText.innerHTML = data.notice;
                if (noticePopup) noticePopup.style.setProperty('display', 'block', 'important');
                if (noticeOverlay) noticeOverlay.style.setProperty('display', 'block', 'important');
                if (noticeMinimized) noticeMinimized.style.display = 'none';
            } else {
                if (noticeMinimized) noticeMinimized.style.display = 'none';
            }

            // News Content
            const pageContent = document.getElementById('page-content');
            if (pageContent && data.content) {
                pageContent.innerHTML = data.content;
            }
        }
    } catch (error) {
        console.error("Error loading data: ", error);
    }
}

// 4. Open/Close Functions
function closeNotice() {
    if (noticePopup) noticePopup.style.setProperty('display', 'none', 'important');
    if (noticeOverlay) noticeOverlay.style.setProperty('display', 'none', 'important');
    if (noticeMinimized) noticeMinimized.style.display = 'flex';
}

function openNotice() {
    if (noticePopup) noticePopup.style.setProperty('display', 'block', 'important');
    if (noticeOverlay) noticeOverlay.style.setProperty('display', 'block', 'important');
    if (noticeMinimized) noticeMinimized.style.display = 'none';
}

// 5. Event Listeners
if (noticeOverlay) noticeOverlay.addEventListener('click', closeNotice);
document.addEventListener('DOMContentLoaded', loadSiteData);

// Footer Year Update
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.innerText = new Date().getFullYear();