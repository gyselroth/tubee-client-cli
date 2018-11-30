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
      .subCommand<CreateOptions, CreateArgs>('endpoints [namespace] [collection] [name]')
      .alias('ep')
      .description('Create new endpoints')
      .action(this.execute.bind(this));
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
    var api = await this.client.factory('Endpoints', this.optparse.parent.parsedOpts);
    let namespace = resource.namespace;
    delete resource.namespace;
    let collection = resource.collection;
    delete resource.collection;
    return api.addEndpoint(namespace, collection, resource);
  }
}
