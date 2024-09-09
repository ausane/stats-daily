import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import AuthCard from "@/components/ui/auth-card";

export default function Handler(props: any) {
  return (
    <AuthCard>
      <StackHandler fullPage={false} app={stackServerApp} {...props} />
    </AuthCard>
  );
}
