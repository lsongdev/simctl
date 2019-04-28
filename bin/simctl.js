#!/usr/bin/env node

const simctl = require('..');
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
.command('boot', async ({ device }) => {
  const { devices } = await simctl.list('devices');
  ({ device } = await inquirer.prompt({
    type: 'list',
    name: 'device',
    choices: Object.keys(devices).reduce((results, deviceType) => results
        .concat(new inquirer.Separator(deviceType))
        .concat(devices[deviceType].map(x => ({ name: x.name, value: x.udid }))), [])
  }));
  return simctl.boot(device);
})
.command('list', async ({ type = 'devices' }) => {
  const { devices = {} } = await simctl.list(type);
  Object.keys(devices).forEach(deviceType => {
    devices[deviceType].forEach(x => console.log(x.name));
  });
})
.command('openurl', async ({ _: [ url ], device = 'booted' }) => {
  return simctl.openurl(device, url);
})
.command('help', () => {
  console.log('simcrl [command]');
})


.parse();