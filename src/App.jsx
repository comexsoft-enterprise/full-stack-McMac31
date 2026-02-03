import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState([])

  useEffect(()=>{

  },[])

  async function getPokemon(page){

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${}&offset=${}`).then(res =>
      res.json()
    ).then(data => {
      console.log(data)
    })
  }

  return (
    <>
      {
        /*
          Lista de pokemon
        */
      }
    </>
  )
}

export default App
