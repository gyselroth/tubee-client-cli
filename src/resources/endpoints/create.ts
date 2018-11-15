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
      .subCommand<CreateOptions, CreateArgs>('endpoints [mandator] [datatype] [name]')
      .alias('ep')
      .description('Create new endpoints')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Endpoints', this.optparse.parent.parsedOpts);

    this.createObjects('endpoint', args, opts, async resource => {
      let mandator = resource.mandator;
      delete resource.mandator;
      let datatype = resource.datatype;
      delete resource.datatype;
      console.log(resource);
      console.log('add');

      var result = await api.addEndpoint(mandator, datatype, resource);
console.log(result);
      return result;
    });
  }
}
