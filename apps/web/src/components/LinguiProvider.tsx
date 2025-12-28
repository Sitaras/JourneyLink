"use client";

import { I18nProvider } from "@lingui/react";
import { type Messages, i18n } from "@lingui/core";
import { useState, useEffect } from "react";

export function LinguiClientProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages: Messages;
}) {
  const [activeI18n] = useState(() => {
    i18n.load({ [initialLocale]: initialMessages });
    i18n.activate(initialLocale);
    return i18n;
  });

  // Ensure the i18n instance is updated when the locale or messages change
  useEffect(() => {
    if (activeI18n.locale !== initialLocale) {
      activeI18n.load({ [initialLocale]: initialMessages });
      activeI18n.activate(initialLocale);
    }
  }, [initialLocale, initialMessages, activeI18n]);

  return <I18nProvider i18n={activeI18n}>{children}</I18nProvider>;
}
