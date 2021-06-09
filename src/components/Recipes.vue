<template>
  <div>
    <div class="true-center blank-slate" v-if="items.length === 0 && recipes.length === 0">
      Add items first
    </div>

    <div class="true-center blank-slate" v-if="items.length && recipes.length === 0">No Recipes
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit Recipe"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidRecipe(recipe)"
    >
      <div class="d-block p-1">
        <b-form>
          <div class="row mt-3">
            <div class="col-4">
              <b-form-group label-cols-md="3" label="Tradeskill">
                <b-form-select v-model="recipe.recipeType" required>
                  <option :value="''">Choose tradeskill</option>
                  <option v-for="ts in recipeTypes" :value="ts" :key="ts">{{ ts }}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Item">
                <b-form-select v-model="recipe.item" required>
                  <option :value="''">Choose result item</option>
                  <option v-for="item in items" :value="item.name" :key="item.name">{{ item.name }}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Category">
                <b-form-input type="text" v-model="recipe.category" required placeholder="Display category for the recipe"></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Min Skill" class="multi">
                <b-form-input
                  type="number"
                  v-model="recipe.requireSkill"
                  min="0"
                  placeholder="Min Skill"
                ></b-form-input>
                <div class="split-label true-center">
                  <strong>Max</strong>
                </div>
                <b-form-input
                  type="number"
                  v-model="recipe.maxSkillForGains"
                  min="0"
                  placeholder="Max Skill"
                ></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Skill+" class="multi">
                <b-form-input type="number" v-model="recipe.skillGained" required placeholder="Skill Earned" min="0"></b-form-input>
                <div class="split-label true-center">
                  <strong>XP+</strong>
                </div>
                <b-form-input type="number" v-model="recipe.xpGained" required placeholder="XP Earned" min="0"></b-form-input>
              </b-form-group>

              <class-selector v-model="recipe.requireClass" label="Required Class" @change="recipe.requireClass = $event"></class-selector>

              <spell-selector v-model="recipe.requireSpell" label="Required Spell" @change="recipe.requireSpell = $event"></spell-selector>

              <div class="row mb-3">
                <b-form-checkbox v-model="recipe.requireLearn" class="col-md-4 offset-md-3">
                  <span v-b-tooltip.hover title="Recipe must be learned from a recipe book">Must Learn</span>
                </b-form-checkbox>

                <b-form-checkbox v-model="recipe.copySkillToPotency" class="col-md-5">
                  <span v-b-tooltip.hover title="Potency of the resulting item useEffect is scaled by your tradeskill">Skill → Potency</span>
                </b-form-checkbox>
              </div>

              <b-form-group label-cols-md="3" label="Potency Scalar" v-if="recipe.copySkillToPotency">
                <b-form-input type="number" v-model="recipe.potencyScalar" required placeholder="Potency Scalar" min="0"></b-form-input>
              </b-form-group>

              <item-selector v-model="recipe.transferOwnerFrom" label="Transfer Owner" @change="recipe.transferOwnerFrom = $event"></item-selector>
            </div>

            <div class="col-4">
              <item-selector v-for="n in 8" :key="n" v-model="recipe.ingredients[n - 1]" :label="'Ing. #' + n" @change="recipe.ingredients[n - 1] = $event" :modItems="items"></item-selector>
            </div>

            <div class="col-4">
              <div v-for="n in 2" :key="n">
                <div v-if="recipe.ozIngredients[n - 1]">
                  <b-form-group label-cols-md="3" :label="'#' + n + ' Item Filter'">
                    <b-form-input type="text" v-model="recipe.ozIngredients[n - 1].filter" required placeholder="Item Filter"></b-form-input>
                  </b-form-group>
                  
                  <item-selector v-model="recipe.ozIngredients[n - 1].display" :label="'#' + n + ' Visual'" @change="recipe.ingredients[n - 1].display = $event" :modItems="items"></item-selector>

                  <b-form-group label-cols-md="3" :label="'#' + n + ' Ounces'">
                    <b-form-input type="number" v-model="recipe.ozIngredients[n - 1].ounces" required placeholder="Ounces Required" min="0"></b-form-input>
                  </b-form-group>

                  <hr v-if="n !== 2">
                </div>
              </div>
            </div>
          </div>
        </b-form>
      </div>
    </b-modal>

    <b-table
      v-if="recipes.length"
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :fields="tableFields"
      :items="recipes"
    >
      <template v-slot:head(actions)>
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(ingredients)="data">
        <div v-for="(item, index) in data.item.ingredients" :key="index">{{ item }}</div>
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

import { clone } from '../helpers';
import { events } from '../main';

import ItemSelector from './shared/ItemSelector.vue';
import SpellSelector from './shared/SpellSelector.vue';
import ClassSelector from './shared/ClassSelector.vue';

const defaultRecipe = {
  item: '',
  skillGained: 0,
  requireSkill: 0,
  maxSkillForGains: 4,
  xpGained: 0,
  ingredients: [],
  ozIngredients: [],
  recipeType: '',
  category: '',
  requireClass: '',
  requireLearn: false,
  requireSpell: '',
  copySkillToPotency: false,
  potencyScalar: 0,
  transferOwnerFrom: ''
};

export default {
  name: 'Recipes',

  props: ['recipes', 'items'],

  components: { ItemSelector, ClassSelector, SpellSelector },

  data() {
    return {
      sortBy: 'name',
      sortDesc: false,
      recipeTypes: ['alchemy', 'metalworking', 'spellforging'],
      tableFields: [
        { key: 'recipeType', label: 'Recipe Type', sortable: true },
        { key: 'item', label: 'Item', sortable: true },
        { key: 'ingredients', label: 'Ingredients', sortable: true },
        { key: 'actions', label: 'Actions', class: 'text-right' }
      ],
      isEditing: -1,
      recipe: this.preRecipe(clone(defaultRecipe))
    };
  },

  methods: {
    preRecipe(recipe) {
      for(let i = 0; i < 8; i++) {
        recipe.ingredients[i] = recipe.ingredients[i] || '';
      }

      for(let i = 0; i < 4; i++) {
        recipe.ozIngredients[i] = recipe.ozIngredients[i] || { filter: '', ounces: 0, display: '' };
      }

      return recipe;
    },

    postRecipe(recipe) {
      recipe.ingredients = recipe.ingredients.filter(Boolean);
      recipe.ozIngredients = recipe.ozIngredients.filter(x => x.ounces > 0);

      return recipe;
    },

    isValidRecipe(recipe) {
      const validKeys = ['item', 'skillGained', 'xpGained', 'recipeType', 'maxSkillForGains'];
      return validKeys.every(x => get(recipe, x)) && recipe.ingredients.filter(Boolean).length >= 2;
    },

    reset() {
      this.recipe = this.preRecipe(clone(defaultRecipe));
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? 'edit' : 'add'}:recipe`, {
        recipe: this.postRecipe(this.recipe),
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(recipe) {
      events.$emit('add:recipe', { recipe: clone(recipe) });
    },

    edit(recipe) {
      this.recipe = this.preRecipe(clone(recipe));
      this.isEditing = this.recipes.findIndex(x => x === recipe);
      this.openModal();
    },

    async remove(recipe) {
      const willRemove = await this.$dialog.confirm({ title: 'Remove Recipe?', text: 'Are you sure you want to remove this recipe?' });
      if(!willRemove) return;

      events.$emit('remove:recipe', { index: this.recipes.findIndex(x => x === recipe) });
    }
  }
};
</script>

<style scoped>
</style>
