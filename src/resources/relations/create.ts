import { CreateOptions, CreateArgs } from '../../operations/create';
import AbstractCreate from '../abstract.create';

/**
 * Create resources
 */
export default class Create extends AbstractCreate {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<CreateOptions, CreateArgs>('relations [namespace] [collection] [name]')
      .alias('re')
      .description('Create new data object relations')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Data', this.optparse.parent.parsedOpts);

    this.createObjects('object-relative', args, opts, async resource => {
      let namespace = resource.namespace;
      delete resource.namespace;
      let collection = resource.collection;
      delete resource.collection;

      return await api.addObjectRelative(namespace, collection, resource);
    });
  }
}
