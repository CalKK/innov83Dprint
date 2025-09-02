// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initModal();
    initAnimations();
    initAnalytics();
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

// Modal functionality
function initModal() {
    const modal = document.getElementById('newsletter-modal');
    const closeBtn = document.querySelector('.close');
    
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Newsletter form submission
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                handleNewsletterSignup(email);
            });
        }
    }
}

// Global newsletter function
window.showNewsletter = function() {
    const modal = document.getElementById('newsletter-modal');
    if (modal) {
        modal.style.display = 'block';
    }
};

// Newsletter signup handler
function handleNewsletterSignup(email) {
    const form = document.querySelector('.newsletter-form');
    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Thank you for subscribing! Check your email for confirmation.';
        form.parentNode.insertBefore(successMsg, form);
        
        // Reset form
        form.reset();
        button.textContent = originalText;
        button.disabled = false;
        
        // Close modal after delay
        setTimeout(() => {
            const modal = document.getElementById('newsletter-modal');
            if (modal) {
                modal.style.display = 'none';
                successMsg.remove();
            }
        }, 2000);
        
        // Track newsletter signup
        trackEvent('newsletter_signup', {
            email: email,
            timestamp: new Date().toISOString()
        });
    }, 1500);
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

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation
function animateCounter(element) {
    const target = element.textContent.replace(/[^\d]/g, '');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = element.textContent.replace(/[\d,]+/, target.toLocaleString());
            clearInterval(timer);
        } else {
            element.textContent = element.textContent.replace(/[\d,]+/, Math.floor(current).toLocaleString());
        }
    }, 16);
}

// Analytics and tracking
function initAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString()
    });

    // Track CTA clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const action = this.textContent.trim();
            const href = this.getAttribute('href');
            
            trackEvent('cta_click', {
                action: action,
                href: href,
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        });
    });

    // Track form interactions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const formType = this.className || 'unknown';
            trackEvent('form_submit', {
                form_type: formType,
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll >= 25 && maxScroll < 50) {
                trackEvent('scroll_depth', { depth: '25%' });
            } else if (maxScroll >= 50 && maxScroll < 75) {
                trackEvent('scroll_depth', { depth: '50%' });
            } else if (maxScroll >= 75) {
                trackEvent('scroll_depth', { depth: '75%' });
            }
        }
    }, 1000));
}

// Event tracking function
function trackEvent(eventName, properties) {
    // Store in localStorage for demo purposes
    // In production, send to your analytics service
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push({
        event: eventName,
        properties: properties,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('analytics_events', JSON.stringify(events));
    
    console.log('Event tracked:', eventName, properties);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Track page load time
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackEvent('page_performance', {
            load_time: loadTime,
            page: window.location.pathname
        });
    });

    // Track Core Web Vitals
    if ('web-vital' in window) {
        // This would integrate with real Core Web Vitals library
        console.log('Core Web Vitals tracking enabled');
    }
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Contact info click tracking
document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
        const type = this.href.startsWith('tel:') ? 'phone' : 'email';
        trackEvent('contact_click', {
            type: type,
            value: this.href,
            page: window.location.pathname
        });
    });
});