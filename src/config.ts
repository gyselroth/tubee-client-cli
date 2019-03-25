const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const homedir = require('os').homedir();
export const tubectlFolder = homedir + '/.tubectl';
export const configPath = tubectlFolder + '/config';
export const keytarPathOrig = './node_modules/keytar/build/Release/keytar.node';
export const keytarPath = tubectlFolder + '/.keytar.node';

export interface Config {
  url: string;
  username: string;
  password: string;
  allowSelfSigned: boolean;
  defaultNamespace: string;
  debug: boolean;
}

/**
 * Api factory
 */
export class ConfigStore {
  protected static config;
  protected static path;

  /**
   * Factory
   */
  protected static load(options = null) {
    ConfigStore.path = configPath;

    if (options.config[0]) {
      ConfigStore.path = options.config[0];
    }

    var config = {} as Config;

    if (fs.existsSync(ConfigStore.path)) {
      try {
        config = yaml.safeLoad(fs.readFileSync(ConfigStore.path, 'utf8')) as Config;
      } catch (e) {
        console.log(e);
      }
    }

    return config;
  }

  /**
   * Retrieve config
   */
  public static get(options = null): Config {
    if (!ConfigStore.config) {
      ConfigStore.config = ConfigStore.load(options);
    }

    return ConfigStore.config;
  }

  /**
   * Write config
   */
  public static write(configPath: string, config: Config) {
    var configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, {
        recursive: true,
      });
    }

    fs.writeFileSync(configPath, yaml.dump(config));
  }
}
