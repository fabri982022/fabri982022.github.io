// ========================================================================
//   ACCESSIBILITY.JS - FitGym Accessibility Functions
//   Funciones de accesibilidad, navegación por teclado y ARIA
// ========================================================================

// Variables globales de accesibilidad
let highContrastMode = false;
let reducedMotionMode = false;
let keyboardNavigation = false;

// Inicializar funciones de accesibilidad
document.addEventListener('DOMContentLoaded', function() {
    initAccessibility();
    initKeyboardNavigation();
    initAriaEnhancements();
    initFocusManagement();
    initNotifications();
    checkUserPreferences();
});

// ========== INICIALIZACIÓN DE ACCESIBILIDAD ==========

function initAccessibility() {
    // Añadir skip links dinámicamente
    addSkipLinks();
    
    // Configurar notificaciones para screen readers
    createAriaLiveRegions();
    
    // Detectar navegación por teclado
    detectKeyboardUsage();
    
    // Configurar estados ARIA dinámicos
    setupDynamicAria();
    
    // Inicializar tooltips accesibles
    initAccessibleTooltips();
}

// ========== SKIP LINKS ==========

function addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
        <a href="#nav-menu" class="skip-link">Saltar a navegación</a>
        <a href="#footer" class="skip-link">Saltar al pie de página</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
}

// ========== REGIONES ARIA LIVE ==========

function createAriaLiveRegions() {
    // Región para anuncios importantes
    const announcements = document.createElement('div');
    announcements.id = 'announcements';
    announcements.setAttribute('aria-live', 'assertive');
    announcements.setAttribute('aria-atomic', 'true');
    announcements.className = 'sr-only';
    document.body.appendChild(announcements);
    
    // Región para cambios de estado
    const status = document.createElement('div');
    status.id = 'status';
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    status.className = 'sr-only';
    document.body.appendChild(status);
}

// ========== NAVEGACIÓN POR TECLADO ==========

function initKeyboardNavigation() {
    // Manejar navegación en mega menús
    setupMegaMenuKeyboard();
    
    // Manejar escape key para cerrar menús/modales
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllMenus();
            closeModals();
            removeFocusTrap();
        }
    });
    
    // Manejar Tab trap en modales
    setupTabTrap();
}

function detectKeyboardUsage() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            keyboardNavigation = true;
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        keyboardNavigation = false;
        document.body.classList.remove('keyboard-navigation');
    });
}

function setupMegaMenuKeyboard() {
    const menuTriggers = document.querySelectorAll('.mega-menu > a');
    
    menuTriggers.forEach(trigger => {
        trigger.addEventListener('keydown', function(e) {
            const menu = this.nextElementSibling;
            
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    toggleMegaMenu(this, menu);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    openMegaMenu(this, menu);
                    focusFirstMenuItem(menu);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    openMegaMenu(this, menu);
                    focusLastMenuItem(menu);
                    break;
            }
        });
    });
}

function toggleMegaMenu(trigger, menu) {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
        closeMegaMenu(trigger, menu);
    } else {
        openMegaMenu(trigger, menu);
    }
}

function openMegaMenu(trigger, menu) {
    trigger.setAttribute('aria-expanded', 'true');
    menu.style.display = 'grid';
    announceToScreenReader('Menú expandido');
}

function closeMegaMenu(trigger, menu) {
    trigger.setAttribute('aria-expanded', 'false');
    menu.style.display = 'none';
    announceToScreenReader('Menú contraído');
}

function closeAllMenus() {
    const openMenus = document.querySelectorAll('[aria-expanded="true"]');
    openMenus.forEach(trigger => {
        const menu = trigger.nextElementSibling;
        if (menu && menu.classList.contains('mega-menu-content')) {
            closeMegaMenu(trigger, menu);
        }
    });
}

// ========== MEJORAS ARIA ==========

function initAriaEnhancements() {
    // Configurar botones interactivos
    setupInteractiveButtons();
    
    // Configurar contadores con aria-live
    setupCounterAnnouncements();
    
    // Configurar carrusel accesible
    setupAccessibleCarousel();
    
    // Configurar formularios con validación
    setupFormValidation();
}

function setupInteractiveButtons() {
    const buttons = document.querySelectorAll('.btn, [role="button"]');
    
    buttons.forEach(button => {
        if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
            console.warn('Botón sin etiqueta accesible encontrado:', button);
        }
        
        // Añadir states para botones de carga
        if (button.classList.contains('btn-loading')) {
            button.addEventListener('click', function() {
                this.setAttribute('aria-busy', 'true');
                announceToScreenReader('Cargando...');
                
                // Simular fin de carga (en aplicación real sería dinámico)
                setTimeout(() => {
                    this.setAttribute('aria-busy', 'false');
                    announceToScreenReader('Carga completada');
                }, 2000);
            });
        }
    });
}

function setupCounterAnnouncements() {
    const counters = document.querySelectorAll('.counter-number');
    
    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target.getAttribute('data-target');
                    const suffix = entry.target.getAttribute('data-suffix') || '';
                    const label = entry.target.nextElementSibling.textContent;
                    
                    setTimeout(() => {
                        announceToScreenReader(`${label}: ${target}${suffix}`);
                    }, 2000); // Esperar a que termine la animación
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ========== GESTIÓN DE FOCUS ==========

function initFocusManagement() {
    // Mantener focus visible en elementos importantes
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('has-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('has-focus');
        });
    });
    
    // Configurar focus trap para modales
    setupModalFocusTrap();
}

function setupTabTrap() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const modal = document.querySelector('.modal.active, .menu-open');
            if (modal) {
                trapFocus(e, modal);
            }
        }
    });
}

function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

// ========== NOTIFICACIONES ACCESIBLES ==========

function initNotifications() {
    window.showAccessibleNotification = function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.textContent = message;
        
        // Añadir botón de cerrar
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'notification-close';
        closeBtn.setAttribute('aria-label', 'Cerrar notificación');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        notification.appendChild(closeBtn);
        document.body.appendChild(notification);
        
        // Anunciar a screen readers
        announceToScreenReader(message);
        
        // Auto-remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    };
}

function announceToScreenReader(message) {
    const announcements = document.getElementById('announcements');
    if (announcements) {
        announcements.textContent = message;
        
        // Limpiar después de un tiempo
        setTimeout(() => {
            announcements.textContent = '';
        }, 1000);
    }
}

function updateStatus(message) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = message;
    }
}

// ========== PREFERENCIAS DEL USUARIO ==========

function checkUserPreferences() {
    // Verificar preferencias de movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        reducedMotionMode = true;
        document.body.classList.add('reduced-motion');
        announceToScreenReader('Modo de movimiento reducido activado');
    }
    
    // Verificar preferencias de contraste
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        highContrastMode = true;
        document.body.classList.add('high-contrast');
        announceToScreenReader('Modo de alto contraste activado');
    }
    
    // Escuchar cambios en preferencias
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        reducedMotionMode = e.matches;
        document.body.classList.toggle('reduced-motion', e.matches);
    });
    
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
        highContrastMode = e.matches;
        document.body.classList.toggle('high-contrast', e.matches);
    });
}

// ========== TOOLTIPS ACCESIBLES ==========

function initAccessibleTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        const tooltipText = trigger.getAttribute('data-tooltip');
        const tooltipId = 'tooltip-' + Math.random().toString(36).substr(2, 9);
        
        // Crear tooltip
        const tooltip = document.createElement('div');
        tooltip.id = tooltipId;
        tooltip.className = 'tooltip-text';
        tooltip.textContent = tooltipText;
        tooltip.setAttribute('role', 'tooltip');
        
        trigger.appendChild(tooltip);
        trigger.setAttribute('aria-describedby', tooltipId);
        
        // Manejar eventos
        trigger.addEventListener('mouseenter', () => showTooltip(tooltip));
        trigger.addEventListener('mouseleave', () => hideTooltip(tooltip));
        trigger.addEventListener('focus', () => showTooltip(tooltip));
        trigger.addEventListener('blur', () => hideTooltip(tooltip));
    });
}

function showTooltip(tooltip) {
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
}

function hideTooltip(tooltip) {
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
}

// ========== UTILIDADES PÚBLICAS ==========

// Función para mejorar contraste dinámicamente
window.toggleHighContrast = function() {
    highContrastMode = !highContrastMode;
    document.body.classList.toggle('high-contrast', highContrastMode);
    
    const message = highContrastMode ? 
        'Modo de alto contraste activado' : 
        'Modo de alto contraste desactivado';
    
    announceToScreenReader(message);
    showAccessibleNotification(message, 'info');
};

// Función para toggle de animaciones
window.toggleReducedMotion = function() {
    reducedMotionMode = !reducedMotionMode;
    document.body.classList.toggle('reduced-motion', reducedMotionMode);
    
    const message = reducedMotionMode ? 
        'Animaciones reducidas activadas' : 
        'Animaciones reducidas desactivadas';
    
    announceToScreenReader(message);
    showAccessibleNotification(message, 'info');
};

// Función para mejorar el modo oscuro accesible
window.toggleAccessibleDarkMode = function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const themeToggle = document.getElementById('themeToggle');
    
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.setAttribute('aria-checked', 'false');
        themeToggle.querySelector('.sr-only').textContent = 'Modo oscuro desactivado';
        announceToScreenReader('Modo claro activado');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.setAttribute('aria-checked', 'true');
        themeToggle.querySelector('.sr-only').textContent = 'Modo oscuro activado';
        announceToScreenReader('Modo oscuro activado');
    }
};

// Exportar funciones para uso global
window.AccessibilityUtils = {
    announceToScreenReader,
    updateStatus,
    showAccessibleNotification,
    toggleHighContrast,
    toggleReducedMotion,
    toggleAccessibleDarkMode
};

// ========== PANEL DE ACCESIBILIDAD ==========

// Configurar panel de accesibilidad
function initAccessibilityPanel() {
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const accessibilityClose = document.getElementById('accessibilityClose');
    
    if (!accessibilityToggle || !accessibilityPanel) return;
    
    // Toggle del panel
    accessibilityToggle.addEventListener('click', function() {
        const isOpen = accessibilityPanel.classList.contains('open');
        
        if (isOpen) {
            closeAccessibilityPanel();
        } else {
            openAccessibilityPanel();
        }
    });
    
    // Cerrar panel
    if (accessibilityClose) {
        accessibilityClose.addEventListener('click', closeAccessibilityPanel);
    }
    
    // Configurar controles del panel
    setupAccessibilityControls();
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && accessibilityPanel.classList.contains('open')) {
            closeAccessibilityPanel();
        }
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', function(e) {
        const isClickInside = accessibilityPanel.contains(e.target) || 
                             accessibilityToggle.contains(e.target);
        
        if (!isClickInside && accessibilityPanel.classList.contains('open')) {
            closeAccessibilityPanel();
        }
    });
}

function openAccessibilityPanel() {
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    
    accessibilityPanel.classList.add('open');
    accessibilityPanel.setAttribute('aria-hidden', 'false');
    accessibilityToggle.setAttribute('aria-expanded', 'true');
    
    // Focus en el primer control
    const firstControl = accessibilityPanel.querySelector('button');
    if (firstControl) {
        firstControl.focus();
    }
    
    announceToScreenReader('Panel de accesibilidad abierto');
}

function closeAccessibilityPanel() {
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    
    accessibilityPanel.classList.remove('open');
    accessibilityPanel.setAttribute('aria-hidden', 'true');
    accessibilityToggle.setAttribute('aria-expanded', 'false');
    
    // Devolver focus al toggle
    accessibilityToggle.focus();
    
    announceToScreenReader('Panel de accesibilidad cerrado');
}

function setupAccessibilityControls() {
    // Control de alto contraste
    const highContrastBtn = document.getElementById('toggleHighContrast');
    if (highContrastBtn) {
        highContrastBtn.addEventListener('click', function() {
            toggleHighContrast();
            this.setAttribute('aria-pressed', highContrastMode.toString());
            this.classList.toggle('active', highContrastMode);
        });
    }
    
    // Control de movimiento reducido
    const reduceMotionBtn = document.getElementById('toggleReduceMotion');
    if (reduceMotionBtn) {
        reduceMotionBtn.addEventListener('click', function() {
            toggleReducedMotion();
            this.setAttribute('aria-pressed', reducedMotionMode.toString());
            this.classList.toggle('active', reducedMotionMode);
        });
    }
    
    // Control de tamaño de fuente
    const increaseFontBtn = document.getElementById('increaseFontSize');
    const decreaseFontBtn = document.getElementById('decreaseFontSize');
    
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', function() {
            changeFontSize(0.1);
        });
    }
    
    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', function() {
            changeFontSize(-0.1);
        });
    }
    
    // Reset de configuraciones
    const resetBtn = document.getElementById('resetAccessibility');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetAccessibilitySettings();
        });
    }
}

// Variables para configuraciones
let currentFontSize = 1;

function changeFontSize(delta) {
    currentFontSize = Math.max(0.8, Math.min(1.5, currentFontSize + delta));
    document.documentElement.style.fontSize = currentFontSize + 'rem';
    
    const message = delta > 0 ? 
        'Tamaño de fuente aumentado' : 
        'Tamaño de fuente reducido';
    
    announceToScreenReader(message);
    saveAccessibilitySettings();
}

function resetAccessibilitySettings() {
    // Resetear alto contraste
    highContrastMode = false;
    document.body.classList.remove('high-contrast');
    const highContrastBtn = document.getElementById('toggleHighContrast');
    if (highContrastBtn) {
        highContrastBtn.setAttribute('aria-pressed', 'false');
        highContrastBtn.classList.remove('active');
    }
    
    // Resetear movimiento
    reducedMotionMode = false;
    document.body.classList.remove('reduced-motion');
    const reduceMotionBtn = document.getElementById('toggleReduceMotion');
    if (reduceMotionBtn) {
        reduceMotionBtn.setAttribute('aria-pressed', 'false');
        reduceMotionBtn.classList.remove('active');
    }
    
    // Resetear tamaño de fuente
    currentFontSize = 1;
    document.documentElement.style.fontSize = '';
    
    announceToScreenReader('Configuraciones de accesibilidad restablecidas');
    saveAccessibilitySettings();
}

function saveAccessibilitySettings() {
    const settings = {
        highContrast: highContrastMode,
        reducedMotion: reducedMotionMode,
        fontSize: currentFontSize
    };
    
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
}

function loadAccessibilitySettings() {
    const savedSettings = localStorage.getItem('accessibility-settings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Aplicar alto contraste
        if (settings.highContrast) {
            highContrastMode = true;
            document.body.classList.add('high-contrast');
            const highContrastBtn = document.getElementById('toggleHighContrast');
            if (highContrastBtn) {
                highContrastBtn.setAttribute('aria-pressed', 'true');
                highContrastBtn.classList.add('active');
            }
        }
        
        // Aplicar movimiento reducido
        if (settings.reducedMotion) {
            reducedMotionMode = true;
            document.body.classList.add('reduced-motion');
            const reduceMotionBtn = document.getElementById('toggleReduceMotion');
            if (reduceMotionBtn) {
                reduceMotionBtn.setAttribute('aria-pressed', 'true');
                reduceMotionBtn.classList.add('active');
            }
        }
        
        // Aplicar tamaño de fuente
        if (settings.fontSize && settings.fontSize !== 1) {
            currentFontSize = settings.fontSize;
            document.documentElement.style.fontSize = currentFontSize + 'rem';
        }
    }
}

// Inicializar panel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initAccessibilityPanel();
    loadAccessibilitySettings();
});
