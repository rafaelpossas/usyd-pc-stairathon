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
    host: 'http://localhost',
    token: '7c50ca8c117b0603aefaad1f2f9c5c46c2d2784157cddd4d13085dbba3b6fb2b',
    serversHost: 'api.digitalocean.com',
    serversPath: '/v2/droplets'
  },
  production:{
    name: 'prod',
    db: 'mongodb://procymo:cymo@2014@ds031852.mongolab.com:31852/procymo-admin',
    rootPath: rootPath,
    port: process.env.PORT || 80,
    host: 'localhost',
    token: '7c50ca8c117b0603aefaad1f2f9c5c46c2d2784157cddd4d13085dbba3b6fb2b',
    serversHost: 'api.digitalocean.com',
    serversPath: '/v2/droplets'
  }
}