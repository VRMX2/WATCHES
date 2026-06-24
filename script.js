// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Submission Simulation
const purchaseForm = document.getElementById('purchase-form');
if (purchaseForm) {
    purchaseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        
        // Show loading state
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تأكيد الطلب...';
        btn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> تم تأكيد طلبك بنجاح!';
            btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            
            // Reset form
            setTimeout(() => {
                purchaseForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
                alert('شكراً لك! سيتم التواصل معك قريباً لتأكيد الطلب.');
            }, 2000);
            
        }, 1500);
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
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const model = this.getAttribute('data-model');
        const select = document.getElementById('model-select');
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

// Countdown Timer Logic
function startCountdown() {
    let hours = 3;
    let minutes = 45;
    let seconds = 30;

    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    const timer = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(timer);
                }
            }
        }

        hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);
}

startCountdown();

// End of script.js
