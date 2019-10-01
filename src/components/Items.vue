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
              <div class="row">
                <div class="col-md-4">
                  <b-form-group class="sprite-field" label-cols-md="3" label="Sprite">
                    <div class="sprite-container">
                      <img
                        src="https://play.rair.land/assets/spritesheets/items.png"
                        class="sprite"
                        v-bind:style="{ 'object-position': objectPosition(item.sprite, 32) }"
                      >
                    </div>

                    <b-form-input type="number" v-model="item.sprite" step="5" min="0" required></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Name">
                    <b-form-input type="text" v-model="item.name" placeholder="Enter Item Name"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Type">
                    <b-form-select
                      v-model="currentSelectedItemClass"
                      required
                      @change.native="changeItemType()"
                    >
                      <option :value="''">Choose item type</option>
                      <optgroup
                        v-for="group in itemGroups"
                        :label="group.group"
                        v-bind:key="group.group"
                      >
                        <option
                          v-for="type in group.keys"
                          :value="type"
                          v-bind:key="type"
                        >{{ type }}</option>
                      </optgroup>
                    </b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Skill" class="multi">
                    <b-form-select v-model="item.type" required>
                      <option :value="''">Choose item skill type</option>
                      <option v-for="type in itemTypes" :value="type" v-bind:key="type">{{ type }}</option>
                    </b-form-select>

                    <div class="split-label true-center px-2">
                      <strong>#2</strong>
                    </div>

                    <b-form-select v-model="item.secondaryType" required>
                      <option :value="''">None</option>
                      <option v-for="type in itemTypes" :value="type" v-bind:key="type">{{ type }}</option>
                    </b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Max Enchant">
                    <b-form-input type="number" v-model="item.maxEnchantLevel" min="0"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Value" class="multi">
                    <b-form-input type="number" v-model="item.value" min="0"></b-form-input>
                    <div
                      class="split-label true-center"
                      v-b-tooltip.hover
                      title="The sell value overrides the default value, and when sold, it will always sell for this value. Set to 0 to use a CHA-based sell ratio based on the normal value instead."
                    >
                      <strong>Sells</strong>
                    </div>
                    <b-form-input type="number" v-model="item.sellValue" min="0"></b-form-input>
                  </b-form-group>

                  <div class="row mb-3">
                    <b-form-checkbox v-model="item.isSackable" class="col-md-4 offset-md-3">
                      <span
                        v-b-tooltip.hover
                        title="Item will be able to be placed in sack, pouch"
                      >Sackable</span>
                    </b-form-checkbox>

                    <b-form-checkbox v-model="item.isBeltable" class="col-md-5">
                      <span
                        v-b-tooltip.hover
                        title="Item will be able to be placed in belt"
                      >Beltable</span>
                    </b-form-checkbox>
                  </div>

                  <div class="row mb-3">
                    <b-form-checkbox v-model="item.binds" class="col-md-4 offset-md-3">
                      <span v-b-tooltip.hover title="Item will bind on pickup">Binds</span>
                    </b-form-checkbox>

                    <b-form-checkbox v-model="item.tellsBind" class="col-md-5">
                      <span
                        v-b-tooltip.hover
                        title="Item will tell the area when it binds to someone"
                      >Tells bind</span>
                    </b-form-checkbox>
                  </div>

                  <b-form-group label-cols-md="3" label="Desc">
                    <b-form-input
                      type="text"
                      v-model="item.desc"
                      placeholder="You are looking at..."
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" class="optional">
                    <template v-slot:label>
                      <span
                        v-b-tooltip.hover
                        title="This desc will only show up when sensed at a certain skill. For a book page, this will be the content of the page."
                      >Sense Desc</span>
                    </template>
                    <b-form-input
                      type="text"
                      v-model="item.extendedDesc"
                      placeholder="The item is..."
                    ></b-form-input>
                  </b-form-group>

                  <div class="row mb-3">
                    <div class="col offset-md-3">
                      <span v-if="item.desc">You are looking at {{ item.desc }}.</span>
                      <span v-if="item.extendedDesc">&nbsp;The item is {{ item.extendedDesc }}.</span>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="row">
                    <div class="col-md-12">
                      <b-input-group>
                        <b-form-select v-model="currentAddStat" required :options="allStats">
                          <template v-slot:first>
                            <option :value="''">Add Stat</option>
                          </template>
                        </b-form-select>

                        <b-input-group-append>
                          <b-button
                            variant="primary"
                            :disabled="!currentAddStat"
                            @click="addStat(currentAddStat)"
                          >Add</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </div>
                  </div>

                  <div class="row mt-1" v-for="(value, stat) in item.stats" v-bind:key="stat">
                    <div class="col">
                      <b-form-group class="left-header">
                        <template v-slot:label>
                          <span>{{ stat }}</span>
                          <b-button
                            variant="outline-info"
                            class="thin-button mb-1"
                            size="sm"
                            @click="swapBetweenRandomAndStatic(stat)"
                          >Swap to min/max</b-button>
                        </template>
                        <b-input-group>
                          <b-form-input type="number" v-model="item.stats[stat]"></b-form-input>

                          <b-input-group-append>
                            <b-button variant="danger" @click="removeStat(stat)">Del</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                    </div>
                  </div>

                  <div class="row mt-1" v-for="(value, stat) in item.randomStats" v-bind:key="stat">
                    <div class="col">
                      <b-form-group class="left-header">
                        <template v-slot:label>
                          <span>{{ stat }}</span>
                          <b-button
                            variant="outline-info"
                            class="thin-button mb-1"
                            size="sm"
                            @click="swapBetweenRandomAndStatic(stat)"
                          >Swap to single number</b-button>
                        </template>
                        <b-input-group class="multi">
                          <b-form-input type="number" v-model="item.randomStats[stat].min" min="0"></b-form-input>
                          <div class="split-label true-center px-2">To</div>
                          <b-form-input type="number" v-model="item.randomStats[stat].max" min="0"></b-form-input>

                          <b-input-group-append>
                            <b-button variant="danger" @click="removeStat(stat)">Del</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="row"></div>
                </div>
              </div>
            </b-tab>

            <b-tab title="Traits, Effects & Requirements"></b-tab>

            <b-tab title="Miscellaneous"></b-tab>
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
        - col 1: type/secondaryType
        - col 3 [extra props]
          - archetype (fake property, maybe inherit from itemtype)
              - [ auto check some properties in weapon based on chosen itemClass]
            - arrow: shots, tier, damageClass
            - armor: isHeavy
            - weapon: tier, damageClass, returnsOnThrow, proneChance, twoHanded, type, secondaryType, attackRange, offhand, isHeavy, canShoot
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

import { clone, objectPosition, isUndefined } from "../helpers";
import {
  coreStats,
  extraStats,
  itemClasses,
  weaponClasses,
  armorClasses,
  damageClasses,
  typePropSets,
  typePropDefaults,
  itemTypes
} from "../constants";
import { events } from "../main";

const defaultItem = {
  sprite: 0,
  name: "",
  itemClass: "",
  maxEnchantLevel: 5,
  value: 1,
  sellValue: 0,
  desc: "an item",
  stats: {},
  randomStats: {},
  type: "Martial",
  secondaryType: ""
};

export default {
  name: "Items",

  props: ["items"],

  data: function() {
    return {
      sortBy: "name",
      sortDesc: false,
      itemGroups: [
        { group: "Armor", keys: armorClasses },
        { group: "Weapons", keys: weaponClasses },
        { group: "Items", keys: itemClasses }
      ],
      currentSelectedItemClass: '',
      typePropSets,
      itemTypes,
      tableFields: [
        { key: "sprite", label: "Sprite" },
        { key: "name", label: "ID", sortable: true },
        { key: "actions", label: "Actions", class: "text-right" }
      ],
      currentAddStat: "",
      isEditing: -1,
      linkStats: true,
      allStats: [...coreStats.map(x => x.stat), ...extraStats.map(x => x.stat)],
      item: clone(defaultItem)
    };
  },

  methods: {
    objectPosition,

    isValidItem(item) {
      const validKeys = ["name", "itemClass", "desc", "value", "type"];
      return validKeys.every(x => get(item, x));
    },

    reset() {
      this.item = clone(defaultItem);
      this.editingRandomStats = {};
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
    },

    addStat(key) {
      if (!key || this.item.stats[key] || this.item.randomStats[key]) return;
      this.$set(this.item.stats, key, 0);
    },

    removeStat(key) {
      if (!key) return;
      this.$delete(this.item.stats, key);
      this.$delete(this.item.randomStats, key);
    },

    swapBetweenRandomAndStatic(stat) {
      if (!stat) return;

      if (!isUndefined(this.item.stats[stat])) {
        this.$delete(this.item.stats, stat);
        this.$set(this.item.randomStats, stat, { min: 0, max: 1 });
      } else {
        this.$delete(this.item.randomStats, stat);
        this.$set(this.item.stats, stat, 0);
      }
    },

    changeItemType() {
      const oldType = this.item.itemClass;
      const newType = this.currentSelectedItemClass;

      // TODO: finish this by setting/unsetting item properties
      this.item.itemClass = newType;
    }
  }
};
</script>

<style scoped>
</style>
