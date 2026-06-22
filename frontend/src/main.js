import { createApp } from 'vue'
import App from './App.vue'
import store from "./store/index";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { Tooltip } from 'bootstrap'
import router from './routerguard';

const app = createApp(App)

app.use(router)
app.use(store)

// Restore user session from cookie before mount
store.dispatch('userModule/loadUserFromCookie')

// Initialize Bootstrap tooltips globally
app.config.globalProperties.$initTooltips = () => {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl)
  })
}

app.mount('#app')
app.config.globalProperties.$initTooltips()