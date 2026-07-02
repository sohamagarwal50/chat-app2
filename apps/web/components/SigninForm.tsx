"use client"
import { useState } from "react";
import { redirect } from "next/dist/server/api-utils";
import { signIn } from "next-auth/react";
export default function SigninForm(){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    async function handleSubmit (e : React.FormEvent){
        e.preventDefault();
        console.log(username);
        console.log(password);
        await signIn("credentials",{username, password, callbackUrl : "/dashboard"});
    }
    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="username" onChange={e => setUsername(e.target.value)}/>
            <input placeholder="password" onChange={e => setPassword(e.target.value)}/>
            <button type = "submit">Sign In</button>
        </form>
    )
}