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
      .subCommand<CreateOptions, CreateArgs>('datatypes [mandator] [name]')
      .alias('dt')
      .description('Create new datatypes')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Datatypes', this.optparse.parent.parsedOpts);

    this.createObjects('datatype', args, opts, async resource => {
      var mandator = resource.mandator;
      delete resource.mandator;
      return await api.addDatatype(args.mandator, resource);
    });
  }
}
