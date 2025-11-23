import { z } from "zod";

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, {
    error: "required",
  }),
});

export type IRefreshTokenPayload = z.infer<typeof refreshTokenSchema>;
