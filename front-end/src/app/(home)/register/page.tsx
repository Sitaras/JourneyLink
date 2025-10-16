"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { register } from "@/api-actions/auth";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/schemas/auth/registerSchema";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { onError } from "@/utils/formUtils";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: _register, handleSubmit } = useForm<
    z.output<typeof registerSchema>
  >({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      return register(data);
    },
    onSuccess: () => {
      toast.success("Registered successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  const handleOnError = (errors: FieldErrors) => {
    const fieldLabels: Record<string, string> = {
      email: "Email",
      firstName: "First name",
      lastName: "Last name",
      phoneNumber: "Phone number",
      dateOfBirth: "Date of birth",
      password: "Password",
      verifyPassword: "Verify password",
    };

    onError(fieldLabels, errors);
  };

  return (
    <div className="h-full flex-1 flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Shut up and take my money</CardDescription>
        </CardHeader>
        <CardFooter>
          <form
            id="signup"
            onSubmit={handleSubmit(onSubmit, handleOnError)}
            className="flex flex-col gap-4 w-full"
            noValidate
          >
            <CustomInput
              id="email"
              name="email"
              label="Email"
              type="email"
              register={_register}
              autoComplete="username"
            />
            <CustomInput
              name="firstName"
              label="First name"
              register={_register}
            />
            <CustomInput
              name="lastName"
              label="Last name"
              register={_register}
            />
            <CustomInput
              name="phoneNumber"
              label="Phone number"
              type="tel"
              register={_register}
            />
            <CustomInput
              label="Date of birth"
              name="dateOfBirth"
              type="date"
              register={_register}
            />
            <CustomInput
              id="new-password"
              label="Password"
              name="password"
              type="password"
              register={_register}
              autoComplete="new-password"
            />
            <CustomInput
              id="verifyPassword"
              label="Verify password"
              name="verifyPassword"
              type="password"
              register={_register}
              autoComplete="new-password"
            />
            <Button
              className="w-full"
              type="submit"
              loading={mutation.isPending}
            >
              Submit
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
