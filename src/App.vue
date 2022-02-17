<template>
  <div id="app" v-cloak>

    <img src="file://./resources/maps/src/content/__assets/spritesheets/items.png" v-if="isLoaded" class="hidden" />
    <img src="file://./resources/maps/src/content/__assets/spritesheets/creatures.png" v-if="isLoaded" class="hidden" />

    <b-navbar type="dark" variant="dark">
      <b-navbar-brand>Land of the Rair Mod Toolkit</b-navbar-brand>

      <b-dropdown
        split
        right
        text="Save"
        class="ml-auto"
        @click="persist()"
        v-if="isLoaded"
        variant="outline-primary"
      >
        <b-dropdown-item disabled>Mod Metadata</b-dropdown-item>
        <b-dropdown-item @click="changeName()">Change Mod Name</b-dropdown-item>
        <b-dropdown-item @click="changeAuthor()">Change Mod Author</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-item disabled>Mod I/O</b-dropdown-item>
        <b-dropdown-item @click="importMod()">Load Mod</b-dropdown-item>
        <b-dropdown-item @click="exportMod()">Save Mod</b-dropdown-item>
        <b-dropdown-item @click="exportMod(true)">Export Mod</b-dropdown-item>
        <mod-validator :mod="mod"></mod-validator>
        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-item disabled>Mod Testing</b-dropdown-item>
        <b-dropdown-item @click="downloadMongo()">Install MongoDB...</b-dropdown-item>
        <b-dropdown-item @click="downloadRair()">Install Rair Server...</b-dropdown-item>
        <mod-tester></mod-tester>
        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-item disabled>Updates</b-dropdown-item>
        <b-dropdown-item @click="getResources()">Update Resources</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-item disabled>Danger Zone</b-dropdown-item>
        <b-dropdown-item @click="resetMod()">Reset Mod</b-dropdown-item>
      </b-dropdown>
    </b-navbar>

    <div class="px-3 loading" v-if="!isLoaded">
      First time load...
      <br>
      Gathering resources...
    </div>

    <div class="px-3" v-if="mod && isLoaded">
      <h3 class="text-center my-3">{{ mod.meta.name || 'Unnamed Modkit' }}</h3>
      <h6 class="text-center my-2">{{ mod.meta.author || 'Unknown Author' }}</h6>

      <div class="mt-3">
        <b-tabs content-class="mt-3" fill class="main-tabs">
          <b-tab active>
            <template v-slot:title>Maps ({{ mod.maps.length }})</template>

            <tab-maps :maps="mod.maps" :creator="mod.meta.author || 'Unknown'"></tab-maps>
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

          <b-tab>
            <template v-slot:title>Quests ({{ mod.quests.length }})</template>

            <tab-quests :quests="mod.quests" :npcs="mod.npcs" :items="mod.items"></tab-quests>
          </b-tab>

          <b-tab>
            <template v-slot:title>NPC Scripts ({{ mod.dialogs.length }})</template>

            <tab-dialogs :dialogs="mod.dialogs" :npcs="mod.npcs" :maps="mod.maps" :items="mod.items"></tab-dialogs>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import localforage from 'localforage';

import { events } from './main';

import ModValidator from './components/simple/ModValidator.vue';
import ModTester from './components/simple/ModTester.vue';

import MapsTab from './components/Maps';
import NPCsTab from './components/NPCs';
import ItemsTab from './components/Items';
import DroptablesTab from './components/Droptables';
import RecipesTab from './components/Recipes';
import SpawnersTab from './components/Spawners';
import DialogsTab from './components/Dialogs';
import QuestsTab from './components/Quests';

const defaultData = {
  meta: {
    name: '',
    author: '',
    version: 1,
    savedAt: 0
  },
  npcs: [],
  items: [],
  drops: [],
  spawners: [],
  recipes: [],
  maps: [],
  quests: [],
  dialogs: [],
};

export default {
  name: 'App',

  components: {
    ModValidator,
    ModTester,
    tabMaps: MapsTab,
    tabNpcs: NPCsTab,
    tabItems: ItemsTab,
    tabDroptables: DroptablesTab,
    tabRecipes: RecipesTab,
    tabSpawners: SpawnersTab,
    tabDialogs: DialogsTab,
    tabQuests: QuestsTab
  },

  async beforeCreate() {

    try {
      const mod = await localforage.getItem('mod');
      this.mod = Object.assign({}, defaultData, JSON.parse(mod));
      this.ensureMapsExist();

    } catch (e) {
      console.error(e);
    }

  },

  created() {
    this.watchIPC();
    this.watchKeybinds();

    window.api.send('READY_CHECK');

    // map
    events.$on('add:map', incomingMap => {
      if (!this.mod.meta.name) this.mod.meta.name = incomingMap.name;

      const existingMap = this.mod.maps.findIndex(x => x.name === incomingMap.name);
      if(existingMap !== -1) {
        this.mod.maps.splice(existingMap, 1, incomingMap);

      } else {
        this.mod.maps.push(incomingMap);
      }

      this.persist();
    });

    events.$on('rename:map', (oldName, newName) => {
      const existingMap = this.mod.maps.find(x => x.name === oldName);
      if(existingMap) {
        existingMap.name = newName;
      }

      this.updateMapNameAcrossMod(oldName, newName);

      this.persist();
    });

    events.$on('remove:map', index => {
      this.mod.maps.splice(index, 1);
      this.persist();
    });

    // npc
    events.$on('add:npc', ({ npc }) => {
      if(this.mod.npcs.find(x => x.npcId === npc.npcId)) npc.npcId = `${npc.npcId} (copy)`;

      this.mod.npcs.push(npc);
      this.persist();
    });

    events.$on('edit:npc', ({ npc, index }) => {
      const oldNPCId = this.mod.npcs[index].npcId;

      this.updateNPCIdAcrossMod(oldNPCId, npc.npcId);

      this.$set(this.mod.npcs, index, npc);
      this.persist();
    });

    events.$on('remove:npc', ({ index }) => {
      this.mod.npcs.splice(index, 1);
      this.persist();
    });

    // item
    events.$on('add:item', ({ item }) => {
      if(this.mod.items.find(x => x.name === item.name)) item.name = `${item.name} (copy)`;

      this.mod.items.push(item);
      this.persist();
    });

    events.$on('edit:item', ({ item, index }) => {
      const oldName = this.mod.items[index].name;
      const newName = item.name;

      this.updateItemsAcrossMod(oldName, newName);

      this.$set(this.mod.items, index, item);
      this.persist();
    });

    events.$on('remove:item', ({ index }) => {
      this.mod.items.splice(index, 1);
      this.persist();
    });

    // droptable
    events.$on('add:droptable', ({ droptable }) => {
      this.mod.drops.push(droptable);
      this.persist();
    });

    events.$on('edit:droptable', ({ droptable, index }) => {
      this.$set(this.mod.drops, index, droptable);
      this.persist();
    });

    events.$on('remove:droptable', ({ index }) => {
      this.mod.drops.splice(index, 1);
      this.persist();
    });

    // recipe
    events.$on('add:recipe', ({ recipe }) => {
      this.mod.recipes.push(recipe);
      this.persist();
    });

    events.$on('edit:recipe', ({ recipe, index }) => {
      this.$set(this.mod.recipes, index, recipe);
      this.persist();
    });

    events.$on('remove:recipe', ({ index }) => {
      this.mod.recipes.splice(index, 1);
      this.persist();
    });

    // spawner
    events.$on('add:spawner', ({ spawner }) => {
      if(this.mod.spawners.find(x => x.tag === spawner.tag)) spawner.tag = `${spawner.tag} (copy)`;

      this.mod.spawners.push(spawner);
      this.persist();
    });

    events.$on('edit:spawner', ({ spawner, index }) => {
      const oldName = this.mod.spawners[index].tag;
      const newName = spawner.tag;

      this.updateSpawnersAcrossMod(oldName, newName);

      this.$set(this.mod.spawners, index, spawner);
      this.persist();
    });

    events.$on('remove:spawner', ({ index }) => {
      this.mod.spawners.splice(index, 1);
      this.persist();
    });
    
    // quest
    events.$on('add:quest', ({ quest }) => {
      if(this.mod.quests.find(x => x.name === quest.name)) quest.name = `${quest.name} (copy)`;

      this.mod.quests.push(quest);
      this.persist();
    });

    events.$on('edit:quest', ({ quest, index }) => {
      this.$set(this.mod.quests, index, quest);
      this.persist();
    });

    events.$on('remove:quest', ({ index }) => {
      this.mod.quests.splice(index, 1);
      this.persist();
    });
    
    // npc script
    events.$on('add:dialog', ({ dialog }) => {
      if(this.mod.dialogs.find(x => x.tag === dialog.tag)) dialog.tag = `${dialog.name} (copy)`;

      this.mod.dialogs.push(dialog);
      this.persist();
    });

    events.$on('edit:dialog', ({ dialog, index }) => {
      this.$set(this.mod.dialogs, index, dialog);
      this.persist();
    });

    events.$on('remove:dialog', ({ index }) => {
      this.mod.dialogs.splice(index, 1);
      this.persist();
    });
  },

  data() {
    return {
      isLoaded: this.isLoaded,
      mod: this.mod
    };
  },

  methods: {
    watchIPC() {

      window.api.reset();

      window.api.receive('ready', () => {
        this.isLoaded = true;
      });

      window.api.receive('notify', ({ type, text }) => {
        this.$dialog.notify[type](text, { position: 'bottom-right' });
      });

      window.api.receive('newmap', mapData => {
        if(mapData.name === 'Template') return;
        events.$emit('add:map', mapData);
      });

      window.api.receive('renamemap', nameData => {
        events.$emit('rename:map', nameData.oldName, nameData.newName);
      });

      window.api.receive('json', jsonData => {
        events.$emit(`json:${jsonData.name}`, jsonData.data);
      });

      window.api.receive('loadmod', mod => {
        this.mod = mod;
        this.persist();
      });
    },

    watchKeybinds() {
      document.onkeypress = (e) => {
        if(e.keyCode !== 19 || !e.ctrlKey) return;
        this.persist();
      };
    },

    persist() {
      this.presave();
      localforage.setItem('mod', JSON.stringify(this.mod));
    },

    exportMod(shouldExport = false) {
      window.api.send('SAVE_MOD', { shouldExport, mapData: this.mod });
    },

    importMod() {
      window.api.send('LOAD_MOD');
    },

    downloadMongo() {
      window.api.send('DOWNLOAD_MONGO');
    },

    downloadRair() {
      window.api.send('DOWNLOAD_RAIR');
    },

    getResources() {
      window.api.send('UPDATE_RESOURCES');
    },

    presave() {
      this.mod.meta.savedAt = Date.now();
      
      this.mod.maps.forEach(({ map }) => {
        map.properties = map.properties || {};
        map.propertytypes = map.propertytypes || {};
        
        map.properties.creator = this.mod.meta.author || 'Unknown';
        map.propertytypes.creator = 'string';
      });
    },

    async resetMod() {
      const willReset = await this.$dialog.confirm({ title: 'Reset Mod?', text: 'Are you sure you want to do this? You will reset all of your existing content, so make sure you have backed it up first!' });
      if(!willReset) return;

      this.mod = Object.assign({}, defaultData);
      this.persist();
    },

    updateSpawnersAcrossMod(oldName, newName) {
      window.api.send('EDIT_MAP_SPAWNER', { oldName, newName });
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

      this.mod.npcs.forEach(npc => {
        npc.items.sack.forEach(item => {
          if(item.result !== oldName) return;

          item.result = newName;
        });

        Object.keys(npc.items.equipment).forEach(slot => {
          npc.items.equipment[slot].forEach(item => {
            if(item.result !== oldName) return;

            item.result = newName;
          });
          
        });

        if(npc.tansFor === oldName) npc.tansFor = newName;

        npc.drops.forEach(item => {
          if(item.result !== oldName) return;

          item.result = newName;
        });
        
        npc.dropPool.items = npc.dropPool.items.map(item => {
          if(item !== oldName) return item;

          return newName;
        });

      });
    },

    updateNPCIdAcrossMod(oldId, newId) {
      this.mod.spawners.forEach(spawner => {
        spawner.npcIds = spawner.npcIds.map(entry => {
          if(entry.result !== oldId) return entry;

          return { ...entry, result: newId };
        });
      });

      this.mod.quests.forEach(quest => {
        if(quest.requirements && quest.requirements.npcIds && !quest.requirements.npcIds.includes(oldId)) return;

        quest.requirements.npcIds = quest.requirements.npcIds.map(entry => {
          if(entry !== oldId) return entry;

          return newId;
        });
      });
    },

    updateMapNameAcrossMod(oldName, newName) {
      this.mod.drops.forEach(droptable => {
        if(droptable.mapName !== oldName) return;

        droptable.mapName = newName;
      });
    },

    async changeName() {
      const newName = await this.$dialog.prompt({ title: 'What would you like to call your mod?', text: 'Use the map or region name', value: this.mod.meta.name });
      if(!newName) return;

      this.mod.meta.name = newName;

      this.persist();
    },

    async changeAuthor() {
      const newName = await this.$dialog.prompt({ title: 'Who should get credit for this mod?', text: 'Your Rair alias or name', value: this.mod.meta.author });
      if(!newName) return;

      this.mod.meta.author = newName;

      this.persist();
    },

    ensureMapsExist() {
      this.mod.maps.forEach(map => {
        window.api.send('ENSURE_MAP', { ...map });
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
  overflow-y: none;
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

table td {
  min-height: 64px;
  vertical-align: middle !important;
}

.loading {
  height: calc(100vh - 64px);
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 3em;
  opacity: 0.7;
  text-align: center;
}
</style>

<style>
  .code-editor {
    background: #2d2d2d;
    color: #f8f8f2;
    border: 1px solid #000;
    font-family: Fira Code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }

  .code-editor.prism-editor-wrapper .prism-editor__container .prism-editor__editor {
    color: #f8f8f2;
    background: none;
    text-shadow: 0 1px rgba(0, 0, 0, 0.3);
    font-family: Fira Code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    tab-size: 4;
    hyphens: none;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>