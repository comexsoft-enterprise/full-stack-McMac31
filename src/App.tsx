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
        console.error("Error cargando pokemons:", error);
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
//Diseño de la interfaz con tres secciones: biblioteca, controles y pokedex
  return (
    <div className="app-container">
      <section className="panel">
        <header className="panel-header">
          <h2>Lista Pokémon</h2>
          <small>{library.length} disponibles</small>
        </header>
        
        <div className="list-container">
          {library.map((p) => (
            <div key={p.id} className={`list-item ${selectedId === p.id ? 'selected' : ''}`}onClick={() => setSelectedId(p.id)}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} alt={p.name} className="sprite-small"/>
              <span className="pokemon-id">#{p.id.toString().padStart(3, '0')}</span>
              <span className="pokemon-name">{p.name}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="controls">
        <button className="transfer-btn"onClick={addToPokedex} disabled={selectedId === null}title="Capturar Pokémon">
          ➔
        </button>
      </section>
      <section className="panel pokedex-panel">
        <header className="panel-header">
          <h2>Mi Pokédex</h2>
          <small>{pokedex.length} capturados</small>
        </header>

        <div className="grid-container">
          {pokedex.map((p) => (
            <div key={p.id} className="card">
              <div 
                className="close-btn" 
                onClick={() => returnToLibrary(p)}
                title="Liberar Pokémon"
              >✕</div>
              
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} alt={p.name} />
              <span className="pokemon-name">{p.name}</span>
            </div>
          ))}
          {pokedex.length === 0 && (
            <div className="empty-state">
              <p>La Pokédex está vacía</p>
              <small>Selecciona un Pokémon de la izquierda para moverlo aquí</small>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default App;