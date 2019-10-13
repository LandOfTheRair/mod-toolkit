<template>
  <div>
    <div
      class="true-center blank-slate"
      v-if="npcs.length === 0 && spawners.length === 0"
    >Add NPCs first</div>

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
      <div class="d-block p-1">
        <b-form>
          <div class="row mt-3">
            <div class="col-4">
              <b-form-group label-cols-md="3" label="Tag">
                <b-form-input type="text" v-model="spawner.tag" placeholder="Enter spawner tag"></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Respawn Rate (sec)">
                <b-form-input
                  type="number"
                  v-model="spawner.respawnRate"
                  min="0"
                  placeholder="Respawn rate"
                ></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Spawn Radius">
                <b-form-input
                  type="number"
                  v-model="spawner.spawnRadius"
                  min="0"
                  placeholder="Spawn radius"
                ></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Walk Radius" class="multi">
                <b-form-input
                  type="number"
                  v-model="spawner.randomWalkRadius"
                  min="0"
                  placeholder="Walk radius"
                ></b-form-input>
                <div class="split-label true-center">
                  <strong>Leash</strong>
                </div>
                <b-form-input
                  type="number"
                  v-model="spawner.leashRadius"
                  min="0"
                  placeholder="Leash radius"
                ></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Initial Spawn" class="multi">
                <b-form-input
                  type="number"
                  v-model="spawner.initialSpawn"
                  min="0"
                  placeholder="# spawned"
                ></b-form-input>
                <div class="split-label true-center">
                  <strong>Max</strong>
                </div>
                <b-form-input
                  type="number"
                  v-model="spawner.maxCreatures"
                  min="0"
                  placeholder="# max"
                ></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Elite Tick Cap">
                <b-form-input
                  type="number"
                  v-model="spawner.eliteTickCap"
                  min="0"
                  placeholder="Elite tick cap"
                ></b-form-input>
              </b-form-group>

              <div class="row mb-3">
                <b-form-checkbox v-model="spawner.alwaysSpawn" class="col-md-4 offset-md-3">
                  <span
                    v-b-tooltip.hover
                    title="Creatures will always spawn from this spawner. Useful for lairs/resources."
                  >Always Spawn</span>
                </b-form-checkbox>

                <b-form-checkbox v-model="spawner.shouldSerialize" class="col-md-5">
                  <span
                    v-b-tooltip.hover
                    title="Spawner will persist. Useful for lairs/resources."
                  >Should Save</span>
                </b-form-checkbox>
              </div>

              <div class="row mb-3">
                <b-form-checkbox
                  v-model="spawner.requireDeadToRespawn"
                  class="col-md-9 offset-md-3"
                >
                  <span
                    v-b-tooltip.hover
                    title="Spawner will only spawn a creature if creature is dead. Useful for lairs/resources."
                  >Require Dead To Respawn</span>
                </b-form-checkbox>
              </div>

              <b-form-group label-cols-md="3" label="Paths">
                <b-form-textarea
                  v-model="spawner._paths"
                  rows="4"
                  max-rows="4"
                  placeholder="Enter spawner paths (2-N 3-W 5-E 6-S)"
                ></b-form-textarea>
              </b-form-group>
            </div>

            <div class="col-4">
              <div class="row mb-3">
                <div class="col">
                  <div class="offset-md-3">
                    <b-button variant="info" block @click="makeLair()">Make Lair-like Spawner</b-button>
                  </div>
                </div>
              </div>

              <b-form-group label-cols-md="3" label="Strip Radius">
                <b-form-input
                  type="number"
                  v-model="spawner.stripRadius"
                  min="0"
                  placeholder="Strip Radius"
                ></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Strip X" class="multi">
                <b-form-input
                  type="number"
                  v-model="spawner.stripX"
                  placeholder="X"
                  min="0"
                  @change.native="spawner.stripOnSpawner = false"
                ></b-form-input>
                <div class="split-label true-center">
                  <strong>Strip Y</strong>
                </div>
                <b-form-input
                  type="number"
                  v-model="spawner.stripY"
                  placeholder="Y"
                  min="0"
                  @change.native="spawner.stripOnSpawner = false"
                ></b-form-input>
              </b-form-group>

              <b-form-group label-cols-md="3" label="Eat Tier">
                <b-form-input
                  type="number"
                  v-model="spawner.shouldEatTier"
                  min="0"
                  placeholder="(5 * tier)% lost"
                ></b-form-input>
              </b-form-group>

              <div class="row mb-3">
                <b-form-checkbox v-model="spawner.isDangerous" class="col-md-9 offset-md-3">
                  <span
                    v-b-tooltip.hover
                    title="Creatures from this spawner are marked as Dangerous"
                  >Dangerous Creatures</span>
                </b-form-checkbox>
              </div>

              <div class="row mb-3">
                <b-form-checkbox v-model="spawner.shouldStrip" class="col-md-9 offset-md-3">
                  <span
                    v-b-tooltip.hover
                    title="Creatures from this spawner will always strip the player"
                  >Should Strip</span>
                </b-form-checkbox>
              </div>

              <div class="row mb-3">
                <b-form-checkbox v-model="spawner.stripOnSpawner" class="col-md-9 offset-md-3">
                  <span
                    v-b-tooltip.hover
                    title="Stripping will happen on the spawner"
                  >Strip On Spawner</span>
                </b-form-checkbox>
              </div>
            </div>

            <div class="col-4">
              <div class="row">
                <div class="col-md-12">
                  <b-input-group>
                    <b-form-select v-model="currentAddNPC" required :options="npcNames">
                      <template v-slot:first>
                        <option :value="''">Custom NPC</option>
                      </template>
                    </b-form-select>

                    <b-input-group-append>
                      <b-button variant="primary" @click="addNPC(currentAddNPC)">Add</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </div>
              </div>

              <div class="row mt-1" v-for="(npc, index) in spawner.npcIds" v-bind:key="index">
                <div class="col-6">
                  <b-form-input type="text" v-model="npc.name" placeholder="NPC ID"></b-form-input>
                </div>
                <div class="col-3">
                  <b-form-input type="number" v-model="npc.chance" placeholder="Weight"></b-form-input>
                </div>
                <div class="col-2">
                  <b-button variant="danger" @click="removeNPC(index)">Del</b-button>
                </div>
              </div>
            </div>
          </div>
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

      <template v-slot:cell(respawnRate)="data">{{ data.item.respawnRate }}sec</template>

      <template v-slot:cell(isDangerous)="data">{{ data.item.isDangerous ? 'Yes' : 'No' }}</template>

      <template v-slot:cell(npcIds)="data">
        <div v-for="(item, index) in data.item.npcIds" v-bind:key="index">{{ item.name }}</div>
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

const defaultSpawner = {
  npcIds: [],
  respawnRate: 120,
  randomWalkRadius: 10,
  leashRadius: 20,
  eliteTickCap: 50,
  initialSpawn: 0,
  spawnRadius: 0,
  maxCreatures: 5,
  stripRadius: 0,
  _paths: ""
};

export default {
  name: "Spawners",

  props: ["spawners", "npcs"],

  data: function() {
    return {
      sortBy: "name",
      sortDesc: false,
      tableFields: [
        { key: "tag", label: "Tag", sortable: true },
        { key: "respawnRate", label: "Respawn", sortable: true },
        { key: "npcIds", label: "NPCs", sortable: true },
        { key: "isDangerous", label: "Dangerous?", sortable: true },
        { key: "actions", label: "Actions", class: "text-right" }
      ],
      isEditing: -1,
      spawner: clone(defaultSpawner),
      currentAddNPC: ""
    };
  },

  computed: {
    npcNames() {
      return this.npcs.map(npc => npc.npcId);
    }
  },

  methods: {
    isValidSpawner(spawner) {
      const validKeys = ["npcIds", "tag"];
      return validKeys.every(x => get(spawner, x));
    },

    reset() {
      this.spawner = clone(defaultSpawner);
      this.isEditing = -1;
    },

    confirm() {
      this.spawner.paths = this.spawner._paths
        ? this.spawner._paths.split("\n")
        : [];
      delete this.spawner._paths;

      events.$emit(`${this.isEditing >= 0 ? "edit" : "add"}:spawner`, {
        spawner: this.spawner,
        index: this.isEditing
      });
    },

    openModal() {
      this.$refs.modal.show();
    },

    copy(spawner) {
      events.$emit("add:spawner", { spawner: clone(spawner) });
    },

    edit(spawner) {
      this.spawner = clone(spawner);
      this.spawner._paths = this.spawner.paths
        ? this.spawner.paths.join("\n")
        : "";
      this.isEditing = this.spawners.findIndex(x => x === spawner);
      this.openModal();
    },

    remove(spawner) {
      if (!window.confirm("Are you sure you want to remove this spawner?"))
        return;
      events.$emit("remove:spawner", {
        index: this.spawners.findIndex(x => x === spawner)
      });
    },

    makeLair() {
      this.spawner.alwaysSpawn = true;
      this.spawner.shouldSerialize = true;
      this.spawner.requireDeadToRespawn = true;
      this.spawner.initalSpawn = 1;
      this.spawner.maxCreatures = 1;
      this.spawner.shouldStrip = true;
      this.spawner.isDangerous = true;
      this.spawner.stripRadius = 1;
    },

    addNPC(npc) {
      this.spawner.npcIds = this.spawner.npcIds || [];
      this.spawner.npcIds.push({ name: npc, chance: 1 });
    },

    removeNPC(index) {
      this.spawner.npcIds.splice(index, 1);
    }
  }
};
</script>

<style scoped>
</style>
