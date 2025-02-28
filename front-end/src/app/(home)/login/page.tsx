"use client";

import { useActionState, useRef, startTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/api-actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/api-actions/auth-validation";
import { Label } from "@/components/ui/label";

// FYI https://dev.to/emmanuel_xs/how-to-use-react-hook-form-with-useactionstate-hook-in-nextjs15-1hja

export default function LoginPage() {
  const [formState, formAction, pending] = useActionState(login, null);

  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit } = useForm<z.output<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "john.doe@example.com",
      password: "SecurePass123!",
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Shut up and take my money!</CardDescription>
        </CardHeader>
        <CardFooter>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={(evt) => {
              evt.preventDefault();
              handleSubmit(() => {
                startTransition(() =>
                  formAction(new FormData(formRef.current!))
                );
              })(evt);
            }}
            className="flex flex-col gap-4 w-full"
          >
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required {...register("email")} />
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              {...register("password")}
            />
            <Button className="w-full" type="submit" loading={pending}>
              Log in
            </Button>
            <p aria-live="polite">{formState?.message}</p>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
