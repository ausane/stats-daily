import AuthCard from "@/components/ui/auth-card";
import { stackServerApp } from "@/stack";
import { SignIn } from "@stackframe/stack";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const user = await stackServerApp.getUser();

  if (user) {
    return redirect("/");
  } else {
    return (
      <AuthCard>
        <SignIn />
      </AuthCard>
    );
  }
}
