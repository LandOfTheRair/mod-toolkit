<template>
  <b-form-group label-cols-md="3" :label="label">
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="['Mage', 'Thief', 'Healer', 'Warrior', 'Traveller']"
    >
      <template v-slot:first>
        <option :value="''">None</option>
      </template>
    </b-form-select>
  </b-form-group>
</template>

<script>
export default {
  name: 'ClassSelector',

  props: ['value', 'label'],
};
</script>

<style scoped>
</style>
