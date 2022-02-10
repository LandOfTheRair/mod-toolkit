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
      :ok-disabled="!isValidNPCScript(dialog)"
    >
      <div class="d-block p-1">
        <b-form>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Core Stats">
              <div class="row">
                <div class="col-md-4">

                  <map-npc-selector v-model="dialog.tag" label="Map NPC Tag" @change="dialog.tag = $event" :maps="maps"></map-npc-selector>

                  <b-form-group label-cols-md="3" label="Name" class="optional">
                    <b-form-input
                      type="text"
                      v-model="dialog.name"
                      placeholder="The NPC name (if not specified in the map)"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Affiliation" class="optional">
                    <b-form-input
                      type="text"
                      v-model="dialog.affiliation"
                      placeholder="The guild/tag for NPC"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="HP" class="multi">
                    <b-form-input
                      type="number"
                      v-model="dialog.hp.min"
                      min="0"
                      @change.native="updateKeyMaxIfNotPresent($event, 'hp')"
                    ></b-form-input>
                    <div class="split-label true-center">To</div>
                    <b-form-input type="number" v-model="dialog.hp.max" min="0"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="MP" class="multi">
                    <b-form-input
                      type="number"
                      v-model="dialog.mp.min"
                      min="0"
                      @change.native="updateKeyMaxIfNotPresent($event, 'mp')"
                    ></b-form-input>
                    <div class="split-label true-center">To</div>
                    <b-form-input type="number" v-model="dialog.mp.max" min="0"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Hostility">
                    <b-form-select
                      v-model="dialog.hostility"
                      required
                      :options="['OnHit', 'Faction', 'Always', 'Never']"
                    ></b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Allegiance">
                    <b-form-select
                      v-model="dialog.allegiance"
                      required
                      :options="['Enemy', 'Adventurers', 'Pirates', 'Royalty', 'Townsfolk', 'Underground', 'Wilderness', 'NaturalResource']"
                    ></b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Alignment">
                    <b-form-select
                      v-model="dialog.alignment"
                      required
                      :options="['Good', 'Neutral', 'Evil']"
                    ></b-form-select>
                  </b-form-group>

                </div>

                <div class="col-md-4">
                  <b-button class="mb-3" variant="info" block @click="addUsableSkill()">Add Spell</b-button>

                  <div class="row" v-for="(skill, index) of dialog.usableSkills" :key="index">
                    <div class="col-6">
                      <spell-selector v-model="skill.result" label="Spell" @change="skill.result = $event"></spell-selector>
                    </div>

                    <div class="col-4">
                      <b-form-input type="number" v-model="skill.chance" placeholder="X" min="1"></b-form-input>
                    </div>

                    <div class="col-2">
                      <b-button variant="danger" @click="removeUsableSkill(index)">Del</b-button>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="row" v-for="(val, slot) of dialog.items.equipment" :key="slot">
                    <div class="col-12">
                      <b-button class="mb-3" variant="info" block @click="addEquipmentItem(slot)">Add {{ slot }} Item</b-button>

                      <div class="row" v-for="(sitem, index) of dialog.items.equipment[slot]" :key="index">
                        <div class="col-7">
                          <item-selector v-model="sitem.result" :modItems="items" label="Item" @change="sitem.result = $event"></item-selector>
                        </div>

                        <div class="col-3">
                          <b-form-input type="number" v-model="sitem.chance" placeholder="1/x" min="1"></b-form-input>
                        </div>

                        <div class="col-2">
                          <b-button variant="danger" @click="removeEquipmentItem(slot, index)">Del</b-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </b-tab>

            <b-tab title="Behaviors">
              <div class="row">
                <div class="col">
                  <prism-editor class="code-editor" v-model="npcBehaviors" :highlight="highlighter" line-numbers></prism-editor>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <div class="feedback" :class="{ 'has-error': npcBehaviorsFeedback }">{{ npcBehaviorsFeedback || 'No errors.' }}</div>
                </div>
              </div>

            </b-tab>

            <b-tab title="Dialog">
              <div class="row">
                <div class="col">
                  <prism-editor class="code-editor" v-model="npcDialog" :highlight="highlighter" line-numbers></prism-editor>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <div class="feedback" :class="{ 'has-error': npcDialogFeedback }">{{ npcDialogFeedback || 'No errors.' }}</div>
                </div>
              </div>
            </b-tab>

          </b-tabs>
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

      <template v-slot:cell(behaviors)="data">
        {{ data.item.behaviors.length }}
      </template>

      <template v-slot:cell(dialog)="data">
        {{ numDialogs(data.item) }}
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
import yaml from 'js-yaml';
import { PrismEditor } from 'vue-prism-editor';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-yaml';

import { events } from '../main';
import { clone } from '../helpers';

import { globalTableHeight } from '../constants';

import ItemSelector from './shared/ItemSelector.vue';
import SpellSelector from './shared/SpellSelector.vue';
import MapNPCSelector from './shared/MapNPCSelector.vue';

const defaultScript = {
  tag: '',
  name: '',
  affiliation: '',
  hostility: 'Never',
  allegiance: 'Adventurers',
  alignment: 'Neutral',
  level: 0,
  hp: {
    min: 100000,
    max: 100000,
  },
  mp: {
    min: 10000,
    max: 10000,
  },
  usableSkills: [],
  items: {
    equipment: {
      rightHand: [],
      leftHand: [],
      head: [],
      neck: [],
      ear: [],
      waist: [],
      wrists: [],
      ring1: [],
      ring2: [],
      hands: [],
      feet: [],
      armor: [],
      robe1: [],
      robe2: [],
      trinket: [],
      potion: [],
      ammo: []
    }
  },
  dialog: {
    keyword: {}
  },
  behaviors: []
};

export default {
  name: 'Dialogs',

  props: ['dialogs', 'npcs', 'maps', 'items'],

  components: { PrismEditor, 'map-npc-selector': MapNPCSelector, ItemSelector, SpellSelector },

  data() {
    return {
      globalTableHeight,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      filter: '',
      npcBehaviors: '',
      npcDialog: '',
      sortBy: 'name',
      sortDesc: false,
      tableFields: [
        { key: 'tag', label: 'Id Tag', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'level', label: 'Level', sortable: true },
        { key: 'affiliation', label: 'Affiliation', sortable: true },
        { key: 'hostility', label: 'Hostility', sortable: true },
        { key: 'allegiance', label: 'Allegiance', sortable: true },
        { key: 'alignment', label: 'Alignment', sortable: true },
        { key: 'behaviors', label: '# Behaviors', sortable: true },
        { key: 'dialog', label: '# Dialogs', sortable: true },
        { key: 'actions', label: 'Actions', class: 'text-right' }
      ],
      isEditing: -1,
      dialog: clone(defaultScript)
    };
  },

  created() {
    this.onFiltered(this.dialogs);
  },

  computed: {
    npcDialogFeedback() {
      try {
        yaml.load(this.npcDialog);
        return '';

      } catch (e) {
        return e.message;
      }
    },

    npcBehaviorsFeedback() {
      try {
        yaml.load(this.npcBehaviors);
        return '';

      } catch (e) {
        return e.message;
      }
    }
  },

  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
      this.dialogs.count = filteredItems.length;
    },

    updateKeyMaxIfNotPresent($event, key) {
      if (this.dialog[key].max > this.dialog[key].min) return;
      this.dialog[key].max = this.dialog[key].min;
    },

    isValidNPCScript(dialog) {
      try {
        yaml.load(this.npcDialog);
        yaml.load(this.npcBehaviors);
      } catch {
        return false;
      }

      const validKeys = ['tag', 'hp.max', 'hp.min', 'hostility', 'allegiance', 'alignment'];
      return validKeys.every(x => get(dialog, x));
    },

    numDialogs(dialog) {
      return Object.keys(dialog.dialog).length;
    },

    reset() {
      this.dialog = clone(defaultScript);
      this.isEditing = -1;
    },

    confirm() {
      this.dialog.behaviors = yaml.load(this.npcBehaviors);
      this.dialog.dialog = yaml.load(this.npcDialog);

      events.$emit(`${this.isEditing >= 0 ? 'edit' : 'add'}:dialog`, {
        dialog: this.dialog,
        index: this.isEditing
      });
    },

    openModal() {
      this.npcBehaviors = yaml.dump(this.dialog.behaviors || []);
      this.npcDialog = yaml.dump(this.dialog.dialog || { keyword: {} });
      this.$refs.modal.show();
    },

    copy(dialog) {
      events.$emit('add:dialog', { dialog: clone(dialog) });
    },

    edit(dialog) {
      this.dialog = clone(dialog);
      this.isEditing = this.dialogs.findIndex(x => x === dialog);
      this.openModal();
    },

    async remove(dialog) {
      const willRemove = await this.$dialog.confirm({ title: 'Remove NPC Script?', text: 'Are you sure you want to remove this NPC Script?' });
      if(!willRemove) return;

      events.$emit('remove:dialog', { index: this.dialogs.findIndex(x => x === dialog) });
    },

    addEquipmentItem(slot) {
      this.dialog.items.equipment[slot].push({
        result: '',
        chance: 1
      });
    },

    removeEquipmentItem(slot, index) {
      this.$delete(this.dialog.items.equipment[slot], index);
    },

    addUsableSkill() {
      this.dialog.usableSkills.push({
        result: '',
        chance: 1
      });
    },

    removeUsableSkill(index) {
      this.$delete(this.dialog.usableSkills, index);
    },

    highlighter(code) {
      return highlight(code, languages.yaml);
    }
  }
};
</script>

<style scoped>
.code-editor {
  max-height: calc(100vh - 10vh - 20vh);
}

.feedback {
  text-align: center;
}

.feedback.has-error {
  color: red;
  font-weight: bold;
}
</style>
