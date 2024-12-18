import { AuthForm } from "@/components/auth/auth-form";

export default function Home() {
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Amazon Smart Biz
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to continue
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
