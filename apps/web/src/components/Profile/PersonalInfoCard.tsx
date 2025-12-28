"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import { CustomTextarea } from "@/components/ui/Inputs/CustomTextarea";
import BirthdayInput from "@/components/ui/Inputs/BirthdayInput";
import Typography from "@/components/ui/typography";
import { formatDate } from "@/utils/dateUtils";
import { DateFormats } from "@/utils/dateFormats";
import { UseFormRegister } from "react-hook-form";
import { UpdateProfilePayload } from "@journey-link/shared";
import EditFormActions from "./EditFormActions";
import InfoField from "./InfoField";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

const MAX_BIO_LENGTH = 500;

interface PersonalInfoCardProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  register: UseFormRegister<UpdateProfilePayload>;
  bioCharCount: number;
  isSubmitting: boolean;
  isDirty: boolean;
}

const PersonalInfoCard = ({
  isEditing,
  onEdit,
  onCancel,
  firstName,
  lastName,
  email,
  phoneNumber,
  dateOfBirth,
  bio,
  register,
  bioCharCount,
  isSubmitting,
  isDirty,
}: PersonalInfoCardProps) => {
  const isCharCountExceeded = bioCharCount > MAX_BIO_LENGTH;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              <Trans>Personal Information</Trans>
            </CardTitle>
            <CardDescription>
              {isEditing ? (
                <Trans>Update your personal details and bio</Trans>
              ) : (
                <Trans>Your personal details and bio</Trans>
              )}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
              aria-label="Edit personal information"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInput
                name="firstName"
                label={<Trans>First name</Trans>}
                register={register}
                required
              />
              <CustomInput
                name="lastName"
                label={<Trans>Last name</Trans>}
                register={register}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInput
                name="email"
                label={<Trans>Email</Trans>}
                type="email"
                register={register}
                autoComplete="username"
                required
              />
              <CustomInput
                name="phoneNumber"
                label={<Trans>Phone</Trans>}
                type="tel-national"
                register={register}
                required
              />
            </div>

            <BirthdayInput
              label={<Trans>Date of birth</Trans>}
              name="dateOfBirth"
              register={register}
            />

            <div className="space-y-2">
              <CustomTextarea
                name="bio"
                label={<Trans>Bio</Trans>}
                placeholder={t`Tell us about yourself...`}
                register={register}
                rows={4}
                maxLength={MAX_BIO_LENGTH}
              />
              <Typography
                className={`text-sm ${
                  isCharCountExceeded
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                <Trans>
                  {bioCharCount}/{MAX_BIO_LENGTH} characters
                </Trans>
              </Typography>
            </div>

            <EditFormActions
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              isDirty={isDirty}
            />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label={<Trans>First name</Trans>} value={firstName} />
              <InfoField label={<Trans>Last name</Trans>} value={lastName} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label={<Trans>Email</Trans>} value={email} />
              <InfoField label={<Trans>Phone</Trans>} value={phoneNumber} />
            </div>

            <InfoField
              label={<Trans>Date of birth</Trans>}
              value={
                dateOfBirth
                  ? formatDate(dateOfBirth, DateFormats.DATE_FULL_MONTH_FORMAT)
                  : undefined
              }
            />

            <InfoField label={<Trans>Bio</Trans>} value={bio} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
