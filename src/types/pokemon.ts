//He definido la interfaz para los objetos Pokemon
// Ya que la API devuelve varios datos, pero solo usaremos estos tres asegurando que el ID es un número
export interface Pokemon { 
  id: number;
  name: string;
  url: string;
 
}
export interface ApiResult {
  name: string;
  url: string;
}

export interface ApiResponse {
  results: ApiResult[];
}