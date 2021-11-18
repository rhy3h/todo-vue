import { createApp } from "vue";
import Master from "./components/layouts/Master";
import router from "./router";

import store from "./store";

import Toast from "vue-toastification";

createApp(Master).use(store).use(router).use(Toast).mount("#app");
