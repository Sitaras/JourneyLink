import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/data/routes";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";

interface AuthorizedRouteProps {
  children: React.ReactNode;
  redirectUrl?: string;
  LoadingComponent?: React.ComponentType;
}

const AuthorizedRoute = ({
  children,
  redirectUrl = routes.login,
  LoadingComponent = ScreenLoader,
}: AuthorizedRouteProps) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl]);

  if (isLoading) {
    return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthorizedRoute;
