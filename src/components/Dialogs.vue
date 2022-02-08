<template>
  <div>
    <div class="true-center blank-slate" v-if="npcs.length === 0">
      Add NPCs first
    </div>

    <div class="true-center blank-slate" v-if="npcs.length && dialogs.length === 0">No NPC Scripts
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit NPC Script"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidNPCScript(script)"
    >
      <div class="d-block p-1">
        <b-form>
        </b-form>
      </div>
    </b-modal>

    <div class="mb-3 row" v-if="dialogs.length > 0">
      <div class="col-6">
        <b-form-input v-model="filter" placeholder="Search NPC scripts..."></b-form-input>
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
      v-if="dialogs.length"
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :fields="tableFields"
      :items="dialogs"
      :sticky-header="globalTableHeight"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      @filtered="onFiltered"
    >
      <template v-slot:head(actions)>
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(ingredients)="data">
        <div v-for="(item, index) in data.item.ingredients" :key="index">{{ item }}</div>
      </template>

      <template v-slot:cell(actions)="data">
        <b-button class="mr-1" size="sm" variant="info" @click="copy(data.item)">Copy</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="edit(data.item)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(data.item)">Remove</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { get } from 'lodash';

import { events } from '../main';
import { clone } from '../helpers';

import { globalTableHeight } from '../constants';

const defaultScript = {

};

export default {
  name: 'Dialogs',

  props: ['dialogs', 'npcs'],

  data() {
    return {
      globalTableHeight,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      filter: '',
      sortBy: 'name',
      sortDesc: false,
      tableFields: [
        { key: 'tag', label: 'NPC Id Tag', sortable: true },
        { key: 'actions', label: 'Actions', class: 'text-right' }
      ],
      isEditing: -1,
      dialog: clone(defaultScript)
    };
  },

  created() {
    this.onFiltered(this.recipes);
  },

  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
      this.items.count = filteredItems.length;
    },

    isValidNPCScript(script) {
      const validKeys = ['tag'];
      return validKeys.every(x => get(script, x));
    },

    reset() {
      this.recipe = clone(defaultScript);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? 'edit' : 'add'}:dialog`, {
        recipe: this.dialog,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(dialog) {
      events.$emit('add:dialog', { dialog: clone(dialog) });
    },

    edit(dialog) {
      this.dialog = clone(dialog);
      this.isEditing = this.recipes.findIndex(x => x === dialog);
      this.openModal();
    },

    async remove(dialog) {
      const willRemove = await this.$dialog.confirm({ title: 'Remove NPC Script?', text: 'Are you sure you want to remove this NPC Script?' });
      if(!willRemove) return;

      events.$emit('remove:dialog', { index: this.dialogs.findIndex(x => x === dialog) });
    }
  }
};
</script>

<style scoped>
</style>
