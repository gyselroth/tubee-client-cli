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
      .subCommand<CreateOptions, CreateArgs>('processes [name]')
      .description('Create new synchronization processes')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Jobs', optparse.parent.parsedOpts);
        var instance = new Create(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    this.createObjects('Process', args, opts, async resource => {
      return await this.create(resource);
    });
  }

  /**
   * Create
   */
  public create(resource) {
    var namespace = resource.namespace;
    delete resource.namespace;
    return this.api.addProcess(namespace, resource);
  }
}
