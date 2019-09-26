// TODO: warn when items are not used by any creature, drop table
// TODO: validate map properties (region, maxskill, maxlevel, etc)
// TODO: with map, check spawner names / spawners
// TODO: with map, check lair names against monsters
// TODO: with map, check npc names / dialogs
// TODO: audit tool that prints abnormal settings (item.destroyOnDrop, item.requirements, etc)
// TODO: advanced mode for npc dialog for scripts
// TODO: advanced mode for quests for scripts
// TODO: get a list of all traits via HTTP - should be hosted on play.rair.land when ready
// TODO: npc sprite should be an array

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap-vue/dist/bootstrap-vue.min.css";

import Vue from "vue";
import BootstrapVue from "bootstrap-vue";

import App from "./App";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

export const events = new Vue();

new Vue({
  render: h => h(App)
}).$mount("#app");
