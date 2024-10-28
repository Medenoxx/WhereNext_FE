import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from "axios";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

// Importieren der Icons
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const app = createApp(App);
const pinia = createPinia();

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi', // Setzen des Standard-Icon-Sets auf 'mdi'
        aliases,
        sets: {
            mdi,
        },
    },
});

// Füge den Token zu jedem Request hinzu
axios.interceptors.request.use((config) => {
    const jwt = localStorage.getItem('token');
    if (!config.headers.hasAuthorization() && jwt) {
        config.headers.setAuthorization(`Bearer ${jwt}`);
    }
    return config;
});

app.use(pinia);
app.use(router);
app.use(vuetify);

app.use(Toast);

app.mount('#app');
