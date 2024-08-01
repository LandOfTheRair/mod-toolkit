<template>
  <b-form-group
label-cols-md="3"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="traits"
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
  name: 'TraitSelector',

  props: ['value', 'label'],

  data() {
    return {
      traits: this.traits || []
    };
  },

  created() {
    events.$on('json:traits', this.updateTraits);

    window.api.send('JSON', { json: 'traits' });
  },

  beforeDestroy() {
    events.$off('json:traits', this.updateTraits);
  },

  methods: {
    updateTraits(traits) {
      this.traits = Object.keys(traits).sort();
    }
  }
};
</script>

<style scoped>
</style>
