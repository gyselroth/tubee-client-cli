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
      .subCommand<CreateOptions, CreateArgs>('workflows [namespace] [collection] [endpoint] [name]')
      .alias('wf')
      .description('Create workflows')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Workflows', this.optparse.parent.parsedOpts);

    this.createObjects('workflow', args, opts, async resource => {
      let namespace = resource.namespace;
      delete resource.namespace;
      let collection = resource.collection;
      delete resource.collection;
      let endpoint = resource.endpoint;
      delete resource.endpoint;
      var r = await api.addWorkflow(namespace, collection, endpoint, resource);
      console.log(r);
    });
  }
}
