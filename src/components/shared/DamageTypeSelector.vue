<template>
  <b-form-group
label-cols-md="3"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="['physical', 'blunt', 'sharp', 'magical', 'necrotic', 'energy', 'disease', 'poison', 'water', 'fire', 'ice', 'heal', 'gm', 'sonic', 'turkey']"
    >
      <template #first>
        <option :value="''">None</option>
      </template>
    </b-form-select>
  </b-form-group>
</template>

<script>
export default {
  name: 'DamageTypeSelector',

  props: ['value', 'label']
};
</script>

<style scoped>
</style>
