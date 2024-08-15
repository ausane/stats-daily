import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="w-screen h-screen flex-center bg-slate-200">
            <SignIn />
        </div>
    );
}
