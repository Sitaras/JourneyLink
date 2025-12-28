export interface NavbarNavItem {
  href: string;
  label: React.ReactNode;
  external?: boolean;
  protected?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarNavItem[];
  signInText?: React.ReactNode;
  signInHref?: string;
  ctaText?: React.ReactNode;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}
