
const sortBy = require('lodash.sortby');

export const coreStats = sortBy([
  { stat: 'str', help: 'Core Stat - used for attack damage' },
  { stat: 'dex', help: 'Core Stat - used for attack to-hit' },
  { stat: 'agi', help: 'Core Stat - used for attack dodging' },
  { stat: 'int', help: 'Core Stat - used for mage-like attacks' },
  { stat: 'wis', help: 'Core Stat - used for healer-like attacks' },
  { stat: 'wil', help: 'Core Stat - used to resist magical attacks' },
  { stat: 'con', help: 'Core Stat - used to resist physical effects' },
  { stat: 'luk', help: 'Core Stat - used for a few things' },
  { stat: 'cha', help: 'Core Stat - used to determine some shop costs' }
], 'stat');

export const extraStats = sortBy([
  { stat: 'move', help: 'Adds additional movement (cap of 4)' },
  { stat: 'hp', help: 'Adds bonus HP' },
  { stat: 'hpregen', help: 'Adds bonus HP regen' },
  { stat: 'mp', help: 'Adds bonus MP for magical classes' },
  { stat: 'mpregen', help: 'Adds bonus MP regen for magical classes' },
  {
    stat: 'weaponDamageRolls',
    help: 'Adds additional damage rolls for weapon melee attacks'
  },
  {
    stat: 'weaponArmorClass',
    help: 'Adds additional chance for weapon blocks to occur'
  },
  {
    stat: 'armorClass',
    help: 'Adds additional chance for armor blocks to occur'
  },
  { stat: 'accuracy', help: 'Adds additional chance to hit in melee combat' },
  { stat: 'offense', help: 'Adds additional offensive combat rolls' },
  { stat: 'defense', help: 'Adds additional defensive combat rolls' },
  { stat: 'stealth', help: 'Adds additional stealth to avoid being detected' },
  {
    stat: 'perception',
    help: 'Adds additional perception to detect hidden enemies'
  },
  { stat: 'physicalDamageBoost', help: 'Adds raw physical damage' },
  { stat: 'magicalDamageBoost', help: 'Adds raw magical damage' },
  { stat: 'healingBoost', help: 'Adds raw healing power boost' },
  { stat: 'necroticBoostPercent', help: 'Adds raw necrotic damage (%)' },
  { stat: 'energyBoostPercent', help: 'Adds raw energy damage (%)' },
  { stat: 'diseaseBoostPercent', help: 'Adds raw disease damage (%)' },
  { stat: 'poisonBoostPercent', help: 'Adds raw poison damage (%)' },
  { stat: 'sonicBoostPercent', help: 'Adds raw sonic damage (%)' },
  { stat: 'waterBoostPercent', help: 'Adds raw water damage (%)' },
  { stat: 'fireBoostPercent', help: 'Adds raw fire damage (%)' },
  { stat: 'iceBoostPercent', help: 'Adds raw ice damage (%)' },
  {
    stat: 'physicalDamageReflect',
    help: 'Adds damage reflect when taking physical damage'
  },
  {
    stat: 'magicalDamageReflect',
    help: 'Adds damage reflect when taking magical damage'
  },
  {
    stat: 'spellReflectChance',
    help: 'Adds chance of reflecting incoming spells'
  },
  { stat: 'mitigation', help: 'Negates a percentage of damage' },
  { stat: 'physicalResist', help: 'Resist a raw amount of physical damage' },
  { stat: 'magicalResist', help: 'Resist a raw amount of magical damage' },
  { stat: 'necroticResist', help: 'Resist a raw amount of necrotic damage' },
  { stat: 'energyResist', help: 'Resist a raw amount of energy damage' },
  { stat: 'waterResist', help: 'Resist a raw amount of water damage' },
  { stat: 'fireResist', help: 'Resist a raw amount of fire damage' },
  { stat: 'iceResist', help: 'Resist a raw amount of ice damage' },
  { stat: 'poisonResist', help: 'Resist a raw amount of poison damage' },
  {
    stat: 'actionSpeed',
    help: 'Add additional actions per round (similar to Haste)'
  },
  { stat: 'threatMultiplier', help: 'Multiply generated threat by a raw multiplier' },
  { stat: 'damageFactor', help: 'Multiply damage by a raw multiplier' },
  { stat: 'xpBonusPercent', help: 'Multiply gained XP by a raw multiplier' },
  { stat: 'skillBonusPercent', help: 'Multiply gained skill by a raw multiplier' },
  { stat: 'spellCriticalPercent', help: 'Increase the chances of getting a critical spell strike' },
  { stat: 'savingThrow', help: 'Increase the chances of negating some spells' },
  { stat: 'maceBonus', help: 'Increase the mace skill of the target' },
  { stat: 'axeBonus', help: 'Increase the axe skill of the target' },
  { stat: 'daggerBonus', help: 'Increase the dagger skill of the target' },
  { stat: 'swordBonus', help: 'Increase the sword skill of the target' },
  { stat: 'shortswordBonus', help: 'Increase the shortsword skill of the target' },
  { stat: 'polearmBonus', help: 'Increase the polearm skill of the target' },
  { stat: 'wandBonus', help: 'Increase the wand skill of the target' },
  { stat: 'staffBonus', help: 'Increase the staff skill of the target' },
  { stat: 'martialBonus', help: 'Increase the martial skill of the target' },
  { stat: 'rangedBonus', help: 'Increase the ranged skill of the target' },
  { stat: 'throwingBonus', help: 'Increase the throwing skill of the target' },
  { stat: 'twohandedBonus', help: 'Increase the twohanded skill of the target' },
  { stat: 'thieveryBonus', help: 'Increase the thievery skill of the target' },
  { stat: 'conjurationBonus', help: 'Increase the conjuration skill of the target' },
  { stat: 'restorationBonus', help: 'Increase the restoration skill of the target' }
], 'stat');

export const damageClasses = sortBy([
  'physical',
  'necrotic',
  'energy',
  'water',
  'fire',
  'ice',
  'poison',
  'disease',
  'sonic'
]);

export const gearSlots = [
  'gear.rightHand',
  'gear.leftHand',
  'gear.Armor',
  'gear.Robe1',
  'gear.Robe2',
  'gear.Ring1',
  'gear.Ring2',
  'gear.Head',
  'gear.Neck',
  'gear.Waist',
  'gear.Wrists',
  'gear.Hands',
  'gear.Feet',
  'gear.Ear'
];

export const itemClasses = [
  'Abacus',
  'Book',
  'Bottle',
  'Box',
  // 'Coin',
  // 'Corpse',
  'Flower',
  'Food',
  'Gem',
  'Key',
  'Rock',
  'Scale',
  'Scroll',
  'Trap',
  'Twig'
];

export const weaponClasses = [
  'Arrow',
  'Axe',
  'Blunderbuss',
  'Broadsword',
  'Claws',
  'Club',
  'Crossbow',
  'Dagger',
  'Flail',
  'Gloves',
  'Greataxe',
  'Greatmace',
  'Greatsword',
  'Halberd',
  'Hammer',
  'Longbow',
  'Longsword',
  'Mace',
  'Saucer',
  'Shield',
  'Shortbow',
  'Shortsword',
  'Spear',
  'Staff',
  'Totem',
  'Wand'
];

export const armorClasses = [
  'Amulet',
  'Bracers',
  'Boots',
  'Breastplate',
  'Claws',
  'Cloak',
  'Earring',
  'Fullplate',
  'Fur',
  'Gloves',
  'Hat',
  'Helm',
  'Robe',
  'Ring',
  'Sash',
  'Saucer',
  'Scaleplate',
  'Skull',
  'Tunic'
];

export const itemTypes = [
  'Axe',
  'Conjuration',
  'Dagger',
  'Mace',
  'Martial',
  'Polearm',
  'Ranged',
  'Restoration',
  'Shortsword',
  'Staff',
  'Sword',
  'Thievery',
  'Throwing',
  'Twohanded',
  'Wand'
];

export const typePropSets = {
  Arrow: ['shots', 'tier', 'damageClass'],
  Bottle: ['ounces'],
  Food: ['ounces'],
  Gem: ['maxEncrusts'],
  Book: ['bookPages', 'bookItemFilter', 'bookFindablePages'],
  Trap: ['trapUses'],
  Scroll: ['bookPage']
};

export const typePropDefaults = {
  Arrow: { shots: 1000, tier: 1, damageClass: 'physical' },
  Bottle: { ounces: 1 },
  Food: { ounces: 1 },
  Gem: { maxEncrusts: 5 },
  Book: { bookPages: 1, bookItemFilter: '', bookFindablePages: '' },
  Trap: { trapUses: 1 },
  Twig: { type: 'Staff' }
};

const typePropPrimarySecondary = {
  Axe: { p: 'Axe' },
  Blunderbuss: { p: 'Ranged', s: 'Twohanded' },
  Broadsword: { p: 'Sword' },
  Club: { p: 'Mace' },
  Crossbow: { p: 'Ranged' },
  Dagger: { p: 'Dagger' },
  Flail: { p: 'Mace' },
  Greataxe: { p: 'Axe', s: 'Twohanded' },
  Greatmace: { p: 'Mace', s: 'Twohanded' },
  Greatsword: { p: 'Twohanded' },
  Halberd: { p: 'Polearm', s: 'Twohanded' },
  Hammer: { p: 'Mace' },
  Longbow: { p: 'Ranged', s: 'Twohanded' },
  Longsword: { p: 'Sword' },
  Mace: { p: 'Mace' },
  Shield: { p: 'Mace' },
  Shortbow: { p: 'Ranged' },
  Shortsword: { p: 'Shortsword' },
  Spear: { p: 'Staff' },
  Staff: { p: 'Staff' },
  Totem: { p: 'Wand' },
  Wand: { p: 'Wand' }
};

itemClasses.forEach(itemType => {
  typePropDefaults[itemType] = typePropDefaults[itemType] || {};

  typePropDefaults[itemType].isSackable = true;
});

weaponClasses.forEach(weaponType => {
  typePropSets[weaponType] = typePropSets[weaponType] || [];
  typePropDefaults[weaponType] = typePropDefaults[weaponType] || {};
  typePropDefaults[weaponType].stats = typePropDefaults[weaponType].stats || {};

  typePropSets[weaponType].push(
    'tier',
    'damageClass',
    'proneChance',
    'attackRange',
    'isHeavy',
    'twoHanded',
    'offhand',
    'returnsOnThrow',
    'canShoot'
  );

  typePropDefaults[weaponType].tier = 1;
  typePropDefaults[weaponType].damageClass = 'physical';
  typePropDefaults[weaponType].proneChance = 0;
  typePropDefaults[weaponType].attackRange = 0;
  typePropDefaults[weaponType].isBeltable = true;
  typePropDefaults[weaponType].isSackable = false;

  if (weaponType === 'Arrow') {
    typePropDefaults[weaponType].isBeltable = true;
    typePropDefaults[weaponType].isSackable = true;
  }

  if (weaponType === 'Halberd') {
    typePropDefaults[weaponType].isBeltable = false;
    typePropDefaults[weaponType].twoHanded = true;
    typePropDefaults[weaponType].attackRange = 1;
  }

  if (
    ['Blunderbuss', 'Shortbow', 'Longbow', 'Greatmace', 'Greataxe'].includes(
      weaponType
    )
  ) {
    typePropDefaults[weaponType].twoHanded = true;
    typePropDefaults[weaponType].secondaryType = 'Twohanded';
  }

  if (['Crossbow', 'Shortbow', 'Longbow', 'Blunderbuss'].includes(weaponType)) {
    typePropDefaults[weaponType].canShoot = true;
    typePropDefaults[weaponType].attackRange = 4;
  }

  if (['Shield', 'Saucer'].includes(weaponType)) {
    typePropDefaults[weaponType].stats.accuracy = 0;
    typePropDefaults[weaponType].stats.mitigation = 5;
    typePropDefaults[weaponType].tier = 1;
  }

  if (['Saucer'].includes(weaponType)) {
    typePropDefaults[weaponType].isSackable = true;
  }

  if (
    [
      'Halberd',
      'Longbow',
      'Shortbow',
      'Blunderbuss',
      'Greatsword',
      'Greataxe',
      'Greatmace'
    ].includes(weaponType)
  ) {
    typePropDefaults[weaponType].twoHanded = true;
  }

  if (['Halberd', 'Greatsword', 'Greataxe', 'Greatmace'].includes(weaponType)) {
    typePropDefaults[weaponType].proneChance = 5;
  }

  if (['Longbow', 'Shortbow', 'Blunderbuss', 'Crossbow'].includes(weaponType)) {
    typePropDefaults[weaponType].proneChance = 5;
  }

  if (typePropPrimarySecondary[weaponType]) {
    typePropDefaults[weaponType].type = typePropPrimarySecondary[weaponType].p;
    typePropDefaults[weaponType].secondaryType =
      typePropPrimarySecondary[weaponType].s || '';
  }

  if (
    [
      'Dagger',
      'Shortsword',
      'Arrow',
      'Axe',
      'Hammer',
      'Totem',
      'Wand'
    ].includes(weaponType)
  ) {
    typePropDefaults[weaponType].isSackable = true;
  }

  typePropSets[weaponType] = [...new Set(typePropSets[weaponType])];
});

armorClasses.forEach(armorType => {
  typePropSets[armorType] = typePropSets[armorType] || [];
  typePropDefaults[armorType] = typePropDefaults[armorType] || {};
  typePropDefaults[armorType].stats = typePropDefaults[armorType].stats || {};

  typePropSets[armorType].push('isHeavy');

  typePropDefaults[armorType].isBeltable = false;
  typePropDefaults[armorType].isSackable = true;

  if (['Breastplate', 'Fullplate', 'Scaleplate'].includes(armorType)) {
    typePropDefaults[armorType].isSackable = false;
  }

  if (['Tunic', 'Fur', 'Scaleplate'].includes(armorType)) {
    typePropDefaults[armorType].stats.mitigation = 10;
  }

  if (['Fullplate', 'Breastplate'].includes(armorType)) {
    typePropDefaults[armorType].stats.mitigation = 25;
    typePropDefaults[armorType].isHeavy = true;
  }

  typePropSets[armorType] = [...new Set(typePropSets[armorType])];
});
