import { createApp } from "vue";
import router from "./router/";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import { useAuthStore } from "./stores/authStore";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
const authStore = useAuthStore();
await authStore.initialize();
app.mount("#app");
