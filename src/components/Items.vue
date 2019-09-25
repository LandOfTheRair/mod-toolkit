<template>
  <div>Items</div>

  <!--
    TODO
      - name
      - stats (split like monsters - main/alt stats)
      - randomStats (allow for clicking above to split a stat into min/max)
      - sprite (sprite picker)
      - binds/tellsBind
      - desc (add "You are looking at [desc]" so people can preview their desc)
      - value/sellValue
      - trait name/level (allow multiple names as array, and level as min/max)
      - effect name/potency/chance/duration/canApply/autocast
        - tooltip/message/stats if effect == Nourishment
        - tier/ignoreHPBoost
      - requirements (level, skill, profession, quest)
      - itemType (claw, arrow, etc)
      - archetype (fake property, maybe inherit from itemtype)
        - arrow: add shots, tier
        - weapon: add tier, returnsOnThrow
        - armor: maxEnchantLevel
        - gem: maxEncrusts, stats.effect
        - book: bookPages (id/text), bookItemFilter (required), bookFindablePages (optional)
        - trap: trapUses, effect.levelRequirement, effect.skillRequirement, effect.uses
        - page: extendedDesc, bookPage
      - cosmetic (name/isPermanent)
      - destroyOnDrop
      - isBeltable/isSackable
      - maxEnchantLevel
      - notUsableAfterHours
  -->
</template>

<script>
import { events } from "../main";

export default {
  name: "Items",

  props: ["items"]
};
</script>

<style scoped>
</style>
