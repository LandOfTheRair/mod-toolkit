<template>
  <div>
    <div class="true-center" v-if="npcs.length === 0">No NPCs
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      ref="modal"
      title="Add/Edit NPC"
      ok-title="Save"
      @show="reset()"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
    >
      <div class="d-block text-center">
        <h3>Content</h3>
      </div>
    </b-modal>
  </div>

  <!--
    TODO: 
    - id
    - name (optional)
    - hostility (faction, always, never)
    - allegiance (unset, pirates, townsfolk, royalty, adventurers, wilderness, underground, naturalresource, enemy)
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
  allegiance: "",
  monsterClass: "",
  sprite: 0,
  affiliation: "",
  alignment: ""
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
