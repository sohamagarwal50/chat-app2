import { redirect } from "next/navigation";
import { auth } from "../auth";
import SignupForm from "../../components/SignupForm";
export default async function SignupPage() {
    const session = await auth();
    if(session){
        console.log("logged in");
        redirect("/dashboard");
    }
    return (
        <SignupForm/>
    )
}
