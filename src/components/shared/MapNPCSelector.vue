<template>
  <b-form-group label-cols-md="3" :label="label">
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
    >
      <option :value="''">None</option>

      <option
        v-for="npc in baseNPCs"
        :value="npc"
        :key="npc"
      >{{ npc }}</option>
    </b-form-select>
  </b-form-group>
</template>

<script>
export default {
  name: 'MapNPCSelector',

  props: ['value', 'label', 'maps'],

  data() {
    return {
      baseNPCs: []
    };
  },

  created() {
    this.updateNPCs(this.maps);
  },

  methods: {
    updateNPCs(maps) {
      const npcNames = new Set();

      maps.forEach(map => {
        map.map.layers[9].objects.forEach(npc => {
          npcNames.add(npc.properties.tag);
        });
      });

      this.baseNPCs = [...npcNames].sort();
    }
  }
};
</script>

<style scoped>
</style>
