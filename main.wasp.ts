import { App } from "wasp-config";

const app = new App("figurinoapp", {
  title: "FigurinoApp",
  wasp: { version: "^0.22.0" },
  head: ["<link rel='icon' href='/favicon.ico' />"],
});

const mainPage = app.page("MainPage", {
  component: { import: "MainPage", from: "@src/MainPage" },
});

app.route("RootRoute", { path: "/", to: mainPage });

export default app;
