<template>
  <b-form-group
label-cols-md="3"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="slots"
    >
      <template #first>
        <option :value="''">None</option>
      </template>
    </b-form-select>
  </b-form-group>
</template>

<script>
export default {
  name: 'SlotSelector',

  props: ['value', 'label'],

  data() {
    return {
      slots: [
        { value: 'equipment.head',      text: 'Head' },
        { value: 'equipment.neck',      text: 'Neck' },
        { value: 'equipment.ear',       text: 'Ear' },
        { value: 'equipment.waist',     text: 'Waist' },
        { value: 'equipment.wrists',    text: 'Wrists' },
        { value: 'equipment.ring1',     text: 'Left Ring' },
        { value: 'equipment.ring2',     text: 'Right Ring' },
        { value: 'equipment.hands',     text: 'Hands' },
        { value: 'equipment.feet',      text: 'Feet' },
        { value: 'equipment.armor',     text: 'Armor' },
        { value: 'equipment.robe1',     text: 'Robe 1' },
        { value: 'equipment.robe2',     text: 'Robe 2' },
        { value: 'equipment.rightHand', text: 'Right Hand' },
        { value: 'equipment.leftHand',  text: 'Left Hand' },
        { value: 'equipment.trinket',   text: 'Trinket' },
        { value: 'equipment.potion',    text: 'Potion' },
        { value: 'equipment.ammo',      text: 'Ammo' },
      ]
    };
  }
};
</script>

<style scoped>
</style>
