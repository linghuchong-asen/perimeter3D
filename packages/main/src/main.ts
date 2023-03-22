import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import locale from "element-plus/lib/locale/lang/zh-cn";
import "amfe-flexible";

import "./assets/main.css";

const app = createApp(App);

app.config.globalProperties.$wsBaseUrl = "";
app.config.globalProperties.$httpBaseUrl = "";
app.use(createPinia());
app.use(router);
app.use(ElementPlus, { locale });
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
