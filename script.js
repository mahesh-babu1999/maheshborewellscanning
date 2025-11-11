// Main JavaScript functionality

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Handle pretty URL routing first so we redirect early if needed
    handlePrettyRoutes();

    initializeHeader();
    initializeAnimations();
    initializeMobileMenu();
    setActiveNavLink();
    initializeServicesDropdown();
});

// Header scroll effect
function initializeHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

    });
}

// Map SEO-friendly paths to services sections
function handlePrettyRoutes() {
    const path = window.location.pathname.replace(/\/+/g, '/');
    // If we landed on a trailing-slash service URL, update the address bar to non-trailing version
    if (path === '/borewell-camera-scanning/') {
        history.replaceState(null, '', '/borewell-camera-scanning');
    }
    if (path === '/submersible-motor-sale-and-services/') {
        history.replaceState(null, '', '/submersible-motor-sale-and-services');
    }

    // Define mapping from pretty path to services section anchors
    const routeMap = {
        '/bore-well-scanning': 'services.html#camera-scanning',
        '/motor-repair-and-winding': 'services.html#repair-winding',
        '/new-motor-installation': 'services.html#additional-services',
        '/submersible-motor-sale-and-services': '/submersible-motor-sale-and-services',
        '/bore-well-drilling': 'services.html#drilling'
    };

    // If user landed directly on a pretty path, redirect to the correct section
    if (routeMap[path]) {
        window.location.replace(routeMap[path]);
        return;
    }

    // Intercept clicks on anchors pointing to these pretty paths and reroute
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href]');
        if (!anchor) return;

        try {
            const url = new URL(anchor.href, window.location.origin);
            const prettyTarget = url.pathname.replace(/\/+/g, '/');
            // Strip trailing slash for service pages visual consistency
            if (prettyTarget === '/borewell-camera-scanning/') {
                e.preventDefault();
                window.location.href = '/borewell-camera-scanning';
                return;
            }
            if (prettyTarget === '/submersible-motor-sale-and-services/') {
                e.preventDefault();
                window.location.href = '/submersible-motor-sale-and-services';
                return;
            }

            if (routeMap[prettyTarget]) {
                e.preventDefault();
                window.location.href = routeMap[prettyTarget];
            }
        } catch (err) {
            // ignore parsing errors
        }
    }, true);
}

// Services dropdown (desktop + mobile)
function initializeServicesDropdown() {
    // Desktop dropdown
    const desktopDropdown = document.getElementById('servicesDropdownDesktop');
    if (desktopDropdown) {
        const toggleLink = desktopDropdown.querySelector('.dropdown-toggle');
        const menu = desktopDropdown.querySelector('.dropdown-menu');
        let closeTimeout;
        const open = () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            desktopDropdown.classList.add('open');
        };
        const close = () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            desktopDropdown.classList.remove('open');
        };
        const toggle = (e) => {
            // allow navigating to services.html on Ctrl/Cmd click
            if (e) e.preventDefault();
            if (desktopDropdown.classList.contains('open')) close(); else open();
        };

        // Open on hover (desktop experience)
        desktopDropdown.addEventListener('mouseenter', open);
        desktopDropdown.addEventListener('mouseleave', () => {
            // slight delay to allow moving cursor into menu area
            closeTimeout = setTimeout(close, 150);
        });

        // Also allow click to toggle
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                // Only toggle if screen is wide (desktop); on mobile the mobile menu handles it
                if (window.innerWidth > 768) {
                    e.preventDefault();
                    toggle();
                }
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!desktopDropdown.contains(e.target)) {
                close();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    // Mobile submenu
    const mobileToggle = document.getElementById('mobileServicesToggle');
    const mobileSubmenu = document.getElementById('mobileServicesSubmenu');
    if (mobileToggle && mobileSubmenu) {
        mobileToggle.addEventListener('click', function() {
            const isOpen = mobileSubmenu.style.display === 'flex';
            mobileSubmenu.style.display = isOpen ? 'none' : 'flex';
            mobileToggle.classList.toggle('open', !isOpen);
        });

        // Close submenu when a link is clicked (and close the mobile menu itself)
        mobileSubmenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                mobileSubmenu.style.display = 'none';
                mobileToggle.classList.remove('open');
                closeMobileMenu();
            });
        });
    }
}

// Scroll animations (AOS-like functionality)
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    const animateElements = document.querySelectorAll('[data-aos]');
    animateElements.forEach(el => observer.observe(el));
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking on actual navigation links (anchors),
        // but not when clicking the Services toggle button
        const mobileNavLinks = document.querySelectorAll('a.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    console.log('toggleMobileMenu called');
    const mobileMenu = document.getElementById('mobileMenu');
    console.log('mobileMenu:', mobileMenu);
    const isOpen = mobileMenu.classList.contains('active');
    console.log('isOpen:', isOpen);

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Open mobile menu
function openMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Call now functionality
function callNow() {
    window.open('tel:123456789', '_self');
}

// WhatsApp functionality
function openWhatsApp() {
    const message = encodeURIComponent('Hi, I need borewell services in Hyderabad');
    window.open(`https://wa.me/123456789?text=${message}`, '_blank');
}

// Email functionality
function sendEmail() {
    const subject = encodeURIComponent('Borewell Service Inquiry');
    const body = encodeURIComponent('Hi, I would like to know more about your borewell services in Hyderabad.');
    window.open(`mailto:info@borewellscanning.com?subject=${subject}&body=${body}`, '_self');
}

// Smooth scrolling for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Service inquiry functionality
function inquireService(serviceName) {
    const message = encodeURIComponent(`Hi, I'm interested in ${serviceName} service in Hyderabad. Please provide more details.`);
    window.open(`https://wa.me/123456789?text=${message}`, '_blank');
}

// Handle contact form (for contact page)
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Create WhatsApp message with form data
    const message = `Hi, I submitted an inquiry form:
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || 'Not provided'}
Service: ${data.service}
Location: ${data.location}
Message: ${data.message || 'No additional message'}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/123456789?text=${encodedMessage}`, '_blank');
    
    // Show success message
    showSuccessMessage();
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 2000;
            text-align: center;
            max-width: 400px;
            width: 90%;
        ">
            <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">✅</div>
            <h3 style="color: #1f2937; margin-bottom: 1rem;">Request Submitted!</h3>
            <p style="color: #6b7280; margin-bottom: 1.5rem;">
                Thank you for your inquiry. We'll contact you within 30 minutes.
            </p>
            <div style="font-weight: bold; color: #2563eb;">
                For immediate assistance: 123456789
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="
                        margin-top: 1rem;
                        background: #2563eb;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                    ">
                Close
            </button>
        </div>
        <div style="
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1999;
        " onclick="this.parentElement.remove()"></div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 5000);
}

// Initialize page-specific functionality
function initializePageSpecific() {
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Service inquiry buttons
    const serviceButtons = document.querySelectorAll('[data-service]');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.getAttribute('data-service');
            inquireService(serviceName);
        });
    });
}

// Call page-specific initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializePageSpecific);

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Close mobile menu with Escape key
    if (event.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Quick call with Ctrl+Enter
    if (event.ctrlKey && event.key === 'Enter') {
        callNow();
    }
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Track user interactions for analytics (if needed)
function trackInteraction(action, label) {
    // This is where you would send analytics data
    console.log(`Action: ${action}, Label: ${label}`);
    
    // Example: Google Analytics 4
    // gtag('event', action, {
    //     event_category: 'engagement',
    //     event_label: label
    // });
}

// Add click tracking to important buttons
document.addEventListener('click', function(event) {
    const target = event.target;
    
    if (target.matches('.cta-button, .btn-primary')) {
        trackInteraction('click', 'cta_button');
    }
    
    if (target.matches('.floating-btn')) {
        trackInteraction('click', 'floating_contact');
    }
    
    if (target.matches('.nav-link')) {
        trackInteraction('click', 'navigation');
    }
});

// Service Worker for offline capability (optional)
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//         navigator.serviceWorker.register('/sw.js')
//             .then(function(registration) {
//                 console.log('SW registered: ', registration);
//             })
//             .catch(function(registrationError) {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }