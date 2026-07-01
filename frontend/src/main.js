import { createApp } from 'vue'
import App from './App.vue'
import store from "./store/index";
import './assets/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { Tooltip } from 'bootstrap'
import auth from './auth.guard.js';
/* Import Font Awesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* Import individual icons */
import { faUser, faEnvelope, faPenToSquare, faTrash, faCartArrowDown, faHeart } from '@fortawesome/free-solid-svg-icons'

/* Import Vue component wrapper */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { loaderDirective } from './directives/loader.js';

library.add(
  faUser,
  faEnvelope,
  faPenToSquare,
  faTrash,
  faCartArrowDown,
  faHeart
)


const app = createApp(App)

/* Register the component globally */
app.component('font-awesome-icon', FontAwesomeIcon);

// Register the custom directive as 'v-loader'
app.directive('loader', loaderDirective);

app.use(auth)
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