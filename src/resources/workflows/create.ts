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
      .subCommand<CreateOptions, CreateArgs>('workflows [mandator] [datatype] [endpoint] [name]')
      .description('Create workflows')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Workflows', this.optparse.parent.parsedOpts);

    this.createObjects('workflow', args, opts, async resource => {
      console.log(resource);
      console.log('1');
      let mandator = resource.mandator;
      delete resource.mandator;
      let datatype = resource.datatype;
      delete resource.datatype;
      let endpoint = resource.endpoint;
      delete resource.endpoint;
      console.log('ADD');
      var res = await api.addWorkflow(mandator, datatype, endpoint, resource);
      console.log(res);
      return res;
    });
  }
}
