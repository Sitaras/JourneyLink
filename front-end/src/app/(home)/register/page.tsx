"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useActionState, useRef, startTransition } from "react";

import { register } from "@/api-actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/schemas/auth/registerSchema";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";

export const RegisterPage = () => {
  const [formState, formAction, pending] = useActionState(register, null);

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register: _register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.output<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Shut up and take my money</CardDescription>
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
            noValidate
          >
            <CustomInput
              name="email"
              label="Email"
              type="email"
              register={_register}
              errors={errors}
            />
            <CustomInput
              name="firstName"
              label="First name"
              register={_register}
              errors={errors}
            />
            <CustomInput
              name="lastName"
              label="Last name"
              register={_register}
              errors={errors}
            />
            <CustomInput
              name="phoneNumber"
              label="Phone number"
              type="tel"
              register={_register}
              errors={errors}
            />
            <CustomInput
              label="Date of birth"
              name="dateOfBirth"
              type="date"
              errors={errors}
              register={_register}
            />
            <CustomInput
              label="Password"
              name="password"
              type="password"
              errors={errors}
              register={_register}
            />
            <CustomInput
              label="Verify password"
              name="verifyPassword"
              type="password"
              errors={errors}
              register={_register}
            />
            <Button className="w-full" type="submit" loading={pending}>
              Submit
            </Button>
            <p aria-live="polite">{formState?.message}</p>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
