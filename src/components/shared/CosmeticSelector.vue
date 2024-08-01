<template>
  <b-form-group
label-cols-md="3"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="cosmetics"
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
  name: 'CosmeticSelector',

  props: ['value', 'label'],

  data() {
    return {
      cosmetics: this.cosmetics || []
    };
  },

  created() {
    events.$on('json:items', this.updateCosmetics);

    window.api.send('JSON', { json: 'items' });
  },

  beforeDestroy() {
    events.$off('json:items', this.updateCosmetics);
  },

  methods: {
    updateCosmetics(items) {
      const cosmetics = new Set();
      items.forEach(item => {
        if(!item.cosmetic || !item.cosmetic.name) return;
        cosmetics.add(item.cosmetic.name);
      });

      this.cosmetics = [...cosmetics].sort();
    }
  }
};
</script>

<style scoped>
</style>
