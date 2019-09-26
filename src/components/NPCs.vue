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
      @show="reset()"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidNPC(npc)"
    >
      <div class="d-block">
        <b-form>
          <div class="row">
            <div class="col-md-6">
              <b-form-group label-cols-md="3" label="Internal ID">
                <b-form-input type="text" v-model="npc.npcId" required></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Name" class="optional">
                <b-form-input type="text" v-model="npc.name"></b-form-input>
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

              <b-form-group label-cols-md="3" label="HP" class="multi">
                <b-form-input type="number" v-model="npc.hp.min" min="0"></b-form-input>
                <div class="split-label true-center">To</div>
                <b-form-input type="number" v-model="npc.hp.max" min="0"></b-form-input>
              </b-form-group>
            </div>

            <div class="col-md-6"></div>
          </div>
        </b-form>
      </div>
    </b-modal>
  </div>

  <!--
    TODO:
    - monsterClass (unset, undead, beast, humanoid, dragon)
    - sprite (have a sprite picker that lets you pick a front sprite; not sure best way to do here because of every 5th being valid) - always be an array - allow for multiple choices
    - affiliation (optional)
    - alignment (unset, good, neutral, evil)
    - baseClass (unset, thief, warrior, mage, healer)
    - stats (have a "main stats" block, with an "all" control to set them all. click arrow to expand and set them individually)
    - stats (have an "alt stats" block, which contains all other stats)
    - level
    - skillLevels
    - skillOnKill (have an "auto" option that is ~25 / npc level)
    - hp (auto set min/max based on this, but have a dropdown that lets the range be set)
    - mp (auto set min/max based on this, but have a dropdown that lets the range be set)
    - gold (auto set min/max based on this, but have a dropdown that lets the range be set)
    - giveXp (auto set min/max based on this, but have a dropdown that lets the range be set)
    - items
      - rightHand
      - leftHand
      - all other gear slots (armor, robe1, robe2, hands, feet, ring1, ring2, waist, head, neck, ear, wrists)
    - movement restrict (none, aquaticOnly, avoidWater - set the latter two as individual flags)
    - usableSkills (sorted by priority. allow for adding a number for custom priority)
    - drops section
      - drops
      - copyDrops
      - dropPool
    - behaviorTriggers
    - combatMessages
    - spawnMessage/leashMessage
    - tansFor/tanSkillRequired
    - baseEffects
    - sfx/sfxMaxChance

    - add warning icons if the items (equip, drop, dropPool, tansFor) are not present in the current modpack
  -->
</template>

<script>
import { events } from "../main";

const defaultNPC = {
  npcId: "",
  name: "",
  hostility: "OnHit",
  allegiance: "Enemy",
  monsterClass: "",
  sprite: 0,
  affiliation: "",
  alignment: "",
  rightHand: "",
  leftHand: "",
  stats: {},
  gear: {},
  hp: { min: 0, max: 0 },
  mp: { min: 0, max: 0 },
  giveXp: { min: 0, max: 0 },
  gold: { min: 0, max: 0 }
};

export default {
  name: "NPCs",

  props: ["npcs", "items"],

  data: function() {
    return {
      npc: Object.assign({}, defaultNPC)
    };
  },

  methods: {
    isValidNPC(npc) {
      return npc.npcId;
    },

    reset() {
      this.npc = Object.assign({}, defaultNPC);
    },

    confirm() {
      console.log("save", this.npc);
    },

    openModal() {
      this.$refs.modal.show();
    }
  }
};
</script>

<style scoped>
</style>
