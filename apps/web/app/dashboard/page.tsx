import {auth} from "../auth"
import {redirect} from "next/navigation";
import DashBoard from "../../components/DashBoard";
export default async function Dashboard(){
    const session = await auth();
    console.log(session);
    if(!session){
        redirect("/signin");
    }
    return (
        <DashBoard id = {session.user.id}/>
    )
}