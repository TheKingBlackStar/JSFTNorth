// JSTF North - script.js (Focus: Stable Featured Events, then review Swiper speeds)

document.addEventListener('DOMContentLoaded', function() {
    console.log("DEBUG: JSTF North Script Loaded - V_FIRESTORE_FEATURED_EVENTS");

    // Footer Year, Smooth Scroll, Active Nav, Contact Form (Keep as is from last working version)
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(anchor => { 
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); 
                    const navbarHeight = document.querySelector('.main-navbar')?.offsetHeight || 70; 
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // Navbar active state (supports extensionless directories: /about, /events, / )
    const path = location.pathname.replace(/\/+/g, '/').replace(/\/$/, '');
    const currentSegment = (path.split('/').pop() || '') || '';
    const current = currentSegment === '' ? 'home' : currentSegment.replace(/\.html$/,'');
    document.querySelectorAll('.navbar .nav-link').forEach(a => {
        let href = a.getAttribute('href') || '';
        // Normalize href: remove leading slash, strip .html, map empty to home
        let target = href.replace(/^\//,'').replace(/\.html$/,'');
        if (target === '') target = 'home';
        a.classList.toggle('active', target === current);
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formStatus = document.getElementById('formStatus'); 
        const loadingSpinner = contactForm.querySelector('#loadingSpinner');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (submitButton) submitButton.disabled = true;
            if (loadingSpinner) loadingSpinner.style.display = 'inline-block'; 
            if (formStatus) formStatus.innerHTML = ''; 
            const formData = new FormData(contactForm);
            const currentDate = new Date();
            formData.append('submissionDate', currentDate.toDateString());
            formData.append('submissionTime', currentDate.toLocaleTimeString());
            fetch(contactForm.action, { method: 'POST', body: formData })
            .then(response => {
                if (response.ok || (response.type === 'opaque' && response.redirected) || response.status === 200) { return response.text(); }
                return response.text().then(text => { throw new Error(`Form submission failed: ${response.status} ${text||""}`); });
            })
            .then(data => {
                if (formStatus) formStatus.innerHTML = '<div class="alert alert-success mt-3">Thank you! Message sent.</div>';
                contactForm.reset();
            })
            .catch(error => {
                if (formStatus) formStatus.innerHTML = `<div class="alert alert-danger mt-3">Error: ${error.message}</div>`;
                console.error('Form Error:', error);
            })
            .finally(() => {
                if (submitButton) submitButton.disabled = false;
                if (loadingSpinner) loadingSpinner.style.display = 'none'; 
            });
        });
    }
    
    // Global Intersection Observer
    let siteObserver;
    if ("IntersectionObserver" in window) {
        const observerCallback = (entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.visibility = 'visible';
                    const animationName = entry.target.dataset.animationNameStored || 'animate__fadeInUp';
                    entry.target.classList.add(animationName);
                    observerInstance.unobserve(entry.target); 
                }
            });
        };
        window.siteObserver = new IntersectionObserver(observerCallback, { threshold: 0.15 });
        document.querySelectorAll('.animate__animated[data-scroll-offset]').forEach(el => {
            const animationName = Array.from(el.classList).find(cls => cls.startsWith('animate__') && !['animate__animated'].includes(cls));
            if (animationName) { el.dataset.animationNameStored = animationName; el.classList.remove(animationName); }
            else { el.dataset.animationNameStored = 'animate__fadeInUp'; }
            window.siteObserver.observe(el); 
        });
    } else { 
        document.querySelectorAll('.animate__animated[data-scroll-offset]').forEach(el => { el.style.visibility = 'visible'; });
    }
    
    // --- Swiper.js Initializations (Using settings that previously worked for coverflow look) ---
    const swiperSpeedSetting = 500; // Faster transition for 1s cadence
    const swiperAutoplayDelaySetting = 1000; // Advance every second

    const commonCoverFlowOptions = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        loop: true,
        loopAdditionalSlides: 3,
        keyboard: { enabled: true },
        speed: swiperSpeedSetting,
        autoplay: { delay: swiperAutoplayDelaySetting, disableOnInteraction: false, pauseOnMouseEnter: true },
        coverflowEffect: { rotate: 10, stretch: 0, depth: 120, modifier: 1, slideShadows: true },
        slidesPerView: 1.1,
        spaceBetween: 16,
        breakpoints: {
            320: { slidesPerView: 1.1, spaceBetween: 16, coverflowEffect: { rotate: 6, stretch: 0, depth: 100, modifier: 1, slideShadows: true }, speed: 600 },
            768: { slidesPerView: 2.2, spaceBetween: 24, coverflowEffect: { rotate: 8, stretch: 0, depth: 120, modifier: 1 }, speed: swiperSpeedSetting },
            992: { slidesPerView: 3, spaceBetween: 28, coverflowEffect: { rotate: 10, stretch: 0, depth: 140, modifier: 1 }, speed: swiperSpeedSetting }
        }
    };
    // Initialize a refined 3D coverflow that adapts to slide count
    function initCoverflowPro(selector, extras = {}) {
        const el = document.querySelector(selector);
        if (!el) return;
        const count = el.querySelectorAll('.swiper-slide').length;
        // Use fractional slides so there's always room to move even with 2 slides
        const spvMob = Math.max(1, Math.min(1.05, count - 0.05));
        const spvTab = Math.max(1.1, Math.min(2.1, count - 0.05));
        const spvDesk = Math.max(1.2, Math.min(2.8, count - 0.05));
        const loopEnabled = count >= 4;
        const autoplayEnabled = count >= 2;
        return new Swiper(selector, {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            loop: loopEnabled,
            rewind: !loopEnabled, // smooth wrap when loop is off
            loopAdditionalSlides: 2,
            keyboard: { enabled: true },
            speed: swiperSpeedSetting,
            autoplay: autoplayEnabled ? { delay: swiperAutoplayDelaySetting, disableOnInteraction: false, pauseOnMouseEnter: true } : false,
            coverflowEffect: { rotate: 25, stretch: -20, depth: 160, modifier: 1, slideShadows: true },
            spaceBetween: 24,
            breakpoints: {
                320: { slidesPerView: spvMob },
                768: { slidesPerView: spvTab },
                992: { slidesPerView: spvDesk }
            },
            ...extras
        });
    }

    // Initialize swipers with 3D coverflow
    // Leadership: prefer rewind for smooth wrap and fixed fractional SPV for reliable movement
    initCoverflowPro('.bishops-swiper', {
        loop: false,
        rewind: true,
        autoplay: { delay: swiperAutoplayDelaySetting, disableOnInteraction: false, pauseOnMouseEnter: true },
        breakpoints: {
            320: { slidesPerView: 1.05 },
            768: { slidesPerView: 1.6 },
            992: { slidesPerView: 2.2 }
        },
        navigation: { nextEl: '.bishops-swiper-button-next', prevEl: '.bishops-swiper-button-prev' }
    });
    // About Us leaders: same smooth behavior as Leadership
    initCoverflowPro('.about-ministries-swiper', {
        loop: false,
        rewind: true,
        autoplay: { delay: swiperAutoplayDelaySetting, disableOnInteraction: false, pauseOnMouseEnter: true },
        breakpoints: {
            320: { slidesPerView: 1.05 },
            768: { slidesPerView: 1.6 },
            992: { slidesPerView: 2.2 }
        },
        navigation: { nextEl: '.about-ministries-swiper-button-next', prevEl: '.about-ministries-swiper-button-prev' }
    });
    initCoverflowPro('.ministries-swiper', { navigation: { nextEl: '.ministries-swiper-button-next', prevEl: '.ministries-swiper-button-prev' }, pagination: { el: '.ministries-swiper-pagination', clickable: true } });

    // Featured Events now fully handled via Firestore (see featured-events.js and admin.js)
    // Legacy Google Sheet loader removed. Containers ('featuredEventsContainerHomepage', 'featuredEventsContainerEventsPage')
    // are populated by the Firestore snapshot module only.

}); // End DOMContentLoaded
