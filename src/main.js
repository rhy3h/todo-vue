import { createApp } from 'vue'
import Master from './components/layouts/Master'
import router from './router'

import store from './store/store'

createApp( Master ).use(store).use(router).mount('#app')
