
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function LandingPage() {
  return (
    <div>
      <Link href = "/signin">Sign In</Link>
      <br/>
      <Link href = "/signup">Sign Up</Link>
    </div>
  )
}