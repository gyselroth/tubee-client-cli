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
      .subCommand<CreateOptions, CreateArgs>('data-objects [mandator] [datatype] [name]')
      .alias('do')
      .description('Create new data objects')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Data', this.optparse.parent.parsedOpts);

    this.createObjects('data-object', args, opts, async resource => {
      let mandator = resource.mandator;
      delete resource.mandator;
      let datatype = resource.datatype;
      delete resource.datatype;

      return await api.addEndpoint(mandator, resource.datatype, resource);
    });
  }
}
