import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";

import App from "./App.vue";
import router from "./router";
import vSelect from "vue-select";
import * as Sentry from "@sentry/vue";
// import * as Integrations from "@sentry/integrations";

// import './assets/main.css'
import "vue-select/dist/vue-select.css";
import "./assets/scss/_styles.scss";
import en from "./assets/i18n/en.json";
import vi from "./assets/i18n/vi.json";
import id from "./assets/i18n/id.json";
import ms from "./assets/i18n/ms.json";
import th from "./assets/i18n/th.json";
import tl from "./assets/i18n/tl.json";
import zh from "./assets/i18n/zh.json";
import ja from "./assets/i18n/ja.json";

import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://84735fbb870e4d9c9f3a457eb61f3d6f@tracker-glitchtip.erhubt.easypanel.host/1",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    new Sentry.Replay(),
  ],
  // integrations: [new Integrations.Vue({ app, attachProps: true })]
});

app.use(vue3GoogleLogin, {
  clientId:
    "725950667001-4jfl4lkhtv5t5hhl54sh63hne60eeosc.apps.googleusercontent.com",
});
app.use(createPinia());
app.use(router);
app.component("v-select", vSelect);

app.directive("click-outside", {
  mounted: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: function (el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
});

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "vi",
  globalInjection: true,
  legacy: false,
  messages: {
    en,
    vi,
    id,
    ms,
    th,
    tl,
    zh,
    ja,
  },
});

app.use(i18n);

app.mount("#app");
