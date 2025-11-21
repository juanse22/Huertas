/**
 * CALI VERDE - Lógica del Formulario
 * Validación y envío de nueva huerta
 */

const API_URL = '../api/huertas.php';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('huertaForm');
    const messageDiv = document.getElementById('formMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Limpiar mensaje previo
        messageDiv.style.display = 'none';
        messageDiv.className = 'form-message';

        // Recopilar datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            responsable: document.getElementById('responsable').value.trim() || null,
            barrio: document.getElementById('barrio').value.trim() || null,
            direccion: document.getElementById('direccion').value.trim() || null,
            lat: parseFloat(document.getElementById('lat').value),
            lng: parseFloat(document.getElementById('lng').value),
            tipo: document.getElementById('tipo').value,
            practicas: getPracticasSeleccionadas(),
            contacto_tel: document.getElementById('contacto_tel').value.trim() || null,
            contacto_email: document.getElementById('contacto_email').value.trim() || null,
            fotos: getFotosArray()
        };

        // Validación del lado del cliente
        if (!validarFormulario(formData)) {
            return;
        }

        // Enviar datos a la API
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // Éxito
                mostrarMensaje('success', '✅ ¡Huerta registrada exitosamente! ID: ' + result.id);
                form.reset();
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'huertas.html';
                }, 2000);
            } else {
                // Error del servidor
                const errorMsg = result.error || 'Error al registrar la huerta';
                const details = result.details ? ` - ${result.details}` : '';
                mostrarMensaje('error', '❌ ' + errorMsg + details);
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('error', '❌ Error de conexión. Verifica que el servidor esté activo.');
        }
    });
});

/**
 * Obtener prácticas seleccionadas
 */
function getPracticasSeleccionadas() {
    const checkboxes = document.querySelectorAll('input[name="practicas"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Convertir textarea de fotos a array
 */
function getFotosArray() {
    const fotosText = document.getElementById('fotos').value.trim();
    if (!fotosText) return [];
    
    return fotosText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

/**
 * Validar formulario
 */
function validarFormulario(data) {
    // Validar nombre
    if (!data.nombre || data.nombre.length < 3) {
        mostrarMensaje('error', '❌ El nombre debe tener al menos 3 caracteres');
        return false;
    }

    // Validar coordenadas
    if (isNaN(data.lat) || isNaN(data.lng)) {
        mostrarMensaje('error', '❌ Las coordenadas deben ser números válidos');
        return false;
    }

    // Validar rango de Cali
    if (data.lat < 3.0 || data.lat > 4.0) {
        mostrarMensaje('error', '❌ Latitud fuera de rango. Debe estar entre 3.0 y 4.0');
        return false;
    }

    if (data.lng < -77.0 || data.lng > -76.0) {
        mostrarMensaje('error', '❌ Longitud fuera de rango. Debe estar entre -77.0 y -76.0');
        return false;
    }

    // Validar email si se proporciona
    if (data.contacto_email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.contacto_email)) {
            mostrarMensaje('error', '❌ Email inválido');
            return false;
        }
    }

    return true;
}

/**
 * Mostrar mensaje de éxito/error
 */
function mostrarMensaje(tipo, mensaje) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = mensaje;
    messageDiv.className = `form-message ${tipo}`;
    messageDiv.style.display = 'block';
    
    // Scroll al mensaje
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
