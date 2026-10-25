# नंदी गौशाला, लछारसर - वेबसाइट

यह नंदी गौशाला (NANDI GO SEWA SANSTHAN LACHHARSAR) की आधिकारिक वेबसाइट है।

## 🛠️ तकनीक (Tech Stack)
- **Frontend:** HTML5, Tailwind CSS (CDN), JavaScript (Vanilla)
- **Backend/Database:** Firebase (Firestore & Authentication)
- **PDF Generation:** jsPDF & html2canvas (दान रसीद के लिए)

## 📁 फाइल स्ट्रक्चर (File Structure)
- `index.html` - होम पेज
- `about.html` - हमारे बारे में
- `donate.html` - दान पेज (QR और रसीद)
- `gallery.html` - फोटो गैलरी
- `contact.html` - संपर्क फॉर्म और मैप्स
- `privacy.html`, `terms.html`, `disclaimer.html` - कानूनी पेज
- `rdx.html` - एडमिन पैनल (सिर्फ एडमिन के लिए)
- `style.css` - सारा डिज़ाइन
- `header.js`, `footer.js` - कॉमन हेडर और फुटर
- `app.js`, `donate.js`, `admin.js` - पेजों के लॉजिक
- `firebase-config.js` - फायरबेस कॉन्फ़िगरेशन

## 🔐 एडमिन लॉगिन
एडमिन पैनल (`rdx.html`) खोलने के लिए Google लॉगिन का उपयोग करें। सिर्फ अधिकृत ईमेल ही लॉगिन कर सकता है।

## 🚀 होस्टिंग (Hosting)
इसे किसी भी स्टेटिक होस्टिंग (Firebase Hosting, Netlify, Vercel, GitHub Pages) पर होस्ट किया जा सकता है।