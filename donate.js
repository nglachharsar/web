const donationForm = document.getElementById('donationForm');
if (donationForm) {
    donationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('donorName').value;
        const amount = document.getElementById('donationAmount').value;
        const message = document.getElementById('donationMessage').value;
        const date = new Date().toLocaleDateString('hi-IN');
        const status = document.getElementById('formStatus');

        status.innerText = "रसीद बन रही है..."; status.className = "text-center font-bold mt-4 text-blue-400 block";

        db.collection('donations').add({ name, amount, message, timestamp: firebase.firestore.FieldValue.serverTimestamp() })
        .then(() => {
            const { jsPDF } = window.jspdf;
            document.getElementById('receipt-name').innerText = name;
            document.getElementById('receipt-amount').innerText = amount;
            document.getElementById('receipt-message').innerText = message || "कोई संदेश नहीं";
            document.getElementById('receipt-date').innerText = date;
            
            const el = document.getElementById('receipt-template');
            el.classList.remove('hidden');
            html2canvas(el).then(canvas => {
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
                pdf.save(`Receipt_${name}.pdf`);
                el.classList.add('hidden');
                status.innerText = "✅ रसीद डाउनलोड हो गई!"; status.className = "text-center font-bold mt-4 text-green-500 block";
                donationForm.reset();
            });
        }).catch(err => {
            status.innerText = "❌ त्रुटि: " + err.message; status.className = "text-center font-bold mt-4 text-red-500 block";
        });
    });
}