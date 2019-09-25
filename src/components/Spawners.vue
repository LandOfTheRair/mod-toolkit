<template>
  <div>Spawners [add npcs]</div>

  <!--
    TODO:
      - npcIds
      - respawnRate
      - initalSpawn
      - maxCreatures
      - spawnRadius
      - paths 
      - randomWalkRadius
      - leashRadius
      - alwaysSpawn
      - shouldSerialize
      - requireDeadToRespawn
      - shouldStrip
      - stripRadius
      - stripOnSpawner
      - stripX
      - stripY
      - eliteTickCap
      - isDangerous 
  -->
</template>

<script>
import { events } from '../main';

export default {
  name: "Spawners",

  props: ["spawners"]
};
</script>

<style scoped>
</style>
