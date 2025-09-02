// Products page functionality
document.addEventListener('DOMContentLoaded', function() {
    initProductFiltering();
    initProductSearch();
    loadProducts();
});

// Product data
const productData = [
    {
        id: 1,
        title: "Enterprise Resource Planning",
        category: "enterprise",
        image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "Comprehensive ERP solution designed to streamline your business operations, from inventory management to financial reporting.",
        features: [
            "Real-time inventory tracking",
            "Advanced financial reporting",
            "Multi-location support",
            "Custom workflow automation",
            "Mobile access capabilities"
        ],
        tags: ["ERP", "Enterprise", "Automation"],
        price: "Custom pricing"
    },
    {
        id: 2,
        title: "Cloud Infrastructure Management",
        category: "cloud",
        image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "Scalable cloud solutions that grow with your business, ensuring reliability, security, and optimal performance.",
        features: [
            "Auto-scaling infrastructure",
            "99.9% uptime guarantee",
            "Advanced security protocols",
            "Global CDN integration",
            "24/7 monitoring & support"
        ],
        tags: ["Cloud", "Infrastructure", "Scalability"],
        price: "Starting at $299/month"
    },
    {
        id: 3,
        title: "Business Intelligence Analytics",
        category: "enterprise",
        image: "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "Transform your data into actionable insights with our comprehensive business intelligence platform.",
        features: [
            "Real-time dashboards",
            "Predictive analytics",
            "Custom report builder",
            "Data visualization tools",
            "API integrations"
        ],
        tags: ["Analytics", "Business Intelligence", "Data"],
        price: "Starting at $199/month"
    },
    {
        id: 4,
        title: "Strategic Consulting Services",
        category: "consulting",
        image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "Expert guidance to optimize your business strategy, operations, and technology implementation.",
        features: [
            "Strategic planning workshops",
            "Process optimization",
            "Technology roadmap development",
            "Change management support",
            "ROI measurement & tracking"
        ],
        tags: ["Consulting", "Strategy", "Optimization"],
        price: "Custom engagement"
    },
    {
        id: 5,
        title: "DevOps Automation Platform",
        category: "cloud",
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "Streamline your development and deployment processes with our comprehensive DevOps automation suite.",
        features: [
            "CI/CD pipeline automation",
            "Infrastructure as code",
            "Automated testing frameworks",
            "Security scanning integration",
            "Performance monitoring"
        ],
        tags: ["DevOps", "Automation", "Development"],
        price: "Starting at $399/month"
    },
    {
        id: 6,
        title: "24/7 Technical Support",
        category: "support",
        image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "Round-the-clock technical support to keep your systems running smoothly and your team productive.",
        features: [
            "24/7 phone & chat support",
            "Remote troubleshooting",
            "Preventive maintenance",
            "Priority ticket handling",
            "Dedicated account manager"
        ],
        tags: ["Support", "Maintenance", "24/7"],
        price: "Starting at $99/month"
    }
];

// Load and display products
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    renderProducts(productData);
}

// Render products to the grid
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        const productElement = createProductElement(product, index);
        productsGrid.appendChild(productElement);
    });

    // Add staggered animation
    setTimeout(() => {
        productsGrid.querySelectorAll('.product-detail').forEach((el, index) => {
            setTimeout(() => {
                el.style.animationDelay = `${index * 0.1}s`;
            }, index * 100);
        });
    }, 100);
}

// Create product element
function createProductElement(product, index) {
    const productElement = document.createElement('div');
    productElement.className = 'product-detail';
    productElement.setAttribute('data-category', product.category);
    productElement.setAttribute('data-title', product.title.toLowerCase());

    productElement.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-info">
            <div class="product-meta">
                ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
            </div>
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <ul class="product-features">
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <div class="product-actions">
                <a href="contact.html?product=${encodeURIComponent(product.title)}" class="btn btn-primary">Get Quote</a>
                <button class="btn btn-secondary" onclick="showProductModal(${product.id})">Learn More</button>
            </div>
        </div>
    `;

    return productElement;
}

// Product filtering
function initProductFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterProducts(filter);

            // Track filter usage
            trackEvent('product_filter', {
                filter: filter,
                timestamp: new Date().toISOString()
            });
        });
    });
}

// Filter products by category
function filterProducts(category) {
    const productElements = document.querySelectorAll('.product-detail');
    
    productElements.forEach(element => {
        const productCategory = element.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            element.style.display = 'block';
            element.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            element.style.display = 'none';
        }
    });
}

// Product search functionality
function initProductSearch() {
    const searchInput = document.getElementById('product-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            searchProducts(searchTerm);

            // Track search
            if (searchTerm.length > 2) {
                trackEvent('product_search', {
                    query: searchTerm,
                    timestamp: new Date().toISOString()
                });
            }
        }, 300));
    }
}

// Search products
function searchProducts(searchTerm) {
    const productElements = document.querySelectorAll('.product-detail');
    
    productElements.forEach(element => {
        const title = element.getAttribute('data-title');
        const description = element.querySelector('.product-info p').textContent.toLowerCase();
        const tags = Array.from(element.querySelectorAll('.product-tag')).map(tag => tag.textContent.toLowerCase());
        
        const searchableText = `${title} ${description} ${tags.join(' ')}`;
        
        if (searchableText.includes(searchTerm) || searchTerm === '') {
            element.style.display = 'block';
            element.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            element.style.display = 'none';
        }
    });
}

// Product modal (for detailed view)
window.showProductModal = function(productId) {
    const product = productData.find(p => p.id === productId);
    if (!product) return;

    // Create and show modal with product details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close">&times;</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                <div>
                    <img src="${product.image}" alt="${product.title}" style="width: 100%; border-radius: 0.5rem;">
                </div>
                <div>
                    <h3>${product.title}</h3>
                    <div class="product-meta" style="margin: 1rem 0;">
                        ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                    </div>
                    <p style="margin-bottom: 1.5rem; line-height: 1.7;">${product.description}</p>
                    <h4>Key Features:</h4>
                    <ul class="product-features">
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
                        <p style="font-weight: 600; margin-bottom: 1rem;">Pricing: ${product.price}</p>
                        <a href="contact.html?product=${encodeURIComponent(product.title)}" class="btn btn-primary">Request Quote</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Track product view
    trackEvent('product_view', {
        product_id: productId,
        product_title: product.title,
        timestamp: new Date().toISOString()
    });
};

// Utility function (if not already defined in main.js)
if (typeof debounce === 'undefined') {
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