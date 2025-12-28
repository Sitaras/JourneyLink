"use client";

import { UpdateProfilePayload } from "@journey-link/shared";
import { UseFormRegister } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { CustomInput } from "../ui/Inputs/CustomInput";
import EditFormActions from "./EditFormActions";
import InfoField from "./InfoField";
import { Trans } from "@lingui/react/macro";

interface SocialMediaCardProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  socials?: {
    facebook?: string;
    twitter?: string;
    linkedIn?: string;
  };
  register: UseFormRegister<UpdateProfilePayload>;
  isSubmitting: boolean;
  isDirty: boolean;
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({
  isEditing,
  onEdit,
  onCancel,
  socials,
  register,
  isSubmitting,
  isDirty,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              <Trans>Social Media</Trans>
            </CardTitle>
            <CardDescription>
              {isEditing ? (
                <Trans>Update your social media accounts</Trans>
              ) : (
                <Trans>Your social media accounts</Trans>
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
              aria-label="Edit social media"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                name="socials.facebook"
                label={<Trans>Facebook</Trans>}
                type="text"
                placeholder="facebook.com/username"
                register={register}
              />
              <CustomInput
                name="socials.twitter"
                label={<Trans>Twitter</Trans>}
                type="text"
                placeholder="twitter.com/username"
                register={register}
              />
              <CustomInput
                name="socials.linkedIn"
                label={<Trans>LinkedIn</Trans>}
                type="text"
                placeholder="linkedin.com/in/username"
                register={register}
              />
            </div>

            <EditFormActions
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              isDirty={isDirty}
            />
          </>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <InfoField
              label={<Trans>Facebook</Trans>}
              value={socials?.facebook}
            />
            <InfoField
              label={<Trans>Twitter</Trans>}
              value={socials?.twitter}
            />
            <InfoField
              label={<Trans>LinkedIn</Trans>}
              value={socials?.linkedIn}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaCard;
