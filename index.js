const { exec } = require('child_process');
const { promisify } = require('util');

const run = promisify(exec);

const simctl = {
  exec(command, ...args){
    return run(`xcrun simctl ${command} ${args.join(' ')}`)
      .then(({ stderr, stdout }) => {
        if(stderr) throw new Error(stderr);
        return stdout;
      });
  },
  /**
   * Create a new device.
   * @param {*} name 
   * @param {*} deviceTypeId 
   * @param {*} runtimeId 
   */
  create(name, deviceTypeId, runtimeId) {
    return this.exec(`create`, name, deviceTypeId, runtimeId);
  },
  /**
   * List available devices, device types, runtimes, or device pairs.
   * @param {*} type 
   */
  list(type){
    return this.exec('list', '-j', type).then(JSON.parse);
  },
  /**
   * Open a URL in a device.
   * @param {*} device 
   * @param {*} url 
   */
  openurl(device, url){
    return this.exec('openurl', device, encodeURI(url));
  },
  /**
   * Boot a device.
   */
  boot(device){
    return this.exec('boot', device);
  },
  /**
   * Shutdown a device.
   * @param {*} device 
   */
  shutdown(device){
    return this.exec('shutdown', device);
  },
  /**
   * Add photos, live photos, videos, or contacts to the library of a device.
   * @param {*} device 
   * @param {*} filename 
   */
  addmedia(device, filename){
    return this.exec('addmedia', device, filename);
  },
  /**
   * Install an app on a device.
   * @param {*} device 
   * @param {*} filename 
   */
  install(device, filename){
    return this.exec('install', device, filename);
  },
  /**
   * Launch an application by identifier on a device.
   * @param {*} device 
   * @param {*} app 
   */
  launch(device, app){
    return this.exec('launch', device, app);
  },
  /**
   * Terminate an application by identifier on a device.
   * @param {*} device 
   * @param {*} app 
   */
  terminate(device, app){
    return this.exec('terminate', device, app);
  },
  /**
   * Set up a device IO operation.
   * @param {*} device 
   * @param {*} operation 
   * @param  {...any} args 
   */
  io(device, operation, ...args){
    return this.exec('io', device, operation, ...args);
  },
  /**
   * Saves a screenshot as a PNG to the specified file or url
   * @param {*} device 
   * @param {*} filename 
   */
  screenshot(device, filename){
    return this.io(device, 'screenshot', filename);
  },
  /**
   * Records the display to the specified file or url
   */
  recordVideo(device, filename){
    return this.io(device, 'recordVideo', filename);
  },
  /**
   * Spawn a process by executing a given executable on a device.
   * @param {*} device 
   * @param {*} command 
   * @param  {...any} args 
   */
  spawn(device, command, ...args){
    return this.exec('spawn', device, command, ...args);
  }
};

module.exports = simctl;