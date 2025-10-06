// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initAnimations();
    initProductPagination();
    initTestimonialsCarousel();
    initDropdowns();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on a link
        navMenu.addEventListener('click', function(event) {
            if (event.target.classList.contains('nav-link')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Scroll effects and animations
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// Scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .product-card, .team-member, .case-study').forEach(el => {
        observer.observe(el);
    });
}

// Product pagination functionality
function initProductPagination() {
    const viewMoreBtn = document.getElementById('view-more-btn');
    const hiddenProducts = document.querySelectorAll('.hidden-product');
    
    if (viewMoreBtn && hiddenProducts.length > 0) {
        viewMoreBtn.addEventListener('click', function() {
            hiddenProducts.forEach(product => {
                product.classList.remove('hidden-product');
                product.style.animation = 'fadeInUp 0.6s ease forwards';
            });
            
            // Hide the button after showing all products
            viewMoreBtn.style.display = 'none';
        });
    }
}

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
    });

    nextBtn.addEventListener('click', function() {
        clearInterval(autoSlideInterval);
        nextSlide();
        autoSlideInterval = setInterval(nextSlide, 6000);
    });

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            clearInterval(autoSlideInterval);
            goToSlide(index);
            autoSlideInterval = setInterval(nextSlide, 6000);
        });
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
    }
}

// Dropdown menu functionality for mobile
function initDropdowns() {
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item.has-submenu');

    if (window.innerWidth <= 768) {
        // Mobile dropdown toggle
        if (navDropdown) {
            const navLink = navDropdown.querySelector('.nav-link');
            navLink.addEventListener('click', function(e) {
                e.preventDefault();
                navDropdown.classList.toggle('active');
            });
        }

        // Submenu toggle
        dropdownItems.forEach(item => {
            const link = item.querySelector('a');
            link.addEventListener('click', function(e) {
                e.preventDefault();
                item.classList.toggle('active');
            });
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navDropdown?.classList.remove('active');
            dropdownItems.forEach(item => item.classList.remove('active'));
        }
    });
}
