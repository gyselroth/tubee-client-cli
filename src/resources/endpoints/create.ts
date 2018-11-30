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
      .subCommand<CreateOptions, CreateArgs>('endpoints [namespace] [collection] [name]')
      .alias('ep')
      .description('Create new endpoints')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Endpoints', optparse.parent.parsedOpts);
        var instance = new Create(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    return this.createObjects('endpoint', args, opts, this.create);
  }

  /**
   * Create
   */
  public async create(resource) {
    let namespace = resource.namespace;
    delete resource.namespace;
    let collection = resource.collection;
    delete resource.collection;
    return this.api.addEndpoint(namespace, collection, resource);
  }
}
