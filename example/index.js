const simctl = require('..');

(async () => {

  const list = await simctl.list();
  console.log(list);

  // simctl.openurl('booted', 'http://baidu.com');

})();