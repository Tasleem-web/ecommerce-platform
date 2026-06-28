import { createApp } from 'vue'
import App from './App.vue'
import store from "./store/index";
import './assets/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { Tooltip } from 'bootstrap'
import router from './routerguard';
/* Import Font Awesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* Import individual icons */
import { faUser, faEnvelope, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

/* Import Vue component wrapper */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser, faEnvelope, faPenToSquare)

const app = createApp(App)

/* Register the component globally */
app.component('font-awesome-icon', FontAwesomeIcon)

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