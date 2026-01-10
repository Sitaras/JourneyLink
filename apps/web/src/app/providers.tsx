"use client";
import { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { LinguiClientProvider } from "@/components/LinguiProvider";
import { Messages } from "@lingui/core";

export default function Providers({
  children,
  initialLocale,
  initialMessages,
}: {
  children: ReactNode;
  initialLocale: string;
  initialMessages: Messages;
}) {
  return (
    <LinguiClientProvider
      initialLocale={initialLocale}
      initialMessages={initialMessages}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </LinguiClientProvider>
  );
}
