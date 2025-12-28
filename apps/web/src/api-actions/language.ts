"use server";

import { cookies } from "next/headers";

export async function switchLanguage(locale: string) {
  (await cookies()).set({
    name: "NEXT_LOCALE",
    value: locale,
    sameSite: "lax",
  });
}
