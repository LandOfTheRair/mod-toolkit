<template>
  <div>
    <div class="true-center blank-slate" v-if="items.length === 0">No Items
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit Item"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidItem(item)"
    >
      <div class="d-block">
        <b-form>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Core Stats">

            </b-tab>

            <b-tab title="Traits, Effects & Requirements">
              
            </b-tab>

            <b-tab title="Miscellaneous">
              
            </b-tab>
          </b-tabs>
        </b-form>
      </div>
    </b-modal>

    <b-table
      v-if="items.length"
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :fields="tableFields"
      :items="items"
    >
      <template v-slot:head(actions)="data">
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(sprite)="data">
        <div class="sprite-container">
          <img
            src="https://play.rair.land/assets/spritesheets/items.png"
            class="sprite"
            v-bind:style="{ 'object-position': objectPosition(data.item.sprite, 32) }"
          >
        </div>
      </template>

      <template v-slot:cell(name)="data">{{ data.item.name }}</template>

      <template v-slot:cell(actions)="data">
        <b-button class="mr-1" size="sm" variant="info" @click="copy(data.index)">Copy</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="edit(data.index)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(data.index)">Remove</b-button>
      </template>
    </b-table>
  </div>

  <!--
    TODO
      - core information (3 col)
        - col 1
          - name
          - desc (add "You are looking at [desc]" so people can preview their desc)
          - extendedDesc (example needed)
          - itemClass (claw, arrow, etc)
          - sprite
          - binds/tellsBind
          - value/sellValue
          - enchantLevel / maxEnchantLevel
          - isBeltable/isSackable

        - col 2
          - stats (split like monsters - main/alt stats)
          - randomStats (click to swap a stat to a min/max of stat)

        - col 3 [extra props]
          - archetype (fake property, maybe inherit from itemtype)
              - [ auto check some properties in weapon based on chosen itemClass]
            - arrow: shots, tier, damageClass
            - armor: isHeavy
            - weapon: tier, dmageClass, returnsOnThrow, proneChance, twoHanded, type, secondaryType, attackRange, offhand, isHeavy, canShoot
            - gem: maxEncrusts, stats.effect
            - book: bookPages (id/text), bookItemFilter (required), bookFindablePages (optional)
            - trap: trapUses, effect.levelRequirement, effect.skillRequirement, effect.uses
            - page: extendedDesc, bookPage
            - bottle/food: ounces
            - scroll: bookPage

      - traits, effects, requirements
        - trait name/level (allow multiple names as array, and level as min/max)
        - effect name/potency/chance/duration/canApply/autocast
          - tooltip/message/stats if effect == Nourishment
          - tier/ignoreHPBoost
        - requirements (level, skill, profession, quest)

      - misc
        - succorInfo
        - containedItems (chance/item)
        - cosmetic (name/isPermanent)
        - destroyOnDrop
        - notUsableAfterHours
  -->
</template>

<script>
import get from "lodash.get";

import { clone, objectPosition } from "../helpers";
import { coreStats, extraStats } from "../constants";
import { events } from "../main";

const defaultItem = {
  name: ""
};

export default {
  name: "Items",

  props: ["items"],

  data: function() {
    return {
      sortBy: "name",
      sortDesc: false,
      tableFields: [
        { key: "sprite", label: "Sprite" },
        { key: "name", label: "ID", sortable: true },
        { key: "actions", label: "Actions", class: "text-right" }
      ],
      isEditing: -1,
      linkStats: true,
      currentExtraStat: "",
      extraStats: extraStats.map(x => x.stat),
      item: clone(defaultItem)
    };
  },

  methods: {
    objectPosition,

    isValidItem(item) {
      const validKeys = ["name"];
      return validKeys.every(x => get(item, x));
    },

    reset() {
      this.item = clone(defaultItem);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? "edit" : "add"}:item`, {
        item: this.item,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(index) {
      const item = this.items[index];
      events.$emit("add:item", { item: clone(item) });
    },

    edit(index) {
      this.item = clone(this.items[index]);
      this.isEditing = index;
      this.openModal();
    },

    remove(index) {
      if (!window.confirm("Are you sure you want to remove this item?")) return;
      events.$emit("remove:item", { index });
    }
  }
};
</script>

<style scoped>
</style>
