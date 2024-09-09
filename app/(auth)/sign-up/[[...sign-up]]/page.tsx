import AuthCard from "@/components/ui/auth-card";
import { stackServerApp } from "@/stack";
import { SignUp } from "@stackframe/stack";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const user = await stackServerApp.getUser();

  if (user) {
    return redirect("/");
  } else {
    return (
      <AuthCard>
        <SignUp />
      </AuthCard>
    );
  }
}
