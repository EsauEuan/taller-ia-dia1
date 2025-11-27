// api.js — utilidades para ejercicios de consumo de APIs
// Contiene una función de ejemplo `process` y la función solicitada `obtenerPokemoApi`.

(function () {
	'use strict';

	// FUNCIÓN: obtenerPokemoApi
	// DESCRIPCIÓN: Consulta la PokeAPI por el nombre de un Pokémon y devuelve los datos en JSON.
	// - Imprime el nombre del Pokémon en la consola (si se obtiene correctamente).
	// - Maneja errores de red o de respuesta no encontrada.
	//
	// PARÁMETROS:
	//   - nombre (string): Nombre del Pokémon (p. ej. 'pikachu'). Puede incluir mayúsculas o espacios.
	//
	// RETORNA: (Promise<object|null>) Un objeto JSON con los datos del Pokémon si la consulta fue exitosa,
	//         o null si hubo un error (por ejemplo, Pokémon no encontrado).
	//
	// EJEMPLO DE USO:
	//   obtenerPokemoApi('pikachu').then(data => console.log(data));
	//   // En la consola también se imprimirá el nombre: "pikachu"
	async function obtenerPokemoApi(nombre) {
		if (!nombre || typeof nombre !== 'string') {
			console.error('obtenerPokemoApi: se espera un nombre de Pokémon válido (string)');
			return null;
		}

		// Normalizar el nombre: quitar espacios al inicio/fin y pasar a minúsculas
		const nombreNormalizado = nombre.trim().toLowerCase();

		// URL de la PokeAPI para el recurso de Pokémon por nombre
		const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nombreNormalizado)}`;

		try {
			const res = await fetch(url);
			if (!res.ok) {
				// 404 o cualquier otro status de error
				console.error(`PokeAPI respondió con estado ${res.status} (${res.statusText}) para '${nombreNormalizado}'`);
				return null;
			}

			const data = await res.json();

			// Imprimir en consola el nombre tal como lo devuelve la API (normalmente en minúsculas)
			console.log(data.name);

			return data;
		} catch (err) {
			// Error de red u otro fallo en fetch
			console.error('Error consultando la PokeAPI:', err);
			return null;
		}
	}

	// FUNCION AUXILIAR: process (mantengo del stub previo)
	function process(input) {
		const cleaned = String(input || '').toLowerCase().replace(/\s+/g, '');
		const reversed = cleaned.split('').reverse().join('');
		const isPalindrome = cleaned !== '' && cleaned === reversed;

		return {
			original: input,
			normalized: cleaned,
			reversed: reversed,
			palindrome: isPalindrome,
			timestamp: new Date().toISOString(),
		};
	}

	// Exportar funciones en window.api
	window.api = window.api || {};
	window.api.process = process;
	window.api.obtenerPokemoApi = obtenerPokemoApi;
})();
