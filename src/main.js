
// TODO: dialog editor
// TODO: quest editor
// TODO: warn when items are not used by any creature, drop table, recipe
// TODO: validate map properties (region, maxskill, maxlevel, etc)
// TODO: with map, check spawner names / spawners
// TODO: with map, check lair names against monsters
// TODO: with map, check npc names / dialogs
// TODO: audit tool that prints abnormal settings (item.destroyOnDrop, item.requirements, stats.actionSpeed, etc)
// TODO: make sure all entries have unique names
// TODO: when updating item name, update npc gear as well
// TODO: when updating npc id, update spawner npcId list
// TODO: remove size from selector components; put size on the implementer
// TODO: support tooltips for selector components
// TODO: add export mod support to export to json, with compiled (and cleaned) result as well as original mod. lots of extra shit needs to be cleaned from the export due to how the editor works

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
