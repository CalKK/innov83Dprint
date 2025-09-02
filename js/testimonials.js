// Testimonials page functionality
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsCarousel();
});

// Testimonials carousel functionality
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!track || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    const slides = track.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;

    // Auto-advance carousel
    let autoSlideInterval = setInterval(nextSlide, 6000);

    // Navigation event listeners
    prevBtn.addEventListener('click', function() {
        clearInterval(autoSlideInterval);
        prevSlide();
        autoSlideInterval = setInterval(nextSlide, 6000);
        trackEvent('testimonial_navigation', { direction: 'previous', slide: currentSlide });
    });

    nextBtn.addEventListener('click', function() {
        clearInterval(autoSlideInterval);
        nextSlide();
        autoSlideInterval = setInterval(nextSlide, 6000);
        trackEvent('testimonial_navigation', { direction: 'next', slide: currentSlide });
    });

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            clearInterval(autoSlideInterval);
            goToSlide(index);
            autoSlideInterval = setInterval(nextSlide, 6000);
            trackEvent('testimonial_navigation', { direction: 'indicator', slide: index });
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            clearInterval(autoSlideInterval);
            prevSlide();
            autoSlideInterval = setInterval(nextSlide, 6000);
        } else if (e.key === 'ArrowRight') {
            clearInterval(autoSlideInterval);
            nextSlide();
            autoSlideInterval = setInterval(nextSlide, 6000);
        }
    });

    // Pause on hover
    track.addEventListener('mouseenter', function() {
        clearInterval(autoSlideInterval);
    });

    track.addEventListener('mouseleave', function() {
        autoSlideInterval = setInterval(nextSlide, 6000);
    });

    // Touch/swipe support for mobile
    let startX = null;
    let startY = null;

    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        clearInterval(autoSlideInterval);
    });

    track.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    track.addEventListener('touchend', function(e) {
        if (startX === null || startY === null) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const deltaX = startX - endX;
        const deltaY = startY - endY;

        // Only trigger if horizontal swipe is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > 50) { // Minimum swipe distance
                if (deltaX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        startX = null;
        startY = null;
        autoSlideInterval = setInterval(nextSlide, 6000);
    });

    function prevSlide() {
        currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
        updateCarousel();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    function updateCarousel() {
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });

        // Track slide view
        trackEvent('testimonial_view', {
            slide: currentSlide,
            total_slides: totalSlides,
            timestamp: new Date().toISOString()
        });
    }
}

// Track event function (if not already defined)
if (typeof trackEvent === 'undefined') {
    function trackEvent(eventName, properties) {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push({
            event: eventName,
            properties: properties,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('analytics_events', JSON.stringify(events));
        console.log('Event tracked:', eventName, properties);
    }
}