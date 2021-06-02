// TODO: warn when items are not used by any creature, drop table, recipe
// TODO: validate map properties (region, maxskill, maxlevel, etc)
// TODO: with map, check spawner names / spawners
// TODO: with map, check lair names against monsters
// TODO: with map, check npc names / dialogs
// TODO: audit tool that prints abnormal settings (item.destroyOnDrop, item.requirements, stats.actionSpeed, etc)
// TODO: advanced mode for npc dialog for scripts
// TODO: advanced mode for quests for scripts
// TODO: get a list of all traits via HTTP - should be hosted on play.rair.land when ready
// TODO: get all tradeskills, skills, traits, and other external data via an api or something?
// TODO: npc sprite should be an array
// TODO: host Content json files somewhere (content.rair.land?) and have an import option in each subtype to import stuff from there
// TODO: provide link to template map and allow for easy download/setup for Tiled - provide sample config with spritesheets in correct location
// TODO: make sure all items and npcs have unique names
// TODO: when updating item name, update npc gear as well
// TODO: when updating npc id, update spawner npcId list

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
