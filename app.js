// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    initNavbar();
    initTypingEffect();
    initActiveLinks();
    initContactForm();
});

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initNavbar() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            
            // Toggle icon between hamburger and close
            const icon = menuToggle.querySelector('i');
            if (icon) {
                const isOpen = navMenu.classList.contains('open');
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                lucide.createIcons({
                    attrs: {
                        class: 'lucide-icon'
                    },
                    nameAttr: 'data-lucide',
                    icons: {
                        x: lucide.icons.x,
                        menu: lucide.icons.menu
                    }
                });
            }
        });
        
        // Close menu when clicking navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // Shrink header on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   Dynamic Typing Effect
   ========================================================================== */
function initTypingEffect() {
    const textSpan = document.querySelector('.hero-title .gradient-text');
    if (!textSpan) return;

    const words = ["Build", "Ship", "Create", "Code"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster when erasing
        } else {
            textSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // slower when typing
        }

        // Handle word switching
        if (!isDeleting && charIndex === currentWord.length) {
            // Wait before starting to erase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // brief pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start effect
    setTimeout(type, 1000);
}

/* ==========================================================================
   Active Navigation Links on Scroll
   ========================================================================== */
function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for sticky header
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   Contact Form Submission (Web3Forms)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (form && submitBtn && formStatus) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if access key is configured
            const accessKey = form.querySelector('input[name="access_key"]').value;
            if (accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
                formStatus.className = 'form-status error';
                formStatus.textContent = '⚠️ Contact form not yet configured. Please set up your Web3Forms access key.';
                return;
            }

            // UI state updates
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('span');
            const originalText = btnText.textContent;
            btnText.textContent = "Sending...";

            formStatus.className = "form-status";
            formStatus.textContent = "";

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                submitBtn.disabled = false;
                btnText.textContent = originalText;

                if (data.success) {
                    formStatus.classList.add('success');
                    formStatus.textContent = "Message sent! I'll get back to you shortly.";
                    form.reset();
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (error) {
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                formStatus.classList.add('error');
                formStatus.textContent = "Something went wrong. Please email me directly at Lucaschan2004@gmail.com";
            }

            // Clear status message after 8 seconds
            setTimeout(() => {
                formStatus.textContent = "";
                formStatus.className = "form-status";
            }, 8000);
        });
    }
}
