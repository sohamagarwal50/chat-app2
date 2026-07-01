console.log("Starting server...");
console.log("Server listening on 8080");
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/client";
interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}
const users: User[] = [];
const wss = new WebSocketServer({port:8080});
function checkuser(token : string) : string | null {
    try{
        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload & {
            userId:string
        };
        if(typeof decoded == "string"){
            return null;
        }
        if(!decoded || !decoded.userId)return null;
        return decoded.userId;
    }
    catch{
        return null;
    }
}
wss.on('connection',(ws,request) => {
    const url = request.url;
    if(!url){

    }
    const queryParams = new URLSearchParams(url?.split('?')[1]);
    const token  = queryParams.get("token") || " ";
    const userId = checkuser(token);
    if(userId === null){
        ws.close();
        return null;
    }
    users.push({
        userId,
        rooms: [],
        ws
    });
    ws.on("message", async function message(data){
        let parsedData;
        if(typeof data !== "string"){
            parsedData = JSON.parse(data.toString());
        }
        else parsedData = JSON.parse(data);
        if(parsedData.type === "join-room"){
            const user = users.find(x => x.ws === ws)
            user?.rooms.push(parsedData.roomId);
        }
        if(parsedData.type === "leave-room"){
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parsedData.room);
        }

        console.log("message received")
        console.log(parsedData);
        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await prismaClient.chat.create({
                data: {
                RoomId: Number(roomId),
                message,
                UserId : userId
                }
            });

            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                user.ws.send(JSON.stringify({
                    type: "chat",
                    message: message,
                    roomId
                }))
                }
            })
        }
    })
});