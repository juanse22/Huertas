/**
 * CALI VERDE - Gestión del Mapa con Leaflet
 * Inicialización y markers
 */

let map;
let markers = [];
let markersLayer;

/**
 * Inicializar mapa de Leaflet
 */
function initMap() {
    // Centro de Cali
    const caliCenter = [3.4372, -76.5225];
    
    map = L.map('map').setView(caliCenter, 12);

    // Tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    // Layer group para markers
    markersLayer = L.layerGroup().addTo(map);

    console.log('Mapa inicializado');
}

/**
 * Agregar markers de huertas al mapa
 */
function addMarkersToMap(huertas) {
    // Limpiar markers previos
    markersLayer.clearLayers();
    markers = [];

    huertas.forEach(huerta => {
        // Icono personalizado según tipo
        const iconColor = getIconColor(huerta.tipo);
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${iconColor}; width: 30px; height: 30px; border-radius: 50%; 
                   border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
                   display: flex; align-items: center; justify-content: center; font-size: 18px;">
                   ${getIconEmoji(huerta.tipo)}
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });

        // Crear marker
        const marker = L.marker([huerta.lat, huerta.lng], { icon })
            .bindPopup(createPopupContent(huerta))
            .addTo(markersLayer);

        // Event: al hacer clic en marker, mostrar detalles
        marker.on('click', () => {
            showHuertaDetails(huerta);
        });

        markers.push({ marker, huerta });
    });

    // Ajustar zoom para mostrar todos los markers
    if (markers.length > 0) {
        const group = L.featureGroup(markers.map(m => m.marker));
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

/**
 * Obtener color de icono según tipo
 */
function getIconColor(tipo) {
    const colors = {
        'comunitaria': '#2d7a3e',
        'escolar': '#f39c12',
        'familiar': '#3498db'
    };
    return colors[tipo] || '#95a5a6';
}

/**
 * Obtener emoji según tipo
 */
function getIconEmoji(tipo) {
    const emojis = {
        'comunitaria': '🌱',
        'escolar': '🎓',
        'familiar': '🏠'
    };
    return emojis[tipo] || '🌿';
}

/**
 * Crear contenido del popup
 */
function createPopupContent(huerta) {
    const practicas = Array.isArray(huerta.practicas) 
        ? huerta.practicas.join(', ') 
        : 'N/A';

    return `
        <div style="min-width: 200px;">
            <h4 style="margin: 0 0 0.5rem 0; color: #2d7a3e;">
                ${huerta.nombre}
            </h4>
            <p style="margin: 0.25rem 0; font-size: 0.9rem;">
                <strong>Tipo:</strong> ${huerta.tipo}
            </p>
            ${huerta.barrio ? `<p style="margin: 0.25rem 0; font-size: 0.9rem;">
                <strong>Barrio:</strong> ${huerta.barrio}
            </p>` : ''}
            ${huerta.responsable ? `<p style="margin: 0.25rem 0; font-size: 0.9rem;">
                <strong>Responsable:</strong> ${huerta.responsable}
            </p>` : ''}
            <p style="margin: 0.25rem 0; font-size: 0.85rem; color: #666;">
                <strong>Prácticas:</strong> ${practicas}
            </p>
            <button onclick="showHuertaDetails(${JSON.stringify(huerta).replace(/"/g, '&quot;')})" 
                    style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #2d7a3e; 
                    color: white; border: none; border-radius: 4px; cursor: pointer;">
                Ver detalles
            </button>
        </div>
    `;
}

/**
 * Centrar mapa en una huerta específica
 */
function centerMapOnHuerta(huerta) {
    map.setView([huerta.lat, huerta.lng], 16);
    
    // Encontrar y abrir el popup del marker
    const markerData = markers.find(m => m.huerta.id === huerta.id);
    if (markerData) {
        markerData.marker.openPopup();
    }
}

/**
 * Mostrar detalles de huerta en modal
 */
function showHuertaDetails(huerta) {
    const modal = document.getElementById('huertaModal');
    const modalBody = document.getElementById('modalBody');

    const practicas = Array.isArray(huerta.practicas) 
        ? huerta.practicas.map(p => `<span class="badge">${p}</span>`).join(' ')
        : 'N/A';

    const fotos = Array.isArray(huerta.fotos) && huerta.fotos.length > 0
        ? huerta.fotos.map(f => `<img src="${f}" alt="Foto" style="max-width: 100%; margin: 0.5rem 0; border-radius: 8px;">`).join('')
        : '<p style="color: #999;">Sin fotos</p>';

    modalBody.innerHTML = `
        <h2 style="color: #2d7a3e; margin-bottom: 1rem;">${huerta.nombre}</h2>
        
        <div style="margin-bottom: 1rem;">
            <strong>📍 Ubicación:</strong><br>
            ${huerta.direccion || 'No especificada'}<br>
            ${huerta.barrio ? `Barrio: ${huerta.barrio}<br>` : ''}
            Coordenadas: ${huerta.lat}, ${huerta.lng}
        </div>

        ${huerta.responsable ? `
        <div style="margin-bottom: 1rem;">
            <strong>👤 Responsable:</strong> ${huerta.responsable}
        </div>
        ` : ''}

        <div style="margin-bottom: 1rem;">
            <strong>🏷️ Tipo:</strong> 
            <span class="badge">${huerta.tipo}</span>
        </div>

        <div style="margin-bottom: 1rem;">
            <strong>🌿 Prácticas:</strong><br>
            ${practicas}
        </div>

        ${huerta.contacto_tel || huerta.contacto_email ? `
        <div style="margin-bottom: 1rem;">
            <strong>📞 Contacto:</strong><br>
            ${huerta.contacto_tel ? `Tel: ${huerta.contacto_tel}<br>` : ''}
            ${huerta.contacto_email ? `Email: ${huerta.contacto_email}` : ''}
        </div>
        ` : ''}

        <div style="margin-bottom: 1rem;">
            <strong>📷 Fotos:</strong><br>
            ${fotos}
        </div>

        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
            <button onclick="editHuerta(${huerta.id})" class="btn-secondary" style="margin-right: 0.5rem;">
                ✏️ Editar
            </button>
            <button onclick="deleteHuerta(${huerta.id})" class="btn-secondary" style="background: #e74c3c; color: white;">
                🗑️ Eliminar
            </button>
        </div>
    `;

    modal.style.display = 'flex';
}

// Cerrar modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('huertaModal');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});
