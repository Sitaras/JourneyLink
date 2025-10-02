const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  settings: "/settings",
  support: "/support",
  terms: "/terms-of-use",
  cookies: "/cookies",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
};

const protectedRoutes = [routes.home, routes.settings];
const publicRoutes = [
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.resetPassword,
];

export { routes, protectedRoutes, publicRoutes };
