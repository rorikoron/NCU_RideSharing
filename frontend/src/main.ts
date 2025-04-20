// FILE: main.js

import { createApp } from 'vue'
import {  Dialog, Notify, Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {Dialog, Notify}, // import Quasar plugins and add hereconfig: {
})

myApp.use(createPinia())
myApp.use(router)
// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
