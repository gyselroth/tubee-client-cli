const { V1Api, HttpBasicAuth, localVarRequest } = require('@gyselroth/tubee-sdk-node');
const fs = require('fs');
const keytar = require('keytar');
import {keytarPath, keytarPathOrig, Config, ConfigStore, configPath, tubectlFolder} from './config';

if (!fs.existsSync(tubectlFolder)) {
  fs.mkdirSync(tubectlFolder);
}

if (!fs.existsSync(keytarPath)) {
  fs.writeFileSync(keytarPath, fs.readFileSync(keytarPathOrig));
}

keytar.setPath(keytarPath);

/**
 * Api factory
 */
export default class TubeeClient {
  /**
   * Factory
   */
  public async factory(category: string, options = null) {
    const config: Config = ConfigStore.get(options);

    if(config.debug || options.debug) {
      localVarRequest.debug = true;
    }

    if (config.allowSelfSigned) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    
    var server = config.url || 'https://localhost:8090';
    var password = (await keytar.getPassword('tubee', config.username || 'admin'));
    var client = new V1Api(server);
    var basic = new HttpBasicAuth();
    basic.username = config.username || 'admin';
    basic.password = password;

    client.setDefaultAuthentication(basic);
    return client;
  }
}
