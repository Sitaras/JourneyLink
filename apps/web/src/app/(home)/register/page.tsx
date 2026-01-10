"use client";

import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { registerSchemaBase } from "@journey-link/shared";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import { onError } from "@/utils/formUtils";
import { useRegisterMutation } from "@/hooks/mutations/useAuthMutations";
import BirthdayInput from "@/components/ui/Inputs/BirthdayInput";

const registerFormSchema = registerSchemaBase
  .extend({
    dateOfBirth: z.string().min(1, {
      message: "REQUIRED",
    }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    path: ["verifyPassword"],
    message: "PASSWORDS_DO_NOT_MATCH",
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register: _register, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const { mutate, isPending } = useRegisterMutation();

  const onSubmit = (data: RegisterFormValues) => {
    mutate(data);
  };

  const handleOnError = (errors: FieldErrors) => {
    const fieldLabels: Record<string, string> = {
      email: t`Email`,
      firstName: t`First name`,
      lastName: t`Last name`,
      phoneNumber: t`Phone number`,
      dateOfBirth: t`Date of birth`,
      password: t`Password`,
      verifyPassword: t`Verify password`,
    };

    onError(fieldLabels, errors);
  };

  return (
    <div className="h-full w-full flex-1 flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            <Trans>Register</Trans>
          </CardTitle>
          <CardDescription>
            <Trans>Shut up and take my money</Trans>
          </CardDescription>
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
              label={<Trans>Email</Trans>}
              type="email"
              register={_register}
              autoComplete="username"
            />
            <CustomInput
              name="firstName"
              label={<Trans>First name</Trans>}
              register={_register}
            />
            <CustomInput
              name="lastName"
              label={<Trans>Last name</Trans>}
              register={_register}
            />
            <CustomInput
              name="phoneNumber"
              label={<Trans>Phone number</Trans>}
              type="tel"
              register={_register}
            />
            <BirthdayInput
              label={<Trans>Date of birth</Trans>}
              name="dateOfBirth"
              register={_register}
            />
            <CustomInput
              id="new-password"
              label={<Trans>Password</Trans>}
              name="password"
              type="password"
              register={_register}
              autoComplete="new-password"
            />
            <CustomInput
              id="verifyPassword"
              label={<Trans>Verify password</Trans>}
              name="verifyPassword"
              type="password"
              register={_register}
              autoComplete="new-password"
            />
            <Button className="w-full" type="submit" loading={isPending}>
              <Trans>Submit</Trans>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
