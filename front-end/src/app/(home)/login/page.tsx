"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/api-actions/auth";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import { useRouter } from "next/navigation";
import { routes } from "@/data/routes";
import { useMutation } from "@tanstack/react-query";

// FYI https://dev.to/emmanuel_xs/how-to-use-react-hook-form-with-useactionstate-hook-in-nextjs15-1hja

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      return login({ success: false }, formData);
    },
    onSuccess: (result) => {
      if (result.success) {
        router.push(routes.login);
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
            noValidate
          >
            <CustomInput
              name="email"
              label="Email"
              type="email"
              register={register}
              errors={errors}
            />
            <CustomInput
              name="password"
              label="Password"
              type="password"
              register={register}
              errors={errors}
            />
            <Button
              className="w-full"
              type="submit"
              loading={mutation.isPending}
            >
              Submit
            </Button>

            {mutation.isError && (
              <p className=" text-center text-red-500">
                {mutation?.error?.message || "Something went wrong"}
              </p>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
