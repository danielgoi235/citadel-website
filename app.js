// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const chatbotButton = document.getElementById('chatbot-button');
const chatbotModal = document.getElementById('chatbot-modal');
const closeModal = document.querySelector('.close');
const materialsForm = document.getElementById('materials-form');
const contactForm = document.getElementById('contact-form');
const testimonialsSlider = document.getElementById('testimonials-slider');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = 70;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to Section Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = 70;
        const targetPosition = section.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections for animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const cards = document.querySelectorAll('.service-card, .project-card, .testimonial-card');
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
});

// Testimonials Slider
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function nextTestimonial() {
    if (testimonialCards.length > 0) {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        const cardWidth = testimonialCards[0].offsetWidth + 32; // width + gap
        testimonialsSlider.scrollTo({
            left: currentTestimonial * cardWidth,
            behavior: 'smooth'
        });
    }
}

// Auto-scroll testimonials every 5 seconds
setInterval(nextTestimonial, 5000);

// Chatbot Modal
chatbotButton.addEventListener('click', () => {
    chatbotModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    chatbotModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === chatbotModal) {
        chatbotModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Materials Form Submission
materialsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(materialsForm);
    const nome = formData.get('nome') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const empresa = formData.get('empresa') || e.target.querySelectorAll('input[type="text"]')[1].value;
    
    if (nome && email && empresa) {
        // Show success message
        showSuccessMessage('E-book enviado com sucesso! Verifique seu e-mail.');
        
        // Reset form
        materialsForm.reset();
    } else {
        showErrorMessage('Por favor, preencha todos os campos.');
    }
});

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const empresa = document.getElementById('empresa').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const mensagem = document.getElementById('mensagem').value;
    
    if (nome && empresa && email && telefone && mensagem) {
        // Show success message
        showSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Reset form
        contactForm.reset();
    } else {
        showErrorMessage('Por favor, preencha todos os campos.');
    }
});

// Success/Error Message Functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-alert');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-alert message-${type}`;
    messageEl.textContent = message;
    
    // Style the message
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1002;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
        background-color: ${type === 'success' ? '#10B981' : '#EF4444'};
    `;
    
    // Add animation keyframes if not already present
    if (!document.querySelector('#message-animations')) {
        const style = document.createElement('style');
        style.id = 'message-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(messageEl);
    
    // Remove after 4 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 4000);
}

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(0, 33, 71, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'var(--color-primary-blue)';
        navbar.style.backdropFilter = 'none';
    }
});

// Testimonials Touch/Mouse Scroll Support
let isScrolling = false;
let startX = 0;
let scrollLeft = 0;

testimonialsSlider.addEventListener('mousedown', (e) => {
    isScrolling = true;
    startX = e.pageX - testimonialsSlider.offsetLeft;
    scrollLeft = testimonialsSlider.scrollLeft;
    testimonialsSlider.style.cursor = 'grabbing';
});

testimonialsSlider.addEventListener('mouseleave', () => {
    isScrolling = false;
    testimonialsSlider.style.cursor = 'grab';
});

testimonialsSlider.addEventListener('mouseup', () => {
    isScrolling = false;
    testimonialsSlider.style.cursor = 'grab';
});

testimonialsSlider.addEventListener('mousemove', (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - testimonialsSlider.offsetLeft;
    const walk = (x - startX) * 2;
    testimonialsSlider.scrollLeft = scrollLeft - walk;
});

// Touch support for mobile
testimonialsSlider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - testimonialsSlider.offsetLeft;
    scrollLeft = testimonialsSlider.scrollLeft;
});

testimonialsSlider.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - testimonialsSlider.offsetLeft;
    const walk = (x - startX) * 2;
    testimonialsSlider.scrollLeft = scrollLeft - walk;
});

// Accessibility: Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        if (chatbotModal.style.display === 'block') {
            chatbotModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Navigate testimonials with arrow keys when focused
    if (document.activeElement === testimonialsSlider) {
        if (e.key === 'ArrowRight') {
            nextTestimonial();
        } else if (e.key === 'ArrowLeft') {
            currentTestimonial = currentTestimonial > 0 ? currentTestimonial - 1 : testimonialCards.length - 1;
            const cardWidth = testimonialCards[0].offsetWidth + 32;
            testimonialsSlider.scrollTo({
                left: currentTestimonial * cardWidth,
                behavior: 'smooth'
            });
        }
    }
});

// Add focus styles for accessibility
testimonialsSlider.setAttribute('tabindex', '0');
testimonialsSlider.style.cursor = 'grab';

// Preload images for better performance
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[src*="placeholder"]');
    images.forEach(img => {
        const newImg = new Image();
        newImg.src = img.src;
    });
});

// Form validation enhancement
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone);
}

// Enhanced contact form validation
contactForm.addEventListener('input', (e) => {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styles
    field.style.borderColor = '';
    
    // Validate specific fields
    if (field.type === 'email' && value && !validateEmail(value)) {
        field.style.borderColor = '#EF4444';
    } else if (field.type === 'tel' && value && !validatePhone(value)) {
        field.style.borderColor = '#EF4444';
    } else if (value) {
        field.style.borderColor = '#10B981';
    }
});

// Enhanced materials form validation
materialsForm.addEventListener('input', (e) => {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styles
    field.style.borderColor = '';
    
    // Validate email field
    if (field.type === 'email' && value && !validateEmail(value)) {
        field.style.borderColor = '#EF4444';
    } else if (value) {
        field.style.borderColor = '#10B981';
    }
});

// Page loaded event
window.addEventListener('load', () => {
    // Add loaded class to body for any additional animations
    document.body.classList.add('loaded');
    
    // Initialize testimonials slider position
    if (testimonialsSlider) {
        testimonialsSlider.scrollLeft = 0;
    }
});

// Intersection Observer for testimonials auto-scroll control
const testimonialsSection = document.querySelector('.testimonials');
if (testimonialsSection) {
    const testimonialsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Section is visible, auto-scroll is already running
            } else {
                // Section is not visible, could pause auto-scroll if needed
            }
        });
    }, { threshold: 0.1 });
    
    testimonialsObserver.observe(testimonialsSection);
}

// Smooth reveal animation for cards
const animateOnScroll = () => {
    const cards = document.querySelectorAll('.service-card, .project-card, .testimonial-card');
    cards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;
        
        if (cardTop < window.innerHeight - cardVisible) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
};

// Initialize card animations
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .project-card, .testimonial-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// Console log for debugging
console.log('Citadel Project Business - Site carregado com sucesso!');
console.log('Funcionalidades ativas:');
console.log('✓ Menu hambúrguer');
console.log('✓ Scroll suave');
console.log('✓ Animações de entrada');
console.log('✓ Slider de depoimentos');
console.log('✓ Modal do chatbot');
console.log('✓ Validação de formulários');
console.log('✓ Responsividade mobile');