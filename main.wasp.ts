import { App } from "wasp-config";

const app = new App("figurinoapp", {
  title: "FigurinoApp",
  wasp: { version: "^0.22.0" },
  head: ["<link rel='icon' href='/favicon.ico' />"],
});

app.auth({
  userEntity: "User",
  methods: { usernameAndPassword: {} },
  onAuthFailedRedirectTo: "/login",
});

app.db({
  seeds: [
    { import: "seedOperadora", from: "@src/server/seeds/operadora" },
  ],
});

const mainPage = app.page("MainPage", {
  component: { import: "MainPage", from: "@src/MainPage" },
});
app.route("RootRoute", { path: "/", to: mainPage });

const loginPage = app.page("LoginPage", {
  component: { import: "LoginPage", from: "@src/client/pages/LoginPage" },
});
app.route("LoginRoute", { path: "/login", to: loginPage });

const dashboardPage = app.page("DashboardPage", {
  authRequired: true,
  component: { import: "DashboardPage", from: "@src/client/pages/DashboardPage" },
});
app.route("DashboardRoute", { path: "/dashboard", to: dashboardPage });

export default app;
