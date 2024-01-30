import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import './App.css'

function App() {
    const usernameRef = useRef();
    const pwdRef = useRef();

    const handleSubmission = async (e) => {
        e.preventDefault();
        const body  = {
            username: usernameRef.current.value,
            password: pwdRef.current.value
        }
        
        try {
            const response = await axios.post("http://localhost:3333/api/loginjwt", body,
                {
                    headers: { "Content-Type":"application/json" },
                }
            );
            console.log(response.data);
        } catch(err) {
            const { error } = err.response.data;
            console.log(error);
        }
    }

    return (
    <>
        <form action="" onSubmit={handleSubmission}>
            <label htmlFor="name">Username</label>
            <input type="text" ref={usernameRef} />
            <label htmlFor="name">password</label>
            <input type="text" ref={pwdRef}/>
            <input type="submit" value="Submit"/>
        </form>
    </>
    )
}

export default App
