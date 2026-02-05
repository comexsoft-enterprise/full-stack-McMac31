// src/services/pokemonService.ts
import { Pokemon, ApiResponse, ApiResult } from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2/pokemon'; //Enlace sin el limite

export const pokemonService = {
  // Método para obtener todos los pokemons
  getAll: async (offset=0, limit=20): Promise<Pokemon[]> => {
    try {
      const response = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);
      if (!response.ok) throw new Error('Error en la petición');
      const data: ApiResponse = await response.json();
      // Mapeo de datos 
      return data.results.map((p: ApiResult) => {
        const parts = p.url.split('/');
        // Extraemos el ID de la URL
        const id = parseInt(parts[parts.length - 2]);
        return {
          name: p.name,
          url: p.url,
          id: id
        };
      });
    } catch (error) {
      console.error('Error en el servicio de Pokemon:', error);
      throw error;
    }
  },
  //Función para ordenar por ID 
  sortById: (list: Pokemon[]): Pokemon[] => {
    const copy = [...list];
    return copy.sort((a, b) => a.id - b.id);
  }
};