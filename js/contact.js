// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    populateProductInquiry();
    initFormValidation();
});

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });

        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// Populate product inquiry if coming from product page
function populateProductInquiry() {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    
    if (product) {
        const messageField = document.getElementById('message');
        const inquiryType = document.getElementById('inquiry-type');
        
        if (messageField) {
            messageField.value = `I'm interested in learning more about ${product}. Please provide additional information and pricing details.`;
        }
        
        if (inquiryType) {
            inquiryType.value = 'quote';
        }

        // Track referral from product page
        trackEvent('contact_referral', {
            source: 'product_page',
            product: product,
            timestamp: new Date().toISOString()
        });
    }
}

// Form validation
function initFormValidation() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    window.validateField = function(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        removeFieldError(field);

        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        else if (fieldName === 'email' && value && !emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Phone validation
        else if (fieldName === 'phone' && value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        // Name validation
        else if ((fieldName === 'first-name' || fieldName === 'last-name') && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }

        // Message validation
        else if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    };
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Remove field error
function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Handle contact form submission
function handleContactFormSubmission(form) {
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showFormMessage('Please correct the errors above.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending Message...';
    submitBtn.disabled = true;
    form.classList.add('loading');

    // Collect form data
    const formData = new FormData(form);
    const data = {
        firstName: formData.get('first-name'),
        lastName: formData.get('last-name'),
        email: formData.get('email'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        inquiryType: formData.get('inquiry-type'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        timestamp: new Date().toISOString(),
        source: 'contact_form',
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };

    // Simulate form submission
    setTimeout(() => {
        // In production, send data to your backend/CRM
        console.log('Form submitted:', data);
        
        // Store submission locally for demo
        storeFormSubmission(data);
        
        // Show success message
        showFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');

        // Track form submission
        trackEvent('contact_form_submission', {
            inquiry_type: data.inquiryType,
            has_company: !!data.company,
            has_phone: !!data.phone,
            newsletter_signup: data.newsletter,
            timestamp: data.timestamp
        });

        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html?thank-you=true';
        }, 3000);

    }, 2000); // Simulate network delay
}

// Show form message
function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type === 'success' ? 'form-success' : 'form-error'}`;
    messageElement.textContent = message;

    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(messageElement, form);

    // Auto-remove error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

// Store form submission
function storeFormSubmission(data) {
    const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    submissions.push(data);
    localStorage.setItem('contact_submissions', JSON.stringify(submissions));
}

// Add CSS for form validation styling
const validationStyles = `
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: var(--error);
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .field-error {
        color: var(--error);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }

    .form-error {
        background: #fef2f2;
        color: var(--error);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #fecaca;
    }

    .form-loading {
        opacity: 0.6;
        pointer-events: none;
    }
`;

// Inject validation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = validationStyles;
document.head.appendChild(styleSheet);

// Track event function (if not already defined in main.js)
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

// Auto-fill form for demo purposes
function autoFillDemo() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    document.getElementById('first-name').value = 'John';
    document.getElementById('last-name').value = 'Doe';
    document.getElementById('email').value = 'john.doe@example.com';
    document.getElementById('company').value = 'Tech Innovations Inc.';
    document.getElementById('phone').value = '+1 (555) 987-6543';
    document.getElementById('inquiry-type').value = 'quote';
    document.getElementById('message').value = 'I am interested in your Enterprise Resource Planning solution for our growing business. We currently have 150 employees and are looking to streamline our operations. Could you provide more information about pricing and implementation timeline?';
}

// Add demo button (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname.includes('webcontainer')) {
    setTimeout(() => {
        const demoBtn = document.createElement('button');
        demoBtn.textContent = 'Fill Demo Data';
        demoBtn.className = 'btn btn-secondary';
        demoBtn.style.position = 'fixed';
        demoBtn.style.bottom = '20px';
        demoBtn.style.right = '20px';
        demoBtn.style.zIndex = '1000';
        demoBtn.onclick = autoFillDemo;
        document.body.appendChild(demoBtn);
    }, 1000);
}