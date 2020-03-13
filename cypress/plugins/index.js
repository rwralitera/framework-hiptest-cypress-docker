//cypress/plugins/index.js
const wp = require('@cypress/webpack-preprocessor');

// promisified fs module
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('./cypress/', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

// plugins file
module.exports = (on, config) => {
  on("before:browser:launch", (browser = {}, args) => {
    // Disable shared memory when run headless since most CI environment do not support that
    if (browser.name === "chrome") {
      args.push("--disable-dev-shm-usage");
    } else if (browser.name === "electron") {
      args["disable-dev-shm-usage"] = true;
    }
    return args
  });
  const options = {
    webpackOptions: require('./webpack.config'),
  };
  on('file:preprocessor', wp(options));
  //To print console.log
  on('task', {
    log(message) {
      console.log(message)
      return null
    }
  })
  // accept a configFile value or use development by default
  const file = config.env.configFile || 'localhost'

  return getConfigurationByFile(file)
};
