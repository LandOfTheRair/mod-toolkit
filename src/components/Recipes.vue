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
            <div class="col-6">
              <b-form-group label-cols-md="3" label="Tradeskill">
                <b-form-select v-model="recipe.recipeType" required>
                  <option :value="''">Choose tradeskill</option>
                  <option v-for="ts in recipeTypes" :value="ts" v-bind:key="ts">{{ ts }}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Item">
                <b-form-select v-model="recipe.item" required>
                  <option :value="''">Choose result item</option>
                  <option v-for="item in items" :value="item.name" v-bind:key="item.name">{{ item.name }}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Max skill">
                <b-form-input type="number" v-model="recipe.maxSkillForGains" placeholder="Max skill to gain skill from" min="0"></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Skill earned">
                <b-form-input type="number" v-model="recipe.skillGained" placeholder="Skill earned" min="0"></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="XP earned">
                <b-form-input type="number" v-model="recipe.xpGained" placeholder="XP earned" min="0"></b-form-input>
              </b-form-group>
            </div>

            <div class="col-5">
              <b-form-group label-cols-md="3" v-for="n in 8" v-bind:key="n">
                  <template v-slot:label>
                    Ingredient #{{ n }}
                  </template>
                <b-form-select v-model="recipe.ingredients[n - 1]" required>
                  <option :value="null">Choose ingredient #{{ n }}</option>
                  <option v-for="item in items" :value="item.name" v-bind:key="item.name">{{ item.name }}</option>
                </b-form-select>
              </b-form-group>
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
      <template v-slot:head(actions)="data">
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(ingredients)="data">
        <div v-for="(item, index) in data.item.ingredients" v-bind:key="index">{{ item }}</div>
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
import get from "lodash.get";

import { clone } from "../helpers";
import { events } from "../main";

const defaultRecipe = {
  item: "",
  skillGained: 0,
  maxSkillForGains: 0,
  xpGained: 0,
  ingredients: [],
  recipeType: ''
};

export default {
  name: "Recipes",

  props: ["recipes", "items"],

  data: function() {
    return {
      sortBy: "name",
      sortDesc: false,
      recipeTypes: ['alchemy', 'metalworking'],
      tableFields: [
        { key: "recipeType", label: "Recipe Type", sortable: true },
        { key: "item", label: "Item", sortable: true },
        { key: "ingredients", label: "Ingredients", sortable: true },
        { key: "actions", label: "Actions", class: "text-right" }
      ],
      isEditing: -1,
      recipe: clone(defaultRecipe)
    };
  },

  methods: {
    isValidRecipe(recipe) {
      const validKeys = ["item", "skillGained", "xpGained", "recipeType", "maxSkillForGains"];
      return validKeys.every(x => get(recipe, x)) && recipe.ingredients.filter(Boolean).length >= 2;
    },

    reset() {
      this.recipe = clone(defaultRecipe);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? "edit" : "add"}:recipe`, {
        recipe: this.recipe,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(recipe) {
      events.$emit("add:recipe", { recipe: clone(recipe) });
    },

    edit(recipe) {
      this.recipe = clone(recipe);
      this.isEditing = this.recipes.findIndex(x => x === recipe);;
      this.openModal();
    },

    remove(recipe) {
      if (!window.confirm("Are you sure you want to remove this recipe?")) return;
      events.$emit("remove:recipe", { index: this.recipes.findIndex(x => x === recipe) });
    }
  }
};
</script>

<style scoped>
</style>
