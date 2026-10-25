// ==========================================
// header.js - सभी पेजों के लिए कॉमन हेडर
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('header-container');
    
    if (headerContainer) {
        headerContainer.innerHTML = `
        <!-- Top Bar (Contact Info) -->
        <div class="bg-gray-900 border-b border-gray-800 text-xs sm:text-sm text-gray-400 py-2 px-4 text-center hidden sm:block">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <span><i class="fas fa-phone-alt text-gold mr-2"></i> हेल्पलाइन: <a href="tel:+919216626445" class="hover:text-gold transition">+91 92166 26445</a></span>
                <span><i class="fas fa-envelope text-gold mr-2"></i> ईमेल: <a href="mailto:info@ngss.mywire.org" class="hover:text-gold transition">info@ngss.mywire.org</a></span>
            </div>
        </div>

        <!-- Main Navigation -->
        <header class="bg-main/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-custom">
            <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                
                <!-- Logo Section -->
                <a href="index.html" class="flex items-center gap-3 group">
                    <img src="ngl.svg" alt="Logo" class="h-12 w-12 sm:h-14 sm:w-14 bg-white rounded-full p-1 border-2 border-gold group-hover:scale-105 transition" onerror="this.src='ngl.png'">
                    <div>
                        <h1 class="text-xl sm:text-2xl font-bold text-gold leading-tight">नंदी गौशाला</h1>
                        <p class="text-xs text-gray-400 font-medium">लछारसर, रतनगढ़ (चूरू)</p>
                    </div>
                </a>

                <!-- Desktop Menu -->
                <nav class="hidden md:flex items-center gap-8 font-semibold text-white">
                    <a href="index.html" class="hover:text-gold transition">होम</a>
                    <a href="about.html" class="hover:text-gold transition">हमारे बारे में</a>
                    <a href="gallery.html" class="hover:text-gold transition">गैलरी</a>
                    <a href="what-we-do.html" class="hover:text-gold transition">हमारे कार्य</a>
                    <a href="contact.html" class="hover:text-gold transition">संपर्क</a>
                </nav>

                <!-- Donate Button (Desktop) -->
                <div class="hidden md:block">
                    <a href="donate.html" class="bg-accent text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-700 shadow-lg hover:-translate-y-0.5 transition flex items-center gap-2">
                        <i class="fas fa-heart"></i> दान करें
                    </a>
                </div>

                <!-- Mobile Menu Button (Hamburger) -->
                <button id="mobile-menu-btn" class="md:hidden text-white text-2xl focus:outline-none p-2">
                    <i class="fas fa-bars"></i>
                </button>
            </div>

            <!-- Mobile Menu (Hidden by default) -->
            <div id="mobile-menu" class="hidden md:hidden bg-gray-900 border-t border-gray-800 absolute w-full left-0">
                <nav class="flex flex-col p-4 space-y-4 font-semibold text-gray-300">
                    <a href="index.html" class="hover:text-gold border-b border-gray-800 pb-2">होम</a>
                    <a href="about.html" class="hover:text-gold border-b border-gray-800 pb-2">हमारे बारे में</a>
                    <a href="gallery.html" class="hover:text-gold border-b border-gray-800 pb-2">गैलरी</a>
                    <a href="what-we-do.html" class="hover:text-gold border-b border-gray-800 pb-2">हमारे कार्य</a>
                    <a href="contact.html" class="hover:text-gold border-b border-gray-800 pb-2">संपर्क</a>
                    <a href="donate.html" class="bg-accent text-white text-center px-4 py-2 rounded-lg mt-2 hover:bg-orange-700 transition">दान करें 🙏</a>
                </nav>
            </div>
        </header>
        `;

        // मोबाइल मेन्यू टॉगल (खोलने/बंद करने) का लॉजिक
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                
                // आइकॉन बदलें (बरमूडा से क्रॉस में)
                const icon = mobileMenuBtn.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            });
        }
    }
});