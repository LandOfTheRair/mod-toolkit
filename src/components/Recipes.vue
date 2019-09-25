<template>
  <div>Recipes [add items]</div>

  <!--
    TODO:
    - type (alchemy, metalworking)
    - result (item from existing items, or warning)
    - skillGained
    - maxSkillForGains
    - xpGained
    - ingredients (max of 8)
  -->
</template>

<script>
import { events } from '../main';

export default {
  name: "Recipes",

  props: ["recipes"]
};
</script>

<style scoped>
</style>
