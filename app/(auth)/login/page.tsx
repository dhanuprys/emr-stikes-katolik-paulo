"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
          <Stethoscope size={24} />
        </div>
        <CardTitle className="text-4xl">SIGAP</CardTitle>
        <CardDescription>
          ST. Vincentius A Paulo Surabaya
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" required placeholder="Masukkan username" />
            {state?.errors?.username && (
              <p className="text-sm text-destructive">{state.errors.username[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Masukkan password" 
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {state?.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Masuk..." : "Masuk"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
