<template>
  <b-form-group
:label-cols-md="label ? 3 : 0"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="stats"
    >
      <template #first>
        <option :value="''">None</option>
      </template>
    </b-form-select>
  </b-form-group>
</template>

<script>
import {
  coreStats,
  extraStats
} from '../../constants';

export default {
  name: 'StatSelector',

  props: ['value', 'label'],

  data() {
    return {
      stats: [...coreStats.map(x => x.stat), ...extraStats.map(x => x.stat)]
    };
  }
};
</script>

<style scoped>
</style>
