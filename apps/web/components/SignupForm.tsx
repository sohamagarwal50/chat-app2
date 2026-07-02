"use client"
import { useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
export default function(){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    async function handleSubmit (e : React.FormEvent){
        e.preventDefault();
        const res = await axios.post("/api/signup",{
            username : username,
            password : password
        });
        console.log(res);
        redirect("/signin");
    };
    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="username" onChange={e => setUsername(e.target.value)}/>
            <input placeholder="password" onChange={e => setPassword(e.target.value)}/>
            <button type = "submit">Sign Up</button>
        </form>
    )
}