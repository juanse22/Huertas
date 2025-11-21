/**
 * CALI VERDE - Mapa y funcionalidad estática para GitHub Pages
 */

// Configuración del mapa
const MAP_CONFIG = {
    center: [3.4516, -76.5320], // Centro de Cali
    zoom: 12,
    minZoom: 11,
    maxZoom: 18
};

let map = null;
let markersLayer = null;

/**
 * Obtiene el color del marcador según el tipo de huerta
 */
function getIconColor(tipo) {
    const colors = {
        'comunitaria': '#10b981',
        'escolar': '#3b82f6',
        'familiar': '#8b5cf6',
        'default': '#6b7280'
    };
    return colors[tipo] || colors.default;
}

/**
 * Crea el contenido del popup para una huerta
 */
function createPopupContent(huerta) {
    const practicasHTML = huerta.practicas
        .map(p => `<span class="badge">${p}</span>`)
        .join(' ');
    
    return `
        <div class="popup-content">
            <h3>${huerta.nombre}</h3>
            <div class="popup-info">
                <p><strong>Tipo:</strong> <span class="type-${huerta.tipo}">${huerta.tipo}</span></p>
                <p><strong>Barrio:</strong> ${huerta.barrio}</p>
                <p><strong>Responsable:</strong> ${huerta.responsable}</p>
                <p><strong>Dirección:</strong> ${huerta.direccion}</p>
                <div class="practicas">
                    <strong>Prácticas:</strong><br>
                    ${practicasHTML}
                </div>
                <p class="contacto">
                    📞 ${huerta.contacto_tel}<br>
                    📧 ${huerta.contacto_email}
                </p>
            </div>
        </div>
    `;
}

/**
 * Crea un marcador personalizado
 */
function createCustomMarker(huerta) {
    const color = getIconColor(huerta.tipo);
    const iconHTML = `
        <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <span style="transform: rotate(45deg); color: white; font-size: 18px;">🌱</span>
        </div>
    `;
    
    const icon = L.divIcon({
        html: iconHTML,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    
    return L.marker([huerta.lat, huerta.lng], { icon })
        .bindPopup(createPopupContent(huerta));
}

/**
 * Inicializa el mapa de Leaflet
 */
function initDemoMap() {
    // Verificar si el elemento existe
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.warn('Elemento #map no encontrado');
        return;
    }

    // Crear el mapa
    map = L.map('map', {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: true
    });

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Crear grupo de marcadores
    markersLayer = L.layerGroup().addTo(map);

    // Añadir marcadores de todas las huertas
    addMarkersToMap(HUERTAS_DATA);

    // Ajustar vista para mostrar todos los marcadores
    if (HUERTAS_DATA.length > 0) {
        const bounds = L.latLngBounds(
            HUERTAS_DATA.map(h => [h.lat, h.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Añade marcadores al mapa
 */
function addMarkersToMap(huertas) {
    if (!markersLayer) return;
    
    // Limpiar marcadores existentes
    markersLayer.clearLayers();
    
    // Añadir nuevos marcadores
    huertas.forEach(huerta => {
        const marker = createCustomMarker(huerta);
        markersLayer.addLayer(marker);
    });
}

/**
 * Renderiza la lista de huertas
 */
function renderHuertasList(huertas = HUERTAS_DATA) {
    const container = document.getElementById('huertas-list');
    if (!container) return;

    if (huertas.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron huertas con esos filtros.</p>';
        return;
    }

    const html = huertas.map(huerta => `
        <div class="huerta-card" data-id="${huerta.id}">
            <div class="huerta-card-header">
                <h3>${huerta.nombre}</h3>
                <span class="huerta-tipo tipo-${huerta.tipo}">${huerta.tipo}</span>
            </div>
            <div class="huerta-card-body">
                <p><strong>📍 Barrio:</strong> ${huerta.barrio}</p>
                <p><strong>👤 Responsable:</strong> ${huerta.responsable}</p>
                <p><strong>🏠 Dirección:</strong> ${huerta.direccion}</p>
                <div class="practicas-list">
                    ${huerta.practicas.map(p => `<span class="badge badge-success">${p}</span>`).join(' ')}
                </div>
                <div class="huerta-card-footer">
                    <a href="tel:${huerta.contacto_tel}" class="btn-contact">📞 ${huerta.contacto_tel}</a>
                    <button class="btn-map" onclick="centerMap(${huerta.lat}, ${huerta.lng})">Ver en mapa</button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

/**
 * Centra el mapa en una coordenada específica
 */
function centerMap(lat, lng) {
    if (map) {
        map.setView([lat, lng], 16);
        // Scroll al mapa
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Aplica filtros a las huertas
 */
function applyFilters() {
    const tipoFilter = document.getElementById('filter-tipo')?.value || 'all';
    const barrioFilter = document.getElementById('filter-barrio')?.value || 'all';
    
    let filtered = HUERTAS_DATA;
    
    if (tipoFilter !== 'all') {
        filtered = filtered.filter(h => h.tipo === tipoFilter);
    }
    
    if (barrioFilter !== 'all') {
        filtered = filtered.filter(h => h.barrio === barrioFilter);
    }
    
    renderHuertasList(filtered);
    addMarkersToMap(filtered);
}

/**
 * Actualiza las estadísticas
 */
function updateStats() {
    const statsBarrios = document.getElementById('stat-barrios');
    const statsHuertas = document.getElementById('stat-huertas');
    const statsAgroeco = document.getElementById('stat-agroeco');
    
    if (statsHuertas) statsHuertas.textContent = HUERTAS_DATA.length;
    
    if (statsBarrios) {
        const uniqueBarrios = new Set(HUERTAS_DATA.map(h => h.barrio));
        statsBarrios.textContent = uniqueBarrios.size;
    }
    
    if (statsAgroeco) {
        const agroeco = HUERTAS_DATA.filter(h => 
            h.practicas.includes('agroecológica')
        );
        const percentage = Math.round((agroeco.length / HUERTAS_DATA.length) * 100);
        statsAgroeco.textContent = `${percentage}%`;
    }
}

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar mapa
    initDemoMap();
    
    // Renderizar lista de huertas
    renderHuertasList();
    
    // Actualizar estadísticas
    updateStats();
    
    // Event listeners para filtros
    const filterTipo = document.getElementById('filter-tipo');
    const filterBarrio = document.getElementById('filter-barrio');
    
    if (filterTipo) filterTipo.addEventListener('change', applyFilters);
    if (filterBarrio) filterBarrio.addEventListener('change', applyFilters);
});
