// ==========================================
// app.js - होम पेज का मुख्य लॉजिक
// ==========================================

// 1. पेज लोडर (Page Loader) को छिपाना
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { 
            loader.style.display = 'none'; 
        }, 500); // 500ms का स्मूथ फेड-आउट
    }
});

// 2. नोटिस पॉपअप के एलिमेंट्स
const noticePopup = document.getElementById('notice-popup');
const noticeOverlay = document.getElementById('notice-overlay');
const noticeMinimized = document.getElementById('notice-minimized');
const noticeText = document.getElementById('notice-text');

// 3. फायरबेस से डेटा लोड करना (नोटिस और न्यूज़)
async function loadSiteData() {
    try {
        const docSnap = await db.collection("siteContent").doc("mainPage").get();
        
        if (docSnap.exists) {
            const data = docSnap.data();
            
            // --- A. नोटिस पॉपअप लॉजिक ---
            if (data.notice && data.notice.trim() !== "") {
                // अगर एडमिन ने नोटिस डाला है
                if (noticeText) noticeText.innerHTML = data.notice; // HTML सपोर्ट करता है
                if (noticePopup) noticePopup.style.setProperty('display', 'block', 'important');
                if (noticeOverlay) noticeOverlay.style.setProperty('display', 'block', 'important');
                if (noticeMinimized) noticeMinimized.style.display = 'none';
            } else {
                // अगर कोई नोटिस नहीं है, तो सब कुछ छिपा रहेगा
                if (noticePopup) noticePopup.style.display = 'none';
                if (noticeOverlay) noticeOverlay.style.display = 'none';
                if (noticeMinimized) noticeMinimized.style.display = 'none';
            }

            // --- B. मुख्य पेज का कंटेंट (समाचार) ---
            const pageContent = document.getElementById('page-content');
            if (pageContent && data.content) {
                pageContent.innerHTML = data.content;
            } else if (pageContent) {
                pageContent.innerHTML = "<p class='text-gray-400'>अभी कोई समाचार उपलब्ध नहीं है।</p>";
            }
        } else {
            console.log("डेटाबेस में कोई डेटा नहीं मिला।");
        }
    } catch (error) {
        console.error("डेटा लोड करने में त्रुटि: ", error);
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.innerHTML = "<p class='text-red-400'>कंटेंट लोड करने में समस्या आ रही है।</p>";
        }
    }
}

// 4. नोटिस को बंद करना (घंटी में बदल जाएगा)
function closeNotice() {
    if (noticePopup) noticePopup.style.setProperty('display', 'none', 'important');
    if (noticeOverlay) noticeOverlay.style.setProperty('display', 'none', 'important');
    if (noticeMinimized) noticeMinimized.style.display = 'flex'; // घंटी दिखाएं
}

// 5. नोटिस को फिर से खोलना (घंटी दबाने पर)
function openNotice() {
    if (noticePopup) noticePopup.style.setProperty('display', 'block', 'important');
    if (noticeOverlay) noticeOverlay.style.setProperty('display', 'block', 'important');
    if (noticeMinimized) noticeMinimized.style.display = 'none'; // घंटी छिपाएं
}

// 6. इवेंट लिसनर्स
if (noticeOverlay) {
    noticeOverlay.addEventListener('click', closeNotice);
}

// पेज लोड होते ही डेटा मंगाएं
document.addEventListener('DOMContentLoaded', loadSiteData);

// 7. फुटर में साल (Year) अपडेट करना
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
}