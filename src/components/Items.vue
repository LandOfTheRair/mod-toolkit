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
      <div class="d-block p-1">
        <b-form>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Core Stats">
              <div class="row">
                <div class="col-md-4">
                  <b-form-group class="sprite-field" label-cols-md="3" label="Sprite">
                    <div class="sprite-container">
                      <img
                        src="file://./resources/maps/src/content/__assets/spritesheets/items.png"
                        class="sprite"
                        v-bind:style="{ 'object-position': objectPosition(item.sprite, 32) }"
                      >
                    </div>

                    <b-form-input type="number" v-model="item.sprite" min="0" required></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Name">
                    <b-form-input type="text" v-model="item.name" placeholder="Enter Item Name"></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Type">
                    <b-form-select
                      v-model="currentSelectedItemClass"
                      required
                      @change="changeItemType($event)"
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
                    <b-form-select v-model="item.type" required class="form-control">
                      <option :value="''">Choose item skill type</option>
                      <option v-for="type in itemTypes" :value="type" v-bind:key="type">{{ type }}</option>
                    </b-form-select>

                    <div class="split-label true-center px-2">
                      <strong>#2</strong>
                    </div>

                    <b-form-select v-model="item.secondaryType" required class="form-control">
                      <option :value="''">None</option>
                      <option v-for="type in itemTypes" :value="type" v-bind:key="type">{{ type }}</option>
                    </b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Max # Upgrades" class="multi">
                    <b-form-input type="number" v-model="item.maxUpgrades" min="0"></b-form-input>

                    <div 
                      class="split-label true-center px-2"
                      v-b-tooltip.hover
                      title="Quality affects whether the item can be transmuted, and how much it disenchants for. An item with any random stats will override this property.">
                      <strong>★</strong>
                    </div>

                    <b-form-select v-model="item.quality" required class="form-control">
                      <option :value="''">None</option>
                      <option v-for="type in [0, 1, 2, 3, 4, 5]" :value="type" v-bind:key="type">{{ type }}</option>
                    </b-form-select>
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
                  <div
                    class="row mt-1"
                    v-for="attr in typePropSets[currentSelectedItemClass]"
                    v-bind:key="attr">
                    <div class="col">

                      <b-form-group label-cols-md="3" label="Ounces" v-if="attr === 'ounces'">
                        <b-form-input type="number" v-model="item.ounces" placeholder="# ounces" min="0"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Tier" v-if="attr === 'tier'">
                        <b-form-input type="number" v-model="item.tier" placeholder="Tier #" min="0"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Shots" v-if="attr === 'shots'">
                        <b-form-input type="number" v-model="item.shots" placeholder="# shots" min="0"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Tier" v-if="attr === 'maxEncrusts'">
                        <b-form-input type="number" v-model="item.maxEncrusts" placeholder="# encrusts" min="0" max="16"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Book Pages" v-if="attr === 'bookPages'">
                        <b-form-input type="number" v-model="item.bookPages" placeholder="# pages" min="0"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Total Pages" v-if="attr === 'bookFindablePages'">
                        <b-form-input type="number" v-model="item.bookFindablePages" placeholder="# pages (total)" min="0"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Page Filter" v-if="attr === 'bookItemFilter'">
                        <b-form-input type="text" v-model="item.bookItemFilter" placeholder="Page Filter"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Book Page" v-if="attr === 'bookPage'">
                        <b-form-input type="number" v-model="item.bookPage" placeholder="Page #" min="0"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Trap Uses" v-if="attr === 'trapUses'">
                        <b-form-input type="number" v-model="item.trapUses" placeholder="# trap uses" min="0"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Damage Type" v-if="attr === 'damageClass'">
                        <b-form-select v-model="item.damageClass" required :options="damageClasses">
                            <template v-slot:first>
                            <option :value="''">Choose damage type</option>
                            </template>
                        </b-form-select>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Prone Chance" v-if="attr === 'proneChance'">
                        <b-form-input type="number" v-model="item.proneChance" placeholder="Prone chance %" min="0" max="100"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-md="3" label="Attack Range" v-if="attr === 'attackRange'">
                        <b-form-input type="number" v-model="item.attackRange" placeholder="Attack range (tiles)" min="0" max="4"></b-form-input>
                      </b-form-group>

                      <b-form-checkbox v-model="item.isHeavy" class="offset-md-3" v-if="attr === 'isHeavy'">
                        <span v-b-tooltip.hover title="Item is heavy and inhibits spellcasting">Heavy Item</span>
                      </b-form-checkbox>

                      <b-form-checkbox v-model="item.twoHanded" class="offset-md-3" v-if="attr === 'twoHanded'">
                        <span v-b-tooltip.hover title="Weapon requires both hands to use">Two-handed</span>
                      </b-form-checkbox>

                      <b-form-checkbox v-model="item.offhand" class="offset-md-3" v-if="attr === 'offhand'">
                        <span v-b-tooltip.hover title="Weapon will make attacks when held in offhand">Offhand weapon</span>
                      </b-form-checkbox>

                      <b-form-checkbox v-model="item.returnsOnThrow" class="offset-md-3" v-if="attr === 'returnsOnThrow'">
                        <span v-b-tooltip.hover title="Weapon returns when thrown">Returns on throw</span>
                      </b-form-checkbox>

                      <b-form-checkbox v-model="item.canShoot" class="offset-md-3" v-if="attr === 'canShoot'">
                        <span v-b-tooltip.hover title="Weapon is able to shoot arrows">Can shoot</span>
                      </b-form-checkbox>

                    </div>
                  </div>
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
      <template v-slot:head(actions)>
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(sprite)="data">
        <div class="sprite-container">
          <img
            src="file://./resources/maps/src/content/__assets/spritesheets/items.png"
            class="sprite"
            v-bind:style="{ 'object-position': objectPosition(data.item.sprite, 32) }"
          >
        </div>
      </template>

      <template v-slot:cell(name)="data">{{ data.item.name }}</template>

      <template v-slot:cell(actions)="data">
        <b-button class="mr-1" size="sm" variant="info" @click="copy(data.item)">Copy</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="edit(data.item)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(data.item)">Remove</b-button>
      </template>
    </b-table>
  </div>

  <!--
    TODO:
      - traits, effects, requirements
        - trait name/level (allow multiple names as array, and level as min/max)
        - effect name/potency/chance/duration/canApply/autocast (strike, use, equip, break)
          - tooltip/message/stats if effect == Nourishment
          - tier/ignoreHPBoost
        - requirements (level, skill, profession, quest)

      - misc
        - succorInfo
        - containedItems (chance/item)
        - cosmetic (name/isPermanent)
        - destroyOnDrop
  -->
</template>

<script>
import get from 'lodash.get';

import { clone, objectPosition, isUndefined } from '../helpers';
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
} from '../constants';
import { events } from '../main';

const defaultItem = {
  sprite: 0,
  quality: 0,
  name: '',
  itemClass: '',
  maxUpgrades: 0,
  value: 1,
  sellValue: 0,
  desc: 'an item',
  stats: {},
  randomStats: {},
  type: 'Martial',
  secondaryType: ''
};

export default {
  name: 'Items',

  props: ['items'],

  data: function() {
    return {
      sortBy: 'name',
      sortDesc: false,
      itemGroups: [
        { group: 'Armor', keys: armorClasses },
        { group: 'Weapons', keys: weaponClasses },
        { group: 'Items', keys: itemClasses }
      ],
      currentSelectedItemClass: '',
      typePropSets,
      damageClasses,
      itemTypes,
      tableFields: [
        { key: 'sprite', label: 'Sprite' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'itemClass', label: 'Type', sortable: true },
        { key: 'type', label: 'Skill', sortable: true },
        { key: 'actions', label: 'Actions', class: 'text-right' }
      ],
      currentAddStat: '',
      isEditing: -1,
      linkStats: true,
      allStats: [...coreStats.map(x => x.stat), ...extraStats.map(x => x.stat)],
      item: clone(defaultItem)
    };
  },

  methods: {
    objectPosition,

    isValidItem(item) {
      const validKeys = ['name', 'itemClass', 'desc', 'value', 'type'];
      return validKeys.every(x => get(item, x));
    },

    reset() {
      this.item = clone(defaultItem);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? 'edit' : 'add'}:item`, {
        item: this.item,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(item) {
      const cloneItem = clone(item);
      cloneItem.name = cloneItem.name + ' (Copy)';

      events.$emit('add:item', { item: cloneItem });
    },

    edit(item) {
      this.item = clone(item);
      this.isEditing = this.items.findIndex(x => x === item);
      this.currentSelectedItemClass = this.item.itemClass;

      this.openModal();
    },

    async remove(item) {
      const willRemove = await this.$dialog.confirm({ title: 'Remove Item?', text: 'Are you sure you want to remove this item?' });
      if(!willRemove) return;

      events.$emit('remove:item', { index: this.items.findIndex(x => x === item) });
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

    changeItemType(event) {
      const oldType = this.item.itemClass;
      const newType = event;

      const resetProps = typePropDefaults[oldType] || {};
      Object.keys(resetProps).forEach(prop => {
        if (prop === 'stats') {
          Object.keys(resetProps[prop]).forEach(subProp => {
            this.$delete(this.item[prop], subProp);
          });
          return;
        }

        this.$delete(this.item, prop);
      });

      const newProps = typePropDefaults[newType] || {};
      Object.keys(newProps).forEach(prop => {
        if (prop === 'stats') {
          Object.keys(newProps[prop]).forEach(subProp => {
            this.$set(this.item[prop], subProp, newProps[prop][subProp]);
          });
          return;
        }

        this.$set(this.item, prop, newProps[prop]);
      });

      if (!this.item.type) this.$set(this.item, 'type', 'Martial');
      if (!this.item.secondaryType) this.$set(this.item, 'secondaryType', '');

      this.item.itemClass = newType;
    }
  }
};
</script>

<style scoped>
</style>
