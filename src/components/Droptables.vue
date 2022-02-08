<template>
  <div>
    <div
      class="true-center blank-slate"
      v-if="(items.length === 0 || maps.length === 0) && droptables.length === 0"
    >Add items & maps first</div>

    <div
      class="true-center blank-slate"
      v-if="items.length && maps.length && droptables.length === 0"
    >No Droptables
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit Droptable"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidDroptable(droptable)"
    >
      <div class="d-block p-1">
        <b-form>
          <div class="row mt-3">
            <div class="col-6">
              <b-form-group label-cols-md="3" label="Map">
                <b-form-select v-model="droptable.mapName" required @change.native="droptable.regionName = ''">
                  <option :value="''">Choose map (unselects region)</option>
                  <option v-for="map in mapNames" :value="map" :key="map">{{ map }}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Region">
                <b-form-select v-model="droptable.regionName" required @change.native="droptable.mapName = ''">
                  <option :value="''">Choose region (unselects map)</option>
                  <option v-for="region in regionNames" :value="region" :key="region">{{ region }}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Item">
                <b-form-select v-model="droptable.result" required>
                  <option :value="''">Choose item</option>
                  <option v-for="item in items" :value="item.name" :key="item.name">{{ item.name }}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Chance to Drop (1/x)">
                <b-form-input type="number" v-model="droptable.maxChance" placeholder="Chance - x" min="0"></b-form-input>
              </b-form-group>

              <div class="row mb-3">
                <b-form-checkbox
                  v-model="droptable.noLuckBonus"
                  class="col-md-9 offset-md-3"
                >
                  <span
                    v-b-tooltip.hover
                    title="This drop will not factor in LUK, meaning it will always be a 1/x."
                  >No Luck Bonus</span>
                </b-form-checkbox>
              </div>

              <holiday-selector v-model="droptable.requireHoliday" label="Holiday" @change="droptable.requireHoliday = $event"></holiday-selector>
            </div>
          </div>
        </b-form>
      </div>
    </b-modal>

    <div class="mb-3">
      <b-form-input v-model="filter" placeholder="Search droptables..."></b-form-input>
    </div>

    <b-table
      v-if="droptables.length"
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :fields="tableFields"
      :items="droptables"
      :sticky-header="globalTableHeight"
      :filter="filter"
    >
      <template v-slot:head(actions)>
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(maxChance)="data">1/{{ data.item.maxChance }}</template>

      <template v-slot:cell(actions)="data">
        <b-button class="mr-1" size="sm" variant="info" @click="copy(data.item)">Copy</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="edit(data.item)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(data.item)">Remove</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import get from 'lodash.get';

import { clone } from '../helpers';
import { events } from '../main';

import { globalTableHeight } from '../constants';

import HolidaySelector from './shared/HolidaySelector.vue';

const defaultDroptable = {
  result: '',
  chance: 1,
  maxChance: 0,
  mapName: '',
  regionName: '',
  requireHoliday: ''
};

export default {
  name: 'Droptables',

  props: ['droptables', 'maps', 'items'],

  components: { HolidaySelector },

  data() {
    return {
      globalTableHeight,
      filter: '',
      sortBy: 'name',
      sortDesc: false,
      tableFields: [
        { key: 'result', label: 'Item', sortable: true },
        { key: 'maxChance', label: 'Chance', sortable: true },
        { key: 'mapName', label: 'Map', sortable: true },
        { key: 'regionName', label: 'Region', sortable: true },
        { key: 'actions', label: 'Actions', class: 'text-right' }
      ],
      isEditing: -1,
      droptable: clone(defaultDroptable)
    };
  },

  computed: {
    regionNames() {
      const regions = this.maps.map(x => {
        if(!x.map || !x.map.properties || !x.map.properties.region) return '';
        return x.map.properties.region;
      });

      return [...new Set(regions)];
    },

    mapNames() {
      return this.maps.map(x => x.name);
    }
  },

  methods: {
    isValidDroptable(droptable) {
      const validKeys = ['result', 'maxChance', 'chance'];
      return validKeys.every(x => get(droptable, x)) && (droptable.mapName || droptable.regionName);
    },

    reset() {
      this.droptable = clone(defaultDroptable);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? 'edit' : 'add'}:droptable`, {
        droptable: this.droptable,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(droptable) {
      events.$emit('add:droptable', { droptable: clone(droptable) });
    },

    edit(droptable) {
      this.droptable = clone(droptable);
      this.isEditing = this.droptables.findIndex(x => x === droptable);
      this.openModal();
    },

    async remove(droptable) {
      const willRemove = await this.$dialog.confirm({ title: 'Remove Droptable?', text: 'Are you sure you want to remove this droptable?' });
      if(!willRemove) return;

      events.$emit('remove:droptable', { index: this.droptables.findIndex(x => x === droptable) });
    }
  }
};
</script>

<style scoped>
</style>
