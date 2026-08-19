// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        const menuId = navMenu.id || 'nav-menu';
        navMenu.id = menuId;
        hamburger.setAttribute('aria-controls', menuId);
        hamburger.setAttribute('type', 'button');
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('tabindex', '0');

        hamburger.addEventListener('click', function() {
            const isOpen = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        });

        hamburger.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                hamburger.click();
            }
        });
    }

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
            }
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
        }
    });

    document.addEventListener('click', function(event) {
        if (hamburger && navMenu && !event.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
        }
    });

    // Contador animado
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            }
        }, 20);
    }

    // Intersection Observer para animar los contadores cuando entren en vista
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(number => {
                    number.classList.add('animate');
                    animateCounter(number);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Smooth scrolling para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cambiar estilo del header al hacer scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        if (!header) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Ocultar/mostrar header al hacer scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Manejo del video de fondo del hero
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        console.log('Hero video element found');
        console.log('Video sources:', heroVideo.querySelectorAll('source').length);
        
        // Función para mostrar información de debug
        const logVideoState = () => {
            console.log('Video ready state:', heroVideo.readyState);
            console.log('Video current time:', heroVideo.currentTime);
            console.log('Video duration:', heroVideo.duration);
            console.log('Video paused:', heroVideo.paused);
            console.log('Video muted:', heroVideo.muted);
        };
        
        // Forzar la reproducción del video
        const playVideo = () => {
            console.log('Attempting to play video...');
            heroVideo.play().then(() => {
                console.log('Video is playing successfully');
                logVideoState();
            }).catch(error => {
                console.log('Error playing video:', error);
                // Si falla, asegurar que esté muted y reintentar
                heroVideo.muted = true;
                console.log('Retrying with muted video...');
                heroVideo.play().catch(e => {
                    console.log('Video failed to play even muted:', e);
                    // Intentar cargar la siguiente fuente
                    tryNextSource();
                });
            });
        };

        // Función para probar la siguiente fuente de video
        let currentSourceIndex = 0;
        const tryNextSource = () => {
            const sources = heroVideo.querySelectorAll('source');
            currentSourceIndex++;
            if (currentSourceIndex < sources.length) {
                console.log(`Trying next source (${currentSourceIndex + 1}/${sources.length}):`, sources[currentSourceIndex].src);
                heroVideo.src = sources[currentSourceIndex].src;
                heroVideo.load();
            } else {
                console.log('All video sources failed, showing fallback');
                // Ocultar el video y mostrar solo el fallback
                heroVideo.style.display = 'none';
            }
        };

        // Eventos del video
        heroVideo.addEventListener('loadstart', () => {
            console.log('Video load started');
        });

        heroVideo.addEventListener('loadedmetadata', () => {
            console.log('Video metadata loaded');
            logVideoState();
        });

        heroVideo.addEventListener('loadeddata', () => {
            console.log('Video data loaded');
            playVideo();
        });

        heroVideo.addEventListener('canplay', () => {
            console.log('Video can play');
            playVideo();
        });

        heroVideo.addEventListener('playing', () => {
            console.log('Video is now playing');
        });
        
        // También intentar reproducir inmediatamente si ya está cargado
        if (heroVideo.readyState >= 3) {
            console.log('Video already loaded, attempting play');
            playVideo();
        }

        // Manejar errores del video
        heroVideo.addEventListener('error', function(e) {
            console.log('Video error event:', e);
            console.log('Video error details:', this.error);
            if (this.error) {
                console.log('Error code:', this.error.code);
                console.log('Error message:', this.error.message);
            }
            // Intentar la siguiente fuente
            tryNextSource();
        });

        // Asegurar que el video se reproduce en bucle
        heroVideo.addEventListener('ended', function() {
            console.log('Video ended, restarting');
            this.currentTime = 0;
            playVideo();
        });

        // Pausar video cuando la pestaña no está visible (ahorro de batería)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                console.log('Tab hidden, pausing video');
                heroVideo.pause();
            } else {
                console.log('Tab visible, resuming video');
                playVideo();
            }
        });

        // Diagnóstico automático después de 5 segundos
        setTimeout(() => {
            if (heroVideo.readyState === 0) {
                console.log('Video still not loading after 5 seconds');
                console.log('Network state:', heroVideo.networkState);
                console.log('Ready state:', heroVideo.readyState);
                
                // Intentar la primera fuente manualmente
                const firstSource = heroVideo.querySelector('source');
                if (firstSource) {
                    console.log('Trying first source manually:', firstSource.src);
                    heroVideo.src = firstSource.src;
                    heroVideo.load();
                }
            }
        }, 5000);
    } else {
        console.log('Hero video element not found');
    }

    // Animación de aparición de elementos al hacer scroll
    const observeElements = document.querySelectorAll('.class-card, .testimonial-slide');
    
    const elementObserver = new IntersectionObserver((entries) => {
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

    observeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        elementObserver.observe(element);
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulación de envío exitoso
                const button = this.querySelector('button');
                const originalText = button.textContent;
                
                button.textContent = '¡Suscrito!';
                button.style.background = '#28a745';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    this.reset();
                }, 2000);
            }
        });
    }

    // Efecto parallax suave para el hero
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroVideo && scrolled < hero.offsetHeight) {
            heroVideo.style.transform = `translateY(${rate}px)`;
        }
    });

    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Completar los mega-menús de páginas que usan una navegación simplificada.
    const menuTemplates = {
        clases: `
            <div class="mega-menu-column"><h3>Cardio</h3><a href="clases.html">Spinning</a><a href="clases.html">Zumba</a><a href="clases.html">Aeróbicos</a></div>
            <div class="mega-menu-column"><h3>Fuerza</h3><a href="clases.html">CrossFit</a><a href="clases.html">Funcional</a><a href="clases.html">Pesas</a></div>
            <div class="mega-menu-column"><h3>Relajación</h3><a href="clases.html">Yoga</a><a href="clases.html">Pilates</a><a href="clases.html">Stretching</a></div>`,
        entrenadores: `<div class="mega-menu-column"><h3>Especialistas</h3><a href="entrenadores.html">Personal Trainers</a><a href="entrenadores.html">Instructores de Grupo</a><a href="entrenadores.html">Nutricionistas</a></div>`,
        precios: `<div class="mega-menu-column"><h3>Membresías</h3><a href="precios.html">Mensual</a><a href="precios.html">Trimestral</a><a href="precios.html">Anual</a></div><div class="mega-menu-column"><h3>Servicios</h3><a href="precios.html#servicios-adicionales">Entrenamiento Personal</a><a href="precios.html#servicios-adicionales">Clases Grupales</a><a href="precios.html#servicios-adicionales">Nutrición</a></div>`
    };

    document.querySelectorAll('.nav-item:not(.mega-menu) > .nav-link').forEach(link => {
        const page = link.getAttribute('href')?.replace('.html', '');
        const template = menuTemplates[page];
        if (!template) return;

        const item = link.parentElement;
        item.classList.add('mega-menu');
        link.innerHTML += ' <i class="fas fa-chevron-down" aria-hidden="true"></i>';
        const content = document.createElement('div');
        content.className = 'mega-menu-content';
        content.setAttribute('role', 'menu');
        content.innerHTML = template;
        item.appendChild(content);
    });

    const megaMenuItems = document.querySelectorAll('.mega-menu');
    
    megaMenuItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const content = item.querySelector('.mega-menu-content');

        if (!link || !content) return;

        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');

        link.addEventListener('click', function(e) {
            const compactNavigation = window.matchMedia('(max-width: 768px)').matches;
            if (!compactNavigation) return;

            e.preventDefault();
            const isOpen = item.classList.contains('active');

            megaMenuItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
            });

            item.classList.toggle('active', !isOpen);
            link.setAttribute('aria-expanded', String(!isOpen));
        });

        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });

    // Cerrar mega menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mega-menu')) {
            megaMenuItems.forEach(item => {
                item.classList.remove('active');
                item.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Animación de entrada para el hero
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 500);

    // Inicializar hero content como invisible
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
    }

    // Efecto de typing para el título principal (opcional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Iniciar el efecto después de un delay
        setTimeout(typeWriter, 1000);
    }

    // Preloader (opcional)
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <i class="fas fa-dumbbell fa-spin"></i>
            <p>Cargando FitGym...</p>
        </div>
    `;
    
    // CSS para el preloader
    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--secondary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
            color: var(--white);
        }
        
        .preloader-content i {
            font-size: 3rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .preloader-content p {
            font-size: 1.2rem;
        }
    `;
    
    document.head.appendChild(preloaderStyle);
    document.body.appendChild(preloader);
    
    // Remover preloader cuando la página esté cargada
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
                preloaderStyle.remove();
            }, 500);
        }, 1000);
    });

    // Performance: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Aquí puedes agregar más funciones que dependan del scroll
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);

    // ========== MODO OSCURO AVANZADO ==========
    initDarkMode();
    
    // ========== SCROLL SNAP ENHANCEMENT ==========
    initScrollSnapEnhancement();
    
    // ========== PARALLAX EFFECTS ==========
    initParallaxEffects();
    
    // ========== INDICADOR DE SCROLL ==========
    initScrollIndicator();
    
    // ========== SCROLL REVEAL AVANZADO ==========
    initAdvancedScrollReveal();
    
    // ========== MICRO-INTERACCIONES Y ANIMACIONES AVANZADAS ==========
    initMicroInteractions();
    initAdvancedAnimations();
    initSVGAnimations();
    initCounterAnimations();
    initParticleEffects();
    
    // ========== INTEGRACIÓN DE ACCESIBILIDAD ==========
    initAllAccessibilityEnhancements();
    
    // ========== SISTEMA DE FILTROS PARA ENTRENADORES ==========
    initTrainerFilters();
});

// ========== FUNCIONALIDAD MODO OSCURO ==========
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('i');
    
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema inicial
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme, themeIcon, themeToggle);
    } else if (prefersDark) {
        body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark', themeIcon, themeToggle);
    }
    
    // Toggle del tema
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Efecto especial en el texto responsive
        const themeResponsiveText = document.querySelector('.theme-responsive-text');
        if (themeResponsiveText) {
            // Agregar clase de transición
            body.classList.add('theme-transition');
            themeResponsiveText.classList.add('theme-change-pulse');
            
            // Efecto de explosión de colores
            setTimeout(() => {
                themeResponsiveText.classList.add('color-burst');
            }, 200);
            
            // Remover clases después de la animación
            setTimeout(() => {
                body.classList.remove('theme-transition');
                themeResponsiveText.classList.remove('theme-change-pulse');
            }, 800);
            
            setTimeout(() => {
                themeResponsiveText.classList.remove('color-burst');
            }, 2200);
        }
        
        // Aplicar nuevo tema con transición suave
        body.style.transition = 'all 0.3s ease';
        body.setAttribute('data-theme', newTheme);
        
        // Guardar preferencia
        localStorage.setItem('theme', newTheme);
        
        // Actualizar icono
        updateThemeIcon(newTheme, themeIcon, themeToggle);
        
        // Animación del botón
        themeToggle.classList.remove('theme-toggle-animate');
        themeToggle.getBoundingClientRect();
        themeToggle.classList.add('theme-toggle-animate');
        
        // Remover transición después del cambio
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
        
        // Notificación visual
        showThemeNotification(newTheme);
    });
    
    // Escuchar cambios en preferencias del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme, themeIcon, themeToggle);
        }
    });
}

function updateThemeIcon(theme, icon, toggle) {
    if (!icon) return;
    icon.classList.remove('theme-icon-sun', 'theme-icon-moon');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        icon.classList.add('theme-icon-sun');
        icon.style.color = '#ffd700';
        toggle?.setAttribute('aria-label', 'Cambiar a modo claro');
        toggle?.setAttribute('aria-checked', 'true');
    } else {
        icon.className = 'fas fa-moon';
        icon.classList.add('theme-icon-moon');
        icon.style.color = '#ffffff';
        toggle?.setAttribute('aria-label', 'Cambiar a modo oscuro');
        toggle?.setAttribute('aria-checked', 'false');
    }
}

function showThemeNotification(theme) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.innerHTML = `
        <i class="fas fa-${theme === 'dark' ? 'moon' : 'sun'}"></i>
        Modo ${theme === 'dark' ? 'oscuro' : 'claro'} activado
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        z-index: 9999;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        font-size: 14px;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========== SCROLL SNAP ENHANCEMENT ==========
function initScrollSnapEnhancement() {
    // Detectar si el usuario está navegando con scroll snap
    let isScrollSnapping = false;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (!isScrollSnapping) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Snap suave a la sección más cercana
                const sections = document.querySelectorAll('.hero, .stats, .classes, .testimonials');
                const scrollPosition = window.pageYOffset;
                const windowHeight = window.innerHeight;
                
                let closestSection = null;
                let closestDistance = Infinity;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const distance = Math.abs(scrollPosition - sectionTop);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestSection = section;
                    }
                });
                
                // Si estamos cerca de una sección, hacer snap
                if (closestDistance < windowHeight * 0.3 && closestSection) {
                    isScrollSnapping = true;
                    closestSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    setTimeout(() => {
                        isScrollSnapping = false;
                    }, 1000);
                }
            }, 150);
        }
    });
}

// ========== EFECTOS PARALLAX ==========
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length === 0) {
        // Añadir clase parallax a algunos elementos existentes
        const hero = document.querySelector('.hero-content');
        const stats = document.querySelector('.stats');
        
        if (hero) hero.classList.add('parallax-element', 'parallax-slow');
        if (stats) stats.classList.add('parallax-element');
    }
    
    // Efecto parallax en scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (element.classList.contains('parallax-slow')) {
                element.style.transform = `translateY(${rate * 0.3}px)`;
            } else {
                element.style.transform = `translateY(${rate * 0.1}px)`;
            }
        });
    });
}

// ========== INDICADOR DE SCROLL ==========
function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (!scrollIndicator) return;
    
    function updateScrollIndicator() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollIndicator.style.setProperty('--scroll-percent', `${scrollPercent}%`);
    }
    
    window.addEventListener('scroll', updateScrollIndicator);
    updateScrollIndicator(); // Inicializar
}

// ========== SCROLL REVEAL AVANZADO ==========
function initAdvancedScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Opcional: dejar de observar después de la primera aparición
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos con clases de scroll reveal
    const revealElements = document.querySelectorAll(`
        .scroll-reveal-left,
        .scroll-reveal-right,
        .scroll-reveal-up,
        .scroll-reveal-down,
        .scroll-reveal-scale,
        .scroll-reveal-rotate
    `);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// ========== MICRO-INTERACCIONES Y EFECTOS AVANZADOS ==========

// Inicializar micro-interacciones
function initMicroInteractions() {
    // Efecto Ripple para botones
    initRippleEffect();
    
    // Efecto Magnetism
    initMagnetismEffect();
    
    // Animaciones SVG
    initSVGAnimations();
    
    // Efectos de partículas
    initParticleEffects();
    
    // Scroll Reveal
    initScrollReveal();
    
    // Contador avanzado
    initAdvancedCounters();
}

// Efecto Ripple
function initRippleEffect() {
    document.querySelectorAll('.ripple').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleAnimation 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Efecto Magnetism
function initMagnetismEffect() {
    document.querySelectorAll('.magnetic').forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
        
        element.addEventListener('mouseleave', function() {
            element.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}

// Animaciones SVG
function initSVGAnimations() {
    // SVG Heartbeat para logos
    document.querySelectorAll('.svg-heartbeat').forEach(svg => {
        svg.addEventListener('mouseenter', function() {
            svg.style.animationDuration = '0.5s';
        });
        
        svg.addEventListener('mouseleave', function() {
            svg.style.animationDuration = '2s';
        });
    });
    
    // SVG Draw animation on scroll
    const drawElements = document.querySelectorAll('.svg-draw');
    const drawObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    });
    
    drawElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        drawObserver.observe(element);
    });
}

// Efectos de partículas
function initParticleEffects() {
    // Crear partículas flotantes
    function createFloatingParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle-snow';
        particle.textContent = Math.random() > 0.5 ? '✨' : '⭐';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 3 + 7) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 10000);
    }
    
    // Crear partículas periódicamente (solo en páginas específicas)
    if (document.body.classList.contains('particles-enabled')) {
        setInterval(createFloatingParticle, 3000);
    }
}

// Scroll Reveal avanzado
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[class*="reveal-"]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Contador avanzado con efectos
function initAdvancedCounters() {
    document.querySelectorAll('.counter-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
        const isTypewriter = counter.classList.contains('typewriter-counter');
        
        function animateCounter() {
            let current = 0;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                current += increment;
                const value = Math.floor(current);
                
                if (isTypewriter) {
                    counter.textContent = value.toString();
                } else {
                    // Efecto de números rodando
                    counter.innerHTML = value.toString().split('').map(digit => 
                        `<span class="rolling-number">${digit}</span>`
                    ).join('');
                }
                
                if (current >= target) {
                    counter.textContent = target + (counter.getAttribute('data-suffix') || '');
                    clearInterval(timer);
                }
            }, 16);
        }
        
        // Observar cuando el contador entra en vista
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });
}

// Spinner de carga dinámico
function showSpinner(element, type = 'basic') {
    const spinnerHTML = {
        basic: '<div class="spinner"></div>',
        pulse: '<div class="spinner-pulse"></div>',
        dots: '<div class="spinner-dots"><span></span><span></span><span></span></div>',
        waves: '<div class="spinner-waves"><span></span><span></span><span></span><span></span><span></span></div>',
        trail: '<div class="spinner-trail"></div>'
    };
    
    element.innerHTML = spinnerHTML[type] || spinnerHTML.basic;
    element.classList.add('loading-container');
}

function hideSpinner(element, originalContent) {
    element.classList.remove('loading-container');
    element.innerHTML = originalContent;
}

// Efecto de carga para botones
function initLoadingButtons() {
    document.querySelectorAll('.btn-loading').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('loading')) return;
            
            this.classList.add('loading');
            
            // Simular carga (en una app real, esto sería una llamada AJAX)
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        });
    });
}

// Animación de texto brillante
function initTextShine() {
    document.querySelectorAll('.text-shine').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animationDuration = '1s';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animationDuration = '2s';
        });
    });
}

// Efectos de hover avanzados
function initAdvancedHovers() {
    // Tilt 3D effect
    document.querySelectorAll('.tilt-3d').forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 4;
            const rotateY = (centerX - x) / 4;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// CSS personalizado para animaciones dinámicas
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleAnimation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60px;
        }
        
        .magnetic {
            transition: transform 0.3s cubic-bezier(0.87, 0, 0.13, 1);
        }
    `;
    document.head.appendChild(style);
}

// Inicializar todas las micro-interacciones
document.addEventListener('DOMContentLoaded', function() {
    injectAnimationStyles();
    initMicroInteractions();
    initLoadingButtons();
    initTextShine();
    initAdvancedHovers();
    
    // Habilitar partículas en páginas específicas
    if (window.location.pathname.includes('index') || window.location.pathname === '/') {
        document.body.classList.add('particles-enabled');
    }
});

// ========== INTEGRACIÓN DE ACCESIBILIDAD ==========

// Mejorar el toggle del modo oscuro con accesibilidad
function initAccessibleThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (window.AccessibilityUtils && window.AccessibilityUtils.toggleAccessibleDarkMode) {
                window.AccessibilityUtils.toggleAccessibleDarkMode();
            } else {
                // Fallback si accessibility.js no está cargado
                toggleDarkMode();
            }
        });
        
        // Manejar navegación por teclado
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

// Mejorar el menú hamburguesa con accesibilidad
function initAccessibleHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isOpen = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle ARIA states
            this.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Anunciar cambio de estado
            if (window.AccessibilityUtils) {
                const message = !isOpen ? 'Menú abierto' : 'Menú cerrado';
                window.AccessibilityUtils.announceToScreenReader(message);
            }
            
            // Gestionar focus
            if (!isOpen) {
                const firstLink = navMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            } else {
                hamburger.focus();
            }
        });
        
        // Cerrar menú con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.click();
            }
        });
    }
}

// Mejorar contadores con anuncios accesibles
function initAccessibleCounters() {
    document.querySelectorAll('.counter-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
        const suffix = counter.getAttribute('data-suffix') || '';
        const isTypewriter = counter.classList.contains('typewriter-counter');
        
        function animateCounter() {
            let current = 0;
            const increment = target / (duration / 16);
            
            // Anunciar inicio de animación
            counter.setAttribute('aria-busy', 'true');
            
            const timer = setInterval(() => {
                current += increment;
                const value = Math.floor(current);
                
                if (isTypewriter) {
                    counter.textContent = value.toString();
                } else {
                    counter.innerHTML = value.toString().split('').map(digit => 
                        `<span class="rolling-number">${digit}</span>`
                    ).join('');
                }
                
                if (current >= target) {
                    counter.textContent = target + suffix;
                    counter.setAttribute('aria-busy', 'false');
                    
                    // Anunciar valor final solo si está visible
                    if (window.AccessibilityUtils && isElementVisible(counter)) {
                        const label = counter.nextElementSibling?.textContent || 'Estadística';
                        window.AccessibilityUtils.announceToScreenReader(`${label}: ${target}${suffix}`);
                    }
                    
                    clearInterval(timer);
                }
            }, 16);
        }
        
        // Observar cuando el contador entra en vista
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter);
    });
}

// Utility function para verificar visibilidad
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Mejorar botones de carga con estados ARIA
function initAccessibleLoadingButtons() {
    document.querySelectorAll('.btn-loading').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('loading')) return;
            
            // Solo prevenir navegación si es un botón, no un enlace
            if (this.tagName.toLowerCase() === 'button') {
                e.preventDefault();
            }
            
            this.classList.add('loading');
            this.setAttribute('aria-busy', 'true');
            
            // Anunciar estado de carga
            if (window.AccessibilityUtils) {
                window.AccessibilityUtils.announceToScreenReader('Cargando contenido...');
            }
            
            // Simular carga
            setTimeout(() => {
                this.classList.remove('loading');
                this.setAttribute('aria-busy', 'false');
                
                if (window.AccessibilityUtils) {
                    window.AccessibilityUtils.announceToScreenReader('Contenido cargado');
                }
            }, 2000);
        });
    });
}

// Mejorar tarjetas interactivas con navegación por teclado
function initAccessibleCards() {
    document.querySelectorAll('.class-card[tabindex="0"]').forEach(card => {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                
                // Buscar botón de play o enlace dentro de la tarjeta
                const playButton = this.querySelector('.fa-play').parentElement;
                const link = this.querySelector('a');
                
                if (playButton && playButton.tagName.toLowerCase() === 'button') {
                    playButton.click();
                } else if (link) {
                    link.click();
                } else {
                    // Acción por defecto - ir a página de clases
                    window.location.href = 'clases.html';
                }
            }
        });
        
        // Mejorar hover con anuncios
        card.addEventListener('mouseenter', function() {
            const title = this.querySelector('h3')?.textContent;
            if (title && window.AccessibilityUtils) {
                window.AccessibilityUtils.updateStatus(`Clase de ${title}`);
            }
        });
    });
}

// Crear panel de configuración de accesibilidad
function createAccessibilityPanel() {
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'accessibility-title');
    panel.setAttribute('aria-hidden', 'true');
    
    panel.innerHTML = `
        <div class="accessibility-panel-content">
            <h2 id="accessibility-title">Configuración de Accesibilidad</h2>
            
            <div class="accessibility-option">
                <button id="toggle-high-contrast" class="btn btn-secondary" 
                        aria-describedby="contrast-desc">
                    Alto Contraste
                </button>
                <p id="contrast-desc" class="accessibility-desc">
                    Mejora el contraste para mejor legibilidad
                </p>
            </div>
            
            <div class="accessibility-option">
                <button id="toggle-reduced-motion" class="btn btn-secondary"
                        aria-describedby="motion-desc">
                    Reducir Animaciones
                </button>
                <p id="motion-desc" class="accessibility-desc">
                    Reduce las animaciones para evitar mareos
                </p>
            </div>
            
            <button class="accessibility-panel-close" aria-label="Cerrar panel de accesibilidad">
                &times;
            </button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Event listeners
    document.getElementById('toggle-high-contrast')?.addEventListener('click', () => {
        if (window.AccessibilityUtils) {
            window.AccessibilityUtils.toggleHighContrast();
        }
    });
    
    document.getElementById('toggle-reduced-motion')?.addEventListener('click', () => {
        if (window.AccessibilityUtils) {
            window.AccessibilityUtils.toggleReducedMotion();
        }
    });
    
    panel.querySelector('.accessibility-panel-close')?.addEventListener('click', () => {
        closeAccessibilityPanel();
    });
}

function openAccessibilityPanel() {
    const panel = document.getElementById('accessibility-panel');
    if (panel) {
        panel.setAttribute('aria-hidden', 'false');
        panel.classList.add('active');
        panel.querySelector('h2')?.focus();
    }
}

function closeAccessibilityPanel() {
    const panel = document.getElementById('accessibility-panel');
    if (panel) {
        panel.setAttribute('aria-hidden', 'true');
        panel.classList.remove('active');
    }
}

// Inicializar todas las mejoras de accesibilidad
function initAllAccessibilityEnhancements() {
    initAccessibleThemeToggle();
    initAccessibleHamburgerMenu();
    initAccessibleCounters();
    initAccessibleLoadingButtons();
    initAccessibleCards();
    createAccessibilityPanel();
    
    // Verificar si hay errores de accesibilidad en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        checkAccessibilityIssues();
    }
}

// Verificar problemas de accesibilidad comunes
function checkAccessibilityIssues() {
    const issues = [];
    
    // Verificar imágenes sin alt
    document.querySelectorAll('img:not([alt])').forEach(img => {
        issues.push('Imagen sin atributo alt encontrada');
        console.warn('Imagen sin alt:', img);
    });
    
    // Verificar botones sin etiquetas
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
        if (!btn.textContent.trim()) {
            issues.push('Botón sin etiqueta accesible encontrado');
            console.warn('Botón sin etiqueta:', btn);
        }
    });
    
    // Verificar enlaces sin texto
    document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])').forEach(link => {
        if (!link.textContent.trim()) {
            issues.push('Enlace sin texto encontrado');
            console.warn('Enlace sin texto:', link);
        }
    });
    
    if (issues.length > 0) {
        console.warn(`${issues.length} problemas de accesibilidad encontrados:`, issues);
    } else {
        console.log('✅ No se encontraron problemas básicos de accesibilidad');
    }
}

// Manejo de errores para video
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.hero-video video');
    if (video) {
        video.addEventListener('error', function() {
            console.log('Error cargando video, usando imagen de respaldo');
            const heroSection = document.querySelector('.hero');
            heroSection.style.background = `
                linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop') center/cover
            `;
        });
    }
});

// ========== SISTEMA DE FILTROS PARA ENTRENADORES ==========
function normalizeFilterText(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function initTrainerFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const trainerCards = document.querySelectorAll('.trainer-card');
    
    // Solo ejecutar si estamos en la página de entrenadores
    if (filterButtons.length === 0 || trainerCards.length === 0) {
        return;
    }
    
    let activeCategory = 'all';
    let searchTerm = '';

    function filterTrainers() {
        let visibleCount = 0;

        trainerCards.forEach(card => {
            const trainerCategory = card.getAttribute('data-category');

            const searchableText = normalizeFilterText(card.textContent);
            const normalizedSearch = normalizeFilterText(searchTerm);
            const matchesCategory = activeCategory === 'all' || trainerCategory?.split(' ').includes(activeCategory);
            const matchesSearch = searchableText.includes(normalizedSearch);
            const isVisible = matchesCategory && matchesSearch;

            if (isVisible) {
                visibleCount += 1;
                card.classList.remove('hidden');
                card.style.display = 'block';
                card.setAttribute('aria-hidden', 'false');
                card.style.animation = 'filterCardIn 0.45s ease both';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
                card.setAttribute('aria-hidden', 'true');
            }
        });

        const resultCounter = document.querySelector('.trainer-results');
        if (resultCounter) {
            resultCounter.textContent = `${visibleCount} entrenador${visibleCount === 1 ? '' : 'es'} encontrado${visibleCount === 1 ? '' : 's'}`;
            resultCounter.classList.toggle('is-empty', visibleCount === 0);
        }
    }
    
    // Event listeners para los botones de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener categoría y filtrar
            activeCategory = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn === this)));
            filterTrainers();
            
            // Efecto visual en el botón
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    const filterContainer = document.querySelector('.trainer-filters .container');
    if (filterContainer && !document.getElementById('trainer-search')) {
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'trainer-search';
        searchWrapper.innerHTML = `
            <label for="trainer-search">Buscar entrenador</label>
            <div class="trainer-search-box">
                <i class="fas fa-search" aria-hidden="true"></i>
                <input id="trainer-search" type="search" placeholder="Nombre, especialidad o disciplina" autocomplete="off">
                <button type="button" class="trainer-search-clear" aria-label="Limpiar búsqueda" hidden>
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        `;
        filterContainer.appendChild(searchWrapper);

        const resultCounter = document.createElement('p');
        resultCounter.className = 'trainer-results';
        resultCounter.setAttribute('aria-live', 'polite');
        filterContainer.appendChild(resultCounter);

        const searchInput = searchWrapper.querySelector('input');
        const clearButton = searchWrapper.querySelector('.trainer-search-clear');
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.toLowerCase().trim();
            clearButton.hidden = !searchTerm;
            filterTrainers();
        });
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchTerm = '';
            clearButton.hidden = true;
            searchInput.focus();
            filterTrainers();
        });
    }

    filterButtons.forEach(button => {
        button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    });
    filterTrainers();
}
