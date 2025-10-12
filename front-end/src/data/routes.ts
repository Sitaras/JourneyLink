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

const protectedRoutes = [routes.settings];
const authRoutes = [
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.resetPassword,
];
const publicRoutes = [routes.home, ...authRoutes];


export { routes, protectedRoutes, authRoutes, publicRoutes };
