import { cn } from "@/lib/utils";
import React from "react";

const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h1 className={cn("text-4xl font-bold", className)} {...props}>
    {children}
  </h1>
);

const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h2 className={cn("text-3xl font-semibold", className)} {...props}>
    {children}
  </h2>
);

const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={cn("text-2xl font-semibold", className)} {...props}>
    {children}
  </h3>
);

const H4: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h4 className={cn("text-xl font-medium", className)} {...props}>
    {children}
  </h4>
);

const H5: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h5 className={cn("text-lg font-medium", className)} {...props}>
    {children}
  </h5>
);

const H6: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h6 className={cn("text-base font-medium", className)} {...props}>
    {children}
  </h6>
);

const P: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn("text-base", className)} {...props}>
    {children}
  </p>
);

const Lead: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn("text-lg text-gray-700", className)} {...props}>
    {children}
  </p>
);

const Small: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...props
}) => (
  <small className={cn("text-sm text-gray-500", className)} {...props}>
    {children}
  </small>
);

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "lead"
  | "small";

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "p",
  children,
  className = "",
}) => {
  const components: Record<TypographyVariant, React.ElementType> = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    p: P,
    lead: Lead,
    small: Small,
  };

  const Component = components[variant];

  return <Component className={className}>{children}</Component>;
};

export default Typography;
