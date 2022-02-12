
const { app } = require('electron');
const fs = require('fs-extra');
const process = require('process');
const childProcess = require('child_process');

const baseUrl = app.getAppPath();

let mongoProcess = null;
let lotrProcess = null;

process.on('exit', () => {
  console.log('Attempting to clean up stray processes...');
  killMod();
});

export const killMod = (sendToUI) => {
  try { 
    childProcess.exec('taskkill /F /IM lotr-server.exe'); 
    lotrProcess = null;
    if(sendToUI) sendToUI('notify', { type: 'info', text: 'Killed LotR server!' });
  } catch (e) {
    if(sendToUI) sendToUI('notify', { type: 'error', text: `Could not kill LotR: ${e}` });
  }

  try { 
    childProcess.exec('taskkill /F /IM mongod.exe'); 
    mongoProcess = null;
    sendToUI('notify', { type: 'info', text: 'Killed MongoDB!' });
  } catch (e) {
    sendToUI('notify', { type: 'error', text: `Could not kill MongoDB: ${e}` });
  }
};

export const testMod = (sendToUI, { openClient, map, settings }) => {

  // check mongodb install
  if(!fs.existsSync(`${baseUrl}/resources/mongodb/bin/mongod.exe`)) {
    sendToUI('notify', { type: 'error', text: 'MongoDB is not installed.' });
    return;
  }

  // check lotr server install
  if(!fs.existsSync(`${baseUrl}/resources/rair/lotr-server.exe`)) {
    sendToUI('notify', { type: 'error', text: 'LotR Server is not installed.' });
    return;
  }

  // check if map exists
  if(!fs.existsSync(`${baseUrl}/resources/maps/src/content/maps/custom/${map}.json`)) {
    sendToUI('notify', { type: 'error', text: `Map ${map} file does not exist.` });
    return;
  }
  
  const username = 'lotrtestuser';
  const password = 'lotrtestuser';

  // ensure map dir exists, copy it over
  fs.ensureDirSync(`${baseUrl}/resources/rair/content`);

  // clean out old maps
  fs.rmdirSync(`${baseUrl}/resources/rair/content/maps`, { recursive: true });
  fs.ensureDirSync(`${baseUrl}/resources/rair/content/maps`);

  // copy only this map over
  fs.copyFileSync(`${baseUrl}/resources/maps/src/content/maps/custom/${map}.json`, `${baseUrl}/resources/rair/content/maps/${map}.json`);
  sendToUI('notify', { type: 'info', text: `Copied map ${map} file!` });

  // write .env
  fs.writeFileSync(`${baseUrl}/resources/rair/.env`, `
DATABASE_URI=mongodb://localhost:35353/lotr2
TEST_MODE=1
TEST_USER_NAME=${username}
TEST_USER_PASSWORD=${password}
TEST_USER_PROPS=${settings}
  `);
  sendToUI('notify', { type: 'info', text: 'Wrote .env file!' });

  // run mongo if not running
  if(!mongoProcess) {
    sendToUI('notify', { type: 'info', text: 'Starting MongoDB...' });
    mongoProcess = childProcess.exec(`${baseUrl}/resources/mongodb/bin/mongod.exe --port 35353 --dbpath ${baseUrl}/resources/mongodb/data/db`, {}, () => {});
  }
  
  // run lotr server if not running (kill old install)
  if(lotrProcess) {
    try {
      sendToUI('notify', { type: 'info', text: 'Stopping old LotR Server...' });
      childProcess.exec('taskkill /F /IM lotr-server.exe');
    } catch (e) {
      console.error(e);
    }
  }
  
  // re/start lotr server
  sendToUI('notify', { type: 'info', text: 'Starting LotR Server...' });
  lotrProcess = childProcess.exec(`${baseUrl}/resources/rair/lotr-server.exe`, { cwd: `${baseUrl}/resources/rair` }, () => {});

  // open lotr client
  if(openClient) {
    sendToUI('notify', { type: 'info', text: 'Opening client...' });

    setTimeout(() => {
      require('electron').shell.openExternal(`https://testplay.rair.land/?apiUrl=localhost:6975&username=${username}&password=${password}`);
    }, 3000);
  }
};