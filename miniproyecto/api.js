const DOG_API = 'https://dog.ceo/api/';
const CAT_API = 'https://api.thecatapi.com/v1/images/search?limit=6';
const BIRD_API = 'https://some-random-api.com/animal/bird'; // solo uno! simulamos varios
// No hay API gratuita de reptiles con imágenes libres, así que simulamos localmente

const container = document.getElementById('container');
const searchInput = document.getElementById('searchinput');
const searchBtn = document.getElementById('searchBtn');

const INFO = {
    perro: {status: "Activo",personality:"Leal, juguetón, sociable",diet:"Croquetas, carne, pollo",habits:"Salir a pasear, jugar, dormir",size:"Mediano",extra:"Compañeros fieles"},
    gato: {status:"Independiente",personality:"Curioso, ágil, cariñoso",diet:"Croquetas, pescado, pollo",habits:"Dormir mucho, asearse, cazar",size:"Mediano",extra:"Muy ágiles y curiosos"},
    ave: {status:"Veloz",personality:"Alegre, alerta, sociable",diet:"Semillas, fruta, insectos",habits:"Volar, cantar, buscar alimento",size:"Chico",extra:"Grandes cantantes"},
    reptil: {status:"Tranquilo",personality:"Calmado, paciente, silencioso",diet:"Insectos, vegetales, pequeños animales",habits:"Tomar sol, esconderse, cazar",size:"Mediano",extra:"Su piel escamosa es única"},
    labrador: {status: "Activo",personality:"Amigable, sociable, energético",diet:"Croquetas, carne, pollo, verduras",habits:"Jugar en parques, nadar, busca compañía",size:"Grande",extra:"Excelentes en asistencia y rescate"},
    chihuahua: {status:"Alerta",personality:"Valiente, protector, vivaz",diet:"Croquetas pequeñas, carne magra",habits:"Muerde juguetes, duerme en mantas",size:"Chico",extra:"Muy longevos y vocales"},
    poodle: {status:"Inteligente",personality:"Leal, activo, fácil de entrenar",diet:"Croquetas premium, arroz, pollo",habits:"Aprende trucos rápido, disfruta compañía humana",size:"Mediano",extra:"Casi no suelta pelo"}
};

// Local demo para reptiles y aves
const REPTILES = [
  {image:'https://images.pexels.com/photos/53980/pexels-photo-53980.jpeg',name:'Iguana'},
  {image:'https://images.pexels.com/photos/162020/lizard-reptile-green-animals-162020.jpeg',name:'Lagarto'},
  {image:'https://images.pexels.com/photos/518259/pexels-photo-518259.jpeg',name:'Tortuga'}
];
const AVES = [
  {image:'https://images.pexels.com/photos/45911/peacock-bird-colorful-feathers-45911.jpeg',name:'Pavo real'},
  {image:'https://images.pexels.com/photos/2300842/pexels-photo-2300842.jpeg',name:'Canario'},
  {image:'https://images.pexels.com/photos/3889691/pexels-photo-3889691.jpeg',name:'Loro'}
];

document.addEventListener('DOMContentLoaded', () => {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => { if (e.key === "Enter") handleSearch(); });

    mostrarMascotaRandom();
});

function handleSearch() {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
        container.innerHTML = '<div class="no-results">Por favor, escribe una especie o raza.</div>';
        return;
    }
    if (["perro","perros"].includes(term)) {
        buscarVariosPerros();
    } else if (["gato","gatos"].includes(term)) {
        buscarVariosGatos();
    } else if (["ave","aves"].includes(term)) {
        mostrarVariasAves();
    } else if (["reptil","reptiles"].includes(term)) {
        mostrarVariosReptiles();
    } else {
        buscarMascotaPorRaza(term);
    }
}

function mostrarMascotaRandom() {
    const especies = ['perros', 'gatos', 'aves', 'reptiles'];
    const especie = especies[Math.floor(Math.random() * especies.length)];
    if (especie === 'perros') buscarVariosPerros();
    else if (especie === 'gatos') buscarVariosGatos();
    else if (especie === 'aves') mostrarVariasAves();
    else mostrarVariosReptiles();
}

// PERROS - muestra 6 random de distintos breeds
async function buscarVariosPerros() {
    container.innerHTML = '<div class="loading">Buscando varios perros...</div>';
    try {
        let breedsRes = await fetch(`${DOG_API}breeds/list/all`);
        let breedsData = await breedsRes.json();
        let breeds = Object.keys(breedsData.message);
        let selected = [];
        // Elige 6 razas aleatorias
        while(selected.length<6 && breeds.length){
            let idx = Math.floor(Math.random()*breeds.length);
            selected.push(breeds[idx]);
            breeds.splice(idx,1);
        }
        let promises = selected.map(breed=>fetch(`${DOG_API}breed/${breed}/images/random`));
        let imagesData = await Promise.all(promises.map(r=>r.then(resp=>resp.json())));
        let cards = imagesData.map((img,i)=>({
            image: img.message,
            name: capitalize(selected[i]),
            especie: "Perro",
            ...INFO[selected[i]]||INFO["perro"]
        }));
        mostrarGridMascotas(cards);
    } catch {
        container.innerHTML = `<div class="no-results">No se pudieron cargar los perros.</div>`;
    }
}

// GATOS - TheCatAPI, 6 random
async function buscarVariosGatos() {
    container.innerHTML = '<div class="loading">Buscando varios gatos...</div>';
    try {
        let res = await fetch(CAT_API);
        let data = await res.json();
        let cards = data.map(cat=>({
            image: cat.url || "https://via.placeholder.com/300x300?text=Gato",
            name: "Gato",
            especie: "Gato",
            ...INFO["gato"]
        }));
        mostrarGridMascotas(cards);
    } catch {
        container.innerHTML = `<div class="no-results">No se pudieron cargar los gatos.</div>`;
    }
}

// AVES
function mostrarVariasAves() {
    container.innerHTML = '<div class="loading">Buscando varias aves...</div>';
    setTimeout(()=>{
        let cards = AVES.map(a=>({
            image: a.image,
            name: a.name,
            especie: "Ave",
            ...INFO["ave"]
        }));
        mostrarGridMascotas(cards);
    },400);
}

// REPTILES
function mostrarVariosReptiles() {
    container.innerHTML = '<div class="loading">Buscando varios reptiles...</div>';
    setTimeout(()=>{
      let cards = REPTILES.map(r=>({
        image: r.image,
        name: r.name,
        especie: "Reptil",
        ...INFO["reptil"]
      }));
      mostrarGridMascotas(cards);
    },400);
}

// Buscar perro por raza y fallback especie única (gato, ave, reptil)
async function buscarMascotaPorRaza(term) {
    // Solo Dog CEO soporta búsqueda por raza
    container.innerHTML = '<div class="loading">Buscando mascota por raza/especie...</div>';
    let url = `${DOG_API}breed/${term}/images/random`;
    let res = await fetch(url);
    let data = await res.json();
    if (data.status === "success") {
        mostrarGridMascotas([{
            image: data.message,
            name: capitalize(term),
            especie: "Perro",
            ...INFO[term]||INFO["perro"]
        }]);
    } else if (term==="gato") {
        buscarVariosGatos();
    } else if (term==="ave") {
        mostrarVariasAves();
    } else if (term==="reptil") {
        mostrarVariosReptiles();
    } else {
        container.innerHTML = `<div class="no-results">No se encontró la raza o especie "${term}".</div>`;
    }
}

// Render grid
function mostrarGridMascotas(mascotas) {
    container.innerHTML = '';
    mascotas.forEach(mascota=>container.appendChild(crearCardMascota(mascota)));
}

// Card visual
function crearCardMascota(mascota) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img 
            src="${mascota.image}" 
            alt="${mascota.name}" 
            class="card-image"
            onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'"
        >
        <div class="card-content">
            <div class="card-title">${mascota.name}</div>
            <div class="status"><strong>Estado:</strong> ${mascota.status}</div>
            <div class="personality"><strong>Personalidad:</strong> ${mascota.personality}</div>
            <div class="card-info"><strong>Especie/Raza:</strong> ${mascota.especie}</div>
            <div class="diet"><strong>Alimentación:</strong> ${mascota.diet}</div>
            <div class="habits"><strong>Hábitos:</strong> ${mascota.habits}</div>
            <div class="size"><strong>Tamaño:</strong> ${mascota.size}</div>
            <div class="extra"><strong>Dato extra:</strong> ${mascota.extra}</div>
        </div>
    `;
    return card;
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}