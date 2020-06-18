//cypress/plugins/index.js
const wp = require('@cypress/webpack-preprocessor');

// In cypress/plugins/index.js
let percyHealthCheck = require('@percy/cypress/task')

// promisified fs module
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('./cypress/', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

// plugins file
module.exports = (on, config) => {
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
  });
  on("task", percyHealthCheck);
  // accept a configFile value or use development by default
  const file = config.env.configFile || 'localhost'

  return getConfigurationByFile(file)
};


require('@applitools/eyes-cypress')(module);
