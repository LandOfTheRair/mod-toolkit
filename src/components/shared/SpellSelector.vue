<template>
  <b-form-group
label-cols-md="3"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="spells"
    >
      <template #first>
        <option :value="''">None</option>
      </template>
    </b-form-select>
  </b-form-group>
</template>

<script>
import { events } from '../../main';

export default {
  name: 'SpellSelector',

  props: ['value', 'label'],

  data() {
    return {
      spells: this.spells || []
    };
  },

  created() {
    events.$on('json:spells', this.updateSpells);

    window.api.send('JSON', { json: 'spells' });
  },

  beforeDestroy() {
    events.$off('json:spells', this.updateSpells);
  },

  methods: {
    updateSpells(spells) {
      this.spells = Object.keys(spells).sort();
    }
  }
};
</script>

<style scoped>
</style>
