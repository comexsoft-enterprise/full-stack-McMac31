import { useEffect, useState } from 'react'
import './App.css'

//He definido la interfaz para los objetos Pokemon
// Ya que la API devuelve varios datos, pero solo usaremos estos tres asegurando que el ID es un número
interface Pokemon { 
  ID: number;
  nombre: string;
  url: string;
 
}

function App() {
  const [pokemon, setPokemon] = useState([])

  useEffect(()=>{

  },[])

  /*async function getPokemon(page){

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${}&offset=${}`).then(res =>
      res.json()
    ).then(data => {
      console.log(data)
    })
  }*/

  return (
    <>
      {
      <h1>Cargando Pokemons...</h1>
        /*
          Lista de pokemon
        */
      }
    </>
  )
}

export default App
