import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { CreateOptions, CreateArgs } from '../../operations/create';
import AbstractCreate from '../abstract.create';

/**
 * Create resources
 */
export default class Create extends AbstractCreate {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<CreateOptions, CreateArgs>, client: TubeeClient) {
    return optparse
      .subCommand<CreateOptions, CreateArgs>('access-rules [name]')
      .alias('au')
      .description('Create new access rules')
      .action(async (opts, args, rest) => {
        var api = await client.factory('AccessRules', optparse.parent.parsedOpts);
        var instance = new Create(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    this.createObjects('AccessRule', args, opts, async resource => {
      return await this.create(resource);
    });
  }
  
  /**
   * Create
   */
  public create(resource) {
    return this.api.createAccessRule(resource);
  }
}
