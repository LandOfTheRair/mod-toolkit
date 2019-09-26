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
      <div class="d-block">
        <b-form>
        </b-form>
      </div>
    </b-modal>

    <b-table
      v-if="recipes.length"
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :fields="tableFields"
      :items="droptables"
    >
      <template v-slot:head(actions)="data">
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(actions)="data">
        <b-button class="mr-1" size="sm" variant="info" @click="copy(data.index)">Copy</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="edit(data.index)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(data.index)">Remove</b-button>
      </template>
    </b-table>
  </div>

  <!-- TODO:
    - recipe type
    - rest of recipe object
  -->
</template>

<script>
import get from "lodash.get";

import { clone } from "../helpers";
import { events } from "../main";

const defaultRecipe = {
  result: ""
};

export default {
  name: "Recipes",

  props: ["recipes", "items"],

  data: function() {
    return {
      sortBy: "name",
      sortDesc: false,
      tableFields: [
        { key: "result", label: "Item", sortable: true },
        { key: "actions", label: "Actions", class: "text-right" }
      ],
      isEditing: -1,
      recipe: clone(defaultRecipe)
    };
  },

  methods: {
    isValidRecipe(recipe) {
      const validKeys = ["result"];
      return validKeys.every(x => get(recipe, x));
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

    copy(index) {
      const recipe = this.recipes[index];
      events.$emit("add:recipe", { recipe: clone(recipe) });
    },

    edit(index) {
      this.recipe = clone(this.recipes[index]);
      this.isEditing = index;
      this.openModal();
    },

    remove(index) {
      if (!window.confirm("Are you sure you want to remove this recipe?")) return;
      events.$emit("remove:recipe", { index });
    }
  }
};
</script>

<style scoped>
</style>
