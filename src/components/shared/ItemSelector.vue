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
label="My Items"
:key="'My Items'"
>
          <option
            v-for="item in modItems"
            :value="item.name"
            :key="item.name"
          >{{ item.name }}</option>
        </optgroup>

        <optgroup
label="Core Items"
:key="'Core Items'"
>
          <option
            v-for="item in baseItems"
            :value="item"
            :key="item"
          >{{ item }}</option>
        </optgroup>
    </b-form-select>
  </b-form-group>
</template>

<script>
import { events } from '../../main';

export default {
  name: 'ItemSelector',

  props: ['value', 'label', 'modItems'],

  data() {
    return {
      baseItems: this.items || []
    };
  },

  created() {
    events.$on('json:items', this.updateItems);

    window.api.send('JSON', { json: 'items' });
  },

  beforeDestroy() {
    events.$off('json:items', this.updateItems);
  },

  methods: {
    updateItems(items) {
      const itemNames = new Set();

      items.forEach(item => {
        itemNames.add(item.name);
      });

      this.baseItems = [...itemNames].sort();
    }
  }
};
</script>

<style scoped>
</style>
