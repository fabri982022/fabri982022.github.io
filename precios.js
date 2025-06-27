// ===== PRECIOS JS =====

// Variables globales
let isAnnual = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeBillingToggle();
    initializeFAQ();
    initializePricingCards();
    initializeTooltips();
    console.log('💰 Sistema de precios inicializado');
});

// ===== TOGGLE MENSUAL/ANUAL ===== 
function initializeBillingToggle() {
    const toggle = document.getElementById('billingToggle');
    if (!toggle) return;
    
    toggle.addEventListener('change', function() {
        isAnnual = this.checked;
        updatePricing();
        animatePriceChange();
    });
}

// ===== ACTUALIZAR PRECIOS =====
function updatePricing() {
    const priceElements = document.querySelectorAll('.monthly-price');
    const monthlyPeriods = document.querySelectorAll('.monthly-period');
    const annualPeriods = document.querySelectorAll('.annual-period');
    const annualSavings = document.querySelectorAll('.annual-savings');
    
    priceElements.forEach(priceEl => {
        const monthlyPrice = parseInt(priceEl.dataset.monthly);
        const annualPrice = parseInt(priceEl.dataset.annual);
        
        if (isAnnual) {
            // Mostrar precio anual
            animateNumber(priceEl, parseInt(priceEl.textContent), annualPrice, 600);
        } else {
            // Mostrar precio mensual
            animateNumber(priceEl, parseInt(priceEl.textContent), monthlyPrice, 600);
        }
    });
    
    // Cambiar períodos
    monthlyPeriods.forEach(period => {
        period.style.display = isAnnual ? 'none' : 'inline';
    });
    
    annualPeriods.forEach(period => {
        period.style.display = isAnnual ? 'inline' : 'none';
    });
    
    // Mostrar/ocultar ahorros anuales
    annualSavings.forEach(saving => {
        if (isAnnual) {
            saving.style.display = 'block';
            saving.style.opacity = '0';
            saving.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                saving.style.transition = 'all 0.3s ease';
                saving.style.opacity = '1';
                saving.style.transform = 'translateY(0)';
            }, 300);
        } else {
            saving.style.transition = 'all 0.3s ease';
            saving.style.opacity = '0';
            saving.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                saving.style.display = 'none';
            }, 300);
        }
    });
}

// ===== ANIMACIÓN DE NÚMEROS =====
function animateNumber(element, start, end, duration) {
    if (start === end) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = Math.round(current);
    }, 16);
}

// ===== ANIMACIÓN DE CAMBIO DE PRECIO =====
function animatePriceChange() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach((card, index) => {
        card.style.transform = 'scale(0.98)';
        card.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 100 + (index * 50));
    });
}

// ===== INICIALIZAR TARJETAS DE PRECIOS =====
function initializePricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    
    cards.forEach(card => {
        // Efecto de hover con seguimiento del mouse
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth <= 768) return; // Desactivar en móviles
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
        
        // Animación de entrada
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.8s ease';
        
        observer.observe(card);
    });
    
    // Manejar clicks en botones CTA
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.pricing-card');
            const planName = card.querySelector('h3').textContent;
            
            // Efecto de click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Mostrar modal o redirigir
            showPlanSelectionModal(planName);
        });
    });
}

// ===== MODAL DE SELECCIÓN DE PLAN =====
function showPlanSelectionModal(planName) {
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.className = 'plan-modal-overlay';
    modal.innerHTML = `
        <div class="plan-modal">
            <div class="plan-modal-header">
                <h3>¡Excelente elección!</h3>
                <button class="plan-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="plan-modal-body">
                <div class="selected-plan">
                    <i class="fas fa-check-circle"></i>
                    <h4>Plan ${planName} seleccionado</h4>
                </div>
                <p>¿Te gustaría proceder con la inscripción o necesitas más información?</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="redirectToSignup('${planName}')">
                        <i class="fas fa-user-plus"></i>
                        Inscribirme Ahora
                    </button>
                    <button class="btn btn-secondary" onclick="redirectToContact()">
                        <i class="fas fa-phone"></i>
                        Consultar por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Estilos del modal
    const style = document.createElement('style');
    style.textContent = `
        .plan-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        
        .plan-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .plan-modal {
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.7);
            transition: transform 0.3s ease;
        }
        
        .plan-modal-overlay.active .plan-modal {
            transform: scale(1);
        }
        
        .plan-modal-header {
            padding: 2rem 2rem 1rem;
            text-align: center;
            position: relative;
            border-bottom: 1px solid #e9ecef;
        }
        
        .plan-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-light);
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .plan-modal-close:hover {
            background: #f8f9fa;
            color: var(--text-dark);
        }
        
        .plan-modal-body {
            padding: 2rem;
            text-align: center;
        }
        
        .selected-plan {
            margin-bottom: 2rem;
        }
        
        .selected-plan i {
            font-size: 3rem;
            color: #28a745;
            margin-bottom: 1rem;
            animation: bounce 1s ease-out;
        }
        
        .selected-plan h4 {
            color: var(--text-dark);
            margin-bottom: 1rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .modal-actions .btn {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
        }
        
        .btn-secondary {
            background: #28a745;
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 480px) {
            .modal-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Mostrar modal
    setTimeout(() => modal.classList.add('active'), 100);
    
    // Cerrar modal
    const closeBtn = modal.querySelector('.plan-modal-close');
    closeBtn.addEventListener('click', () => closePlanModal(modal, style));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePlanModal(modal, style);
    });
    
    // Cerrar con Escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closePlanModal(modal, style);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

function closePlanModal(modal, style) {
    modal.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    }, 300);
}

function redirectToSignup(planName) {
    // En una aplicación real, esto redirigiría a la página de registro
    showNotification(`Redirigiendo a registro para plan ${planName}...`, 'success');
    setTimeout(() => {
        window.location.href = 'contacto.html';
    }, 1500);
}

function redirectToContact() {
    // En una aplicación real, esto abriría WhatsApp
    showNotification('Abriendo WhatsApp...', 'success');
    setTimeout(() => {
        window.open('https://wa.me/541112345678?text=Hola,%20me%20interesa%20información%20sobre%20los%20planes%20del%20gimnasio', '_blank');
    }, 1500);
}

// ===== FAQ ACCORDION =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Cerrar todas las otras FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle la FAQ actual
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// ===== TOOLTIPS =====
function initializeTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        let timeoutId;
        
        tooltip.addEventListener('mouseenter', function() {
            clearTimeout(timeoutId);
            const content = this.querySelector('.tooltip-content');
            if (content) {
                content.style.opacity = '1';
                content.style.visibility = 'visible';
                content.style.transform = 'translateX(-50%) translateY(-5px)';
            }
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const content = this.querySelector('.tooltip-content');
            if (content) {
                timeoutId = setTimeout(() => {
                    content.style.opacity = '0';
                    content.style.visibility = 'hidden';
                    content.style.transform = 'translateX(-50%) translateY(0)';
                }, 200);
            }
        });
        
        // Touch support para móviles
        tooltip.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const content = this.querySelector('.tooltip-content');
            if (content) {
                const isVisible = content.style.opacity === '1';
                
                // Cerrar otros tooltips
                document.querySelectorAll('.tooltip-content').forEach(otherContent => {
                    if (otherContent !== content) {
                        otherContent.style.opacity = '0';
                        otherContent.style.visibility = 'hidden';
                    }
                });
                
                if (!isVisible) {
                    content.style.opacity = '1';
                    content.style.visibility = 'visible';
                    content.style.transform = 'translateX(-50%) translateY(-5px)';
                } else {
                    content.style.opacity = '0';
                    content.style.visibility = 'hidden';
                    content.style.transform = 'translateX(-50%) translateY(0)';
                }
            }
        });
    });
    
    // Cerrar tooltips al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tooltip')) {
            document.querySelectorAll('.tooltip-content').forEach(content => {
                content.style.opacity = '0';
                content.style.visibility = 'hidden';
                content.style.transform = 'translateX(-50%) translateY(0)';
            });
        }
    });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info', duration = 3000) {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos de notificación
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            background: linear-gradient(135deg, #28a745, #20c997);
        }
        
        .notification.error {
            background: linear-gradient(135deg, #dc3545, #c82333);
        }
        
        .notification.info {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
                transform: translateY(-100px);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover después del tiempo especificado
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, duration);
}

// ===== UTILIDADES =====
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

// ===== ANIMACIONES DE SCROLL =====
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll('.service-card, .comparison-section, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// ===== EXPORT PARA TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updatePricing,
        animateNumber,
        showNotification
    };
}
