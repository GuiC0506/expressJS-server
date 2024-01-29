import { useState, useEffect } from 'react'
import './App.css'

function App() {
    useEffect(() => {
        fetch("http://localhost:3333/api/users")
            .then(response => response.json())
            .then(data => console.log(data));
    }, []);
    return (
    <>
      hello
    </>
    )
}

export default App
