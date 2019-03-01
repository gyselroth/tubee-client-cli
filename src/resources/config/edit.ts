import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { EditOptions, EditArgs } from '../../operations/edit';
import AbstractEdit from '../abstract.edit';
import { Config, ConfigStore, keytarPath, configPath } from '../../config';

/**
 * Edit resources
 */
export default class Edit extends AbstractEdit {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<EditOptions, EditArgs>, client: TubeeClient) {
    return optparse
      .subCommand<EditOptions, any>('config <name> <value>')
      .description('Edit tubectl client config')
      .action(async (opts, args, rest) => {
        var config = ConfigStore.get(optparse.parent.parsedOpts);
        config[args.name] = args.value;
        ConfigStore.write(optparse.parent.parsedOpts.config[0] || configPath, config);
      });
  }
}
