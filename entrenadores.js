// JavaScript específico para la página de entrenadores
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const filterButtons = document.querySelectorAll('.filter-btn');
    const trainerCards = document.querySelectorAll('.trainer-card');
    const statNumbers = document.querySelectorAll('.team-stats .stat-number');

    // Filtrado de entrenadores
    function initializeFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Actualizar botón activo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrar tarjetas
                filterTrainers(filter);
            });
        });
    }

    function filterTrainers(filter) {
        trainerCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Animación de barras de habilidades
    function animateSkillBars() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    animateCardSkills(card);
                }
            });
        }, observerOptions);

        trainerCards.forEach(card => {
            skillObserver.observe(card);
        });
    }

    function animateCardSkills(card) {
        const skillBars = card.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const skillValue = bar.getAttribute('data-skill');
            
            // Establecer la variable CSS para la animación
            bar.style.setProperty('--progress-width', skillValue + '%');
            
            // Animar la barra después de un pequeño delay
            setTimeout(() => {
                bar.style.width = skillValue + '%';
            }, 300);
        });
    }

    // Efecto flip mejorado
    function enhanceFlipEffect() {
        trainerCards.forEach(card => {
            let isFlipped = false;
            
            card.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (!isFlipped) {
                    this.style.transform = 'rotateY(180deg)';
                    isFlipped = true;
                    
                    // Animar barras de habilidades cuando se voltea
                    setTimeout(() => {
                        animateCardSkills(this);
                    }, 300);
                } else {
                    this.style.transform = 'rotateY(0deg)';
                    isFlipped = false;
                }
            });

            // Reset al salir con el mouse
            card.addEventListener('mouseleave', function() {
                if (isFlipped) {
                    setTimeout(() => {
                        this.style.transform = 'rotateY(0deg)';
                        isFlipped = false;
                    }, 2000);
                }
            });
        });
    }

    // Contador animado para estadísticas del equipo
    function animateTeamStats() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(number => {
                        animateCounter(number);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.team-stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const increment = isDecimal ? target / 100 : target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = isDecimal ? target.toFixed(1) : target;
                clearInterval(timer);
            } else {
                element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            }
        }, 30);
    }

    // Sistema de rating interactivo
    function enhanceRatingSystem() {
        const ratingStars = document.querySelectorAll('.rating-stars');
        
        ratingStars.forEach(rating => {
            const stars = rating.querySelectorAll('.stars i');
            
            stars.forEach((star, index) => {
                star.addEventListener('mouseenter', function() {
                    // Highlight stars up to current one
                    for (let i = 0; i <= index; i++) {
                        stars[i].style.transform = 'scale(1.2)';
                        stars[i].style.filter = 'drop-shadow(0 0 5px #ffd700)';
                    }
                });
                
                star.addEventListener('mouseleave', function() {
                    // Reset all stars
                    stars.forEach(s => {
                        s.style.transform = 'scale(1)';
                        s.style.filter = 'none';
                    });
                });
            });
        });
    }

    // Búsqueda de entrenadores
    function createSearchFunctionality() {
        const searchContainer = document.querySelector('.trainer-filters .container');
        
        const searchInput = document.createElement('div');
        searchInput.className = 'search-container';
        searchInput.innerHTML = `
            <div class="search-box">
                <input type="text" id="trainer-search" placeholder="Buscar entrenador...">
                <i class="fas fa-search"></i>
            </div>
        `;
        
        searchContainer.appendChild(searchInput);
        
        // Agregar estilos para la búsqueda
        const searchStyle = document.createElement('style');
        searchStyle.textContent = `
            .search-container {
                text-align: center;
                margin-top: 2rem;
            }
            
            .search-box {
                position: relative;
                display: inline-block;
                max-width: 300px;
                width: 100%;
            }
            
            .search-box input {
                width: 100%;
                padding: 0.75rem 2.5rem 0.75rem 1rem;
                border: 2px solid #ddd;
                border-radius: 25px;
                font-size: 1rem;
                transition: var(--transition);
            }
            
            .search-box input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
            }
            
            .search-box i {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #999;
            }
        `;
        
        document.head.appendChild(searchStyle);
        
        // Funcionalidad de búsqueda
        const searchInputField = document.getElementById('trainer-search');
        searchInputField.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            trainerCards.forEach(card => {
                const trainerName = card.querySelector('h3').textContent.toLowerCase();
                const trainerTitle = card.querySelector('.trainer-title').textContent.toLowerCase();
                const specialties = Array.from(card.querySelectorAll('.specialty'))
                    .map(spec => spec.textContent.toLowerCase()).join(' ');
                
                const matchesSearch = trainerName.includes(searchTerm) || 
                                    trainerTitle.includes(searchTerm) || 
                                    specialties.includes(searchTerm);
                
                if (matchesSearch) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    // Modal de contacto
    function handleContactButtons() {
        const contactButtons = document.querySelectorAll('.btn-contact');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const card = this.closest('.trainer-card');
                const trainerName = card.querySelector('h3').textContent;
                const trainerTitle = card.querySelector('.trainer-title').textContent;
                
                showContactModal(trainerName, trainerTitle);
            });
        });
    }

    function showContactModal(name, title) {
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Contactar a ${name}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <p><strong>Especialidad:</strong> ${title}</p>
                    <form class="contact-form">
                        <input type="text" placeholder="Tu nombre" required>
                        <input type="email" placeholder="Tu email" required>
                        <input type="tel" placeholder="Tu teléfono">
                        <select required>
                            <option value="">Selecciona un servicio</option>
                            <option value="consulta">Consulta inicial</option>
                            <option value="entrenamiento">Entrenamiento personal</option>
                            <option value="plan">Plan personalizado</option>
                            <option value="nutricion">Consulta nutricional</option>
                        </select>
                        <textarea placeholder="Mensaje (opcional)" rows="4"></textarea>
                        <button type="submit" class="btn-send">Enviar Mensaje</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Estilos del modal
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .contact-modal {
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
                animation: fadeIn 0.3s ease;
            }
            
            .contact-modal .modal-content {
                background: white;
                border-radius: 15px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideInUp 0.3s ease;
            }
            
            .contact-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                border-bottom: 1px solid #eee;
                padding-bottom: 1rem;
            }
            
            .contact-modal .close-modal {
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
            }
            
            .contact-modal .close-modal:hover {
                color: #333;
            }
            
            .contact-form input,
            .contact-form select,
            .contact-form textarea {
                width: 100%;
                padding: 0.75rem;
                margin-bottom: 1rem;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-sizing: border-box;
                font-family: inherit;
            }
            
            .contact-form textarea {
                resize: vertical;
            }
            
            .btn-send {
                width: 100%;
                padding: 0.75rem;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: var(--transition);
            }
            
            .btn-send:hover {
                background: #e55a2b;
            }
        `;
        
        document.head.appendChild(modalStyle);
        
        // Manejar cierre del modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            modalStyle.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                modalStyle.remove();
            }
        });
        
        // Manejar envío del formulario
        const form = modal.querySelector('.contact-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            
            // Simular envío
            const sendButton = form.querySelector('.btn-send');
            sendButton.textContent = 'Enviando...';
            sendButton.disabled = true;
            
            setTimeout(() => {
                showNotification(`Mensaje enviado a ${name}`);
                modal.remove();
                modalStyle.remove();
            }, 1500);
        });
    }

    // Mostrar notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 1rem 2rem;
                border-radius: 5px;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(notificationStyle);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
                notificationStyle.remove();
            }, 300);
        }, 3000);
    }

    // Efecto parallax sutil en el hero
    function addParallaxEffect() {
        const hero = document.querySelector('.trainers-hero');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Tooltip para especialidades
    function addSpecialtyTooltips() {
        const specialties = document.querySelectorAll('.specialty');
        
        const tooltipData = {
            'CrossFit': 'Entrenamiento funcional de alta intensidad',
            'Funcional': 'Movimientos naturales para el día a día',
            'Yoga': 'Equilibrio entre mente y cuerpo',
            'Nutrición': 'Planes alimentarios personalizados',
            'Spinning': 'Cardio intensivo en bicicleta estática',
            'Cardio': 'Ejercicios cardiovasculares',
            'Zumba': 'Baile fitness con ritmos latinos',
            'Danza': 'Expresión artística y ejercicio',
            'Rehabilitación': 'Recuperación de lesiones',
            'Fisioterapia': 'Tratamiento manual especializado',
            'Dietética': 'Ciencia de la alimentación'
        };
        
        specialties.forEach(specialty => {
            const text = specialty.textContent;
            const tooltip = tooltipData[text];
            
            if (tooltip) {
                specialty.title = tooltip;
                specialty.style.cursor = 'help';
            }
        });
    }

    function addKnowledgeOverlays() {
        trainerCards.forEach(card => {
            const image = card.querySelector('.trainer-image');
            const skills = card.querySelectorAll('.skill-progress');
            if (!image || !skills.length || image.querySelector('.knowledge-overlay')) return;

            const overlay = document.createElement('div');
            overlay.className = 'knowledge-overlay';
            overlay.innerHTML = '<strong>Conocimientos</strong>';

            skills.forEach(skill => {
                const skillItem = skill.closest('.skill-item');
                const label = skillItem?.querySelector('.skill-info span')?.textContent || 'Especialidad';
                const value = skill.dataset.skill || '0';
                overlay.insertAdjacentHTML('beforeend', `
                    <div class="knowledge-row">
                        <span>${label}</span>
                        <span>${value}%</span>
                    </div>
                    <div class="knowledge-bar"><span style="--knowledge-width: ${value}%"></span></div>
                `);
            });

            image.appendChild(overlay);
        });
    }

    // Inicializar todas las funcionalidades
    animateSkillBars();
    enhanceFlipEffect();
    animateTeamStats();
    enhanceRatingSystem();
    handleContactButtons();
    addParallaxEffect();
    addSpecialtyTooltips();
    addKnowledgeOverlays();

    // Animación de entrada escalonada
    setTimeout(() => {
        trainerCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 300);
});

// Función de utilidad para debounce
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
