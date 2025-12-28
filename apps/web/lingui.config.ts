import type { LinguiConfig } from "@lingui/conf";
import { formatter } from "@lingui/format-po";
import rootConfig from "../../lingui.config";

const config: LinguiConfig = {
  ...rootConfig,
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src", "../../packages/shared/src"],
    },
  ],
  format: formatter({ origins: false }),
};

export default config;
