<template>
  <b-form-group
label-cols-md="3"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
    >
        <option :value="''">None</option>

        <optgroup
label="My NPCs"
:key="'My NPCs'"
>
          <option
            v-for="npc in modNPCs"
            :value="npc.npcId"
            :key="npc.npcId"
          >{{ npc.npcId }}</option>
        </optgroup>

        <optgroup
label="Core NPCs"
:key="'Core NPCs'"
>
          <option
            v-for="npc in baseNPCs"
            :value="npc"
            :key="npc"
          >{{ npc }}</option>
        </optgroup>
    </b-form-select>
  </b-form-group>
</template>

<script>
import { events } from '../../main';

export default {
  name: 'NPCSelector',

  props: ['value', 'label', 'modNPCs'],

  data() {
    return {
      baseNPCs: this.npcs || []
    };
  },

  created() {
    events.$on('json:npcs', this.updateNPCs);

    window.api.send('JSON', { json: 'npcs' });
  },

  beforeDestroy() {
    events.$off('json:npcs', this.updateNPCs);
  },

  methods: {
    updateNPCs(npcs) {
      const npcNames = new Set();

      npcs.forEach(npc => {
        npcNames.add(npc.npcId);
      });

      this.baseNPCs = [...npcNames].sort();
    }
  }
};
</script>

<style scoped>
</style>
