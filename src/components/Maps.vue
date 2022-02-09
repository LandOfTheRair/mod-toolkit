<template>
  <div>
    <input
      type="file"
      multiple
      @change="uploadMap($event.target.files)"
      accept="application/json"
      ref="mapUpload"
      class="hidden"
    >

    <div class="true-center blank-slate" v-if="maps.length === 0">No maps
      <br>

      <b-button class="mb-1" variant="primary" @click="$refs.mapUpload.click()">Import some</b-button> <b-button variant="primary" @click="createMap()">Create new</b-button>
    </div>

    <div class="mb-3 row" v-if="maps.length > 0">
      <div class="col-6">
        <b-form-input v-model="filter" placeholder="Search maps..."></b-form-input>
      </div>

      <div class="col-6">
        <b-pagination
          class="float-right"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
        ></b-pagination>
      </div>
    </div>

    <b-table 
      v-if="maps.length" 
      small 
      :fields="tableFields" 
      :items="maps"
      :sticky-header="globalTableHeight"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      @filtered="onFiltered"
    >
      <template v-slot:head(actions)>
        <b-button class="mr-1" size="sm" variant="success" @click="$refs.mapUpload.click()">Import</b-button>
        <b-button size="sm" variant="success" @click="createMap()">New</b-button>
      </template>

      <template v-slot:cell(name)="data">{{ data.item.name }}</template>

      <template v-slot:cell(width)="data">{{ data.item.map.width }}</template>

      <template v-slot:cell(height)="data">{{ data.item.map.height }}</template>

      <template v-slot:cell(actions)="data">
        <b-button class="mr-1" size="sm" variant="info" @click="renameMap(data.item.name)">Rename</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="editMap(data.item.name)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="removeMap(data.index)">Remove</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { events } from '../main';

import { globalTableHeight } from '../constants';

export default {
  name: 'Maps',

  props: ['maps', 'creator'],

  data() {
    return {
      globalTableHeight,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      filter: '',
      tableFields: [
        { key: 'name', label: 'Name' },
        { key: 'width', label: 'Width' },
        { key: 'height', label: 'Height' },
        { key: 'actions', label: 'Actions', class: 'text-right' }
      ]
    };
  },

  created() {
    this.onFiltered(this.maps);
  },

  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
      this.maps.count = filteredItems.length;
    },
    
    async createMap() {
      const newName = await this.$dialog.prompt({ title: 'What would you like to name this map?', text: '' });
      if(!newName) return;

      window.api.send('NEW_MAP', { name: newName, creator: this.creator });
    },

    async renameMap(mapName) {
      const newName = await this.$dialog.prompt({ title: 'What would you like to rename this map to?', text: '' });
      if(!newName) return;

      if(this.maps.some(map => map.name === newName)) {
        this.$dialog.error({ title: 'Error', text: 'A map with that name already exists.' });
        return;
      }

      window.api.send('RENAME_MAP', { newName, oldName: mapName });
    },

    editMap(name) {
      window.api.send('EDIT_MAP', { name });
    },

    uploadMap(files) {
      for (let i = 0; i < files.length; i++) {
        let file = this.$refs.mapUpload.files[i];
        if (!file || file.type !== 'application/json') return;

        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = evt => {
          try {
            const map = JSON.parse(evt.target.result);
            const mapName = files[i].name.split('.')[0];
            events.$emit('add:map', { name: mapName, map });
          } catch (e) {
            this.$dialog.notify.error(`Map upload error: ${e.message}`);
          }
        };

        reader.onerror = e => {
          this.$dialog.notify.error(`Map upload error: ${e.message}`);
        };
      }
    },

    async removeMap(index) {
      const willRemove = await this.$dialog.confirm({ title: 'Remove Map?', text: 'Are you sure you want to remove this map?' });
      if(!willRemove) return;

      events.$emit('remove:map', index);
    }
  }
};
</script>

<style scoped>
</style>
