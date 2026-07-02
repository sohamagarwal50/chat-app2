import { useEffect, useState } from "react";
export function useSocket(token : string) {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();
    console.log("connected1");
    useEffect(() => {
        console.log(token);
        const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
        console.log("connected2");
    }, []);
    return {
        socket,
        loading
    }

}