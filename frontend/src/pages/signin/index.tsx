import { LoginForm } from "@/pages/signin/login-form";

export function SignIn() {
    return (
        <div className="bg-gradient-to-b from-[#565656] to-[#181818] flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm/>
      </div>
    </div>
    )
}