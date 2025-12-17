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
  users: "/users",
} as const;

export type RouteKey = keyof typeof routes;
export type RoutePath = (typeof routes)[RouteKey];

const routeConfig = {
  protected: {
    paths: [
      routes.settings,
      routes.createRide,
      routes.profile,
      routes.users,
      routes.myRides,
    ] as string[],
    prefixes: [routes.viewRide, routes.myRides, routes.users],
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
  const { paths, prefixes } = routeConfig.protected;

  return (
    paths.includes(path) ||
    prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
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
