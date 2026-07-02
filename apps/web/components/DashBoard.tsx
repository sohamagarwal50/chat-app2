"use client"
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
export default function DashBoard({id} : {id : string}){
    const [roomName, setRoom] = useState("");
    const [room2,setRoom2] = useState("");
    const router = useRouter();
    async function createRoom(room2 : string) {
        try{
            const res= await axios.post("http://localhost:3001/room",{
                body : {
                    "name" : room2
                },
                userId : id
            })
            alert("room created");
        }
        catch(err){
            console.log(err);
        }
    }
    return <>
        <div className="pt-60 align-center">
            <div className="flex justify-center pb-10">
                <input onChange = {(e) => {
                    setRoom(e.target.value);
                }}className ="border rounded " placeholder="enter room name" type="text"/>
                <button onClick = {() => {
                    router.push("/room/" + `${roomName}`);
                }}className="pl-3 border rounded pr-3">Join room</button>
            </div>
            <div className="flex justify-center pl-5">
                <input onChange = {(e) => {
                    setRoom2(e.target.value);
                }} className = "border rounded "placeholder="enter room name" type="text"/>
                <button onClick={() => createRoom(room2)} className="pl-3 border rounded pr-3">Create room</button>
            </div>
        </div>
    </>
}