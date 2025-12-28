import "server-only";

import { I18n, Messages, setupI18n } from "@lingui/core";
import linguiConfig from "../../lingui.config";
import { cookies } from "next/headers";
import { setI18n } from "@lingui/react/server";

const { locales } = linguiConfig;

// Statically import catalogs to avoid dynamic import issues in some Next.js configs
import * as enCatalog from "../locales/en/messages";
import * as elCatalog from "../locales/el/messages";

const catalogs: Record<string, any> = {
  en: enCatalog,
  el: elCatalog,
};

export const allMessages: Record<string, Messages> = {
  en: catalogs.en.messages,
  el: catalogs.el.messages,
};

type SupportedLocales = string;
type AllI18nInstances = { [K in SupportedLocales]: I18n };

export const allI18nInstances: AllI18nInstances = locales.reduce(
  (acc, locale) => {
    const messages = allMessages[locale] ?? {};
    const i18n = setupI18n({
      locale,
      messages: { [locale]: messages },
    });
    return { ...acc, [locale]: i18n };
  },
  {} as AllI18nInstances
);

export const getI18nInstance = (locale: SupportedLocales): I18n => {
  if (!allI18nInstances[locale]) {
    console.warn(`No i18n instance found for locale "${locale}"`);
    return allI18nInstances["en"];
  }
  return allI18nInstances[locale];
};

export async function initLingui() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const i18n = getI18nInstance(locale);
  setI18n(i18n);
  return i18n;
}
