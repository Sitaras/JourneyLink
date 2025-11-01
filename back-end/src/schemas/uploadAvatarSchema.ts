import { z } from "zod";

export const uploadAvatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "File size must be less than 2MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      {
        message: "Only JPEG, PNG, and WebP images are allowed",
      }
    ),
});

export type UploadAvatarSchemaPayload = z.infer<typeof uploadAvatarSchema>;
