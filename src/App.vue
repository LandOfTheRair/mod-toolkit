<template>
  <div id="app" v-cloak>
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand>Land of the Rair Mod Toolkit</b-navbar-brand>

      <b-dropdown
        split
        right
        text="Save"
        class="ml-auto"
        @click="persist()"
        variant="outline-primary"
      >
        <b-dropdown-item
          href="https://github.com/bjorn/tiled/releases/tag/v1.1.4"
          target="_blank"
        >Get Map Editor</b-dropdown-item>
        <b-dropdown-item @click="exportMod()">Export Mod</b-dropdown-item>
        <b-dropdown-item @click="importMod()">Import Mod</b-dropdown-item>
        <b-dropdown-item @click="resetMod()">Reset Mod</b-dropdown-item>
      </b-dropdown>
    </b-navbar>

    <div class="px-3">
      <h3 class="text-center my-3">Modkit Title</h3>

      <div>
        <input
          type="text"
          class="form-control"
          placeholder="Modkit Title"
          v-model.trim="mod.modkitName"
          @keyup="persist()"
        >
      </div>

      <div class="mt-3">
        <b-tabs content-class="mt-3" fill class="main-tabs">
          <b-tab active>
            <template v-slot:title>Maps ({{ mod.maps.length }})</template>

            <tab-maps :maps="mod.maps"></tab-maps>
          </b-tab>

          <b-tab>
            <template v-slot:title>NPCs ({{ mod.npcs.length }})</template>

            <tab-npcs :npcs="mod.npcs" :items="mod.items"></tab-npcs>
          </b-tab>

          <b-tab>
            <template v-slot:title>Items ({{ mod.items.length }})</template>

            <tab-items :items="mod.items"></tab-items>
          </b-tab>

          <b-tab>
            <template v-slot:title>Droptables ({{ mod.drops.length }})</template>

            <tab-droptables :droptables="mod.drops" :items="mod.items" :maps="mod.maps"></tab-droptables>
          </b-tab>

          <b-tab>
            <template v-slot:title>Recipes ({{ mod.recipes.length }})</template>

            <tab-recipes :recipes="mod.recipes" :items="mod.items"></tab-recipes>
          </b-tab>

          <b-tab>
            <template v-slot:title>Spawners ({{ mod.spawners.length }})</template>

            <tab-spawners :spawners="mod.spawners" :npcs="mod.npcs"></tab-spawners>
          </b-tab>

          <b-tab disabled>
            <template v-slot:title>Dialogs</template>

            <tab-dialogs :dialogs="mod.dialogs"></tab-dialogs>
          </b-tab>

          <b-tab disabled>
            <template v-slot:title>Quests</template>

            <tab-quests :quests="mod.quests"></tab-quests>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { events } from "./main";

import MapsTab from "./components/Maps";
import NPCsTab from "./components/NPCs";
import ItemsTab from "./components/Items";
import DroptablesTab from "./components/Droptables";
import RecipesTab from "./components/Recipes";
import SpawnersTab from "./components/Spawners";
import DialogsTab from "./components/Dialogs";
import QuestsTab from "./components/Quests";

const defaultData = {
  modkitName: "",
  npcs: [],
  items: [],
  drops: [],
  spawners: [],
  recipes: [],
  maps: []
};

let loadedData = {};
try {
  loadedData = JSON.parse(localStorage.getItem("mod"));
} catch (e) {}

const opts = Object.assign({}, defaultData, loadedData);

export default {
  name: "App",

  components: {
    tabMaps: MapsTab,
    tabNpcs: NPCsTab,
    tabItems: ItemsTab,
    tabDroptables: DroptablesTab,
    tabRecipes: RecipesTab,
    tabSpawners: SpawnersTab,
    tabDialogs: DialogsTab,
    tabQuests: QuestsTab
  },

  created() {
    // map
    events.$on("add:map", map => {
      if (!this.mod.modkitName) this.mod.modkitName = map.name;

      if(this.mod.maps.find(x => x.name === map.name)) map.name = `${map.name} (2)`;

      this.mod.maps.push(map);

      this.persist();
    });

    events.$on("remove:map", index => {
      this.mod.maps.splice(index, 1);
      this.persist();
    });

    // npc
    events.$on("add:npc", ({ npc }) => {
      if(this.mod.npcs.find(x => x.npcId === npc.npcId)) npc.npcId = `${npc.npcId} (2)`;

      this.mod.npcs.push(npc);
      this.persist();
    });

    events.$on("edit:npc", ({ npc, index }) => {
      if(this.mod.npcs.find(x => x.npcId === npc.npcId)) npc.npcId = `${npc.npcId} (2)`;

      this.$set(this.mod.npcs, index, npc);
      this.persist();
    });

    events.$on("remove:npc", ({ index }) => {
      this.mod.npcs.splice(index, 1);
      this.persist();
    });

    // item
    events.$on("add:item", ({ item }) => {
      if(this.mod.items.find(x => x.name === item.name)) item.name = `${item.name} (2)`;

      this.mod.items.push(item);
      this.persist();
    });

    events.$on("edit:item", ({ item, index }) => {
      if(this.mod.items.find(x => x.name === item.name)) item.name = `${item.name} (2)`;

      const oldName = this.mod.items[index].name;
      const newName = item.name;

      this.$set(this.mod.items, index, item);

      this.updateItemsAcrossMod(oldName, newName);
      this.persist();
    });

    events.$on("remove:item", ({ index }) => {
      this.mod.items.splice(index, 1);
      this.persist();
    });

    // droptable
    events.$on("add:droptable", ({ droptable }) => {
      this.mod.drops.push(droptable);
      this.persist();
    });

    events.$on("edit:droptable", ({ droptable, index }) => {
      this.$set(this.mod.drops, index, droptable);
      this.persist();
    });

    events.$on("remove:droptable", ({ index }) => {
      this.mod.drops.splice(index, 1);
      this.persist();
    });

    // recipe
    events.$on("add:recipe", ({ recipe }) => {
      this.mod.recipes.push(recipe);
      this.persist();
    });

    events.$on("edit:recipe", ({ recipe, index }) => {
      this.$set(this.mod.recipes, index, recipe);
      this.persist();
    });

    events.$on("remove:recipe", ({ index }) => {
      this.mod.recipes.splice(index, 1);
      this.persist();
    });

    // spawner
    events.$on("add:spawner", ({ spawner }) => {
      if(this.mod.spawners.find(x => x.tag === spawner.tag)) spawner.tag = `${spawner.tag} (2)`;

      this.mod.spawners.push(spawner);
      this.persist();
    });

    events.$on("edit:spawner", ({ spawner, index }) => {
      if(this.mod.spawners.find(x => x.tag === spawner.tag)) spawner.tag = `${spawner.tag} (2)`;

      this.$set(this.mod.spawners, index, spawner);
      this.persist();
    });

    events.$on("remove:spawner", ({ index }) => {
      this.mod.spawners.splice(index, 1);
      this.persist();
    });
  },

  data: function() {
    return {
      mod: opts
    };
  },

  methods: {
    persist() {
      localStorage.setItem("mod", JSON.stringify(this.mod));
    },

    exportMod() {
      console.log("export");
    },

    importMod() {
      console.log("import");
    },

    resetMod() {
      if (
        !window.confirm(
          "Are you sure you want to do this? You will reset all of your existing content, so make sure you have backed it up first!"
        )
      )
        return;

      this.mod = Object.assign({}, defaultData);
      this.persist();
    },

    updateItemsAcrossMod(oldName, newName) {

      this.mod.drops.forEach(droptable => {
        if(droptable.result === oldName) droptable.result = newName;
      });

      this.mod.recipes.forEach(recipe => {
        if(recipe.item === oldName) recipe.item = newName;

        recipe.ingredients.forEach((ing, index) => {
          if(ing !== oldName) return;

          recipe.ingredients[index] = newName;
        });
      });
    }
  }
};
</script>

<style>
body,
html {
  height: 100%;
}

.tab-content {
  padding-left: 1rem;
  padding-right: 1rem;
}

.main-tabs .tab-content {
  height: calc(100vh - 56px - 33px - 38px - 1rem - 1rem - 42px - 2rem);
  max-height: calc(100vh - 56px - 33px - 38px - 1rem - 1rem - 42px - 2rem);
  overflow-y: auto;
}

.true-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.blank-slate {
  flex-direction: column;

  font-size: 2rem;
  color: #777;
  height: calc(100vh - 56px - 33px - 38px - 1rem - 1rem - 42px - 2rem);
}

.hidden {
  display: none;
}

.form-group:not(.left-header) .col-form-label {
  text-align: right;
  justify-content: flex-end;
  align-items: center;
}

.col-form-label {
  font-weight: bold;
  flex-direction: row;
  justify-content: space-between;
}

.modal-footer {
  justify-content: space-between;
}

fieldset legend {
  max-height: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  font-size: 90%;

  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

fieldset.optional legend {
  flex-direction: column;
  align-items: flex-end !important;
}

fieldset.optional legend::after {
  content: "\A(optional)";
  font-size: 65%;
}

fieldset.multi .col,
fieldset.multi-3 .col,
fieldset.sprite-field .col {
  display: flex;
}

fieldset.sprite-field .col {
  align-items: center;
}

fieldset.multi .form-control {
  width: 40% !important;
}

fieldset.multi-3 .form-control {
  width: 20% !important;
}

fieldset.multi .split-label,
fieldset.multi-3 .split-label {
  width: 20% !important;
}

.sprite-container,
.sprite {
  width: 64px !important;
  height: 64px !important;
}

.sprite {
  object-fit: none;
}

.sprite-container + input {
  margin-left: 64px !important;
}

th[role="columnheader"]:last-child {
  width: 200px;
  max-width: 200px;
}

.tooltip {
  pointer-events: none;
}

.modal-xl {
  max-width: calc(100vw - 50px);
}

.thin-button {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
