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
      <div class="d-block p-1">
        <b-form>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Core Stats">
              <div class="row">
                <div class="col-md-4">
                  <b-form-group class="sprite-field" label-cols-md="3" label="Sprite">
                    <div class="sprite-container">
                      <img
                        src="file://./resources/maps/src/content/__assets/spritesheets/creatures.png"
                        class="sprite"
                        :style="{ 'object-position': objectPosition(npc.sprite, 40) }"
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
                      placeholder="The guild/tag for NPC"
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

                  <class-selector v-model="npc.baseClass" label="Class" @change="npc.baseClass = $event"></class-selector>

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

                  <b-form-group label-cols-md="3" label="Grouping" class="optional">
                    <b-form-input
                      type="text"
                      v-model="npc.monsterGroup"
                      placeholder="The guild/tag for NPC"
                    ></b-form-input>
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

                  <div class="row mb-3">
                    <b-form-checkbox
                      v-model="npc.noCorpseDrop"
                      class="col-md-4 offset-md-3"
                    >
                      <span v-b-tooltip.hover title="Creature will not drop a corpse">No Corpse</span>
                    </b-form-checkbox>

                    <b-form-checkbox
                      v-model="npc.noItemDrop"
                      class="col-md-5"
                    >
                      <span
                        v-b-tooltip.hover
                        title="Creature will not drop items"
                      >No Items</span>
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
                  
                  <div class="row mt-1" v-for="(value, stat) in npc.otherStats" :key="stat">
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

            <b-tab title="Skills & Attributes">
              <div class="row">
                <div class="col-4">

                  <div class="row">
                    <div class="col-8">
                      <trait-selector v-model="currentTrait" label="Trait" @change="currentTrait = $event"></trait-selector>
                    </div>

                    <div class="col-4">
                      <b-button
                        variant="primary"
                        :disabled="!currentTrait || npc.traitLevels[currentTrait] > 0"
                        @click="addTrait(currentTrait)"
                      >Add</b-button>
                    </div>
                  </div>

                  <div class="row mb-3" v-for="(level, trait) of npc.traitLevels" :key="trait">
                    <div class="col-4">
                      <strong>{{ trait }}</strong>
                    </div>

                    <div class="col-4">
                      <b-form-input type="number" v-model="npc.traitLevels[trait]" placeholder="Lv." min="1"></b-form-input>
                    </div>

                    <div class="col-4">
                      <b-button variant="danger" @click="removeTrait(trait)">Del</b-button>
                    </div>
                  </div>

                </div>

                <div class="col-4">
                  
                  <b-button class="mb-3" variant="info" block @click="addUsableSkill()">Add Spell</b-button>

                  <div class="row" v-for="(skill, index) of npc.usableSkills" :key="index">
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

                <div class="col-4">
                  
                  <b-button class="mb-3" variant="info" block @click="addBaseEffect()">Add Base Effect</b-button>

                  <div class="row" v-for="(effect, index) of npc.baseEffects" :key="index">
                    <div class="col-9">
                      <effect-selector v-model="effect.name" label="Effect" @change="effect.name = $event"></effect-selector>
                    </div>

                    <div class="col-2">
                      <b-button variant="danger" @click="removeBaseEffect(index)">Del</b-button>
                    </div>

                    <div class="col-7 offset-1" v-if="effect.name === 'Attribute'">
                      <damage-type-selector v-model="effect.extra.damageType" label="Type" @change="effect.extra.damageType = $event"></damage-type-selector>
                    </div>

                    <div class="col-3" v-if="effect.name === 'Attribute'">
                      <b-form-input type="number" v-model="effect.extra.potency" placeholder="%" min="0"></b-form-input>
                    </div>
                  </div>
                </div>
              </div>

            </b-tab>

            <b-tab title="Gear">
              <div class="row">
                <div class="col-6">
                  <b-button class="mb-3" variant="info" block @click="addSackItem()">Add Sack Item</b-button>

                  <div class="row" v-for="(sitem, index) of npc.items.sack" :key="index">
                    <div class="col-7">
                      <item-selector v-model="sitem.result" :modItems="items" label="Item" @change="sitem.result = $event"></item-selector>
                    </div>

                    <div class="col-3">
                      <b-form-input type="number" v-model="sitem.chance" placeholder="1/x" min="-1"></b-form-input>
                    </div>

                    <div class="col-2">
                      <b-button variant="danger" @click="removeSackItem(index)">Del</b-button>
                    </div>
                  </div>
                </div>

                <div class="col-6">
                  <div class="row" v-for="(val, slot) of npc.items.equipment" :key="slot">
                    <div class="col-12">
                      <b-button class="mb-3" variant="info" block @click="addEquipmentItem(slot)">Add {{ slot }} Item</b-button>

                      <div class="row" v-for="(sitem, index) of npc.items.equipment[slot]" :key="index">
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

            <b-tab title="Drops">
              <div class="row">
                <div class="col-4">
                  <b-button class="mb-3" variant="info" block @click="addDrop()">Add Drop</b-button>

                  <div class="row" v-for="(drop, index) of npc.drops" :key="index">
                    <div class="col-6">
                      <item-selector v-model="drop.result" :modItems="items" label="Item" @change="drop.result = $event"></item-selector>
                    </div>

                    <div class="col-4">
                      <b-form-input type="number" v-model="drop.chance" placeholder="1/x" min="-1"></b-form-input>
                    </div>

                    <div class="col-2">
                      <b-button variant="danger" @click="removeDrop(index)">Del</b-button>
                    </div>
                  </div>

                </div>

                <div class="col-4">
                  <b-button class="mb-3" variant="info" block @click="addCopyDrop()">Add Copy Drop</b-button>

                  <div class="row" v-for="(cdrop, index) of npc.copyDrops" :key="index">
                    <div class="col-10">
                      <slot-selector v-model="cdrop.result" label="Copy Slot" @change="cdrop.result = $event"></slot-selector>
                    </div>

                    <div class="col-2">
                      <b-button variant="danger" @click="removeCopyDrop(index)">Del</b-button>
                    </div>
                  </div>
                </div>

                <div class="col-4">
                  <item-selector v-model="npc.tansFor" :modItems="items" label="Tans For" @change="npc.tansFor = $event"></item-selector>

                  <b-form-group label-cols-md="3" label="Tan Skill Required">
                    <b-form-input type="number" v-model="npc.tanSkillRequired" required placeholder="Tan Skill Required" min="0"></b-form-input>
                  </b-form-group>
                  

                  <b-button class="mb-3" variant="info" block @click="addDropPoolItem()">Add Drop Pool Item</b-button>

                  <b-form-group label-cols-md="3" label="Min" class="multi">
                    <b-form-input type="number" v-model="npc.dropPool.choose.min" placeholder="Drop Pool Min" min="0"></b-form-input>

                    <div class="split-label true-center">
                      <strong>Max</strong>
                    </div>

                    <b-form-input
                      type="number"
                      v-model="npc.dropPool.choose.max"
                      min="0"
                      placeholder="Drop Pool Max"
                    ></b-form-input>
                  </b-form-group>

                  <div class="row" v-for="(drop, index) of npc.dropPool.items" :key="index">
                    <div class="col-8">
                      <item-selector v-model="npc.dropPool.items[index]" :modItems="items" label="Item" @change="npc.dropPool.items[index] = $event"></item-selector>
                    </div>

                    <div class="col-4">
                      <b-button variant="danger" @click="removeDropPoolItem(index)">Del</b-button>
                    </div>
                  </div>
                </div>
              </div>
            </b-tab>

            <b-tab title="Triggers">
              <div class="row">
                <div class="col-6">
                  <b-button class="mb-3" variant="info" block @click="addCombatMessage()">Add Combat Message</b-button>

                  <b-form-group label-cols-md="3" label="Message" v-for="(message, index) in npc.triggers.combat.messages" :key="index">
                    <b-input-group>
                      <b-form-input type="text" v-model="npc.triggers.combat.messages[index]" placeholder="Message"></b-form-input>

                      <b-input-group-append>
                        <b-button variant="danger" @click="removeCombatMessage(index)">Del</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </div>

                <div class="col-6">
                  <b-form-group label-cols-md="3" label="Spawn Message">
                    <b-form-input type="text" v-model="npc.triggers.spawn.messages[0]" placeholder="Spawn Message"></b-form-input>
                  </b-form-group>

                  <sfx-selector v-model="npc.triggers.spawn.sfx.name" label="Spawn SFX" @change="npc.triggers.spawn.sfx.name = $event"></sfx-selector>

                  <b-form-group label-cols-md="3" label="Spawn SFX%">
                    <b-form-input type="number" v-model="npc.triggers.spawn.sfx.maxChance" placeholder="x/100" min="0" max="100"></b-form-input>
                  </b-form-group>

                  <hr>

                  <b-form-group label-cols-md="3" label="Leash Message">
                    <b-form-input type="text" v-model="npc.triggers.leash.messages[0]" placeholder="Leash Message"></b-form-input>
                  </b-form-group>

                  <sfx-selector v-model="npc.triggers.leash.sfx.name" label="Leash SFX" @change="npc.triggers.leash.sfx.name = $event"></sfx-selector>

                  <b-form-group label-cols-md="3" label="Leash SFX%">
                    <b-form-input type="number" v-model="npc.triggers.leash.sfx.maxChance" placeholder="x/100" min="0" max="100"></b-form-input>
                  </b-form-group>
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </b-form>
      </div>
    </b-modal>

    <div class="mb-3 row" v-if="npcs.length > 0">
      <div class="col-6">
        <b-form-input v-model="filter" placeholder="Search NPCs..."></b-form-input>
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
      v-if="npcs.length" 
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc" 
      :fields="tableFields" 
      :items="npcs"
      :sticky-header="globalTableHeight"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      @filtered="onFiltered"
    >
      <template v-slot:head(actions)>
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(sprite)="data">
        <div class="sprite-container">
          <img
            src="file://./resources/maps/src/content/__assets/spritesheets/creatures.png"
            class="sprite"
            :style="{ 'object-position': objectPosition(data.item.sprite, 40) }"
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
        <b-button class="mr-1" size="sm" variant="info" @click="copy(data.item)">Copy</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="edit(data.item)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(data.item)">Remove</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import get from 'lodash.get';

import { clone, objectPosition } from '../helpers';
import { coreStats, extraStats, globalTableHeight } from '../constants';
import { events } from '../main';

import ClassSelector from './shared/ClassSelector.vue';
import SFXSelector from './shared/SFXSelector.vue';
import ItemSelector from './shared/ItemSelector.vue';
import SlotSelector from './shared/SlotSelector.vue';
import TraitSelector from './shared/TraitSelector.vue';
import SpellSelector from './shared/SpellSelector.vue';
import EffectSelector from './shared/EffectSelector.vue';
import DamageTypeSelector from './shared/DamageTypeSelector.vue';

const defaultNPC = {
  sprite: 0,
  npcId: '',
  name: '',
  hostility: 'OnHit',
  allegiance: 'Enemy',
  monsterClass: '',
  baseClass: '',
  affiliation: '',
  alignment: 'Neutral',
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
  skillOnKill: 0,
  otherStats: {},
  gear: {},
  hp: { min: 0, max: 0 },
  mp: { min: 0, max: 0 },
  giveXp: { min: 0, max: 0 },
  gold: { min: 0, max: 0 },
  monsterGroup: '',
  avoidWater: false,
  aquaticOnly: false,
  noCorpseDrop: false,
  noItemDrop: false,
  traitLevels: {},
  usableSkills: [],
  baseEffects: [],
  drops: [],
  copyDrops: [],
  dropPool: {
    choose: {
      min: 0,
      max: 0,
    },
    items: []
  },
  tansFor: '',
  tanSkillRequired: 0,
  triggers: {
    leash: {
      messages: [''],
      sfx: {
        name: '',
        maxChance: 0
      }
    },
    spawn: {
      messages: [''],
      sfx: {
        name: '',
        maxChance: 0
      }
    },
    combat: {
      messages: []
    }
  },
  items: {
    sack: [],
    belt: [],
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
  }
};

export default {
  name: 'NPCs',

  props: ['npcs', 'items'],

  components: { ClassSelector, 'sfx-selector': SFXSelector, ItemSelector, SlotSelector, TraitSelector, SpellSelector, EffectSelector, DamageTypeSelector },

  data() {
    return {
      globalTableHeight,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      filter: '',
      sortBy: 'name',
      sortDesc: false,
      tableFields: [
        { key: 'sprite', label: 'Sprite' },
        { key: 'name', label: 'ID', sortable: true },
        { key: 'level', label: 'Level', sortable: true },
        { key: 'skillLevels', label: 'Skill', sortable: true },
        { key: 'baseClass', label: 'Class', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
        { key: 'allegiance', label: 'Allegiance', sortable: true },
        { key: 'actions', label: 'Actions', class: 'text-right' }
      ],
      isEditing: -1,
      linkStats: true,
      currentTrait: '',
      currentExtraStat: '',
      extraStats: extraStats.map(x => x.stat),
      npc: clone(defaultNPC)
    };
  },

  created() {
    this.onFiltered(this.npcs);
  },

  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
      this.npcs.count = filteredItems.length;
    },
    
    objectPosition,

    isValidNPC(npc) {
      if(this.npcs.some((check, i) => i !== this.isEditing && npc.npcId === check.npcId)) return false;

      const validKeys = [
        'npcId',
        'hp.min',
        'giveXp.min',
        'gold.min',
        'level',
        'skillLevels',
        'skillOnKill'
      ];
      return validKeys.every(x => get(npc, x));
    },

    reset() {
      this.npc = clone(defaultNPC);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? 'edit' : 'add'}:npc`, { npc: this.npc, index: this.isEditing });
      this.onFiltered(this.npcs);
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(npc) {
      this.npc = clone(npc);
      this.openModal();
    },

    edit(npc) {
      this.npc = clone(npc);
      this.isEditing = this.npcs.findIndex(x => x === npc);
      this.openModal();
    },

    async remove(npc) {
      const willRemove = await this.$dialog.confirm({ title: 'Remove NPC?', text: 'Are you sure you want to remove this NPC?' });
      if(!willRemove) return;

      events.$emit('remove:npc', { index: this.npcs.findIndex(x => x === npc) });
      this.onFiltered(this.npcs);
    },

    updateKeyMaxIfNotPresent($event, key) {
      if (this.npc[key].max > this.npc[key].min) return;
      this.npc[key].max = this.npc[key].min;
    },

    addExtraStat(key) {
      if (!key || this.npc.otherStats[key]) return;
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
        Math.floor(9947.208 * level - 79505.7)
      );

      if(['Warrior', 'Thief'].includes(this.npc.baseClass)) {
        this.npc.mp.max = this.npc.mp.min = 100;
      }

      if(['Mage', 'Healer'].includes(this.npc.baseClass)) {
        this.npc.mp.max = this.npc.mp.min = Math.max(
          100,
          Math.floor(1947.208 * level - 19505.7)
        );
      }

      if(!this.npc.baseClass || this.npc.baseClass === 'Traveller') {
        this.npc.mp.max = this.npc.mp.min = 0;
      }

      this.npc.giveXp.max = this.npc.giveXp.min = Math.max(
        10,
        Math.floor(3247.873 * level - 41978.42)
      );

      this.npc.gold.max = this.npc.gold.min = 300 * level;
    },

    addCombatMessage() {
      this.npc.triggers.combat.messages.push('');
    },

    removeCombatMessage(index) {
      this.$delete(this.npc.triggers.combat.messages, index);
    },
    
    addDrop() {
      this.npc.drops.push({ result: '', chance: -1 });
    },

    removeDrop(index) {
      this.$delete(this.npc.drops, index);
    },

    addCopyDrop() {
      this.npc.copyDrops.push({ result: '', chance: -1 });
    },

    removeCopyDrop(index) {
      this.$delete(this.npc.copyDrops, index);
    },

    addDropPoolItem() {
      this.npc.dropPool.items.push('');
    },

    removeDropPoolItem(index) {
      this.$delete(this.npc.dropPool.items, index);
    },

    addSackItem() {
      this.npc.items.sack.push({
        result: '',
        chance: -1
      });
    },

    removeSackItem(index) {
      this.$delete(this.npc.items.sack, index);
    },

    addEquipmentItem(slot) {
      this.npc.items.equipment[slot].push({
        result: '',
        chance: 1
      });
    },

    removeEquipmentItem(slot, index) {
      this.$delete(this.npc.items.equipment[slot], index);
    },

    addTrait(trait) {
      this.$set(this.npc.traitLevels, trait, 1);
    },

    removeTrait(trait) {
      this.$delete(this.npc.traitLevels, trait);
    },

    addUsableSkill() {
      this.npc.usableSkills.push({
        result: '',
        chance: 1
      });
    },

    removeUsableSkill(index) {
      this.$delete(this.npc.usableSkills, index);
    },

    addBaseEffect() {
      this.npc.baseEffects.push({
        name: '',
        endsAt: -1,
        extra: {
          damageType: '',
          potency: 1
        }
      });
    },

    removeBaseEffect(index) {
      this.$delete(this.npc.baseEffects, index);
    },
  }
};
</script>

<style scoped>
</style>
