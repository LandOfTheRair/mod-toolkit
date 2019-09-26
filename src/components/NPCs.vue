<template>
  <div>
    <div class="true-center blank-slate" v-if="npcs.length === 0">No NPCs
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <!-- todo: copy, delete, add buttons -->
    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit NPC"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @show="reset()"
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
                <div class="col-md-6">
                  <b-form-group class="sprite-field" label-cols-md="3" label="Sprite">
                    <img
                      src="https://play.rair.land/assets/spritesheets/creatures.png"
                      class="sprite"
                      v-bind:style="{ 'object-position': objectPosition(npc.sprite) }"
                    >

                    <b-form-input
                      class="ml-4"
                      type="number"
                      v-model="npc.sprite"
                      step="5"
                      min="0"
                      required
                    ></b-form-input>
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
                      placeholder="The guild or grouping this creature is in"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Level" class="multi">
                    <b-form-input
                      type="number"
                      v-model="npc.level"
                      placeholder="Creature level"
                      min="0"
                    ></b-form-input>
                    <div class="split-label true-center">
                      <strong>Skill</strong>
                    </div>
                    <b-form-input
                      type="number"
                      v-model="npc.skillLevels"
                      min="0"
                      placeholder="Creature skill"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Class">
                    <b-form-select
                      v-model="npc.baseClass"
                      required
                      :options="['Mage', 'Thief', 'Healer', 'Warrior']"
                    >
                      <template v-slot:first>
                        <!-- todo fix this-->
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
                        <!-- todo fix this-->
                        <option :value="''">None</option>
                      </template>
                    </b-form-select>
                  </b-form-group>

                  <div class="row mb-3">
                    <b-form-checkbox
                      v-model="npc.aquaticOnly"
                      @input="npc.avoidWater = false"
                      class="col-md-4 offset-md-3"
                    >Aquatic Creature</b-form-checkbox>

                    <b-form-checkbox
                      v-model="npc.avoidWater"
                      @input="npc.aquaticOnly = false"
                      class="col-md-5"
                    >Hydrophobic Creature</b-form-checkbox>
                  </div>

                  <div class="row mb-3"></div>
                </div>

                <div class="col-md-6">
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

                  <div class="row mb-3">
                    <b-form-checkbox v-model="linkStats" class="col-md-3 offset-md-3">Link Stats</b-form-checkbox>
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
  </div>

  <!--
    TODO:
    - auto/"recommend" options
      - stats: 0.7 per level
      - skillOnKill: 15 per level (y = 1.992296*x - 0.3004622)
      - hp: ~1000 per level (y = 8947.208*x - 79505.7)
      - xp: ~1500 per level (y = 6247.873*x - 51978.42)
      - gold: ~500 per level

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
      - stats (have an "alt stats" block, which contains all other stats)
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

import { coreStats } from "../constants";
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
      linkStats: true,
      npc: Object.assign({}, defaultNPC)
    };
  },

  methods: {
    objectPosition(sprite) {
      const divisor = 40;
      const y = Math.floor(sprite / divisor);
      const x = sprite % divisor;
      return `-${x * 64}px -${y * 64}px`;
    },

    isValidNPC(npc) {
      const validKeys = [
        "npcId",
        "hp.min",
        "giveXp.min",
        "gold.min",
        "level",
        "skillLevels"
      ];
      return validKeys.every(x => get(this.npc, x));
    },

    reset() {
      this.npc = Object.assign({}, defaultNPC);
    },

    confirm() {
      console.log("save", this.npc);
    },

    openModal() {
      this.$refs.modal.show();
    },

    updateKeyMaxIfNotPresent($event, key) {
      if (this.npc[key].max > this.npc[key].min) return;
      this.npc[key].max = this.npc[key].min;
    },

    updateStat(key) {
      if (!this.linkStats) return;

      const value = this.npc.stats[key];

      coreStats.forEach(({ stat }) => (this.npc.stats[stat] = value));
    }
  }
};
</script>

<style scoped>
</style>
