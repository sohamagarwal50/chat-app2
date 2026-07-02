import { redirect } from "next/navigation";
import { auth } from "../auth";
import SigninForm from "../../components/SigninForm"
export default async function SigninPage() {
    const session = await auth();
    if(session){
        redirect("/dashboard");
    }
    return (
        <SigninForm/>
    )
}
