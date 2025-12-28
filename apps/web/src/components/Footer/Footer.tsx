import Link from "next/link";
import Typography from "@/components/ui/typography";
import { Car } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Trans } from "@lingui/react/macro";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex justify-center border-t bg-muted/30 ">
      <div className="container p-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <Typography className="font-bold text-lg">
                CoPassengers
              </Typography>
            </div>
            <Typography className="text-sm text-muted-foreground">
              <Trans>
                Connecting travelers and reducing carbon footprints, one ride at
                a time.
              </Trans>
            </Typography>
          </div>

          {/* Quick Links */}
          <div>
            <Typography className="font-semibold mb-4">
              <Trans>Quick Links</Trans>
            </Typography>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>Find a Ride</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/offer-ride"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>Offer a Ride</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>How it Works</Trans>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <Typography className="font-semibold mb-4">
              <Trans>Support</Trans>
            </Typography>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>Help Center</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>Safety</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>Contact Us</Trans>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <Typography className="font-semibold mb-4">
              <Trans>Legal</Trans>
            </Typography>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>Terms of Service</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>Privacy Policy</Trans>
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Trans>Cookie Policy</Trans>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Typography className="text-sm text-muted-foreground">
            © {currentYear} CoPassengers. <Trans>All rights reserved.</Trans>
          </Typography>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Trans>Terms</Trans>
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Trans>Privacy</Trans>
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Trans>Cookies</Trans>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
