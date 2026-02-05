// src/services/pokemonService.ts
import { Pokemon, ApiResponse, ApiResult } from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20'; //Limite de 20 pokemons

export const pokemonService = {
  // Método para obtener todos los pokemons
  getAll: async (): Promise<Pokemon[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error en la petición');
      const data: ApiResponse = await response.json();
      // Mapeo de datos 
      return data.results.map((p: ApiResult) => {
        const parts = p.url.split('/'); // Divide la URL para extraer el ID
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