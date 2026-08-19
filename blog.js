// ============================================================================
// BLOG.JS - FitGym Blog JavaScript
// Funcionalidades: Scroll Reveal, Filtros CSS-only mejorados, Animaciones
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initCategoryFilters();
    initSearchFunctionality();
    initSmoothScrolling();
    initArticleAnimations();
    initLazyLoading();
    initCommentInteractions();
    // El modo claro/oscuro se inicializa en el script compartido.
});

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================

function initScrollReveal() {
    // Configuración del observer para scroll reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Opcional: dejar de observar después de la primera aparición
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos a animar con scroll reveal
    const revealElements = document.querySelectorAll('.article-card, .comment, .newsletter-section, .filter-tags');
    
    revealElements.forEach((element, index) => {
        // Añadir clase inicial para ocultar elementos
        element.classList.add('scroll-reveal');
        
        // Añadir delay escalonado para efecto cascada
        element.style.setProperty('--reveal-delay', `${index * 0.1}s`);
        
        // Comenzar a observar el elemento
        observer.observe(element);
    });

    // Animación especial para artículos del grid
    animateGridArticles();
}

function animateGridArticles() {
    const articles = document.querySelectorAll('.newspaper-grid .article-card');
    
    articles.forEach((article, index) => {
        article.style.setProperty('--animation-delay', `${index * 0.15}s`);
        
        // Animación de entrada desde diferentes direcciones
        const animationClass = getArticleAnimationClass(index);
        article.classList.add(animationClass);
    });
}

function getArticleAnimationClass(index) {
    const animations = ['fade-in-up', 'fade-in-left', 'fade-in-right', 'fade-in-down'];
    return animations[index % animations.length];
}

// ============================================================================
// SISTEMA DE FILTROS MEJORADO
// ============================================================================

function initCategoryFilters() {
    const filterInputs = document.querySelectorAll('input[name="category"]');
    const articles = document.querySelectorAll('.article-card');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            const selectedCategory = this.value;
            filterArticles(selectedCategory, articles);
            updateFilterStats(selectedCategory, articles);
            animateFilteredResults();
        });
    });
}

function filterArticles(category, articles) {
    articles.forEach(article => {
        const articleCategory = article.getAttribute('data-category');
        const shouldShow = category === 'all' || articleCategory === category;
        
        if (shouldShow) {
            article.classList.remove('filtered-out');
            article.classList.add('filtered-in');
        } else {
            article.classList.remove('filtered-in');
            article.classList.add('filtered-out');
        }
    });
}

function updateFilterStats(category, articles) {
    const visibleCount = document.querySelectorAll('.article-card.filtered-in, .article-card:not(.filtered-out):not(.filtered-in)').length;
    
    // Crear o actualizar contador de resultados
    let resultsCounter = document.querySelector('.results-counter');
    if (!resultsCounter) {
        resultsCounter = document.createElement('div');
        resultsCounter.className = 'results-counter';
        document.querySelector('.filters-section .container').appendChild(resultsCounter);
    }
    
    const categoryName = category === 'all' ? 'todos los artículos' : 
                        document.querySelector(`label[for="${category}"]`).textContent.toLowerCase();
    
    resultsCounter.innerHTML = `
        <i class="fas fa-filter"></i>
        Mostrando ${visibleCount} artículo${visibleCount !== 1 ? 's' : ''} en ${categoryName}
    `;
    
    // Animación del contador
    resultsCounter.style.opacity = '0';
    setTimeout(() => {
        resultsCounter.style.opacity = '1';
    }, 100);
}

function animateFilteredResults() {
    const visibleArticles = document.querySelectorAll('.article-card:not(.filtered-out)');
    
    visibleArticles.forEach((article, index) => {
        article.style.animationDelay = `${index * 0.1}s`;
        article.classList.add('filter-reveal');
        
        setTimeout(() => {
            article.classList.remove('filter-reveal');
        }, 1000);
    });
}

// ============================================================================
// FUNCIONALIDAD DE BÚSQUEDA
// ============================================================================

function initSearchFunctionality() {
    // Crear barra de búsqueda si no existe
    createSearchBar();
    
    const searchInput = document.querySelector('.blog-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('search-focused');
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('search-focused');
        });
    }
}

function createSearchBar() {
    const filtersSection = document.querySelector('.filters-section .container');
    if (filtersSection && !document.querySelector('.blog-search')) {
        const searchHTML = `
            <div class="blog-search">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="blog-search-input" placeholder="Buscar artículos..." />
                    <button class="search-clear" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        filtersSection.insertAdjacentHTML('afterbegin', searchHTML);
        
        // Agregar funcionalidad al botón de limpiar
        const clearButton = document.querySelector('.search-clear');
        const searchInput = document.querySelector('.blog-search-input');
        
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            handleSearch({ target: { value: '' }});
            clearButton.style.display = 'none';
        });
        
        searchInput.addEventListener('input', (e) => {
            clearButton.style.display = e.target.value ? 'block' : 'none';
        });
    }
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const articles = document.querySelectorAll('.article-card');
    
    articles.forEach(article => {
        const title = article.querySelector('h2, h3').textContent.toLowerCase();
        const excerpt = article.querySelector('.article-excerpt')?.textContent.toLowerCase() || '';
        const category = article.querySelector('.category-badge')?.textContent.toLowerCase() || '';
        
        const isMatch = title.includes(searchTerm) || 
                       excerpt.includes(searchTerm) || 
                       category.includes(searchTerm);
        
        if (searchTerm === '' || isMatch) {
            article.classList.remove('search-hidden');
            article.classList.add('search-visible');
        } else {
            article.classList.add('search-hidden');
            article.classList.remove('search-visible');
        }
    });
    
    updateSearchResults(searchTerm, articles);
}

function updateSearchResults(searchTerm, articles) {
    if (searchTerm === '') {
        // Remover indicador de búsqueda si existe
        const searchIndicator = document.querySelector('.search-results-indicator');
        if (searchIndicator) {
            searchIndicator.remove();
        }
        return;
    }
    
    const visibleCount = document.querySelectorAll('.article-card:not(.search-hidden)').length;
    
    let searchIndicator = document.querySelector('.search-results-indicator');
    if (!searchIndicator) {
        searchIndicator = document.createElement('div');
        searchIndicator.className = 'search-results-indicator';
        document.querySelector('.blog-search').appendChild(searchIndicator);
    }
    
    searchIndicator.innerHTML = `
        <i class="fas fa-search"></i>
        ${visibleCount} resultado${visibleCount !== 1 ? 's' : ''} para "${searchTerm}"
        ${visibleCount === 0 ? '<span class="no-results">No se encontraron artículos</span>' : ''}
    `;
}

// ============================================================================
// SMOOTH SCROLLING Y NAVEGACIÓN
// ============================================================================

function initSmoothScrolling() {
    // Smooth scroll para enlaces internos
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
    
    // Botón de volver arriba
    createBackToTopButton();
}

function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(backToTop);
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Funcionalidad del botón
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================================================
// ANIMACIONES ADICIONALES
// ============================================================================

function initArticleAnimations() {
    // Hover effects mejorados para artículos
    const articles = document.querySelectorAll('.article-card');
    
    articles.forEach(article => {
        article.addEventListener('mouseenter', function() {
            this.classList.add('article-hover');
        });
        
        article.addEventListener('mouseleave', function() {
            this.classList.remove('article-hover');
        });
        
        // Efecto de lectura
        article.addEventListener('click', function(e) {
            if (!e.target.closest('a')) {
                this.classList.add('article-reading');
                setTimeout(() => {
                    this.classList.remove('article-reading');
                }, 2000);
            }
        });
    });
    
    // Animación de badges de categorías
    const categoryBadges = document.querySelectorAll('.category-badge');
    categoryBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// ============================================================================
// LAZY LOADING DE IMÁGENES
// ============================================================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================================================
// INTERACCIONES DE COMENTARIOS
// ============================================================================

function initCommentInteractions() {
    // Animación al cargar comentarios
    const comments = document.querySelectorAll('.comment');
    comments.forEach((comment, index) => {
        comment.style.setProperty('--comment-delay', `${index * 0.1}s`);
    });
    
    // Efecto hover en avatares de comentarios
    const avatars = document.querySelectorAll('.comment-avatar');
    avatars.forEach(avatar => {
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Botones de reacción en comentarios (si existen)
    const reactionButtons = document.querySelectorAll('.comment-reaction');
    reactionButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Animación de reacción
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// ============================================================================
// MODO OSCURO PARA BLOG
// ============================================================================

function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');
    
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema inicial
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme, themeIcon);
    } else if (prefersDark) {
        body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark', themeIcon);
    }
    
    // Toggle del tema
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Aplicar nuevo tema con transición suave
        body.style.transition = 'all 0.3s ease';
        body.setAttribute('data-theme', newTheme);
        
        // Guardar preferencia
        localStorage.setItem('theme', newTheme);
        
        // Actualizar icono
        updateThemeIcon(newTheme, themeIcon);
        
        // Animación del botón
        themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1) rotate(0deg)';
        }, 150);
        
        // Remover transición después del cambio
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
        
        // Notificación visual
        showThemeNotification(newTheme);
    });
}

function updateThemeIcon(theme, icon) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        icon.style.color = '#ffd700';
    } else {
        icon.className = 'fas fa-moon';
        icon.style.color = '#ffffff';
    }
}

function showThemeNotification(theme) {
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
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============================================================================
// UTILIDADES
// ============================================================================

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

// ============================================================================
// ANIMATIONS CSS DINÁMICAS
// ============================================================================

// Añadir estilos CSS dinámicos para las animaciones
const style = document.createElement('style');
style.textContent = `
    /* Scroll Reveal Animations */
    .scroll-reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transition-delay: var(--reveal-delay, 0s);
    }
    
    .scroll-reveal.reveal-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Animaciones específicas para artículos */
    .fade-in-up {
        transform: translateY(50px);
    }
    
    .fade-in-left {
        transform: translateX(-50px);
    }
    
    .fade-in-right {
        transform: translateX(50px);
    }
    
    .fade-in-down {
        transform: translateY(-50px);
    }
    
    /* Filtros y búsqueda */
    .filtered-out {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
        transition: all 0.5s ease;
    }
    
    .filtered-in {
        opacity: 1;
        transform: scale(1);
        transition: all 0.5s ease;
    }
    
    .search-hidden {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
        pointer-events: none;
        transition: all 0.4s ease;
    }
    
    .search-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        transition: all 0.4s ease;
    }
    
    .filter-reveal {
        animation: filterReveal 0.6s ease forwards;
    }
    
    @keyframes filterReveal {
        0% { opacity: 0; transform: translateY(20px) scale(0.9); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    /* Búsqueda */
    .blog-search {
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .search-container {
        position: relative;
        display: inline-block;
        width: 100%;
        max-width: 500px;
    }
    
    .blog-search-input {
        width: 100%;
        padding: 15px 50px 15px 50px;
        border: 2px solid var(--border-color, #ddd);
        border-radius: 50px;
        font-size: 16px;
        transition: all 0.3s ease;
        background: white;
    }
    
    .blog-search-input:focus {
        outline: none;
        border-color: var(--primary-color, #FF6B35);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    
    .search-icon {
        position: absolute;
        left: 18px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        font-size: 18px;
    }
    
    .search-clear {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .search-clear:hover {
        background: #f5f5f5;
        color: #333;
    }
    
    .search-focused {
        transform: scale(1.02);
    }
    
    .search-results-indicator {
        margin-top: 1rem;
        padding: 10px 20px;
        background: #f8f9fa;
        border-radius: 20px;
        font-size: 14px;
        color: #666;
        display: inline-block;
    }
    
    .no-results {
        color: #e74c3c;
        font-weight: 500;
        margin-left: 10px;
    }
    
    .results-counter {
        margin-top: 1rem;
        text-align: center;
        color: #666;
        font-size: 14px;
        transition: opacity 0.3s ease;
    }
    
    .results-counter i {
        margin-right: 8px;
        color: var(--primary-color, #FF6B35);
    }
    
    /* Back to top button */
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color, #FF6B35);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .back-to-top:hover {
        background: var(--primary-dark, #e55a2b);
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    
    /* Hover effects para artículos */
    .article-hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .article-reading {
        transform: scale(1.02);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    /* Modo oscuro */
    [data-theme="dark"] {
        background-color: #121212;
        color: #e0e0e0;
    }
    
    [data-theme="dark"] a {
        color: #bb86fc;
    }
    
    [data-theme="dark"] .card {
        background-color: #1e1e1e;
        border-color: #333;
    }
    
    [data-theme="dark"] .article-card {
        background-color: #2c2c2c;
        border-color: #444;
    }
    
    [data-theme="dark"] .comment {
        background-color: #2c2c2c;
        border-color: #444;
    }
    
    [data-theme="dark"] .newsletter-section {
        background-color: #2c2c2c;
    }
    
    [data-theme="dark"] .filter-tags {
        background-color: #2c2c2c;
        border-color: #444;
    }
    
    [data-theme="dark"] .results-counter {
        color: #ddd;
    }
    
    [data-theme="dark"] .search-results-indicator {
        background: #333;
        color: #ddd;
    }
    
    [data-theme="dark"] .theme-notification {
        background: #bb86fc;
        color: #121212;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .blog-search-input {
            padding: 12px 40px 12px 40px;
            font-size: 14px;
        }
        
        .search-icon {
            left: 15px;
            font-size: 16px;
        }
        
        .search-clear {
            right: 12px;
        }
        
        .back-to-top {
            width: 45px;
            height: 45px;
            bottom: 20px;
            right: 20px;
        }
    }
`;

document.head.appendChild(style);

// ============================================================================
// INICIALIZACIÓN FINAL
// ============================================================================

// Mensaje de consola para debug
console.log('🎯 Blog FitGym JavaScript cargado correctamente');
console.log('✨ Funcionalidades activas: Scroll Reveal, Filtros, Búsqueda, Animaciones');
