import { useEffect, useState } from 'react';
import './App.css';
import { pokemonService } from './services/pokemon_Service';
import { Pokemon } from './types/pokemon';

function App() {
  //Estados para la biblioteca, la pokedex y el pokemon seleccionado
  const [library, setLibrary] = useState<Pokemon[]>([]);
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Carga inicial de pokemons usando el servicio
  useEffect(() => {
    // Función asíncrona para cargar pokemons
    const loadPokemons = async () => {
      try {
        const data = await pokemonService.getAll();
        setLibrary(data);
      } catch (error) {
        console.error("Failed to load app", error);
      }
    };
    loadPokemons();
  }, []);
  
  // Función para mover un pokemon de la biblioteca a la pokedex
  const addToPokedex = () => {
    if (selectedId === null) return;
    
    const pokemon = library.find(p => p.id === selectedId);
    if (!pokemon) return;

    // Añadir a Pokedex
    setPokedex([...pokedex, pokemon]);
    // Remover de Library
    setLibrary(library.filter(p => p.id !== selectedId));
    
    setSelectedId(null);
  };

  const returnToLibrary = (pokemon: Pokemon) => {
    // Formamos una lista mixta (Library + Pokemon a devolver)
    const mixedList = [...library, pokemon];
    // Ordenamos por ID usando la función del servicio
    const sortedList = pokemonService.sortById(mixedList);
    
    setLibrary(sortedList);
    //Remover de Pokedex
    setPokedex(pokedex.filter(p => p.id !== pokemon.id));
  };

  //Vista temp 
  return (
    <div>
      <h1>Vista prueba</h1>
      <h3>Library ({library.length})</h3>
      {library.map(p => (
        <div key={p.id} onClick={() => setSelectedId(p.id)}style={{ cursor: 'pointer' }}>
          {selectedId === p.id ? ' [ SELECCIONADO ] ' : '[ ] '} 
          {p.name}
        </div>
      ))}

      <br/>
      <button onClick={addToPokedex} disabled={selectedId === null}>Mover a pokedex</button>
      <br /><br/>
      <h3>Pokedex ({pokedex.length})</h3>
      {pokedex.map(p => (
        <div key={p.id}>
          {p.name} 
          <button onClick={() => returnToLibrary(p)} style={{ marginLeft: '10px' }}>Borrar</button>
        </div>
      ))}
    </div>
  );
}

export default App;