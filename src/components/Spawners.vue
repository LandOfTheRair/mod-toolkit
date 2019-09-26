<template>
  <div>
    <div class="true-center blank-slate" v-if="npcs.length === 0 && spawners.length === 0">
      Add NPCs first
    </div>

    <div class="true-center blank-slate" v-if="npcs.length && spawners.length === 0">No Spawners
      <br>

      <b-button variant="primary" @click="openModal()">Add one</b-button>
    </div>

    <b-modal
      size="xl"
      ref="modal"
      title="Add/Edit Spawner"
      ok-title="Save"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      cancel-variant="warning"
      body-class="p-0"
      @hide="reset()"
      @cancel="reset()"
      @close="reset()"
      @ok="confirm()"
      :ok-disabled="!isValidSpawner(spawner)"
    >
      <div class="d-block">
        <b-form>
        </b-form>
      </div>
    </b-modal>

    <b-table
      v-if="spawners.length"
      small
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :fields="tableFields"
      :items="spawners"
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

  <!--
    TODO:
      - npcIds
      - respawnRate
      - initalSpawn
      - maxCreatures
      - spawnRadius
      - paths 
      - randomWalkRadius
      - leashRadius
      - alwaysSpawn
      - shouldSerialize
      - requireDeadToRespawn
      - shouldStrip
      - stripRadius
      - stripOnSpawner
      - stripX
      - stripY
      - eliteTickCap
      - isDangerous 
  -->
</template>

<script>

import get from "lodash.get";

import { clone } from "../helpers";
import { events } from "../main";

const defaultSpawner = {
  npcIds: []
};

export default {
  name: "Spawners",

  props: ["spawners", "npcs"],

  data: function() {
    return {
      sortBy: "name",
      sortDesc: false,
      tableFields: [
        { key: "tag", label: "Name", sortable: true },
        { key: "actions", label: "Actions", class: "text-right" }
      ],
      isEditing: -1,
      spawner: clone(defaultSpawner)
    };
  },

  methods: {
    isValidSpawner(spawner) {
      const validKeys = ["npcIds"];
      return validKeys.every(x => get(spawner, x));
    },

    reset() {
      this.spawner = clone(defaultSpawner);
      this.isEditing = -1;
    },

    confirm() {
      events.$emit(`${this.isEditing >= 0 ? "edit" : "add"}:spawner`, {
        spawner: this.spawner,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(index) {
      const spawner = this.spawners[index];
      events.$emit("add:spawner", { spawner: clone(spawner) });
    },

    edit(index) {
      this.spawner = clone(this.spawners[index]);
      this.isEditing = index;
      this.openModal();
    },

    remove(index) {
      if (!window.confirm("Are you sure you want to remove this spawner?")) return;
      events.$emit("remove:spawner", { index });
    }
  }
};
</script>

<style scoped>
</style>
