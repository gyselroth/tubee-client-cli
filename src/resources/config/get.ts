import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
import { Config, ConfigStore, keytarPath, configPath } from '../../config';
const yaml = require('js-yaml');

/**
 * Get resources
 */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('config [name]')
      .description('Get tubectl client config entry')
      .action(async (opts, args, rest) => {
        var config = ConfigStore.get(optparse.parent.parsedOpts);
        console.log(yaml.dump(config));
      });
  }
}
