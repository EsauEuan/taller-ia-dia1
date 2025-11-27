const API_URL = 'https://rickandmortyapi.com/api/character';
const container = document.getElementById('container');
const searchInput = document.getElementById('searchinput');
const searchBtn = document.getElementById('searchBtn');

let allCharacters = [];

// Cargar personajes al iniciar
document.addEventListener('DOMContentLoaded', () => {
    fetchCharacters();
    
    // Eventos de búsqueda
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

/**
 * Obtiene todos los personajes de la API
 */
async function fetchCharacters() {
    try {
        container.innerHTML = '<div class="loading">Cargando personajes...</div>';
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error de API: ${response.status}`);
        }
        
        const data = await response.json();
        allCharacters = data.results || [];
        
        displayCharacters(allCharacters);
    } catch (error) {
        showError(`Error al cargar los personajes: ${error.message}`);
        console.error('Error:', error);
    }
}

/**
 * Maneja la búsqueda de personajes
 */
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        displayCharacters(allCharacters);
        return;
    }
    
    const filtered = allCharacters.filter(character => 
        character.name.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="no-results">No se encontraron personajes para "${searchTerm}"</div>`;
    } else {
        displayCharacters(filtered);
    }
}

/**
 * Muestra los personajes en el DOM
 */
function displayCharacters(characters) {
    container.innerHTML = '';
    
    if (characters.length === 0) {
        container.innerHTML = '<div class="no-results">No hay personajes para mostrar</div>';
        return;
    }
    
    characters.forEach(character => {
        const card = createCharacterCard(character);
        container.appendChild(card);
    });
}

/**
 * Crea una tarjeta de personaje
 */
function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    
    const statusClass = character.status.toLowerCase();
    const statusLabel = getStatusLabel(character.status);
    
    card.innerHTML = `
        <img 
            src="${character.image}" 
            alt="${character.name}" 
            class="character-image"
            onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'"
        >
        <div class="character-info">
            <div class="character-name">${character.name}</div>
            
            <div class="character-detail">
                <span class="detail-label">Estado:</span>
                <span class="status ${statusClass}">${statusLabel}</span>
            </div>
            
            <div class="character-detail">
                <span class="detail-label">Especie:</span>
                <span>${character.species}</span>
            </div>
            
            <div class="character-detail">
                <span class="detail-label">Ubicación:</span>
                <span>${character.location?.name || 'Desconocida'}</span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Obtiene la etiqueta de estado según el valor
 */
function getStatusLabel(status) {
    const statusMap = {
        'Alive': 'Vivo',
        'Dead': 'Muerto',
        'unknown': 'Desconocido'
    };
    
    return statusMap[status] || status;
}

/**
 * Muestra un mensaje de error
 */
function showError(message) {
    container.innerHTML = `<div class="error">${message}</div>`;
}
