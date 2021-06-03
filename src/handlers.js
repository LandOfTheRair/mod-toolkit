
const { app } = require('electron');
const childProcess = require('child_process');

const fs = require('fs-extra');
const { default: fetch } = require('node-fetch');
const admZip = require('adm-zip');

const baseUrl = app.getAppPath();

let isUpdating = false;

export const updateResources = async () => {

  if(isUpdating) throw new Error('Currently updating, please wait.');
  isUpdating = true;

  if(fs.existsSync(`${baseUrl}/.loaded`)) {
    fs.rmSync(`${baseUrl}/.loaded`);
  }

  fs.ensureDirSync(`${baseUrl}/resources`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src`);

  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content/__assets`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content/__assets/spritesheets`);
  
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content/maps`);
  fs.ensureDirSync(`${baseUrl}/resources/maps/src/content/maps/custom`);

  const sheets = async () => {
    const spritesheets = ['creatures', 'decor', 'items', 'terrain', 'walls'];
  
    for await(let sheet of spritesheets) {
      const url = `https://play.rair.land/assets/spritesheets/${sheet}.png`;
      const res = await fetch(url);
      const buffer = await res.buffer();
  
      fs.writeFileSync(`${baseUrl}/resources/maps/src/content/__assets/spritesheets/${sheet}.png`, buffer);
    }
  };

  const template = async () => {
    const templateUrl = 'https://server.rair.land/editor/map?map=Template';
    const templateRes = await fetch(templateUrl);
    const templateBuffer = await templateRes.buffer();
    fs.writeFileSync(`${baseUrl}/resources/maps/src/content/maps/custom/Template.json`, templateBuffer);
  };

  const tiled = async () => {
    const tiledUrl = 'https://rair.land/Tiled.zip';
    const tiledRes = await fetch(tiledUrl);
    const tiledBuffer = await tiledRes.buffer();
    fs.writeFileSync(`${baseUrl}/resources/Tiled.zip`, tiledBuffer);

    const adm = new admZip(`${baseUrl}/resources/Tiled.zip`);
    adm.extractAllTo(`${baseUrl}/resources`);

    fs.rmSync(`${baseUrl}/resources/Tiled.zip`);
  };

  await sheets();
  await template();
  await tiled();

  fs.writeFileSync(`${baseUrl}/.loaded`, '');

  isUpdating = false;
};

export const ensureMap = (mapName, mapData) => {
  
  const path = `${baseUrl}/resources/maps/src/content/maps/custom/${mapName}.json`;
  fs.writeFileSync(path, JSON.stringify(mapData));
};

export const newMap = (mapName) => {
  
  const fileName = mapName.replace(/[^a-zA-Z-]/g, '');
  const path = `${baseUrl}/resources/maps/src/content/maps/custom/${fileName}.json`;

  if(fs.existsSync(path)) {
    throw new Error('Map already exists');
  }

  fs.copyFileSync(`${baseUrl}/resources/maps/src/content/maps/custom/Template.json`, path);

  editMap(fileName);

  const data = fs.readJSONSync(path);

  return data;
};

export const editMap = (mapName) => {
  
  const path = `${baseUrl}/resources/maps/src/content/maps/custom/${mapName}.json`;

  childProcess.exec(`${baseUrl}/resources/Tiled/tiled.exe "${path}"`);
};