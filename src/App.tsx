import { useEffect, useState, useRef } from 'react';
import './App.css';
import { pokemonService } from './services/pokemon_Service';
import { Pokemon } from './types/pokemon';

function App() {
  //Estados para la biblioteca, la pokedex y el pokemon seleccionado
  const [library, setLibrary] = useState<Pokemon[]>([]);
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Estados para el scroll infinito
  const [offset, setOffset] = useState(0);
  const loadingRef = useRef(false);

  // Estados para arrastrar y soltar
  const [isDragMode, setIsDragMode] = useState(false);
  const [draggedPokemon, setDraggedPokemon] = useState<Pokemon | null>(null);

  // Carga inicial de pokemons usando el servicio (con paginación)
  const loadMorePokemons = async (currentOffset: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const newPokemons = await pokemonService.getAll(currentOffset);
      setLibrary(prev => {
        const combined = [...prev, ...newPokemons];
        // Eliminamos duplicados
        return Array.from(new Map(combined.map(p => [p.id, p])).values());
      });
    } catch (error) { console.error("Error cargando pokemons:", error); } 
    finally { loadingRef.current = false; }
  };

  useEffect(() => { loadMorePokemons(0); }, []);

  // Función para detectar el scroll y cargar más
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      const newOffset = offset + 20;
      setOffset(newOffset);
      loadMorePokemons(newOffset);
    }
  };

  // Función auxiliar para mover de libreria a pokedex
  const moveLibToPokeDex = (pokemon: Pokemon) => {
    if (pokedex.some(p => p.id === pokemon.id)) return;
    setPokedex(prev => [...prev, pokemon]);
    setLibrary(prev => prev.filter(p => p.id !== pokemon.id));
    if (selectedId === pokemon.id) setSelectedId(null);
  };

  // Función auxiliar para mover de pokedex a libreria
  const movePokeDexToLib = (pokemon: Pokemon) => {
    setLibrary(prev => {
      const mixed = [...prev, pokemon];
      return pokemonService.sortById(mixed);
    });
    setPokedex(prev => prev.filter(p => p.id !== pokemon.id));
  };

  // Función para mover un pokemon de la biblioteca a la pokedex (Click)
  const addToPokedex = () => {
    if (selectedId === null) return;
    const pokemon = library.find(p => p.id === selectedId);
    if (pokemon) moveLibToPokeDex(pokemon);
  };

  const returnToLibrary = (pokemon: Pokemon) => {
    movePokeDexToLib(pokemon);
  };

  // Funciones para arrastrar y soltar
  const handleDragStart = (e: React.DragEvent, pokemon: Pokemon) => {
    if (!isDragMode) { e.preventDefault(); return; }
    setDraggedPokemon(pokemon);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => { if (isDragMode) e.preventDefault(); };

  const handleDropToPokedex = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPokemon && library.some(p => p.id === draggedPokemon.id)) {
      moveLibToPokeDex(draggedPokemon);
      setDraggedPokemon(null);
    }
  };

  const handleDropToLibrary = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPokemon && pokedex.some(p => p.id === draggedPokemon.id)) {
      movePokeDexToLib(draggedPokemon);
      setDraggedPokemon(null);
    }
  };

  //Diseño de la interfaz con tres secciones: biblioteca, controles y pokedex
  return (
    <div className="app-container">
      <button className={`drag-toggle-btn ${isDragMode ? 'active' : ''}`} onClick={() => setIsDragMode(!isDragMode)}>
        {isDragMode ? 'Arrastrar: ON' : 'Arrastrar: OFF'}
      </button>
      <section className={`panel ${isDragMode ? 'drag-mode-lib' : ''}`} onDragOver={handleDragOver} onDrop={handleDropToLibrary}>
        <header className="panel-header"><h2>Lista Pokémon</h2><small>{library.length} disponibles</small></header>
        
        <div className="list-container" onScroll={handleScroll}>
          {library.map((p) => (
            <div key={p.id} className={`list-item ${selectedId === p.id ? 'selected' : ''} ${isDragMode ? 'draggable-item' : ''}`} onClick={() => setSelectedId(p.id)} draggable={isDragMode} onDragStart={(e) => handleDragStart(e, p)}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} alt={p.name} className="sprite-small"/>
              <span className="pokemon-id">#{p.id.toString().padStart(3, '0')}</span>
              <span className="pokemon-name">{p.name}</span>
            </div>
          ))}
          <div className="loading-text">...</div>
        </div>
      </section>
      <section className="controls">
        <button className="transfer-btn" onClick={addToPokedex} disabled={selectedId === null} title="Capturar Pokémon"></button>
      </section>
      <section className={`panel pokedex-panel ${isDragMode ? 'drag-mode-dex' : ''}`} onDragOver={handleDragOver} onDrop={handleDropToPokedex}>
        <header className="panel-header"><h2>Mi Pokédex</h2><small>{pokedex.length} capturados</small></header>

        <div className="grid-container">
          {pokedex.map((p) => (
            <div key={p.id} className={`card ${isDragMode ? 'draggable-item' : ''}`} draggable={isDragMode} onDragStart={(e) => handleDragStart(e, p)}>
              <div className="close-btn" onClick={() => returnToLibrary(p)} title="Liberar Pokémon">✕</div>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} alt={p.name} />
              <span className="pokemon-name">{p.name}</span>
            </div>
          ))}
          {pokedex.length === 0 && (
            <div className="empty-state">
              <p>La Pokédex está vacía</p>
              <small>{isDragMode ? '¡Arrastra aquí!' : 'Selecciona para mover'}</small>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;