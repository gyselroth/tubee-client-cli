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
      .subCommand<CreateOptions, CreateArgs>('collections [name]')
      .alias('co')
      .description('Create new collections')
      .action(async (opts, args, rest) => {
        var api = await client.factory('v1', optparse.parent.parsedOpts);
        var instance = new Create(api);
        this.executeOperation(instance.execute(opts, args, rest));
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    this.createObjects('Collection', args, opts, async (resource) => {
      return await this.create(resource);
    });
  }

  /**
   * Create
   */
  public create(resource) {
    var namespace = resource.namespace;
    delete resource.namespace;
    return this.api.addCollection(namespace, resource);
  }
}
