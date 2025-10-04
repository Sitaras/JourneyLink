"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { register } from "@/api-actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/schemas/auth/registerSchema";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {

  const {
    register: _register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.output<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      return register({ success: false }, data);
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

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Shut up and take my money</CardDescription>
        </CardHeader>
        <CardFooter>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
            noValidate
          >
            <CustomInput
              name="email"
              label="Email"
              type="email"
              register={_register}
              errors={errors}
              autoComplete="username"
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
              autoComplete="new-password"
            />
            <CustomInput
              label="Verify password"
              name="verifyPassword"
              type="password"
              errors={errors}
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
};

export default RegisterPage;
