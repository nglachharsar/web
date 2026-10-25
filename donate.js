// ==========================================
// donate.js - दान पेज और रसीद (PDF) का लॉजिक
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const donationForm = document.getElementById('donationForm');
    
    // अगर पेज पर दान फॉर्म मौजूद है, तभी कोड चलेगा
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. फॉर्म से डेटा प्राप्त करें
            const name = document.getElementById('donorName').value.trim();
            const amount = document.getElementById('donationAmount').value;
            const message = document.getElementById('donationMessage').value.trim();
            const date = new Date().toLocaleDateString('hi-IN');
            const status = document.getElementById('formStatus');

            // 2. बटन को डिसेबल करें और स्टेटस दिखाएं
            const submitBtn = donationForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> रसीद बन रही है...';
            
            status.innerText = "";
            status.classList.add('hidden');

            // 3. फायरबेस में दान का डेटा सेव करें
            db.collection('donations').add({ 
                name: name, 
                amount: Number(amount), 
                message: message || "कोई संदेश नहीं",
                timestamp: firebase.firestore.FieldValue.serverTimestamp() 
            })
            .then(() => {
                // 4. डेटा सेव होने के बाद PDF रसीद जनरेट करें
                generateReceipt(name, amount, message, date);
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
// 5. PDF रसीद बनाने का फंक्शन
// ==========================================
function generateReceipt(name, amount, message, date) {
    const status = document.getElementById('formStatus');
    const submitBtn = document.querySelector('#donationForm button[type="submit"]');

    // रसीद टेम्पलेट में डेटा भरें (यह टेम्पलेट donate.html में छिपा हुआ है)
    document.getElementById('receipt-name').innerText = name;
    document.getElementById('receipt-amount').innerText = amount;
    document.getElementById('receipt-message').innerText = message || "कोई संदेश नहीं";
    document.getElementById('receipt-date').innerText = date;

    const receiptTemplate = document.getElementById('receipt-template');
    
    // टेम्पलेट को थोड़ी देर के लिए दिखाएं (ताकि html2canvas इसे पकड़ सके)
    receiptTemplate.classList.remove('hidden');
    receiptTemplate.style.position = 'absolute';
    receiptTemplate.style.left = '-9999px'; // स्क्रीन से बाहर रखें

    // html2canvas का उपयोग करके टेम्पलेट को इमेज में बदलें
    html2canvas(receiptTemplate, { scale: 2 }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // A4 पेज की चौड़ाई (मार्जिन छोड़कर)
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Receipt_${name.replace(/\s+/g, '_')}.pdf`);

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