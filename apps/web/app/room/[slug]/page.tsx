import { redirect } from "next/navigation";
import {auth} from "../../auth"
import axios from "axios";
import {ChatRoomClient} from "../../../components/ChatRoomClient";
async function getId(slug : string) {
    const res = await axios("http://localhost:3001/room/"+`${slug}`);
    return res.data.roomId;
}
async function getMessages(roomId : Number){
    const messages = await axios.get("http://localhost:3001/chat/"+`${roomId}`)
    return messages.data.messages;
}
export default async function ChatRoom1({params} : {
    params : {slug : string}
}) {
    const session = await auth();
    if(!session){
        redirect("/signin");
    }
    console.log(session.backendToken);
    const slug = (await params).slug;
    const roomId = await getId(slug);
    const messages = await getMessages(roomId);//messages = [{message:"hello"},{message:"bye"}]
    return <div>
        <ChatRoomClient id={roomId.toString()}token = {session!.backendToken} messages = {messages}/>
    </div>
}