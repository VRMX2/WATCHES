// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Google Sheets Web App URL (Replace this with your actual URL)
const scriptURL = 'https://script.google.com/macros/s/AKfycbwtRcKvKZYbfpsjNPFxr9P-f8E0zltAcAs6dCcCb6Qhi3h6OeZ9tPIqn8HLOtrhhR7w/exec';
const purchaseForm = document.getElementById('purchase-form');

if (purchaseForm) {
    purchaseForm.addEventListener('submit', e => {
        e.preventDefault();

        const btn = purchaseForm.querySelector('.submit-btn');
        const originalText = btn.innerHTML;

        // Show loading state
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تأكيد الطلب...';
        btn.disabled = true;

        // Build URL-encoded data (more compatible with Google Apps Script)
        const params = new URLSearchParams();
        params.append('fullname', document.getElementById('fullname').value);
        params.append('phone', document.getElementById('phone').value);
        params.append('wilaya', document.getElementById('wilaya').options[document.getElementById('wilaya').selectedIndex].text);
        
        const baladiyaEl = document.getElementById('baladiya');
        let baladiyaVal = baladiyaEl.value;
        if (baladiyaEl.tagName === 'SELECT' && baladiyaEl.selectedIndex >= 0) {
            baladiyaVal = baladiyaEl.options[baladiyaEl.selectedIndex].text;
        }
        params.append('baladiya', baladiyaVal);
        
        let offerSelectElem = document.getElementById('offer-select');
        let offerText = offerSelectElem ? offerSelectElem.options[offerSelectElem.selectedIndex].text : '';
        params.append('offer', offerText);
        
        let selectedModels = [];
        document.querySelectorAll('.model-select').forEach((sel) => {
            if (sel.closest('.input-group').style.display !== 'none' && sel.selectedIndex > 0) {
                selectedModels.push(sel.options[sel.selectedIndex].text);
            }
        });
        params.append('model', selectedModels.join(' + '));

        fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
            mode: 'no-cors'
        })
            .then(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> تم تأكيد طلبك بنجاح!';
                btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                setTimeout(() => {
                    purchaseForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    alert('شكراً لك! تم استلام طلبك وسيتم التواصل معك قريباً.');
                }, 2000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> حدث خطأ، يرجى المحاولة مرة أخرى';
                btn.style.background = '#e74c3c';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            });
    });
}

// Scroll Animations (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            observer.unobserve(entry.target); // Run once
        }
    });
}, observerOptions);

// Observe all section headers and cards
document.querySelectorAll('.section-header, .model-card, .detail-box, .occasion-card, .review-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add CSS class for animation via JS
document.head.insertAdjacentHTML('beforeend', `
<style>
    .animate-on-scroll {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
</style>
`);

// Model Selection
document.querySelectorAll('.select-model-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const model = this.getAttribute('data-model');
        const select = document.getElementById('model-select-1');
        if (select) {
            select.value = model;
        }

        // Scroll to order form
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Optional: highlight the select element briefly
            select.style.transition = 'box-shadow 0.3s';
            select.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.4)';
            setTimeout(() => {
                select.style.boxShadow = 'none';
            }, 1500);
        }
    });
});


// =====================
// Slideshow Logic
// =====================
const slides = document.querySelectorAll('.slide');
const dotsWrapper = document.getElementById('slide-dots');
let currentSlide = 0;
let autoSlide;

if (slides.length) {
    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsWrapper.appendChild(dot);
    });

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dotsWrapper.querySelectorAll('.dot')[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dotsWrapper.querySelectorAll('.dot')[currentSlide].classList.add('active');
    }

    document.getElementById('slide-prev').addEventListener('click', () => {
        clearInterval(autoSlide);
        goToSlide(currentSlide - 1);
        autoSlide = setInterval(() => goToSlide(currentSlide + 1), 3500);
    });

    document.getElementById('slide-next').addEventListener('click', () => {
        clearInterval(autoSlide);
        goToSlide(currentSlide + 1);
        autoSlide = setInterval(() => goToSlide(currentSlide + 1), 3500);
    });

    // Auto-advance every 3.5 seconds
    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 3500);
}

// =====================
// Lightbox Logic
// =====================
const galleryImages = [
    'photo_5856938776213524504_y.jpg',
    'photo_5856938776213524505_y.jpg',
    'photo_5856938776213524506_y.jpg',
    'photo_5856938776213524507_y.jpg',
    'photo_5856938776213524508_y.jpg',
    'photo_5856938776213524509_y.jpg',
    'photo_5856938776213524510_y.jpg',
    'photo_5856938776213524511_y.jpg',
    'photo_5856938776213524512_y.jpg',
    'photo_5856938776213524513_y.jpg'
];

let currentLightboxIndex = 0;

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = galleryImages[index];
    document.getElementById('lightbox-counter').textContent = (index + 1) + ' / ' + galleryImages.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

function changeLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
    document.getElementById('lightbox-img').src = galleryImages[currentLightboxIndex];
    document.getElementById('lightbox-counter').textContent = (currentLightboxIndex + 1) + ' / ' + galleryImages.length;
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeLightbox(-1);
    if (e.key === 'ArrowLeft') changeLightbox(1);
});

// =====================
// Animated Number Counter
// =====================
function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target.toLocaleString('ar-DZ');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start).toLocaleString('ar-DZ');
        }
    }, 16);
}

// Trigger counters when the bar is visible
const proofBar = document.querySelector('.social-proof-bar');
if (proofBar) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.proof-number[data-target]').forEach(el => {
                    animateCounter(el, parseInt(el.getAttribute('data-target')));
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    counterObserver.observe(proofBar);
}

// =====================
// Live Viewer Simulator
// =====================
const liveViewers = document.getElementById('live-viewers');
if (liveViewers) {
    setInterval(() => {
        const current = parseInt(liveViewers.textContent) || 12;
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = Math.max(8, Math.min(25, current + change));
        liveViewers.textContent = newCount;
    }, 4000);
}

// =====================
// Wilaya & Baladiya Logic
// =====================
const wilayaSelect = document.getElementById('wilaya');
const baladiyaSelect = document.getElementById('baladiya');

if (wilayaSelect && baladiyaSelect) {
    wilayaSelect.addEventListener('change', function() {
        const wId = this.value;
        baladiyaSelect.innerHTML = '<option value="" disabled selected>اختر بلديتك</option>';
        if (typeof baladiyaData !== 'undefined' && baladiyaData[wId]) {
            baladiyaData[wId].forEach(bName => {
                const option = document.createElement('option');
                option.value = bName;
                option.textContent = bName;
                baladiyaSelect.appendChild(option);
            });
            baladiyaSelect.disabled = false;
        } else {
            baladiyaSelect.innerHTML = '<option value="" disabled selected>اختر الولاية أولاً</option>';
            baladiyaSelect.disabled = true;
        }
    });
}

// =====================
// Offer & Dynamic Models Logic
// =====================
const offerSelect = document.getElementById('offer-select');
const extraModelsRow = document.getElementById('extra-models-row');
const modelGroup2 = document.getElementById('model-group-2');
const modelGroup3 = document.getElementById('model-group-3');
const modelSelect2 = document.getElementById('model-select-2');
const modelSelect3 = document.getElementById('model-select-3');

if (offerSelect) {
    offerSelect.addEventListener('change', function() {
        const val = this.value;
        if (val === "1") {
            if (extraModelsRow) extraModelsRow.style.display = 'none';
            if (modelGroup2) modelGroup2.style.display = 'none';
            if (modelGroup3) modelGroup3.style.display = 'none';
            if (modelSelect2) modelSelect2.required = false;
            if (modelSelect3) modelSelect3.required = false;
        } else if (val === "2") {
            if (extraModelsRow) extraModelsRow.style.display = 'flex';
            if (modelGroup2) modelGroup2.style.display = 'block';
            if (modelGroup3) modelGroup3.style.display = 'none';
            if (modelSelect2) modelSelect2.required = true;
            if (modelSelect3) modelSelect3.required = false;
        } else if (val === "3") {
            if (extraModelsRow) extraModelsRow.style.display = 'flex';
            if (modelGroup2) modelGroup2.style.display = 'block';
            if (modelGroup3) modelGroup3.style.display = 'block';
            if (modelSelect2) modelSelect2.required = true;
            if (modelSelect3) modelSelect3.required = true;
        }
    });
}
