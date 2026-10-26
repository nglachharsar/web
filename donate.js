// ==========================================
// donate.js - दान पेज और प्रीमियम रसीद (PDF) का लॉजिक
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const donationForm = document.getElementById('donationForm');
    
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. फॉर्म से डेटा प्राप्त करें
            const name = document.getElementById('donorName').value.trim();
            const amount = parseFloat(document.getElementById('donationAmount').value);
            const message = document.getElementById('donationMessage').value.trim();
            
            // वैलिडेशन: अगर नाम खाली है या राशि 0 या उससे कम है
            if (name === "" || isNaN(amount) || amount <= 0) {
                alert("कृपया सही नाम और दान राशि दर्ज करें!");
                return;
            }

            // तारीख और समय को अच्छे फॉर्मेट में निकालें
            const now = new Date();
            const dateStr = now.toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            const timeStr = now.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });
            const fullDate = `${dateStr} को ${timeStr} बजे`;

            // यूनिक रसीद नंबर बनाएं (जैसे: NGL-8451239)
            const receiptNo = "NGL-" + Math.floor(Math.random() * 9000000 + 1000000);

            const status = document.getElementById('formStatus');
            const submitBtn = donationForm.querySelector('button[type="submit"]');
            
            // बटन को डिसेबल करें
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> रसीद तैयार हो रही है...';
            status.innerText = "";
            status.classList.add('hidden');

            // 2. फायरबेस में दान का डेटा सेव करें
            db.collection('donations').add({ 
                name: name, 
                amount: Number(amount), 
                message: message || "कोई संदेश नहीं",
                receiptNo: receiptNo,
                timestamp: firebase.firestore.FieldValue.serverTimestamp() 
            })
            .then(() => {
                // 3. डेटा सेव होने के बाद PDF रसीद जनरेट करें
                generateReceipt(name, amount, message, fullDate, receiptNo);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                status.innerText = "❌ दान दर्ज करने में त्रुटि: " + error.message;
                status.className = "text-center font-bold mt-4 text-red-500 block";
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'दान दर्ज करें & रसीद पाएं';
            });
        });
    }
});

// ==========================================
// 4. PDF रसीद बनाने का फंक्शन
// ==========================================
function generateReceipt(name, amount, message, fullDate, receiptNo) {
    const status = document.getElementById('formStatus');
    const submitBtn = document.querySelector('#donationForm button[type="submit"]');

    // रसीद टेम्पलेट में डेटा भरें
    document.getElementById('receipt-no').innerText = receiptNo;
    document.getElementById('receipt-date').innerText = fullDate;
    document.getElementById('receipt-name').innerText = name;
    document.getElementById('receipt-amount').innerText = amount;
    document.getElementById('receipt-message').innerText = message || "कोई संदेश नहीं";

    const receiptTemplate = document.getElementById('receipt-template');
    
    // टेम्पलेट को थोड़ी देर के लिए दिखाएं (ताकि html2canvas इसे पकड़ सके)
    receiptTemplate.classList.remove('hidden');
    receiptTemplate.style.position = 'absolute';
    receiptTemplate.style.left = '-9999px'; // स्क्रीन से बाहर रखें

    // सुनिश्चित करें कि सभी इमेजेज (लोगो, स्टाम्प) लोड हो चुकी हैं, तभी PDF बने
    const images = receiptTemplate.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;

    // अगर कोई इमेज नहीं है, तो सीधे PDF बनाएं
    if (totalImages === 0) {
        createPDF(receiptTemplate, name, amount, message, fullDate, receiptNo, status, submitBtn);
        return;
    }

    // इमेज लोड होने का इंतजार करें
    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
            if (loadedImages === totalImages) {
                createPDF(receiptTemplate, name, amount, message, fullDate, receiptNo, status, submitBtn);
            }
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    createPDF(receiptTemplate, name, amount, message, fullDate, receiptNo, status, submitBtn);
                }
            });
            // अगर इमेज लोड होने में एरर आए, तो भी आगे बढ़ें
            img.addEventListener('error', () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    createPDF(receiptTemplate, name, amount, message, fullDate, receiptNo, status, submitBtn);
                }
            });
        }
    });
}

// ==========================================
// 5. असली PDF जनरेट करने वाला फंक्शन
// ==========================================
function createPDF(receiptTemplate, name, amount, message, fullDate, receiptNo, status, submitBtn) {
    // html2canvas का उपयोग करके टेम्पलेट को इमेज में बदलें
    // scale: 2 का मतलब है हाई क्वालिटी (HD) रसीद
    html2canvas(receiptTemplate, { scale: 2, useCORS: true }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 पेज की चौड़ाई (Full width)
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Receipt_${name.replace(/\s+/g, '_')}_${receiptNo}.pdf`);

        // काम होने के बाद टेम्पलेट वापस छिपा दें
        receiptTemplate.classList.add('hidden');
        
        // सक्सेस मैसेज दिखाएं और फॉर्म रीसेट करें
        status.innerText = "✅ दान सफलतापूर्वक दर्ज हो गया! आपकी रसीद डाउनलोड हो गई है।";
        status.className = "text-center font-bold mt-4 text-green-500 block";
        
        document.getElementById('donationForm').reset();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'दान दर्ज करें & रसीद पाएं';
        
    }).catch(err => {
        console.error("PDF Error: ", err);
        status.innerText = "✅ दान दर्ज हो गया, लेकिन रसीद डाउनलोड करने में समस्या आई।";
        status.className = "text-center font-bold mt-4 text-yellow-500 block";
        
        receiptTemplate.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'दान दर्ज करें & रसीद पाएं';
    });
}