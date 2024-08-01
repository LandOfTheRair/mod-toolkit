<template>
  <b-form-group
label-cols-md="3"
:label="label"
>
    <b-form-select
      :value="value"
      @change="$emit('change', $event)"
      required
      :options="sfxs"
    >
      <template #first>
        <option :value="''">None</option>
      </template>
    </b-form-select>
  </b-form-group>
</template>

<script>
export default {
  name: 'SfxSelector',

  props: ['value', 'label'],

  data() {
    return {
      sfxs: [
        'combat-block-armor',
        'combat-block-weapon',
        'combat-die',
        'combat-hit-melee',
        'combat-hit-spell',
        'combat-kill',
        'combat-miss',
        'combat-special-blunderbuss',

        'env-door-close',
        'env-door-open',
        'env-stairs',

        'monster-bear',
        'monster-bird',
        'monster-dragon',
        'monster-ghost',
        'monster-goblin',
        'monster-rocks',
        'monster-skeleton',
        'monster-turkey',
        'monster-wolf',

        'spell-aoe-fire',
        'spell-aoe-frost',
        'spell-buff-magical',
        'spell-buff',
        'spell-buff-physical',
        'spell-buff-protection',
        'spell-conjure',
        'spell-debuff-give',
        'spell-debuff-receive',
        'spell-heal',
        'spell-sight-effect',
        'spell-special-revive',
        'spell-special-teleport'
      ]
    };
  }
};
</script>

<style scoped>
</style>
