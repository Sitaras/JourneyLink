"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useLingui } from "@lingui/react";
import { switchLanguage } from "@/api-actions/language";

export function LanguageSwitcher() {
  const { i18n } = useLingui();
  const router = useRouter();

  const toggleLanguage = async () => {
    const nextLocale = i18n.locale === "en" ? "el" : "en";

    // Call server action to set cookie
    await switchLanguage(nextLocale);

    // Refresh to update server components and load new messages
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={toggleLanguage}>
      {i18n.locale === "en" ? "Ελληνικά" : "English"}
    </Button>
  );
}
