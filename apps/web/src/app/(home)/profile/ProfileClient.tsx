"use client";

import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import { useState } from "react";
import { useUserProfile } from "@/hooks/queries/useUserQuery";
import { useUpdateProfileMutation } from "@/hooks/mutations/useUserMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import z from "zod";
import { formatDate } from "@/utils/dateUtils";
import { DateFormats } from "@/utils/dateFormats";
import Typography from "@/components/ui/typography";
import { onError } from "@/utils/formUtils";
import PageLoader from "@/components/PageLoader/PageLoader";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import PersonalInfoCard from "@/components/Profile/PersonalInfoCard";
import SocialMediaCard from "@/components/Profile/SocialMediaCard";
import {
  updateProfileSchema,
  UpdateProfilePayload,
} from "@journey-link/shared";

type EditSection = "personal" | "social" | null;

const ProfileClient = () => {
  const [editingSection, setEditingSection] = useState<EditSection>(null);

  const { data, isLoading } = useUserProfile();

  const { mutate, isPending } = useUpdateProfileMutation();

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    bio,
    rating,
    socials,
  } = data || {};

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<z.output<typeof updateProfileSchema>>({
    values: {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth: dateOfBirth
        ? formatDate(dateOfBirth, DateFormats.DATE_DASH_REVERSE)
        : "",
      bio,
      socials,
    },
    resolver: zodResolver(updateProfileSchema),
  });

  const onSubmit = (data: UpdateProfilePayload) => {
    mutate(data, {
      onSuccess: () => {
        setEditingSection(null);
      },
    });
  };

  const handleOnError = (errors: FieldErrors) => {
    const FIELD_LABELS: Record<string, string> = {
      firstName: t`First name`,
      lastName: t`Last name`,
      email: t`Email`,
      dateOfBirth: t`Date of birth`,
      bio: t`Bio`,
      phoneNumber: t`Phone number`,
      "socials.facebook": t`Facebook`,
      "socials.twitter": t`Twitter`,
      "socials.linkedIn": t`LinkedIn`,
    };

    onError(FIELD_LABELS, errors);
  };

  const handleEdit = (section: EditSection) => {
    setEditingSection(section);
  };

  const handleCancel = () => {
    reset();
    setEditingSection(null);
  };

  const bioCharCount = watch("bio")?.length || 0;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <section className="flex justify-center w-full py-8 px-4">
      <div className="flex flex-col gap-6 max-w-xl w-full">
        <div className="flex flex-col gap-2">
          <Typography variant="h2">
            <Trans>My Profile</Trans>
          </Typography>
        </div>

        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          rating={rating}
        />

        <form
          onSubmit={handleSubmit(onSubmit, handleOnError)}
          className="flex flex-col gap-6 w-full"
          noValidate
        >
          <PersonalInfoCard
            isEditing={editingSection === "personal"}
            onEdit={() => handleEdit("personal")}
            onCancel={handleCancel}
            firstName={firstName}
            lastName={lastName}
            email={email}
            phoneNumber={phoneNumber}
            dateOfBirth={
              dateOfBirth
                ? typeof dateOfBirth === "string"
                  ? dateOfBirth
                  : formatDate(dateOfBirth, DateFormats.DATE_DASH_REVERSE)
                : undefined
            }
            bio={bio}
            register={register}
            bioCharCount={bioCharCount}
            isSubmitting={isPending}
            isDirty={isDirty}
          />

          <SocialMediaCard
            isEditing={editingSection === "social"}
            onEdit={() => handleEdit("social")}
            onCancel={handleCancel}
            socials={socials}
            register={register}
            isSubmitting={isPending}
            isDirty={isDirty}
          />
        </form>

        <Typography className="text-xs text-center text-muted-foreground">
          <Trans>
            Your profile information is private and will only be shared with
            riders you connect with.
          </Trans>
        </Typography>
      </div>
    </section>
  );
};

export default ProfileClient;
