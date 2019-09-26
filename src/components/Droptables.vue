<template>
  <div>
    <div class="true-center blank-slate" v-if="items.length === 0 && maps.length === 0 && droptables.length === 0">
      Add items & maps first
    </div>

    <div class="true-center blank-slate" v-if="items.length && maps.length && droptables.length === 0">No Droptables
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit Droptable"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidDroptable(droptable)"
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
      v-if="droptables.length"
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :fields="tableFields"
      :items="droptables"
    >
      <template v-slot:head(actions)="data">
        <b-button size="sm" variant="success" @click="openModal()">Add</b-button>
      </template>

      <template v-slot:cell(chance)="data">1/{{ data.item.chance }}</template>

      <template v-slot:cell(actions)="data">
        <b-button class="mr-1" size="sm" variant="info" @click="copy(data.index)">Copy</b-button>
        <b-button class="mr-1" size="sm" variant="info" @click="edit(data.index)">Edit</b-button>
        <b-button size="sm" variant="danger" @click="remove(data.index)">Remove</b-button>
      </template>
    </b-table>
  </div>
  <!--
  TODO:
    - map drop section (Choose map)
    - region drop section (choose region from uploaded maps)

    array: {result/maxChance} (chance always set to 1)
  -->
</template>

<script>
import get from "lodash.get";

import { clone } from "../helpers";
import { events } from "../main";

const defaultDroptable = {
  result: "",
  chance: 1,
  mapName: "",
  regionName: ""
};

export default {
  name: "Droptables",

  props: ["droptables", "maps", "items"],

  data: function() {
    return {
      sortBy: "name",
      sortDesc: false,
      tableFields: [
        { key: "result", label: "Item", sortable: true },
        { key: "chance", label: "Chance", sortable: true },
        { key: "mapName", label: "Map", sortable: true },
        { key: "regionName", label: "Region", sortable: true },
        { key: "actions", label: "Actions", class: "text-right" }
      ],
      isEditing: -1,
      droptable: clone(defaultDroptable)
    };
  },

  methods: {
    isValidDroptable(droptable) {
      const validKeys = ["result"];
      return validKeys.every(x => get(droptable, x));
    },

    reset() {
      this.droptable = clone(defaultDroptable);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? "edit" : "add"}:droptable`, {
        droptable: this.droptable,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(index) {
      const droptable = this.droptables[index];
      events.$emit("add:droptable", { droptable: clone(droptable) });
    },

    edit(index) {
      this.droptable = clone(this.droptables[index]);
      this.isEditing = index;
      this.openModal();
    },

    remove(index) {
      if (!window.confirm("Are you sure you want to remove this droptable?")) return;
      events.$emit("remove:droptable", { index });
    }
  }
};
</script>

<style scoped>
</style>
