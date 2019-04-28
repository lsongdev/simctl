#!/usr/bin/env node

const simctl = require('..');
const Table = require('cli-table');
const inquirer = require('inquirer');
const program = require('../program');

program()
.command('create', async ({ name, device, runtime }) => {
  if(!name) {
    // input name
    ({ name } = await inquirer.prompt({
      name: 'name',
      type: 'text',
    }))
  }
  if(!device){
    // show and select device
    const { devicetypes } = await simctl.list('devicetypes');
    ({ device } = await inquirer.prompt({
      type: 'list',
      name: 'device',
      choices: devicetypes.map(x => ({ name: x.name, value: x.identifier }))
    }));
  }
  if(!runtime){
    // show and select runtime
    const { runtimes } = await simctl.list('runtimes');
    ({ runtime } = await inquirer.prompt({
      type: 'list',
      name: 'runtime',
      choices: runtimes.map(x => ({ name: x.name, value: x.identifier }))
    }));
  }
  const result = await simctl.create(name, device, runtime);
  console.log(result);
})
.command('delete', async ({ device }) => {
  const unavailable = { 
    name: '<All Unavailable Devices>',
    value: 'unavailable'
  };
  const { devices } = await simctl.list('devices');
  ({ device } = await inquirer.prompt({
    type: 'list',
    name: 'device',
    choices: Object.keys(devices).reduce((results, deviceType) => results
        .concat(new inquirer.Separator(deviceType))
        .concat(devices[deviceType].map(x => ({ name: x.name, value: x.udid }))), [ unavailable ])
  }));
  return simctl.delete(device);
})
.command('boot', async ({ device }) => {
  const { devices } = await simctl.list('devices');
  if(!device){
    ({ device } = await inquirer.prompt({
      type: 'list',
      name: 'device',
      choices: Object.keys(devices).reduce((results, deviceType) => results
          .concat(new inquirer.Separator(deviceType))
          .concat(devices[deviceType].map(x => ({ name: x.name, value: x.udid }))), [])
    }));
  }
  await simctl.boot(device);
  await simctl.open();

})
.command('shutdown', async ({ device }) => {
  const { devices } = await simctl.list('devices');
  ({ device } = await inquirer.prompt({
    type: 'list',
    name: 'device',
    choices: Object.keys(devices).reduce((results, deviceType) => {
      const list = devices[deviceType].filter(x => x.state === 'Booted');
      // list.length && results.push(new inquirer.Separator(deviceType));
      return results.concat(list.map(x => ({ name: x.name, value: x.udid })));
    }, [])
  }));
  return simctl.shutdown(device);
})
.command('list', async ({ type = 'devices' }) => {
  const { devices = {}, devicetypes = [], runtimes = [] } = await simctl.list(type);
  const deviceTable = new Table({
    head: [ "#", "name", 'state' ]
  });

  const deviceTypeTable = new Table({
    head: [ 'name', 'identifier' ]
  });

  const runtimeTable = new Table({
    head: [ 'name', 'version', 'build', 'identifier' ]
  });

  devicetypes.forEach(x => deviceTypeTable.push([ x.name, x.identifier ]));
  runtimes.forEach(x => runtimeTable.push([ x.name, x.version, x.buildversion, x.identifier ]));
  Object.keys(devices).forEach(deviceType => {
    devices[deviceType].forEach(x => deviceTable.push([ x.udid, x.name, x.state ]));
  });

  if(deviceTable.length)
    console.log(deviceTable.toString());
  if(deviceTypeTable.length)
    console.log(deviceTypeTable.toString());
  if(runtimeTable.length)
    console.log(runtimeTable.toString());
  
})
.command('openurl', async ({ _: [ url ], device = 'booted' }) => {
  return simctl.openurl(device, url);
})
.command('help', () => {
  console.log('simcrl [command] [options]');
})


.parse();