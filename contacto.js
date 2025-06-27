// ===== CONTACTO JS =====

// Variables globales
let formSubmissionAttempted = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeValidation();
    initializeCharCounter();
    initializeModal();
    console.log('📧 Sistema de contacto inicializado');
});

// ===== INICIALIZACIÓN DEL FORMULARIO =====
function initializeForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (form && submitBtn) {
        // Prevenir envío por defecto
        form.addEventListener('submit', handleFormSubmit);
        
        // Limpiar formulario al cargar
        form.reset();
        
        // Establecer foco en el primer campo
        const firstInput = form.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 500);
        }
    }
}

// ===== VALIDACIÓN EN TIEMPO REAL =====
function initializeValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validación en tiempo real
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('focus', () => clearFieldErrors(input));
        
        // Validación especial para campos específicos
        if (input.type === 'email') {
            input.addEventListener('input', () => validateEmail(input));
        }
        
        if (input.type === 'tel') {
            input.addEventListener('input', () => formatPhone(input));
        }
        
        if (input.name === 'firstName' || input.name === 'lastName') {
            input.addEventListener('input', () => validateName(input));
        }
        
        // Checkbox de política de privacidad
        if (input.name === 'privacy') {
            input.addEventListener('change', () => validatePrivacyCheckbox(input));
        }
    });
}

// ===== VALIDACIÓN DE CAMPOS INDIVIDUALES =====
function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const errorMsg = formGroup.querySelector('.error-message');
    const successMsg = formGroup.querySelector('.success-message');
    
    let isValid = true;
    let errorMessage = '';
    
    // Validaciones específicas por tipo de campo
    switch (field.type) {
        case 'text':
            if (field.hasAttribute('required') && field.value.trim().length < 2) {
                isValid = false;
                errorMessage = `${field.labels[0].textContent.replace('*', '')} debe tener al menos 2 caracteres`;
            }
            break;
            
        case 'email':
            if (field.hasAttribute('required') && !isValidEmail(field.value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
            break;
            
        case 'tel':
            if (field.value && !isValidPhone(field.value)) {
                isValid = false;
                errorMessage = 'Formato de teléfono inválido';
            }
            break;
            
        default:
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorMessage = 'Este campo es obligatorio';
            }
    }
    
    // Validación para textarea
    if (field.tagName === 'TEXTAREA') {
        const minLength = parseInt(field.getAttribute('minlength')) || 0;
        const maxLength = parseInt(field.getAttribute('maxlength')) || Infinity;
        const length = field.value.trim().length;
        
        if (field.hasAttribute('required') && length < minLength) {
            isValid = false;
            errorMessage = `El mensaje debe tener al menos ${minLength} caracteres`;
        } else if (length > maxLength) {
            isValid = false;
            errorMessage = `El mensaje no puede exceder ${maxLength} caracteres`;
        }
    }
    
    // Validación para select
    if (field.tagName === 'SELECT') {
        if (field.hasAttribute('required') && !field.value) {
            isValid = false;
            errorMessage = 'Selecciona una opción';
        }
    }
    
    // Validación para checkbox de privacidad
    if (field.type === 'checkbox' && field.name === 'privacy') {
        if (field.hasAttribute('required') && !field.checked) {
            isValid = false;
            errorMessage = 'Debes aceptar la política de privacidad';
        }
    }
    
    // Aplicar estilos de validación
    updateFieldValidation(field, isValid, errorMessage);
    
    return isValid;
}

// ===== ACTUALIZAR ESTADO VISUAL DE VALIDACIÓN =====
function updateFieldValidation(field, isValid, errorMessage) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const errorMsg = formGroup.querySelector('.error-message');
    const successMsg = formGroup.querySelector('.success-message');
    
    // Limpiar estados previos
    field.classList.remove('error', 'success');
    
    if (formSubmissionAttempted || field.value.trim()) {
        if (isValid) {
            field.classList.add('success');
            if (successMsg) {
                successMsg.style.opacity = '1';
                successMsg.style.transform = 'translateY(0)';
            }
            if (errorMsg) {
                errorMsg.style.opacity = '0';
                errorMsg.style.transform = 'translateY(-10px)';
            }
        } else {
            field.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = errorMessage;
                errorMsg.style.opacity = '1';
                errorMsg.style.transform = 'translateY(0)';
            }
            if (successMsg) {
                successMsg.style.opacity = '0';
                successMsg.style.transform = 'translateY(-10px)';
            }
        }
    }
}

// ===== LIMPIAR ERRORES DE CAMPO =====
function clearFieldErrors(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const errorMsg = formGroup.querySelector('.error-message');
    
    if (errorMsg) {
        errorMsg.style.opacity = '0';
        errorMsg.style.transform = 'translateY(-10px)';
    }
}

// ===== VALIDACIONES ESPECÍFICAS =====
function validateEmail(field) {
    const email = field.value.trim();
    const formGroup = field.closest('.form-group');
    
    if (email && !isValidEmail(email)) {
        updateFieldValidation(field, false, 'Formato de email inválido');
        return false;
    }
    
    return true;
}

function validateName(field) {
    const name = field.value.trim();
    const formGroup = field.closest('.form-group');
    
    // Validar que solo contenga letras y espacios
    if (name && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name)) {
        updateFieldValidation(field, false, 'Solo se permiten letras y espacios');
        return false;
    }
    
    return true;
}

function validatePrivacyCheckbox(field) {
    const formGroup = field.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-message');
    const successMsg = formGroup.querySelector('.success-message');
    
    if (field.required && !field.checked) {
        if (errorMsg) {
            errorMsg.style.opacity = '1';
            errorMsg.style.transform = 'translateY(0)';
        }
        return false;
    } else {
        if (errorMsg) {
            errorMsg.style.opacity = '0';
            errorMsg.style.transform = 'translateY(-10px)';
        }
        if (successMsg && field.checked) {
            successMsg.style.opacity = '1';
            successMsg.style.transform = 'translateY(0)';
        }
        return true;
    }
}

// ===== FORMATEO DE TELÉFONO =====
function formatPhone(field) {
    let value = field.value.replace(/\D/g, ''); // Remover todo excepto números
    
    // Formatear según la longitud
    if (value.length >= 10) {
        if (value.startsWith('54')) {
            // Formato argentino internacional: +54 11 1234-5678
            value = value.substring(0, 13);
            value = '+54 ' + value.substring(2, 4) + ' ' + value.substring(4, 8) + '-' + value.substring(8);
        } else if (value.startsWith('11')) {
            // Formato argentino local: 11 1234-5678
            value = value.substring(0, 10);
            value = value.substring(0, 2) + ' ' + value.substring(2, 6) + '-' + value.substring(6);
        } else {
            // Formato general
            value = value.substring(0, 10);
        }
    }
    
    field.value = value;
}

// ===== CONTADOR DE CARACTERES =====
function initializeCharCounter() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const charCounter = document.querySelector('.char-counter');
    
    if (messageField && charCount) {
        messageField.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = parseInt(this.getAttribute('maxlength')) || 500;
            
            charCount.textContent = currentLength;
            
            // Cambiar color según el porcentaje usado
            const percentage = (currentLength / maxLength) * 100;
            
            charCounter.classList.remove('warning', 'danger');
            
            if (percentage >= 90) {
                charCounter.classList.add('danger');
            } else if (percentage >= 75) {
                charCounter.classList.add('warning');
            }
        });
    }
}

// ===== MANEJO DE ENVÍO DEL FORMULARIO =====
async function handleFormSubmit(e) {
    e.preventDefault();
    
    formSubmissionAttempted = true;
    const form = e.target;
    const submitBtn = document.querySelector('.submit-btn');
    
    // Validar todos los campos
    const isFormValid = validateForm(form);
    
    if (!isFormValid) {
        showNotification('Por favor, corrige los errores en el formulario', 'error');
        // Hacer scroll al primer campo con error
        const firstError = form.querySelector('.error, input:invalid, select:invalid, textarea:invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }
    
    // Mostrar spinner de carga
    showLoadingState(submitBtn, true);
    
    try {
        // Simular envío (en una aplicación real, aquí iría la llamada al servidor)
        await simulateFormSubmission(new FormData(form));
        
        // Mostrar modal de éxito
        showSuccessModal();
        
        // Resetear formulario
        form.reset();
        formSubmissionAttempted = false;
        
        // Limpiar validaciones visuales
        clearAllValidations(form);
        
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
    } finally {
        showLoadingState(submitBtn, false);
    }
}

// ===== VALIDACIÓN COMPLETA DEL FORMULARIO =====
function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        const fieldValid = validateField(input);
        if (!fieldValid) {
            isValid = false;
        }
    });
    
    return isValid;
}

// ===== SIMULACIÓN DE ENVÍO =====
async function simulateFormSubmission(formData) {
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular posibilidad de error (5% de probabilidad)
    if (Math.random() < 0.05) {
        throw new Error('Error de servidor simulado');
    }
    
    // Log de datos del formulario (solo para desarrollo)
    console.log('📤 Datos del formulario enviados:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    return { success: true, referenceNumber: generateReferenceNumber() };
}

// ===== GENERAR NÚMERO DE REFERENCIA =====
function generateReferenceNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `FG-${timestamp}-${random}`.toUpperCase();
}

// ===== ESTADO DE CARGA =====
function showLoadingState(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        button.querySelector('.spinner').style.display = 'block';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.querySelector('.spinner').style.display = 'none';
    }
}

// ===== MODAL DE ÉXITO =====
function initializeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalOk = document.getElementById('modalOk');
    
    if (modalClose) {
        modalClose.addEventListener('click', hideSuccessModal);
    }
    
    if (modalOk) {
        modalOk.addEventListener('click', hideSuccessModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                hideSuccessModal();
            }
        });
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            hideSuccessModal();
        }
    });
}

function showSuccessModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const referenceNumber = document.getElementById('referenceNumber');
    
    if (modalOverlay) {
        // Generar número de referencia
        if (referenceNumber) {
            referenceNumber.textContent = generateReferenceNumber();
        }
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Hacer foco en el botón de cerrar para accesibilidad
        setTimeout(() => {
            const modalOk = document.getElementById('modalOk');
            if (modalOk) modalOk.focus();
        }, 300);
    }
}

function hideSuccessModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== LIMPIAR VALIDACIONES =====
function clearAllValidations(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
        const formGroup = input.closest('.form-group');
        
        if (formGroup) {
            const errorMsg = formGroup.querySelector('.error-message');
            const successMsg = formGroup.querySelector('.success-message');
            
            if (errorMsg) {
                errorMsg.style.opacity = '0';
                errorMsg.style.transform = 'translateY(-10px)';
            }
            
            if (successMsg) {
                successMsg.style.opacity = '0';
                successMsg.style.transform = 'translateY(-10px)';
            }
        }
    });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info', duration = 5000) {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover después del tiempo especificado
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ===== UTILIDADES DE VALIDACIÓN =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remover espacios, guiones y paréntesis
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    // Validar que tenga al menos 10 dígitos
    return cleanPhone.length >= 10 && /^\d+$/.test(cleanPhone);
}

// ===== MEJORAS DE ACCESIBILIDAD =====
function initializeAccessibility() {
    // Agregar atributos ARIA dinámicamente
    const form = document.getElementById('contactForm');
    if (form) {
        form.setAttribute('novalidate', '');
        form.setAttribute('aria-label', 'Formulario de contacto');
    }
    
    // Asociar mensajes de error con campos
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        const input = group.querySelector('input, select, textarea');
        const errorMsg = group.querySelector('.error-message');
        const successMsg = group.querySelector('.success-message');
        
        if (input && errorMsg) {
            const errorId = `error-${index}`;
            errorMsg.id = errorId;
            input.setAttribute('aria-describedby', errorId);
        }
        
        if (input && successMsg) {
            const successId = `success-${index}`;
            successMsg.id = successId;
        }
    });
}

// Inicializar mejoras de accesibilidad cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// ===== EXPORT PARA TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        isValidEmail,
        isValidPhone,
        formatPhone,
        generateReferenceNumber
    };
}
