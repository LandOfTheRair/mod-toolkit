<template>
  <div>
    <input
      type="file"
      multiple
      @change="uploadMap($event.target.files)"
      accept="application/json"
      ref="mapUpload"
      class="hidden"
    >

    <div class="true-center" v-if="maps.length === 0">No maps
      <br>

      <b-button variant="primary" @click="$refs.mapUpload.click()">Upload some</b-button>
    </div>

    <b-table v-if="maps.length" small :fields="tableFields" :items="maps">
      <template v-slot:head(actions)="data">
        <b-button size="sm" variant="success" @click="$refs.mapUpload.click()">Add</b-button>
      </template>

      <template v-slot:cell(name)="data">{{ data.item.name }}</template>

      <template v-slot:cell(actions)="data">
        <b-button size="sm" variant="danger" @click="removeMap(data.index)">Remove</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { events } from "../main";

export default {
  name: "Maps",

  props: ["maps"],

  data: function() {
    return {
      tableFields: [
        { key: "name", label: "Name" },
        { key: "actions", label: "Actions", class: "text-right" }
      ]
    };
  },

  methods: {
    uploadMap(files) {
      for (let i = 0; i < files.length; i++) {
        let file = this.$refs.mapUpload.files[i];
        if (!file || file.type !== "application/json") return;

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = evt => {
          try {
            const map = JSON.parse(evt.target.result);
            const mapName = files[i].name.split(".")[0];
            events.$emit("add:map", { name: mapName, map });
          } catch (e) {
            alert("Map upload error " + e);
          }
        };

        reader.onerror = evt => {
          alert("Map upload error " + evt);
        };
      }
    },

    removeMap(index) {
      if (!window.confirm("Are you sure you want to remove this map?")) return;

      this.mod.maps.splice(index, 1);
      this.persist();
    }
  }
};
</script>

<style scoped>
</style>
