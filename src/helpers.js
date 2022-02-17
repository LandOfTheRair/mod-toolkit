import { get } from 'lodash';

export const clone = obj => JSON.parse(JSON.stringify(obj));

export const isUndefined = key => key === undefined;

export const objectPosition = (sprite, divisor) => {
  const y = Math.floor(sprite / divisor);
  const x = sprite % divisor;
  return `-${x * 64}px -${y * 64}px`;
};

export const validationMessagesForMod = (mod) => {

  const validations = [];

  // item validators
  const checkItemStats = () => {
    const itemValidations = [];

    itemValidations.push({ subheader: 'Awkward Item Stats & Settings' });

    mod.items.forEach(item => {
      const modsActionSpeed = get(item, 'randomStats.actionSpeed') || get(item, 'stats.actionSpeed');
      if(modsActionSpeed) {
        itemValidations.push({ type: 'warning', message: `${item.name} modifies actionSpeed.` });
      }

      const destroysOnDrop = get(item, 'destroyOnDrop');
      if(destroysOnDrop) {
        itemValidations.push({ type: 'warning', message: `${item.name} destroys on drop.` });
      }
    });

    if(itemValidations.length === 1) {
      itemValidations.push({ type: 'good', message: 'No abnormalities!' });
    }

    validations.push(...itemValidations);
  };

  const checkItemUses = () => {
    const itemValidations = [];

    itemValidations.push({ subheader: 'Unused Items' });

    // item count tracker
    const itemCounts = {};

    const addItemCount = (item) => {
      if(itemCounts[item] >= 0) {
        itemCounts[item]++;
      }
    };

    mod.items.forEach(item => {
      itemCounts[item.name] = 0;
    });

    // count item usages by type
    mod.drops.forEach(droptable => {
      addItemCount(droptable.result);
    });

    mod.recipes.forEach(recipe => {
      addItemCount(recipe.item);

      recipe.ingredients.forEach((ing) => {
        addItemCount(ing);
      });
    });

    mod.npcs.forEach(npc => {
      npc.items.sack.forEach(item => {
        addItemCount(item.result);
      });

      Object.keys(npc.items.equipment).forEach(slot => {
        npc.items.equipment[slot].forEach(item => {
          addItemCount(item.result);
        });
        
      });

      if(npc.tansFor) {
        addItemCount(npc.tansFor);
      }

      npc.drops.forEach(item => {
        addItemCount(item.result);
      });
      
      npc.dropPool.items.forEach(item => {
        addItemCount(item);
      });
    });

    Object.keys(itemCounts).forEach(item => {
      if(itemCounts[item] > 0) return;

      itemValidations.push({ type: 'warning', message: `${item} is unused.` });
    });
    
    if(itemValidations.length === 1) {
      itemValidations.push({ type: 'good', message: 'No abnormalities!' });
    }

    validations.push(...itemValidations);
  };

  const checkItems = () => {
    validations.push({ header: 'Items' });
    checkItemStats();
    checkItemUses();
  };

  const checkMapProperties = () => {
    const allMapPropValidations = [];
    
    mod.maps.forEach(map => {

      const mapValidations = [];
      mapValidations.push({ subheader: `${map.name} Map Properties` });
      ['itemExpirationHours', 'itemGarbageCollection', 'maxCreatures', 'maxLevel', 'maxSkill', 'region', 'respawnX', 'respawnY'].forEach(prop => {
        if(map.map.properties[prop]) return;

        mapValidations.push({ type: 'error', message: `${map.name} map does not have a ${prop} property.` });
      });

      allMapPropValidations.push(...mapValidations);
    });

    validations.push(...allMapPropValidations);
  };

  const checkMapSpawners = () => {

    const bosses = [];
    const modSpawnerTags = {};    
    const usedSpawnerTags = {};

    const addModSpawnerCount = (item) => {
      if(modSpawnerTags[item] >= 0) {
        modSpawnerTags[item]++;
      }
    };

    const addUsedSpawnerCount = (item) => {
      usedSpawnerTags[item] = usedSpawnerTags[item] || 0;
      usedSpawnerTags[item]++;
    };

    mod.spawners.forEach(item => {
      modSpawnerTags[item.tag] = 0;
    });
    
    mod.maps.forEach(map => {
      map.map.layers[10].objects.forEach(spawner => {
        addModSpawnerCount(spawner.properties.tag);
        addUsedSpawnerCount(spawner.properties.tag);

        if(spawner.properties.lairName) {
          bosses.push(spawner.properties.lairName);
        }
      });
    });

    // calculate unused mod spawners
    const modSpawnerValidations = [];

    modSpawnerValidations.push({ subheader: 'Unused Mod Spawners' });

    Object.keys(modSpawnerTags).forEach(item => {
      if(modSpawnerTags[item] > 0) return;

      modSpawnerValidations.push({ type: 'warning', message: `${item} is unused.` });
    });
    
    if(modSpawnerValidations.length === 1) {
      modSpawnerValidations.push({ type: 'good', message: 'No abnormalities!' });
    }

    validations.push(...modSpawnerValidations);

    // calculate map spawners
    const mapSpawnerValidations = [];

    mapSpawnerValidations.push({ subheader: 'Map Spawners' });

    Object.keys(usedSpawnerTags).forEach(item => {
      if(item === 'Global Lair') return;
      if(usedSpawnerTags[item] > 0 && modSpawnerTags[item] > 0) return;

      mapSpawnerValidations.push({ type: 'error', message: `${item} is not a valid spawner tag.` });
    });
    
    if(mapSpawnerValidations.length === 1) {
      mapSpawnerValidations.push({ type: 'good', message: 'No abnormalities!' });
    }

    validations.push(...mapSpawnerValidations);

    // calculate boss validations
    const mapLairValidations = [];

    mapLairValidations.push({ subheader: 'Lairs' });

    bosses.forEach(boss => {
      if(mod.npcs.some(npc => npc.npcId === boss)) return;

      mapLairValidations.push({ type: 'error', message: `${boss} is not a valid lair.` });
    });
    
    if(mapLairValidations.length === 1) {
      mapLairValidations.push({ type: 'good', message: 'No abnormalities!' });
    }

    validations.push(...mapLairValidations);

  };

  const checkMapNPCDialogs = () => {
    // check npc dialog refs, make sure they exist
    const mapDialogValidations = [];

    const foundDialogs = {};

    const addDialogCount = (item) => {
      foundDialogs[item] = foundDialogs[item] || 0;
      foundDialogs[item]++;
    };

    mapDialogValidations.push({ subheader: 'NPC Scripts' });
    
    mod.maps.forEach(map => {
      map.map.layers[9].objects.forEach(npc => {
        addDialogCount(npc.properties.tag);
      });
    });


    mod.dialogs.forEach(dia => {
      if(foundDialogs[dia.tag]) return;

      mapDialogValidations.push({ type: 'warning', message: `${dia.tag} is unused.` });
    });
    
    if(mapDialogValidations.length === 1) {
      mapDialogValidations.push({ type: 'good', message: 'No abnormalities!' });
    }

    validations.push(...mapDialogValidations);
  };

  // map validators
  const checkMaps = () => {
    validations.push({ header: 'Maps' });

    checkMapProperties();
    checkMapSpawners();
    checkMapNPCDialogs();
  };

  checkItems();
  checkMaps();

  return validations;
};

export const numErrorsForMod = (mod) => {
  const validationMessages = validationMessagesForMod(mod);

  const numErrors = validationMessages.filter(vdn => vdn.type === 'error').length;

  return numErrors;
};