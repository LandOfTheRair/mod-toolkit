<template>
  <div>
    <div class="true-center blank-slate" v-if="npcs.length === 0">No NPCs
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit NPC"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidNPC(npc)"
    >
      <div class="d-block">
        <b-form>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Core Stats">
              <div class="row">
                <div class="col-md-4">
                  <b-form-group class="sprite-field" label-cols-md="3" label="Sprite">
                    <div class="sprite-container">
                      <img
                        src="https://play.rair.land/assets/spritesheets/creatures.png"
                        class="sprite"
                        v-bind:style="{ 'object-position': objectPosition(npc.sprite, 40) }"
                      >
                    </div>

                    <b-form-input type="number" v-model="npc.sprite" step="5" min="0" required></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Internal ID">
                    <b-form-input
                      type="text"
                      v-model="npc.npcId"
                      required
                      placeholder="[Map Name] - Create Type"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Name" class="optional">
                    <b-form-input
                      type="text"
                      v-model="npc.name"
                      placeholder="If unspecified, will be random"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Affiliation" class="optional">
                    <b-form-input
                      type="text"
                      v-model="npc.affiliation"
                      placeholder="The guild/grouping for NPC"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Level" class="multi">
                    <b-form-input type="number" v-model="npc.level" placeholder="Level" min="0"></b-form-input>
                    <div class="split-label true-center">
                      <strong>Skill</strong>
                    </div>
                    <b-form-input
                      type="number"
                      v-model="npc.skillLevels"
                      min="0"
                      placeholder="Skill"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Class">
                    <b-form-select
                      v-model="npc.baseClass"
                      required
                      :options="['Mage', 'Thief', 'Healer', 'Warrior']"
                    >
                      <template v-slot:first>
                        <option :value="''">None</option>
                      </template>
                    </b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Alignment">
                    <b-form-select
                      v-model="npc.alignment"
                      required
                      :options="['Good', 'Neutral', 'Evil']"
                    ></b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Hostility">
                    <b-form-select
                      v-model="npc.hostility"
                      required
                      :options="['OnHit', 'Faction', 'Always', 'Never']"
                    ></b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Allegiance">
                    <b-form-select
                      v-model="npc.allegiance"
                      required
                      :options="['Enemy', 'Adventurers', 'Pirates', 'Royalty', 'Townsfolk', 'Underground', 'Wilderness', 'NaturalResource']"
                    ></b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Category">
                    <b-form-select
                      v-model="npc.monsterClass"
                      required
                      :options="['Beast', 'Dragon', 'Humanoid', 'Undead']"
                    >
                      <template v-slot:first>
                        <option :value="''">None</option>
                      </template>
                    </b-form-select>
                  </b-form-group>

                  <div class="row mb-3">
                    <b-form-checkbox
                      v-model="npc.aquaticOnly"
                      @input="npc.avoidWater = false"
                      class="col-md-4 offset-md-3"
                    >
                      <span v-b-tooltip.hover title="Creature will ONLY step in the water">Aquatic</span>
                    </b-form-checkbox>

                    <b-form-checkbox
                      v-model="npc.avoidWater"
                      @input="npc.aquaticOnly = false"
                      class="col-md-5"
                    >
                      <span
                        v-b-tooltip.hover
                        title="Creature will not step in the water"
                      >Hydrophobic</span>
                    </b-form-checkbox>
                  </div>

                  <div class="row mb-3"></div>
                </div>

                <div class="col-md-5">
                  <div class="row mb-3">
                    <div class="col">
                      <div class="offset-md-3">
                        <b-button
                          variant="info"
                          block
                          :disabled="!npc.level"
                          @click="recommend()"
                        >Recommend stats based on level</b-button>
                      </div>
                    </div>
                  </div>

                  <b-form-group label-cols-md="3" label="HP" class="multi">
                    <b-form-input
                      type="number"
                      v-model="npc.hp.min"
                      min="0"
                      @change.native="updateKeyMaxIfNotPresent($event, 'hp')"
                    ></b-form-input>
                    <div class="split-label true-center">To</div>
                    <b-form-input type="number" v-model="npc.hp.max" min="0"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="MP" class="multi">
                    <b-form-input
                      type="number"
                      v-model="npc.mp.min"
                      min="0"
                      @change.native="updateKeyMaxIfNotPresent($event, 'mp')"
                    ></b-form-input>
                    <div class="split-label true-center">To</div>
                    <b-form-input type="number" v-model="npc.mp.max" min="0"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="XP" class="multi">
                    <b-form-input
                      type="number"
                      v-model="npc.giveXp.min"
                      min="0"
                      @change.native="updateKeyMaxIfNotPresent($event, 'giveXp')"
                    ></b-form-input>
                    <div class="split-label true-center">To</div>
                    <b-form-input type="number" v-model="npc.giveXp.max" min="0"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Gold" class="multi">
                    <b-form-input
                      type="number"
                      v-model="npc.gold.min"
                      min="0"
                      @change.native="updateKeyMaxIfNotPresent($event, 'gold')"
                    ></b-form-input>
                    <div class="split-label true-center">To</div>
                    <b-form-input type="number" v-model="npc.gold.max" min="0"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Skill on Kill">
                    <b-form-input
                      type="number"
                      v-model="npc.skillOnKill"
                      placeholder="Skill gained on kill"
                      min="0"
                    ></b-form-input>
                  </b-form-group>

                  <div class="row mb-3">
                    <b-form-checkbox v-model="linkStats" class="col-md-9 offset-md-3">
                      <span
                        v-b-tooltip.hover
                        title="All stats will change at the same time"
                      >Link Stats</span>
                    </b-form-checkbox>
                  </div>

                  <b-form-group label-cols-md="3" label="STR" class="multi-3">
                    <b-form-input
                      type="number"
                      v-model="npc.stats.str"
                      min="0"
                      @change="updateStat('str')"
                    ></b-form-input>
                    <div class="split-label true-center">
                      <strong>DEX</strong>
                    </div>
                    <b-form-input
                      type="number"
                      v-model="npc.stats.dex"
                      min="0"
                      @change="updateStat('dex')"
                    ></b-form-input>
                    <div class="split-label true-center">
                      <strong>AGI</strong>
                    </div>
                    <b-form-input
                      type="number"
                      v-model="npc.stats.agi"
                      min="0"
                      @change="updateStat('agi')"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="INT" class="multi-3">
                    <b-form-input
                      type="number"
                      v-model="npc.stats.int"
                      min="0"
                      @change="updateStat('int')"
                    ></b-form-input>
                    <div class="split-label true-center">
                      <strong>WIS</strong>
                    </div>
                    <b-form-input
                      type="number"
                      v-model="npc.stats.wis"
                      min="0"
                      @change="updateStat('wis')"
                    ></b-form-input>
                    <div class="split-label true-center">
                      <strong>WIL</strong>
                    </div>
                    <b-form-input
                      type="number"
                      v-model="npc.stats.wil"
                      min="0"
                      @change="updateStat('wil')"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="CON" class="multi-3">
                    <b-form-input
                      type="number"
                      v-model="npc.stats.con"
                      min="0"
                      @change="updateStat('con')"
                    ></b-form-input>
                    <div class="split-label true-center">
                      <strong>CHA</strong>
                    </div>
                    <b-form-input
                      type="number"
                      v-model="npc.stats.cha"
                      min="0"
                      @change="updateStat('cha')"
                    ></b-form-input>
                    <div class="split-label true-center">
                      <strong>LUK</strong>
                    </div>
                    <b-form-input
                      type="number"
                      v-model="npc.stats.luk"
                      min="0"
                      @change="updateStat('luk')"
                    ></b-form-input>
                  </b-form-group>
                </div>

                <div class="col-md-3">
                  <div class="row">
                    <div class="col-md-12">
                      <b-input-group>
                        <b-form-select v-model="currentExtraStat" required :options="extraStats">
                          <template v-slot:first>
                            <option :value="''">Add Extra Stat</option>
                          </template>
                        </b-form-select>

                        <b-input-group-append>
                          <b-button
                            variant="primary"
                            :disabled="!currentExtraStat"
                            @click="addExtraStat(currentExtraStat)"
                          >Add</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </div>
                  </div>
                  <div class="row mt-1" v-for="(value, stat) in npc.otherStats" v-bind:key="stat">
                    <div class="col">
                      <b-form-group :label="stat" class="left-header">
                        <b-input-group>
                          <b-form-input type="number" v-model="npc.otherStats[stat]"></b-form-input>

                          <b-input-group-append>
                            <b-button
                              variant="danger"
                              @click="removeExtraStat(currentExtraStat)"
                            >Del</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                    </div>
                  </div>
                </div>
              </div>
            </b-tab>

            <b-tab title="Skills & Attributes"></b-tab>

            <b-tab title="Gear"></b-tab>

            <b-tab title="Drops"></b-tab>

            <b-tab title="Triggers" disabled></b-tab>
          </b-tabs>
        </b-form>
      </div>
    </b-modal>

    <b-table v-if="npcs.length" 
             small
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc" 
             :fields="tableFields" 
             :items="npcs">
      <template v-slot:head(actions)="data">
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(sprite)="data">
        <div class="sprite-container">
          <img
            src="https://play.rair.land/assets/spritesheets/creatures.png"
            class="sprite"
            v-bind:style="{ 'object-position': objectPosition(data.item.sprite) }"
          >
        </div>
      </template>

      <template v-slot:cell(name)="data">
        {{ data.item.npcId }}
      </template>

      <template v-slot:cell(baseClass)="data">
        {{ data.item.baseClass || 'None' }}
      </template>

      <template v-slot:cell(category)="data">
        {{ data.item.category || 'None' }}
      </template>

      <template v-slot:cell(actions)="data">
        <b-button class="mr-1" size="sm" variant="info" @click="copy(data.index)">Copy</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="edit(data.index)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(data.index)">Remove</b-button>
      </template>
    </b-table>
  </div>

  <!--
    TODO:      
    - items (2 column?)
      - sack items [result, chance]
      - rightHand
      - leftHand
      - all other gear slots (armor, robe1, robe2, hands, feet, ring1, ring2, waist, head, neck, ear, wrists)
    
    - drops section (3 column?)
      - drops
      - copyDrops
      - dropPool
      - tansFor/tanSkillRequired

    - skills & attributes (3 column?)
      - traits
      - usableSkills (sorted by priority. allow for adding a number for custom priority)
      - baseEffects

    - behaviorTriggers (3 column?)
      - combatMessages
      - spawnMessage/leashMessage
      - sfx/sfxMaxChance

    - add warning icons if the items (equip, drop, dropPool, tansFor) are not present in the current modpack
  -->
</template>

<script>
import get from "lodash.get";

import { clone, objectPosition } from '../helpers';
import { coreStats, extraStats } from "../constants";
import { events } from "../main";

const defaultNPC = {
  sprite: 0,
  npcId: "",
  name: "",
  hostility: "OnHit",
  allegiance: "Enemy",
  monsterClass: "",
  baseClass: "",
  affiliation: "",
  alignment: "Neutral",
  rightHand: "",
  leftHand: "",
  stats: {
    str: 0,
    dex: 0,
    agi: 0,
    int: 0,
    wis: 0,
    wil: 0,
    con: 0,
    cha: 0,
    luk: 0
  },
  otherStats: {},
  gear: {},
  hp: { min: 0, max: 0 },
  mp: { min: 0, max: 0 },
  giveXp: { min: 0, max: 0 },
  gold: { min: 0, max: 0 },
  avoidWater: false,
  aquaticOnly: false
};

export default {
  name: "NPCs",

  props: ["npcs", "items"],

  data: function() {
    return {
      sortBy: 'name',
      sortDesc: false,
      tableFields: [
        { key: "sprite", label: "Sprite" },
        { key: "name", label: "ID", sortable: true },
        { key: "level", label: "Level", sortable: true },
        { key: "skillLevels", label: "Skill", sortable: true },
        { key: "baseClass", label: "Class", sortable: true },
        { key: "category", label: "Category", sortable: true },
        { key: "allegiance", label: "Allegiance", sortable: true },
        { key: "actions", label: "Actions", class: "text-right" }
      ],
      isEditing: -1,
      linkStats: true,
      currentExtraStat: "",
      extraStats: extraStats.map(x => x.stat),
      npc: clone(defaultNPC)
    };
  },

  methods: {
    objectPosition,

    isValidNPC(npc) {
      const validKeys = [
        "npcId",
        "hp.min",
        "giveXp.min",
        "gold.min",
        "level",
        "skillLevels",
        "skillOnKill"
      ];
      return validKeys.every(x => get(npc, x));
    },

    reset() {
      this.npc = clone(defaultNPC);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? 'edit' : 'add'}:npc`, { npc: this.npc, index: this.isEditing });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(index) {
      const npc = this.npcs[index];
      events.$emit("add:npc", { npc: clone(npc) });
    },

    edit(index) {
      this.npc = clone(this.npcs[index]);
      this.isEditing = index;
      this.openModal();
    },

    remove(index) {
      if (!window.confirm("Are you sure you want to remove this NPC?")) return;
      events.$emit("remove:npc", { index });
    },

    updateKeyMaxIfNotPresent($event, key) {
      if (this.npc[key].max > this.npc[key].min) return;
      this.npc[key].max = this.npc[key].min;
    },

    addExtraStat(key) {
      if (!key) return;
      this.$set(this.npc.otherStats, key, 0);
    },

    removeExtraStat(key) {
      this.$delete(this.npc.otherStats, key);
    },

    updateStat(key) {
      if (!this.linkStats) return;

      const value = this.npc.stats[key];
      coreStats.forEach(({ stat }) => (this.npc.stats[stat] = value));
    },

    recommend() {
      const level = this.npc.level;

      coreStats.forEach(
        ({ stat }) =>
          (this.npc.stats[stat] = Math.max(1, Math.floor(level * 0.7)))
      );
      this.npc.skillOnKill = Math.floor(1.992296 * level - 0.3004622);

      this.npc.hp.max = this.npc.hp.min = Math.max(
        100,
        Math.floor(8947.208 * level - 79505.7)
      );
      this.npc.giveXp.max = this.npc.giveXp.min = Math.max(
        10,
        Math.floor(6247.873 * level - 51978.42)
      );
      this.npc.gold.max = this.npc.gold.min = 500 * level;
    }
  }
};
</script>

<style scoped>
</style>
