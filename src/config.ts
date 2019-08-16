const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const homedir = require('os').homedir();
export const tubectlFolder = homedir + '/.tubectl';
export const configPath = tubectlFolder + '/config';
export const keytarPathOrig = './node_modules/keytar/build/Release/keytar.node';
export const keytarPath = tubectlFolder + '/.keytar.node';

export interface Config {
  defaultContext: string;
  context: Context[];
  kind: string;
}

export interface Context {
  name: string;
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
  protected static config: Config;
  protected static context: Context;
  protected static path;

  /**
   * Factory
   */
  protected static load(options = null) {
    ConfigStore.path = configPath;
    if (options !== null && options.config[0]) {
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
  public static getAll(options = null): Config {
    return (ConfigStore.config = ConfigStore.load(options));
  }

  /**
   * Retrieve config
   */
  public static get(options = null): Context {
    var config = ConfigStore.getAll(options);
    var context;

    if (ConfigStore.context) {
      return ConfigStore.context;
    } else if (options !== null && options.context[0]) {
      context = ConfigStore.getContextByName(options.context[0]);
    } else {
      context = ConfigStore.getContextByName(config.defaultContext || 'default');
    }

    return (ConfigStore.context = context);
  }

  /**
   * Get context by name
   */
  protected static getContextByName(name: string): Context {
    for (let context of ConfigStore.config.context) {
      if (context.name === name) {
        return context;
      }
    }

    throw new Error('context not found');
  }

  /**
   * Set context
   */
  public static writeContext(configPath: string, name: string, context: Context) {
    var config = ConfigStore.getAll({ config: [configPath] });
    if (!ConfigStore.config.context) {
      ConfigStore.config.context = [];
    }

    if (ConfigStore.config.kind !== 'Config') {
      ConfigStore.config.kind = 'Config';
    }

    if (!ConfigStore.config.defaultContext) {
      ConfigStore.config.defaultContext = name;
    }

    for (let context of ConfigStore.config.context) {
      if (context.name === name) {
        var index = ConfigStore.config.context.indexOf(context);
        if (index > -1) {
          ConfigStore.config.context.splice(index, 1);
        }
      }
    }

    context.name = name;
    ConfigStore.config.context.push(context);

    var configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, {
        recursive: true,
      });
    }

    fs.writeFileSync(configPath, yaml.dump(ConfigStore.config));
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
