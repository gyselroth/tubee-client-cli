const api = require('@gyselroth/tubee-sdk-node');
const yaml = require('js-yaml');
const fs = require('fs');
const keytar = require('keytar');
const homedir = require('os').homedir();
export const tubectlFolder = homedir + '/.tubectl';
export const configPath = tubectlFolder + '/config';
const keytarPath = tubectlFolder+'/.keytar.node';
const keytarPathOrig = './node_modules/keytar/build/Release/keytar.node';

if(!fs.existsSync(tubectlFolder)) {
  fs.mkdirSync(tubectlFolder);
}

if(!fs.existsSync(keytarPath)) {
  fs.writeFileSync(keytarPath, fs.readFileSync(keytarPathOrig));
}

keytar.setPath(keytarPath);

export interface Config {
  url: string;
  username: string;
  password: string;
  allowSelfSigned: boolean;
}

/**
 * Api factory
 */
export default class TubeeClient {
  /**
   * Factory
   */
  public async factory(category: string, options = null) {
    var path = configPath;

    if (options.config[0]) {
      path = options.config[0];
    }

    var config = {} as Config;

    if (fs.existsSync(path)) {
      try {
        config = yaml.safeLoad(fs.readFileSync(path, 'utf8')) as Config;
      } catch (e) {
        console.log(e);
      }
    }

    if (config.allowSelfSigned) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    var server = config.url || 'https://localhost:8090';
    var password = (await keytar.getPassword('tubee', config.username || 'admin')) || 'admin';
    var client = new api[category + 'Api'](server + '/api/v1');
    var auth = new api.HttpBasicAuth();
    auth.username = config.username || 'admin';
    auth.password = password;

    client.setDefaultAuthentication(auth);
    return client;
  }
}
