import { useEffect, useState } from 'react'
import './App.css'

//He definido la interfaz para los objetos Pokemon
// Ya que la API devuelve varios datos, pero solo usaremos estos tres asegurando que el ID es un número
interface Pokemon { 
  id: number;
  name: string;
  url: string;
 
}

function App() {
  //Estados para manejar los pokemons, la librería y el pokedex
  const [library, setLibrary] = useState<Pokemon[]>([])
  const [pokedex, setPokedex] = useState<Pokemon[]>([])
  const[selectedId, setSelectedId]= useState<number | null>(null)

// useEffect para cargar los pokemons al montar el componente
  useEffect(()=>{
    const fetchPokemons = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();
        const cleanPokemons: Pokemon[] = data.results.map((p: any) => {
        const parts = p.url.split('/'); // Divide la URL para extraer el ID
        const id = parseInt(parts[parts.length - 2]); // Extrae el ID de la URL
        return {
          name: p.name,
          url: p.url,
          id: id
        };
      });
        setLibrary(cleanPokemons);
      } catch (error) {
        console.error('Error cargando pokemons:', error);
      }
    };
    fetchPokemons();
  }, []);
  //Prueba de renderizado
  return (
    <>
      {
      <div>
      <h1>Cargando {library.length} Pokemons... </h1>
      </div>
      }
    </>
  )
}

export default App
