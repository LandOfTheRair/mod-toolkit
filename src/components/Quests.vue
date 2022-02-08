<template>
    <div>

    <div class="true-center blank-slate" v-if="quests.length === 0">No Quests
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit Quest"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidQuest(quest)"
    >
      <div class="d-block p-1">
        <b-form>
          <div class="row mt-3">
            <div class="col-4">
              <b-form-group label-cols-md="3" label="Name">
                <b-form-input
                  type="text"
                  v-model="quest.name"
                  required
                  placeholder="Quest Name"
                ></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Desc">
                <b-form-input
                  type="text"
                  v-model="quest.desc"
                  required
                  placeholder="Quest Description"
                ></b-form-input>
              </b-form-group>
              
              <b-form-group label-cols-md="3" label="Giver">
                <b-form-input
                  type="text"
                  v-model="quest.giver"
                  required
                  placeholder="Quest Giver"
                ></b-form-input>
              </b-form-group>

              <div class="row mb-3">
                <b-form-checkbox
                  v-model="quest.isDaily"
                  class="col-md-4 offset-md-3"
                  @input="makeSureDailyRepeatableSet('daily')"
                >
                  <span v-b-tooltip.hover title="Quest can be done daily">Daily</span>
                </b-form-checkbox>

                <b-form-checkbox
                  v-model="quest.isRepeatable"
                  class="col-md-5"
                  @input="makeSureDailyRepeatableSet('repeat')"
                >
                  <span
                    v-b-tooltip.hover
                    title="Quest can be repeated multiple times upon completion"
                  >Repeatable</span>
                </b-form-checkbox>
              </div>
              
            </div>

            <div class="col-4">

              <b-form-group label-cols-md="3" label="Quest Type">
                <b-form-select
                  v-model="quest.requirements.type"
                  required
                  :options="['none', 'kill', 'item', 'count', 'array']"
                ></b-form-select>
              </b-form-group>

              <div v-if="quest.requirements.type === 'kill'">
                <b-form-group label-cols-md="3" label="Kills">
                  <b-form-input
                    type="number"
                    v-model="quest.requirements.killsRequired"
                    required
                    placeholder="Kills Required"
                  ></b-form-input>
                </b-form-group>

                <b-button class="mb-3" variant="info" block @click="addKillNPC()">Add NPC</b-button>

                <div class="row" v-for="(npc, index) in quest.requirements.npcIds" :key="index">
                  <div class="col-9">
                    <n-p-c-selector v-model="quest.requirements.npcIds[index]" label="NPC" @change="quest.requirements.npcIds[index] = $event" :modNPCs="npcs"></n-p-c-selector>
                  </div>

                  <div class="col-3">
                    <b-button variant="danger" @click="removeKillNPC(index)">Del</b-button>
                  </div>
                </div>
              </div>

              <div v-if="quest.requirements.type === 'item'">
                <item-selector v-model="quest.requirements.item" label="Item" @change="quest.requirements.item = $event" :modItems="items"></item-selector>
              </div>

              <div v-if="quest.requirements.type === 'count'">
                <b-form-group label-cols-md="3" label="Count">
                  <b-form-input
                    type="number"
                    v-model="quest.requirements.countRequired"
                    required
                    placeholder="Count Required"
                  ></b-form-input>
                </b-form-group>
              </div>

              <div v-if="quest.requirements.type === 'array'">
                <b-form-group label-cols-md="3" label="Size">
                  <b-form-input
                    type="number"
                    v-model="quest.requirements.itemsRequired"
                    required
                    placeholder="Array Size Required"
                  ></b-form-input>
                </b-form-group>
              </div>

            </div>

            <div class="col-4">
              <b-input-group class="mb-3">
                <b-form-select v-model="currentAddReward" required :options="['xp', 'gold', 'silver', 'reputation', 'stat', 'holidayTokens']">
                  <template v-slot:first>
                    <option :value="''">Add Reward</option>
                  </template>
                </b-form-select>

                <b-input-group-append>
                  <b-button
                    variant="primary"
                    :disabled="!currentAddReward"
                    @click="addReward(currentAddReward)"
                  >Add</b-button>
                </b-input-group-append>
              </b-input-group>

              <div class="row" v-for="(reward, index) in quest.rewards" :key="index">
                <div class="col-12"><strong>{{ reward.type }}</strong></div>

                <div class="col-4">
                  <b-form-group>
                    <b-form-input
                      type="number"
                      v-model="reward.value"
                      required
                      :placeholder="reward.type"
                    ></b-form-input>
                  </b-form-group>
                </div>

                <div class="col-5" v-if="reward.type !== 'reputation' && reward.type !== 'stat'"></div>

                <div class="col-5" v-if="reward.type === 'reputation'">
                  <b-form-group>
                    <b-form-select v-model="reward.statName" required :options="['Adventurers', 'Pirates', 'Royalty', 'Townsfolk', 'Underground', 'Wilderness']">
                      <template v-slot:first>
                        <option :value="''">Choose Faction</option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </div>

                <div class="col-5" v-if="reward.type === 'stat'">
                  <stat-selector v-model="reward.statName" @change="reward.statName = $event"></stat-selector>
                </div>

                <div class="col-3">
                  <b-button variant="danger" @click="removeReward(index)">Del</b-button>
                </div>
              </div>
            </div>
          </div>
        </b-form>
      </div>
    </b-modal>

    <div class="mb-3">
      <b-form-input v-model="filter" placeholder="Search quests..."></b-form-input>
    </div>

    <b-table
      v-if="quests.length"
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :fields="tableFields"
      :items="quests"
      :sticky-header="globalTableHeight"
      :filter="filter"
    >
      <template v-slot:head(actions)>
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(name)="data">{{ data.item.name }}</template>

      <template v-slot:cell(giver)="data">{{ data.item.desc }}</template>

      <template v-slot:cell(daily)="data">{{ data.item.isDaily ? 'Yes' : 'No' }}</template>

      <template v-slot:cell(repeatable)="data">{{ data.item.isRepeatable ? 'Yes' : 'No' }}</template>

      <template v-slot:cell(type)="data">{{ data.item.requirements.type }}</template>

      <template v-slot:cell(rewards)="data">{{ formatRewards(data.item.rewards) }}</template>

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

import NPCSelector from './shared/NPCSelector.vue';
import ItemSelector from './shared/ItemSelector.vue';
import StatSelector from './shared/StatSelector.vue';

const defaultQuest = {
  name: '',
  desc: '',
  giver: '',
  isDaily: false,
  isRepeatable: false,

  messages: {
    kill: '',
    complete: '',
    incomplete: '',
    alreadyHas: '',
    permComplete: ''
  },

  requirements: {
    type: 'none',

    npcIds: [],
    killsRequired: 0,

    item: '',
    fromHands: true,
    slot: ['rightHand', 'leftHand'],

    countRequired: 0,

    itemsRequired: 0
  },

  rewards: [] // { type, statName, value }
};

export default {
  name: 'Quests',

  props: ['quests', 'npcs', 'items'],

  components: { NPCSelector, ItemSelector, StatSelector },

  data() {
    return {
      globalTableHeight,
      filter: '',
      sortBy: 'name',
      sortDesc: false,
      tableFields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'giver', label: 'Giver', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'daily', label: 'Daily?', sortable: true },
        { key: 'repeatable', label: 'Repeatable?', sortable: true },
        { key: 'rewards', label: 'Rewards', sortable: true },
        { key: 'actions', label: 'Actions', class: 'text-right' }
      ],
      isEditing: -1,
      quest: clone(defaultQuest),
      currentAddReward: ''
    };
  },

  methods: {
    isValidQuest(quest) {
      if(this.quests.some((check, i) => i !== this.isEditing && quest.name === check.name)) return false;

      const validKeys = ['name', 'desc', 'giver'];
      return validKeys.every(x => get(quest, x));
    },

    reset() {
      this.quest = clone(defaultQuest);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? 'edit' : 'add'}:quest`, {
        quest: this.quest,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(quest) {
      events.$emit('add:quest', { quest: clone(quest) });
    },

    edit(quest) {
      this.quest = clone(quest);
      this.isEditing = this.quests.findIndex(x => x === quest);
      this.openModal();
    },

    async remove(quest) {
      const willRemove = await this.$dialog.confirm({ title: 'Remove Quest?', text: 'Are you sure you want to remove this quest?' });
      if(!willRemove) return;

      events.$emit('remove:quest', {
        index: this.quests.findIndex(x => x === quest)
      });
    },

    makeSureDailyRepeatableSet(flag) {
      if(flag === 'daily' && this.quest.isDaily) this.quest.isRepeatable = true;
      if(flag === 'repeat' && !this.quest.isRepeatable) this.quest.isDaily = false;
    },
    
    formatRewards(rewards) {
      return rewards.map(x => {
        if(x.type === 'reputation') return `${x.statName} Rep +${x.value.toLocaleString()}`;
        if(x.type === 'stat') return `${x.statName} +${x.value.toLocaleString()}`;
        return `${x.type} +${x.value.toLocaleString()}`;
      }).join(', ');
    },

    addKillNPC() {
      this.quest.requirements.npcIds.push('');
    },

    removeKillNPC(index) {
      this.$delete(this.quest.requirements.npcIds, index);
    },

    addReward(reward) {
      this.quest.rewards.push({ type: reward, value: 0, statName: '' });
    },

    removeReward(index) {
      this.$delete(this.quest.rewards, index);
    }
  }
};
</script>

<style scoped>
</style>
