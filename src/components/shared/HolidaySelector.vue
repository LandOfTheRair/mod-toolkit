<template>
  <b-form-group
label-cols-md="3"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="holidays"
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
  name: 'HolidaySelector',

  props: ['value', 'label'],

  data() {
    return {
      holidays: this.holidays || []
    };
  },

  created() {
    events.$on('json:holidaydescs', this.updateHolidays);

    window.api.send('JSON', { json: 'holidaydescs' });
  },

  beforeDestroy() {
    events.$off('json:holidaydescs', this.updateHolidays);
  },

  methods: {
    updateHolidays(holidays) {
      this.holidays = Object.keys(holidays).map(x => ({ value: x, text: holidays[x].name }));
    }
  }
};
</script>

<style scoped>
</style>
