// JSTF North - script.js (Focus: Stable Featured Events, then review Swiper speeds)

document.addEventListener('DOMContentLoaded', function() {
    console.log("DEBUG: JSTF North Script Loaded - V_STABLE_FEATURED_EVENTS");

    const featuredEventsGoogleSheetUrl = 'https://script.google.com/macros/s/AKfycbx90SqZG78lyWVnLPmBXeiSRmPzfYvhTsWV8j-8XgtgU4rDdseY2gqkMpf5lLYI2Dpn/exec';

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

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.main-navbar .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href').split("/").pop();
        if (linkPath === currentPath) link.classList.add('active');
    });
    if (currentPath === "index.html" || currentPath === "") {
        const homeLink = document.querySelector('.main-navbar .nav-link[href="index.html"]');
        if(homeLink && !homeLink.classList.contains('active')) { 
            navLinks.forEach(link => link.classList.remove('active'));
            homeLink.classList.add('active');
        }
    }

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
    const swiperSpeedSetting = 800; // For manual clicks
    const swiperAutoplayDelaySetting = 3500; // Pause between slides

    const commonCoverFlowOptions = {
        effect: 'coverflow', grabCursor: true, centeredSlides: true, loop: true, 
        speed: swiperSpeedSetting, 
        autoplay: { delay: swiperAutoplayDelaySetting, disableOnInteraction: false, pauseOnMouseEnter: true },
        coverflowEffect: { rotate: 25, stretch: -15, depth: 100, modifier: 1, slideShadows: true },
        slidesPerView: 'auto', 
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 5, coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 1, slideShadows: false }, speed: 500 },
            768: { slidesPerView: 3, spaceBetween: -20, coverflowEffect: { rotate: 25, stretch: -20, depth: 100, modifier: 1 }, speed: swiperSpeedSetting },
            992: { slidesPerView: 3, spaceBetween: -30, coverflowEffect: { rotate: 25, stretch: -40, depth: 120, modifier: 1 }, speed: swiperSpeedSetting }
        }
    };
    if (document.querySelector('.bishops-swiper')) { /* ... Swiper for Bishops ... */ 
        new Swiper('.bishops-swiper', { ...commonCoverFlowOptions, loopedSlides: 4, navigation: { nextEl: '.bishops-swiper-button-next', prevEl: '.bishops-swiper-button-prev' } });
    }
    if (document.querySelector('.about-ministries-swiper')) { /* ... Swiper for About Ministries ... */ 
        new Swiper('.about-ministries-swiper', { ...commonCoverFlowOptions, loopedSlides: 5, navigation: { nextEl: '.about-ministries-swiper-button-next', prevEl: '.about-ministries-swiper-button-prev' } });
    }
    if (document.querySelector('.ministries-swiper')) { /* ... Swiper for Main Ministries ... */ 
        new Swiper('.ministries-swiper', { ...commonCoverFlowOptions, loopedSlides: 6, navigation: { nextEl: '.ministries-swiper-button-next', prevEl: '.ministries-swiper-button-prev' }, pagination: { el: '.ministries-swiper-pagination', clickable: true } });
    }

    // --- Featured Events from Google Sheet (Simplified Display - No Conditional Swiper for now) ---
    function createEventCardHTML_Static(event) { // Renamed for clarity
        console.log("DEBUG: createEventCardHTML_Static called for:", event.EventTitle);
        const title = event.EventTitle || "Untitled Event";
        const badge = event.BadgeText || "";
        const dateInfo = event.DateInfo || "";
        const description = event.Description || "No description available.";
        const imageURL = typeof event.ImageURL === 'string' ? event.ImageURL.trim() : ""; 
        const imagePlaceholderText = "Event Image";
        const linkURL = event.LinkURL || "#";
    
        const imageHTML = imageURL !== "" ?
            `<img src="${imageURL}" class="card-img-top" alt="${title}" style="height: 200px; object-fit: cover;">` :
            `<div class="placeholder-image-container card-img-top" style="height:200px; background-color:#BFACE2; display:flex; align-items:center; justify-content:center; text-align:center; color:#703ABD;"><i>${imagePlaceholderText} for ${title}</i></div>`;
        
        // This creates Bootstrap columns directly
        return `
            <div class="col-md-6 col-lg-4 mb-4 d-flex align-items-stretch animate__animated animate__fadeInUp" data-scroll-offset="100">
                <div class="card h-100 shadow-sm event-card-featured">
                    ${imageHTML}
                    <div class="card-body d-flex flex-column">
                        ${badge ? `<span class="badge bg-gold text-dark mb-2">${badge}</span>` : ''}
                        <h5 class="card-title">${title}</h5>
                        ${dateInfo ? `<p class="card-text small text-muted"><i class="far fa-calendar-alt me-1"></i> ${dateInfo}</p>` : ''}
                        <p class="card-text">${description}</p>
                        <a href="${linkURL}" class="btn btn-outline-primary mt-auto btn-sm">Learn More</a>
                    </div>
                </div>
            </div>
        `;
    }
    
    async function loadFeaturedEvents_Static(containerId, maxEvents = 3) {
        const container = document.getElementById(containerId); // This ID should be on a 'row' div
        if (!container) {
            console.error("DEBUG: Static Featured events container not found for ID:", containerId); 
            return;
        }
    
        container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading featured events...</p></div>';
        console.log("DEBUG: Attempting to load STATIC events for container:", containerId); 
    
        try {
            const response = await fetch(featuredEventsGoogleSheetUrl);
            console.log("DEBUG: Fetch response status for " + containerId + ":", response.status, response.statusText); 
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorText}`);
            }
            const events = await response.json();
            console.log("DEBUG: Fetched events data for " + containerId + " (RAW):", JSON.stringify(events)); 
    
            container.innerHTML = ''; // Clear loading message
    
            if (events && Array.isArray(events) && events.length > 0) {
                let eventsToShow = events.filter(event => String(event.IsActive).toUpperCase().trim() === 'YES');
                
                if (containerId === 'featuredEventsContainerHomepage') { // Assuming this ID is for the homepage static display
                    eventsToShow = eventsToShow.slice(0, maxEvents);
                }
                console.log("DEBUG: STATIC Events to show after filtering for " + containerId + ":", eventsToShow);
    
                if (eventsToShow.length > 0) {
                    let allCardsHTML = "";
                    eventsToShow.forEach(event => {
                        allCardsHTML += createEventCardHTML_Static(event); // Use static card creator
                    });
                    container.innerHTML = allCardsHTML;
                    console.log("DEBUG: STATIC Final container.innerHTML for " + containerId + " set with " + eventsToShow.length + " cards.");

                    const newAnimatedElements = container.querySelectorAll('.animate__animated[data-scroll-offset]');
                    if (newAnimatedElements.length > 0 && "IntersectionObserver" in window && window.siteObserver) { 
                        newAnimatedElements.forEach(el => {
                            el.style.visibility = 'hidden';
                            const animationName = el.dataset.animationNameStored || 'animate__fadeInUp';
                            el.classList.forEach(cls => { if (cls.startsWith('animate__') && cls !== 'animate__animated') el.classList.remove(cls); });
                            el.dataset.animationNameStored = animationName; 
                            window.siteObserver.observe(el); 
                        });
                    }
                } else {
                    container.innerHTML = '<div class="col-12 text-center"><p>No featured events currently active. Check our <a href="events.html">full calendar</a>!</p></div>';
                }
            } else {
                 container.innerHTML = '<div class="col-12 text-center"><p>No featured events data received from the sheet (or array empty).</p></div>';
            }
        } catch (error) {
            console.error('DEBUG: Error in loadFeaturedEvents_Static for ' + containerId + ':', error); 
            container.innerHTML = `<div class="col-12 text-center"><p class="text-danger">DEBUG: Could not load events. Error: ${error.message}</p></div>`;
        }
    }
    
    // Load events for homepage (STATIC DISPLAY)
    // **IMPORTANT**: Ensure index.html has <div id="featuredEventsContainerHomepage" class="row">
    if (document.getElementById('featuredEventsContainerHomepage')) { 
        loadFeaturedEvents_Static('featuredEventsContainerHomepage', 3);
    }
    // Load events for events page (STATIC DISPLAY)
    // **IMPORTANT**: Ensure events.html has <div id="featuredEventsContainerEventsPage" class="row">
    if (document.getElementById('featuredEventsContainerEventsPage')) { 
        loadFeaturedEvents_Static('featuredEventsContainerEventsPage', 100); 
    }

}); // End DOMContentLoaded