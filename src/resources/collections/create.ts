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
      .subCommand<CreateOptions, CreateArgs>('collections [namespace] [name]')
      .alias('co')
      .description('Create new collections')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Collections', this.optparse.parent.parsedOpts);

    this.createObjects('collection', args, opts, async resource => {
      var namespace = resource.namespace;
      delete resource.namespace;
      return await api.addCollection(args.namespace, resource);
    });
  }
}
