import { z } from "zod";
import { citySchema } from "./citySchema";

import { t } from "@lingui/core/macro";

export const createRideSearchSchema = () =>
  z.object({
    departureLocation: z
      .union([citySchema, z.undefined()])
      .refine((val) => Boolean(val), {
        message: t`required`,
      }),
    arrivalLocation: z
      .union([citySchema, z.undefined()])
      .refine((val) => Boolean(val), {
        message: t`required`,
      }),
    dateTrip: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: t`Date must be in the future`,
        }
      )
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          const maxDate = new Date(new Date().getFullYear() + 1, 11, 31);
          return date <= maxDate;
        },
        {
          message: t`Date is too far in the future`,
        }
      ),
  });
