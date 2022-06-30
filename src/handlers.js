const { app } = require('electron');
const childProcess = require('child_process');

const fs = require('fs-extra');
const { default: fetch } = require('node-fetch');
const admZip = require('adm-zip');
const dlgit = require('download-github-repo');

const { clone } = require('./helpers');

const agent = new require('https').Agent({
  rejectUnauthorized: false,
});

const baseUrl = app.getAppPath();

let isUpdating = false;

export const updateResources = async (sendToUI) => {

  if(isUpdating) throw new Error('Currently updating, please wait.');
  isUpdating = true;

  if(fs.existsSync(`${baseUrl}/.loaded`)) {
    fs.rmSync(`${baseUrl}/.loaded`);
  }

  sendToUI('notify', { type: 'info', text: 'Creating directory structure...' });

  fs.ensureDirSync(`${baseUrl}/resources`);

  fs.ensureDirSync(`${baseUrl}/resources/json`);

  fs.ensureDirSync(`${baseUrl}/resources/maps/src`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content`);

  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content/__assets`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content/__assets/spritesheets`);
  
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content/maps`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content/maps/custom`);

  fs.rmdirSync(`${baseUrl}/resources/content`, { recursive: true });

  const sheets = async () => {
    const spritesheets = ['creatures', 'decor', 'items', 'terrain', 'walls'];
  
    for await(let sheet of spritesheets) {
      sendToUI('notify', { type: 'info', text: `Downloading spritesheet "${sheet}"...` });
      
      try {
        const url = `https://play.rair.land/assets/spritesheets/${sheet}.png`;
        const res = await fetch(url, { agent });
        const buffer = await res.buffer();
    
        await fs.writeFile(`${baseUrl}/resources/maps/src/content/__assets/spritesheets/${sheet}.png`, buffer);
      } catch (e) {
        sendToUI('notify', { type: 'error', text: `Error downloading "${sheet}": ${e}` });
        isUpdating = false;
      }
    }
  };

  const json = async () => {
    const jsons = ['challenge', 'effect-data', 'holidaydescs', 'items', 'npc-scripts', 'npcs', 'quests', 'recipes', 'spawners', 'spells', 'traits'];

    for await(let json of jsons) {
      sendToUI('notify', { type: 'info', text: `Downloading content "${json}"...` });
      
      try {
        const templateUrl = `https://play.rair.land/assets/content/_output/${json}.json`;
        const templateRes = await fetch(templateUrl, { agent });
        const templateBuffer = await templateRes.buffer();

        await fs.writeFile(`${baseUrl}/resources/json/${json}.json`, templateBuffer);
      } catch (e) {
        sendToUI('notify', { type: 'error', text: `Error downloading "${json}": ${e}` });
        isUpdating = false;
      }
    }
  };

  const template = async () => {
    sendToUI('notify', { type: 'info', text: 'Downloading template & TestArea...' });

    try {
      const templateUrl = 'https://server.rair.land/editor/map?map=Template';
      const templateRes = await fetch(templateUrl, { agent });
      const templateBuffer = await templateRes.buffer();

      await fs.writeFile(`${baseUrl}/resources/maps/src/content/maps/custom/Template.json`, templateBuffer);
    } catch (e) {
      sendToUI('notify', { type: 'error', text: `Error downloading Template: ${e}` });
      isUpdating = false;
    }

    try {
      const templateUrl = 'https://server.rair.land/editor/map?map=TestArea';
      const templateRes = await fetch(templateUrl, { agent });
      const templateBuffer = await templateRes.buffer();

      await fs.writeFile(`${baseUrl}/resources/maps/src/content/maps/custom/TestArea.json`, templateBuffer);
    } catch (e) {
      sendToUI('notify', { type: 'error', text: `Error downloading TestArea: ${e}` });
      isUpdating = false;
    }
  };

  const tiled = async () => {
    sendToUI('notify', { type: 'info', text: 'Downloading Tiled...' });

    try {
      const tiledUrl = 'https://rair.land/Tiled.zip';
      const tiledRes = await fetch(tiledUrl, { agent });
      const tiledBuffer = await tiledRes.buffer();
      await fs.writeFile(`${baseUrl}/resources/Tiled.zip`, tiledBuffer);

      const adm = new admZip(`${baseUrl}/resources/Tiled.zip`);
      adm.extractAllTo(`${baseUrl}/resources`);

      fs.rmSync(`${baseUrl}/resources/Tiled.zip`);
    } catch (e) {
      sendToUI('notify', { type: 'error', text: `Error downloading Tiled: ${e}` });
      isUpdating = false;
    }
  };

  const validators = async () => {
    sendToUI('notify', { type: 'info', text: 'Downloading validators...' });
    dlgit('LandOfTheRair/Content', `${baseUrl}/resources/content`, async () => {});
  };

  await sheets();
  await json();
  await template();
  await tiled();
  await validators();

  fs.writeFileSync(`${baseUrl}/.loaded`, '');

  isUpdating = false;
};

export const downloadMongo = async (sendToUI) => {
  sendToUI('notify', { type: 'info', text: 'Downloading MongoDB (~300mb)...' });

  try {

    if(fs.existsSync(`${baseUrl}/resources/mongodb`)) {
      fs.rmSync(`${baseUrl}/resources/mongodb`);
    }

    if(fs.existsSync(`${baseUrl}/resources/mongodb-win32-x86_64-windows-5.0.6`)) {
      fs.rmSync(`${baseUrl}/resources/mongodb-win32-x86_64-windows-5.0.6`);
    }
    
    const mongoUrl = 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.6.zip';
    const mongoRes = await fetch(mongoUrl);
    const mongoBuffer = await mongoRes.buffer();
    fs.writeFileSync(`${baseUrl}/resources/MongoDB.zip`, mongoBuffer);

    const adm = new admZip(`${baseUrl}/resources/MongoDB.zip`);
    adm.extractAllTo(`${baseUrl}/resources`);

    fs.rmSync(`${baseUrl}/resources/MongoDB.zip`);

    fs.renameSync(`${baseUrl}/resources/mongodb-win32-x86_64-windows-5.0.6`, `${baseUrl}/resources/mongodb`);
    fs.ensureDirSync(`${baseUrl}/resources/mongodb/data`);
    fs.ensureDirSync(`${baseUrl}/resources/mongodb/data/db`);
  } catch(e) {
    console.log(e);
    sendToUI('notify', { type: 'error', text: 'MongoDB download failed!' });
  }
};

export const downloadRair = async (sendToUI) => {
  sendToUI('notify', { type: 'info', text: 'Downloading Rair Server (~70mb)...' });

  try {

    if(fs.existsSync(`${baseUrl}/resources/rair`)) {
      fs.rmSync(`${baseUrl}/resources/rair`);
    }

    fs.mkdirSync(`${baseUrl}/resources/rair`);

    const releaseUrl = 'https://api.github.com/repos/LandOfTheRair/landoftherair/releases/latest';
    const releaseRes = await fetch(releaseUrl);
    const releaseData = await releaseRes.json();
    
    const serverUrl = releaseData.assets.find(x => x.name === 'lotr-server.exe').browser_download_url;
    const serverRes = await fetch(serverUrl);
    const serverBuffer = await serverRes.buffer();
    fs.writeFileSync(`${baseUrl}/resources/rair/lotr-server.exe`, serverBuffer);

  } catch(e) {
    console.log(e);
    sendToUI('notify', { type: 'error', text: 'Rair Server download failed!' });
  }
};

export const ensureMap = (mapName, mapData) => {
  
  const path = `${baseUrl}/resources/maps/src/content/maps/custom/${mapName}.json`;
  fs.writeFileSync(path, JSON.stringify(mapData));
};

export const newMap = (mapName, mapAuthor) => {
  
  const fileName = mapName.replace(/[^a-zA-Z-]/g, '');
  const templatePath = `${baseUrl}/resources/maps/src/content/maps/custom/Template.json`;
  const path = `${baseUrl}/resources/maps/src/content/maps/custom/${fileName}.json`;

  if(fs.existsSync(path)) {
    throw new Error('Map already exists');
  }

  const json = fs.readJSONSync(templatePath);
  json.properties.creator = mapAuthor;
  json.propertytypes.creator = 'string';

  fs.writeJSONSync(path, json);

  editMap(fileName);

  return json;
};

export const editMap = (mapName) => {

  if(!fs.existsSync(`${baseUrl}/resources/Tiled`)) {
    throw new Error('Tiled is not installed.');
  }
  
  const path = `${baseUrl}/resources/maps/src/content/maps/custom/${mapName}.json`;

  childProcess.exec(`${baseUrl}/resources/Tiled/tiled.exe "${path}"`);
};

export const renameMap = (oldName, newName) => {
  
  const oldPath = `${baseUrl}/resources/maps/src/content/maps/custom/${oldName}.json`;
  const newPath = `${baseUrl}/resources/maps/src/content/maps/custom/${newName}.json`;
  
  fs.moveSync(oldPath, newPath);
};

export const editMapSpawnerNames = (oldName, newName) => {
  fs.readdirSync(`${baseUrl}/resources/maps/src/content/maps/custom`).forEach(file => {
    const path = `${baseUrl}/resources/maps/src/content/maps/custom/${file}`;
    const json = fs.readJSONSync(path);

    let didWrite = false;
  
    json.layers[10].objects.forEach(spawner => {
      if(spawner.tag !== oldName) return;

      spawner.tag = newName;
      didWrite = true;
    });
  
    if(didWrite) {
      fs.writeJSONSync(path, json);
    }
  });
};

export const loadJSON = (json) => {
  const file = `${baseUrl}/resources/json/${json}.json`;

  if(!fs.existsSync(file)) {
    throw new Error(`Attempting to load invalid or absent JSON: ${json}`);
  }

  return fs.readJsonSync(file);
};

export const formatMod = (mod) => {

  mod.meta._backup = clone(mod);

  const formatNPCs = () => {
    mod.npcs.forEach(npc => {
      delete npc.hp;
      delete npc.mp;
      delete npc.giveXp;
      delete npc.gold;
    });
  };

  // put droptables into the correct format
  const formatDrops = () => {
    const finalDrops = [];

    const mapDrops = {};
    const regionDrops = {};

    mod.drops.forEach(drop => {

      if(drop.mapName) {
        mapDrops[drop.mapName] = mapDrops[drop.mapName] || [];
        mapDrops[drop.mapName].push({ 
          result: drop.result, 
          chance: drop.chance,
          maxChance: drop.maxChance,
          noLuckBonus: drop.noLuckBonus,
          requireHoliday: drop.requireHoliday
        });
      }

      if(drop.regionName) {
        regionDrops[drop.regionName] = regionDrops[drop.regionName] || [];
        regionDrops[drop.regionName].push({ 
          result: drop.result, 
          chance: drop.chance,
          maxChance: drop.maxChance,
          noLuckBonus: drop.noLuckBonus,
          requireHoliday: drop.requireHoliday
        });
      }

    });

    Object.keys(mapDrops).forEach(mapName => {
      finalDrops.push({
        mapName,
        drops: mapDrops[mapName]
      });
    });

    Object.keys(regionDrops).forEach(regionName => {
      finalDrops.push({
        regionName,
        drops: regionDrops[regionName]
      });
    });

    mod.drops = finalDrops;
  };

  // remove extraneous things from the final item
  const formatItems = () => {
    const items = mod.items.map(item => {
      item.sprite = +item.sprite;
      if(!item.sellValue) delete item.sellValue;
      if(!item.maxUpgrades) delete item.maxUpgrades;
      if(!item.secondaryType) delete item.secondaryType;
      if(!item.succorInfo.map) delete item.succorInfo;
      if(!item.cosmetic.name) delete item.cosmetic;
      if(!item.containedItems.length) delete item.containedItems;
      if(!item.trait.name) delete item.trait;
      if(!item.useEffect.name) delete item.useEffect;
      if(!item.strikeEffect.name) delete item.strikeEffect;
      if(!item.breakEffect.name) delete item.breakEffect;
      if(!item.equipEffect.name) delete item.equipEffect;
      if(!item.requirements.baseClass) delete item.requirements.baseClass;
      if(!item.requirements.level) delete item.requirements.level;
      if(!item.requirements.baseClass && !item.requirements.level) delete item.requirements;

      return item;
    });

    mod.items = items;
  };

  formatNPCs();
  formatDrops();
  formatItems();

  // whatever
  // eslint-disable-next-line no-undef
  const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;

  const { fillInProperties: droptableValidator } = requireFunc('./resources/content/_transformers/props/droptable');
  const { fillInProperties: itemValidator } = requireFunc('./resources/content/_transformers/props/item');
  const { fillInProperties: npcScriptValidator } = requireFunc('./resources/content/_transformers/props/npc-scripts');
  const { fillInProperties: npcValidator } = requireFunc('./resources/content/_transformers/props/npc');
  const { fillInProperties: questValidator } = requireFunc('./resources/content/_transformers/props/quest');
  const { fillInProperties: recipeValidator } = requireFunc('./resources/content/_transformers/props/recipe');
  const { fillInProperties: spawnerValidator } = requireFunc('./resources/content/_transformers/props/spawner');

  mod.drops.forEach(dt => droptableValidator(dt));
  mod.items.forEach(dt => itemValidator(dt));
  mod.dialogs.forEach(dt => npcScriptValidator(dt));
  mod.npcs.forEach(dt => npcValidator(dt));
  mod.quests.forEach(dt => questValidator(dt));
  mod.recipes.forEach(dt => recipeValidator(dt));
  mod.spawners.forEach(dt => spawnerValidator(dt));

  return mod;
};