"use client";

import { motion } from "framer-motion";
import Typography from "@/components/ui/typography";
import { Trans } from "@lingui/react/macro";

export default function HeroSection() {
  return (
    <div className="w-full max-w-4xl text-center space-y-4 mb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Typography
          variant="h1"
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2"
        >
          <Trans>Find Your Perfect Ride</Trans>
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <Typography className="text-lg text-muted-foreground max-w-2xl mx-auto">
          <Trans>
            Connect with drivers heading your way. Share the journey, split the
            costs, and travel sustainably.
          </Trans>
        </Typography>
      </motion.div>
    </div>
  );
}
