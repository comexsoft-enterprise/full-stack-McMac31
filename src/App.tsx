import { useEffect, useState, useRef } from 'react';
import './App.css';
import { pokemonService } from './services/pokemon_Service';
import { Pokemon } from './types/pokemon';

function App() {
  // Estados principales
  const [library, setLibrary] = useState<Pokemon[]>([]);
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Estados para paginación
  const [offset, setOffset] = useState(0); 
  const loadingRef = useRef(false); 

  // Función para cargar más pokemons
  const loadMorePokemons = async (currentOffset: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try { 
      const newPokemons = await pokemonService.getAll(currentOffset);
      setLibrary(prev => {
        const combined = [...prev, ...newPokemons];
        return Array.from(new Map(combined.map(p => [p.id, p])).values());
      });
    } catch (error) {
      console.error("Error cargando pokemons nuevos:", error);
    } finally {
      loadingRef.current = false;
    }
  };


  useEffect(() => {
    loadMorePokemons(0);
  }, []);

  // Detector de Scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // Si llegamos al final (limite 10px)
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      const newOffset = offset + 20;
      setOffset(newOffset);
      loadMorePokemons(newOffset);
    }
  };
// Función para mover un pokemon a la pokedex
  const addToPokedex = () => {
    if (selectedId === null) return;
    const pokemon = library.find(p => p.id === selectedId);
    if (!pokemon) return;

    setPokedex([...pokedex, pokemon]);
    setLibrary(library.filter(p => p.id !== selectedId));
    setSelectedId(null);
  };
// Función para devolver un pokemon a la biblioteca
  const returnToLibrary = (pokemon: Pokemon) => {
    const mixedList = [...library, pokemon];
    const sortedList = pokemonService.sortById(mixedList);
    setLibrary(sortedList);
    setPokedex(pokedex.filter(p => p.id !== pokemon.id));
  };

  return (
    <div className="app-container">
      <section className="panel">
        <header className="panel-header">
          <h2>Lista Pokémon</h2>
          <small>{library.length} disponibles</small>
        </header>
    
        <div className="list-container" onScroll={handleScroll}>
          {library.map((p) => (
            <div key={p.id} className={`list-item ${selectedId === p.id ? 'selected' : ''}`}onClick={() => setSelectedId(p.id)}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} alt={p.name} className="sprite-small"/>
              <span className="pokemon-id">#{p.id.toString().padStart(3, '0')}</span>
              <span className="pokemon-name">{p.name}</span>
            </div>
          ))}
          <div style={{ textAlign: 'center', padding: '10px', opacity: 0.5 }}>...</div>
        </div>
      </section>

      <section className="controls">
        <button className="transfer-btn"onClick={addToPokedex} disabled={selectedId === null}title="Capturar Pokémon"></button>
      </section>

      <section className="panel pokedex-panel">
        <header className="panel-header">
          <h2>Mi Pokédex</h2>
          <small>{pokedex.length} capturados</small>
        </header>

        <div className="grid-container">
          {pokedex.map((p) => (
            <div key={p.id} className="card">
              <div className="close-btn" onClick={() => returnToLibrary(p)} title="Liberar Pokémon">✕</div>
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