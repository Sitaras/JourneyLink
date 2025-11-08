const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  settings: "/settings",
  createRide: "/create-ride",
  myRides: "/my-rides",
  viewRide: "/ride",
  support: "/support",
  terms: "/terms-of-use",
  cookies: "/cookies",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  profile: "/profile",
} as const;

const routeConfig = {
  protected: {
    paths: [
      routes.settings,
      routes.createRide,
      routes.profile,
      routes.myRides,
    ] as string[],
    // Note: /route is protected, but we'll handle dynamic routes separately
    patterns: [/^\/route\/.+/], // Regex to match /route/* paths
    redirectTo: routes.login,
  },
  auth: {
    paths: [
      routes.login,
      routes.register,
      routes.forgotPassword,
      routes.resetPassword,
    ] as string[],
    redirectTo: routes.home,
  },
  public: {
    paths: [
      routes.home,
      routes.support,
      routes.terms,
      routes.cookies,
    ] as string[],
  },
} as const;

const isProtectedRoute = (path: string): boolean => {
  return (
    routeConfig.protected.paths.includes(path) ||
    routeConfig.protected.patterns.some((pattern) => pattern.test(path))
  );
};

const isAuthRoute = (path: string): boolean => {
  return routeConfig.auth.paths.includes(path);
};

const isPublicRoute = (path: string): boolean => {
  return routeConfig.public.paths.includes(path);
};

const protectedRoutes = routeConfig.protected.paths;
const authRoutes = routeConfig.auth.paths;
const publicRoutes = [...routeConfig.public.paths, ...authRoutes];

export {
  routes,
  routeConfig,
  protectedRoutes,
  authRoutes,
  publicRoutes,
  isProtectedRoute,
  isAuthRoute,
  isPublicRoute,
};

export type RoutePath = (typeof routes)[keyof typeof routes];
export type RouteKey = keyof typeof routes;
