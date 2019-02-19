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
      .subCommand<CreateOptions, CreateArgs>('data-objects [collection] [name]')
      .alias('do')
      .description('Create new data objects')
      .action(async (opts, args, rest) => {
        var api = await client.factory('v1', optparse.parent.parsedOpts);
        var instance = new Create(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    this.createObjects('DataObject', args, opts, async resource => {
      return await this.create(resource);
    });
  }

  /**
   * Create
   */
  public create(resource) {
    let namespace = resource.namespace;
    delete resource.namespace;
    let collection = resource.collection;
    delete resource.collection;

    return this.api.addObject(namespace, collection, resource);
  }
}
