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
                        :style="{ 'object-position': objectPosition(item.sprite, 32) }"
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
                        :key="group.group"
                      >
                        <option
                          v-for="type in group.keys"
                          :value="type"
                          :key="type"
                        >{{ type }}</option>
                      </optgroup>
                    </b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Skill" class="multi">
                    <b-form-select v-model="item.type" required class="form-control">
                      <option :value="''">Choose item skill type</option>
                      <option v-for="type in itemTypes" :value="type" :key="type">{{ type }}</option>
                    </b-form-select>

                    <div class="split-label true-center px-2">
                      <strong>#2</strong>
                    </div>

                    <b-form-select v-model="item.secondaryType" required class="form-control">
                      <option :value="''">None</option>
                      <option v-for="type in itemTypes" :value="type" :key="type">{{ type }}</option>
                    </b-form-select>
                  </b-form-group>

                  <b-form-group label-cols-md="3" label="Max # Upgrades" class="multi">
                    <b-form-input type="number" v-model="item.maxUpgrades" min="0"></b-form-input>

                    <div 
                      class="split-label true-center px-2"
                      v-b-tooltip.hover
                      title="Quality affects whether the item can be transmuted, and how much it disenchants for. An item with any random stats will override this property. Quality is always shown as -2 of the display value. For example, if you set this to 3, the display value in game will be ★.">
                      <strong>★</strong>
                    </div>

                    <b-form-select v-model="item.quality" required class="form-control">
                      <option :value="''">None</option>
                      <option v-for="type in [0, 1, 2, 3, 4, 5]" :value="type" :key="type">{{ type }}</option>
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

                  <div class="row mb-3">
                    <b-form-checkbox v-model="item.destroyOnDrop" class="col-md-6 offset-md-3">
                      <span v-b-tooltip.hover title="Item will be destroyed when dropped">Destroy on drop</span>
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
                    
                      <div class="row">
                        <div class="col-8">
                          <stat-selector v-model="currentAddStat" @change="currentAddStat = $event"></stat-selector>
                        </div>

                        <div class="col-4 text-right">
                          <b-button
                            variant="primary"
                            :disabled="!currentAddStat"
                            @click="addStat(currentAddStat)"
                          >Add</b-button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row mt-1" v-for="(value, stat) in item.stats" :key="stat">
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

                  <div class="row mt-1" v-for="(value, stat) in item.randomStats" :key="stat">
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
                    :key="attr">
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

                      <div v-if="attr === 'succorInfo'">

                        <b-form-group label-cols-md="3" label="Succor Map">
                          <b-form-input type="text" v-model="item.succorInfo.map" placeholder="Succor Map"></b-form-input>
                        </b-form-group>

                        <b-form-group label-cols-md="3" label="Succor X">
                          <b-form-input type="number" v-model="item.succorInfo.x" placeholder="Succor X" min="0"></b-form-input>
                        </b-form-group>

                        <b-form-group label-cols-md="3" label="Succor Y">
                          <b-form-input type="number" v-model="item.succorInfo.y" placeholder="Succor Y" min="0"></b-form-input>
                        </b-form-group>
                      </div>

                      <div v-if="attr === 'containedItems'">
                        <b-button
                          variant="primary"
                          block
                          @click="addContainedItem()"
                        >Add Contained Item</b-button>

                        <div class="row mt-1" v-for="contained in item.containedItems" :key="contained.result">
                          <div class="col">
                            <b-form-group class="left-header">
                              <b-input-group class="multi">
                                <b-form-input type="text" v-model="contained.result" placeholder="Item"></b-form-input>
                                <b-form-input type="number" v-model="contained.chance" min="0" placeholder="Weight"></b-form-input>

                                <b-input-group-append>
                                  <b-button variant="danger" @click="removeContainedItem(contained)">Del</b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </b-tab>

            <b-tab title="Traits, Effects & Requirements">
              
              <div class="row">
                <div class="col-md-4">
                  <trait-selector v-model="item.trait.name" label="Trait" @change="item.trait.name = $event"></trait-selector>

                  <b-form-group label-cols-md="3" label="Trait Level">
                    <b-form-input type="number" v-model="item.trait.level" min="0" max="5"></b-form-input>
                  </b-form-group>
                </div>

                <div class="col-md-4">
                  <effect-selector v-model="item.useEffect.name" label="Use Effect" @change="item.useEffect.name = $event"></effect-selector>

                  <div v-if="item.useEffect.name">
                    <b-form-group label-cols-md="3" label="Use Potency">
                      <b-form-input type="number" v-model="item.useEffect.potency" min="0"></b-form-input>
                    </b-form-group>

                    <b-form-group label-cols-md="3" label="Use Duration">
                      <b-form-input type="number" v-model="item.useEffect.duration" min="0"></b-form-input>
                    </b-form-group>

                    <b-form-checkbox v-model="item.useEffect.canApply" class="col-md-9 offset-md-3">
                      <span v-b-tooltip.hover title="This effect can be applied from this item to weapons, using the Thief Apply skill">Can Apply Use Effect</span>
                    </b-form-checkbox>
                  </div>

                  <div class="mt-3" v-if="item.useEffect.name === 'Nourishment'">
                    <b-form-group label-cols-md="3" label="Nourish Tooltip">
                      <b-form-input type="text" v-model="item.useEffect.extra.tooltip" placeholder="Nourish Tooltip"></b-form-input>
                    </b-form-group>

                    <b-form-group label-cols-md="3" label="Nourish Message">
                      <b-form-input type="text" v-model="item.useEffect.extra.message" placeholder="Nourish Message"></b-form-input>
                    </b-form-group>
                    
                    <div class="row">
                      <div class="col-8">
                        <stat-selector v-model="currentAddNourishStat" @change="currentAddNourishStat = $event"></stat-selector>
                      </div>

                      <div class="col-4 text-right">
                        <b-button
                          variant="primary"
                          :disabled="!currentAddNourishStat"
                          @click="addNourishStat(currentAddNourishStat)"
                        >Add</b-button>
                      </div>
                    </div>

                    <div class="row mt-1" v-for="(value, stat) in item.useEffect.extra.statChanges" :key="stat">
                      <div class="col">
                        <b-form-group class="left-header">
                          <template v-slot:label>
                            <span>{{ stat }}</span>
                          </template>
                          <b-input-group>
                            <b-form-input type="number" v-model="item.useEffect.extra.statChanges[stat]"></b-form-input>

                            <b-input-group-append>
                              <b-button variant="danger" @click="removeNourishStat(stat)">Del</b-button>
                            </b-input-group-append>
                          </b-input-group>
                        </b-form-group>
                      </div>
                    </div>
                  </div>

                  <hr>

                  <effect-selector v-model="item.strikeEffect.name" label="Strike Effect" @change="item.strikeEffect.name = $event"></effect-selector>

                  <div v-if="item.strikeEffect.name">
                    <b-form-group label-cols-md="3" label="Strike Potency">
                      <b-form-input type="number" v-model="item.strikeEffect.potency" min="0"></b-form-input>
                    </b-form-group>

                    <b-form-group label-cols-md="3" label="Strike Duration">
                      <b-form-input type="number" v-model="item.strikeEffect.duration" min="0"></b-form-input>
                    </b-form-group>

                    <b-form-group label-cols-md="3" label="Strike Chance">
                      <b-form-input type="number" v-model="item.strikeEffect.chance" min="0" max="100"></b-form-input>
                    </b-form-group>
                  </div>

                  <hr>

                  <effect-selector v-model="item.equipEffect.name" label="Equip Effect" @change="item.equipEffect.name = $event"></effect-selector>

                  <div v-if="item.equipEffect.name">
                    <b-form-group label-cols-md="3" label="Equip Potency">
                      <b-form-input type="number" v-model="item.equipEffect.potency" min="0"></b-form-input>
                    </b-form-group>
                  </div>

                  <hr>

                  <effect-selector v-model="item.breakEffect.name" label="Break Effect" @change="item.breakEffect.name = $event"></effect-selector>

                  <div v-if="item.breakEffect.name">
                    <b-form-group label-cols-md="3" label="Break Potency">
                      <b-form-input type="number" v-model="item.breakEffect.potency" min="0"></b-form-input>
                    </b-form-group>
                  </div>

                </div>

                <div class="col-md-4">
                  <class-selector v-model="item.requirements.baseClass" label="Required Class" @change="item.requirements.baseClass = $event"></class-selector>

                  <b-form-group label-cols-md="3" label="Required Level">
                    <b-form-input type="number" v-model="item.requirements.level" min="0"></b-form-input>
                  </b-form-group>
                </div>
              </div>
            </b-tab>

            <b-tab title="Miscellaneous">
              
              <div class="row">
                <div class="col-md-6">
                  <cosmetic-selector v-model="item.cosmetic.name" label="Cosmetic" @change="item.cosmetic.name = $event"></cosmetic-selector>

                  <div class="row mb-3">
                    <b-form-checkbox v-model="item.cosmetic.isPermanent" class="col-md-6 offset-md-3">
                      <span v-b-tooltip.hover title="Cosmetic cannot be removed from item">Permanent Cosmetic</span>
                    </b-form-checkbox>
                  </div>
                </div>
              </div>
              
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
      <template v-slot:head(actions)>
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(sprite)="data">
        <div class="sprite-container">
          <img
            src="file://./resources/maps/src/content/__assets/spritesheets/items.png"
            class="sprite"
            :style="{ 'object-position': objectPosition(data.item.sprite, 32) }"
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

import CosmeticSelector from './shared/CosmeticSelector.vue';
import ClassSelector from './shared/ClassSelector.vue';
import TraitSelector from './shared/TraitSelector.vue';
import EffectSelector from './shared/EffectSelector.vue';
import StatSelector from './shared/StatSelector.vue';

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
  secondaryType: '',
  succorInfo: {},
  cosmetic: { name: '' },
  containedItems: [],
  trait: { name: '', level: 0 },
  useEffect: { name: '', potency: 0, duration: 0, extra: { statChanges: {}, tooltip: '', message: '' } },
  strikeEffect: { name: '', potency: 0, duration: 0, chance: 0 },
  breakEffect: { name: '', potency: 0, duration: 0 },
  equipEffect: { name: '', potency: 0, duration: 0 },
  requirements: { baseClass: '', level: 0 }
};

export default {
  name: 'Items',

  props: ['items'],

  components: { CosmeticSelector, ClassSelector, TraitSelector, EffectSelector, StatSelector },

  data() {
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
      currentAddNourishStat: '',
      isEditing: -1,
      linkStats: true,
      allStats: [...coreStats.map(x => x.stat), ...extraStats.map(x => x.stat)],
      item: clone(defaultItem)
    };
  },

  methods: {
    objectPosition,

    isValidItem(item) {
      if(this.items.some((check, i) => i !== this.isEditing && item.name === check.name)) return false;

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

    addNourishStat(key) {
      if(!key || this.item.useEffect.extra.statChanges[key]) return;
      this.$set(this.item.useEffect.extra.statChanges, key, 0);
    },

    removeNourishStat(key) {
      if (!key) return;
      this.$delete(this.item.useEffect.extra.statChanges, key);
      this.$delete(this.item.useEffect.extra.statChanges, key);
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

    addContainedItem() {
      this.item.containedItems.push({ result: `Item ${this.item.containedItems.length + 1}`, chance: 1 });
    },

    removeContainedItem(contained) {
      this.$delete(this.item.containedItems.indexOf(contained));
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
