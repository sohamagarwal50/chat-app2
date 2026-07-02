
"use client"
import { useEffect, useRef, useState } from "react"
import { useSocket } from "../hooks/useSocket";
export function ChatRoomClient({messages,token,id} : {messages : any[],token : string,id:string}){
    const [chats,setChats] = useState(messages);
    const {socket,loading} = useSocket(token);
    const inputref = useRef<HTMLInputElement>(null);
    useEffect(() =>{
        console.log("trigger");
        if(socket && !loading){
            socket.send(JSON.stringify({
                "type" : "join-room",
                "roomId" : id
            }));
            console.log("reached here");
            socket.onmessage = (event) => { ///registers event listner
                const parsedData = JSON.parse(event.data);
                console.log("parsed");
                console.log(parsedData);
                if(parsedData.type === "chat"){
                    setChats(prev => [...prev,parsedData]);
                }
            }
        }
    },[socket,loading,id])
    return <>
        <div>
        {chats.map(chat => <div key={chat.id}>{chat.message}</div>)}
        <input ref = {inputref} type = "text" ></input>
        <button type="submit" onClick={() => {
            if(inputref.current){
                socket?.send(JSON.stringify({
                type : "chat",
                message : inputref.current.value,
                roomId : id
                }));
                inputref.current.value="";
            }
        }}>Send</button>
        </div>
    </>
}