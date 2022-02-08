
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.min.css';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import BootstrapVueDialog from 'bootstrap-vue-dialog';

import App from './App';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueDialog);

export const events = new Vue();

new Vue({
  render: h => h(App)
}).$mount('#app');
