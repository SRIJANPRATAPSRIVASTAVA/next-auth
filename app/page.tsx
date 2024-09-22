import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-500 to-blue-900">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-white drop-shadow-md">🔐 Auth </h1>
        <p className="text-white text-lg">
          A simple auth service
        </p>
        <div>
          <LoginButton>
            <Button variant="secondary" className="lg font-semibold ">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
} 
