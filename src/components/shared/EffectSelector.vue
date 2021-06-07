<template>
  <b-form-group label-cols-md="3" :label="label">
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="effects"
    >
      <template v-slot:first>
        <option :value="''">None</option>
      </template>
    </b-form-select>
  </b-form-group>
</template>

<script>
import { events } from '../../main';

export default {
  name: 'EffectSelector',

  props: ['value', 'label'],

  data() {
    return {
      effects: this.effects || []
    };
  },

  created() {
    events.$on('json:effect-data', this.updateEffects);

    window.api.send('JSON', { json: 'effect-data' });
  },

  beforeDestroy() {
    events.$off('json:effect-data', this.updateEffects);
  },

  methods: {
    updateEffects(effects) {
      this.effects = Object.keys(effects).sort();
    }
  }
};
</script>

<style scoped>
</style>
