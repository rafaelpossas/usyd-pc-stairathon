/**
 * Created by rafaelpossas on 3/25/15.
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {

  development: {
    name: 'dev',
    db: 'mongodb://localhost/usydhealth',
    rootPath: rootPath,
    port: process.env.PORT || 3000,

  },
  production:{
    name: 'prod',
    db: 'mongodb://usyd:usyd2015@ds043057.mongolab.com:43057/stairathon',
    rootPath: rootPath,
    port: process.env.PORT || 80,
  },
  test:{
    name: 'test',
    db: 'mongodb://localhost/usydhealth',
    rootPath: rootPath,
    port: process.env.PORT || 3000,
  }
}