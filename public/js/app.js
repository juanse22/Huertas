/**
 * CALI VERDE - Lógica principal de lista de huertas
 * Carga, filtrado y sincronización con mapa
 */

const API_URL = '../api/huertas.php';

let allHuertas = [];
let filteredHuertas = [];

/**
 * Inicialización
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    initMap();

    // Cargar huertas
    loadHuertas();

    // Event listeners para filtros
    document.getElementById('searchBarrio').addEventListener('input', applyFilters);
    document.getElementById('filterTipo').addEventListener('change', applyFilters);
    document.getElementById('btnReset').addEventListener('click', resetFilters);
});

/**
 * Cargar huertas desde la API
 */
async function loadHuertas() {
    const listContainer = document.getElementById('huertasList');
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Error al cargar huertas');
        }

        allHuertas = await response.json();
        filteredHuertas = [...allHuertas];

        // Renderizar lista y mapa
        renderHuertasList(filteredHuertas);
        addMarkersToMap(filteredHuertas);

        // Actualizar contador
        updateCount(filteredHuertas.length);

    } catch (error) {
        console.error('Error:', error);
        listContainer.innerHTML = `
            <div class="error-message" style="padding: 2rem; text-align: center; color: #e74c3c;">
                ❌ Error al cargar las huertas. Verifica que la API esté funcionando.
            </div>
        `;
    }
}

/**
 * Renderizar lista de huertas
 */
function renderHuertasList(huertas) {
    const listContainer = document.getElementById('huertasList');

    if (huertas.length === 0) {
        listContainer.innerHTML = '<div class="loading">No se encontraron huertas</div>';
        return;
    }

    const html = huertas.map(huerta => {
        const practicas = Array.isArray(huerta.practicas) 
            ? huerta.practicas.slice(0, 2).join(', ')
            : '';

        return `
            <div class="huerta-card" onclick="selectHuerta(${huerta.id})">
                <h4>${huerta.nombre}</h4>
                <span class="badge">${huerta.tipo}</span>
                ${huerta.barrio ? `<span style="color: #666;">📍 ${huerta.barrio}</span>` : ''}
                <div class="info">
                    ${huerta.responsable ? `👤 ${huerta.responsable}<br>` : ''}
                    ${practicas ? `🌿 ${practicas}` : ''}
                </div>
            </div>
        `;
    }).join('');

    listContainer.innerHTML = html;
}

/**
 * Seleccionar una huerta (centrar en mapa)
 */
function selectHuerta(id) {
    const huerta = allHuertas.find(h => h.id === id);
    if (huerta) {
        centerMapOnHuerta(huerta);
    }
}

/**
 * Aplicar filtros
 */
function applyFilters() {
    const searchTerm = document.getElementById('searchBarrio').value.toLowerCase().trim();
    const tipoFilter = document.getElementById('filterTipo').value;

    filteredHuertas = allHuertas.filter(huerta => {
        // Filtro por barrio
        const matchesBarrio = !searchTerm || 
            (huerta.barrio && huerta.barrio.toLowerCase().includes(searchTerm)) ||
            (huerta.nombre && huerta.nombre.toLowerCase().includes(searchTerm));

        // Filtro por tipo
        const matchesTipo = !tipoFilter || huerta.tipo === tipoFilter;

        return matchesBarrio && matchesTipo;
    });

    // Re-renderizar
    renderHuertasList(filteredHuertas);
    addMarkersToMap(filteredHuertas);
    updateCount(filteredHuertas.length);
}

/**
 * Resetear filtros
 */
function resetFilters() {
    document.getElementById('searchBarrio').value = '';
    document.getElementById('filterTipo').value = '';
    applyFilters();
}

/**
 * Actualizar contador
 */
function updateCount(count) {
    document.getElementById('countHuertas').textContent = count;
}

/**
 * Editar huerta (placeholder)
 */
function editHuerta(id) {
    // Para el MVP, simplemente mostrar alert
    // En producción, redireccionar a formulario de edición
    const huerta = allHuertas.find(h => h.id === id);
    if (confirm(`¿Editar huerta "${huerta.nombre}"?\n\n(Funcionalidad de edición completa en desarrollo)`)) {
        // Aquí iría la lógica de edición
        console.log('Editar huerta:', id);
    }
}

/**
 * Eliminar huerta
 */
async function deleteHuerta(id) {
    const huerta = allHuertas.find(h => h.id === id);
    
    if (!confirm(`¿Estás seguro de eliminar "${huerta.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            alert('✅ Huerta eliminada exitosamente');
            
            // Cerrar modal
            document.getElementById('huertaModal').style.display = 'none';
            
            // Recargar lista
            loadHuertas();
        } else {
            alert('❌ Error: ' + (result.error || 'No se pudo eliminar la huerta'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión al eliminar la huerta');
    }
}
