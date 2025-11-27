// Uso de la API de OMDB https://www.omdbapi.com/
const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'demo'; // Usa tu API KEY si tienes una. "demo" es muy limitado.

const container = document.getElementById('container');
const searchInput = document.getElementById('searchinput');
const searchBtn = document.getElementById('searchBtn');

document.addEventListener('DOMContentLoaded', () => {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === "Enter") handleSearch();
    });

    // Opcional: carga algo al iniciar, por ejemplo búsqueda de "Avengers"
    fetchMovies('Avengers');
});

async function fetchMovies(query) {
    container.innerHTML = '<div class="loading">Buscando películas y series...</div>';
    try {
        const res = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Error API: ' + res.status);

        const data = await res.json();
        if (data.Response === "False") {
            container.innerHTML = `<div class="no-results">${data.Error}</div>`;
            return;
        }

        // OMDB puede devolver solo títulos tipo: película, serie, episodio
        let list = data.Search || [];
        // Traer detalles adicionales por cada título
        let detailList = await Promise.all(
            list.map(async item => {
                let detailRes = await fetch(`${API_URL}?apikey=${API_KEY}&i=${item.imdbID}`);
                let detail = await detailRes.json();
                return detail;
            })
        );

        displayMovies(detailList);
    } catch (err) {
        container.innerHTML = `<div class="error">Error: ${err.message}</div>`;
        console.error(err);
    }
}

function handleSearch() {
    const term = searchInput.value.trim();
    if (!term) {
        container.innerHTML = '<div class="no-results">Por favor introduce un término de búsqueda.</div>';
        return;
    }
    fetchMovies(term);
}

function displayMovies(movies) {
    container.innerHTML = '';
    if (!movies.length) {
        container.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
        return;
    }

    movies.forEach(movie => {
        container.appendChild(createMovieCard(movie));
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'card';

    // Estado (depende del tipo y año de estreno)
    // - Película: "en estreno" (año igual al actual y tipo Movie), "por estrenar" (año mayor), default: gris
    // - Series: "en emisión" si el campo Released < hoy y Genre incluye "Series", "próximamente" si año mayor a actual, default: gris
    let statusText = '';
    let statusClass = '';
    const year = movie.Year && /^\d+$/.test(movie.Year) ? parseInt(movie.Year) : null;
    const ahora = new Date().getFullYear();

    if (movie.Type === "movie") {
        if (year === ahora) {
            statusText = "En estreno";
            statusClass = "estreno";
        } else if (year && year > ahora) {
            statusText = "Por estrenar";
            statusClass = "porestrenar";
        } else {
            statusText = "Por estrenar";
            statusClass = "porestrenar";
        }
    } else if (movie.Type === "series" || movie.Type === "series" || (movie.Type ==="series" || movie.Type==="series" || movie.Type==="series")) {
        // OMDB retorna Type: "series"
        if (year === ahora) {
            statusText = "En emisión";
            statusClass = "emision";
        } else if (year && year > ahora) {
            statusText = "Próximamente";
            statusClass = "proximamente";
        } else {
            statusText = "En emisión";
            statusClass = "emision";
        }
    } else if (movie.Type === "series") {
        statusText = "En emisión";
        statusClass = "emision";
    } else {
        statusText = "Por estrenar";
        statusClass = "porestrenar";
    }

    let poster = movie.Poster && movie.Poster !== "N/A" ?
        movie.Poster : "https://via.placeholder.com/300x400?text=No+Image";

    // Género, año
    let genres = movie.Genre ? movie.Genre.split(',') : [];
    let genreHtml = genres.map(g => `<span class="genre">${g.trim()}</span>`).join('');
    let yearText = year ? year : 'Desconocido';

    // Personajes y actores
    let actors = movie.Actors && movie.Actors !== "N/A" ? movie.Actors.split(',') : [];
    let charactersHtml = actors.length
        ? `<div class="characters"><strong>Personajes:</strong> ${actors.map(a => a.trim()).join(', ')}</div>`
        : '';

    card.innerHTML = `
        <img
            src="${poster}"
            alt="${movie.Title}"
            class="card-image"
            onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'"
        >
        <div class="card-content">
            <div class="card-title">${movie.Title}</div>
            <div class="card-info">
                <span class="year">${yearText}</span>
                ${genreHtml}
            </div>
            <div class="card-info">
                <span class="status ${statusClass}">${statusText}</span>
            </div>
            ${charactersHtml}
        </div>
    `;
    return card;
}