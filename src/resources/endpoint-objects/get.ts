import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';

/**
 *  * Edit resources
 *   */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<GetOptions, GetArgs>('endpoint-objects <mandator> <datatype> <endpoint> [name]')
      .alias('eo')
      .description('Get objects from endpoint')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Data', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await category.getEndpointObject(
        args.mandator,
        args.datatype,
        args.endpoint,
        args.name,
        this.getFields(opts),
      );
      this.getObjects(response, opts);
    } else {
      var response = await category.getEndpointObjects(
        args.mandator,
        args.datatype,
        args.endpoint,
        ...this.getQueryOptions(opts, args),
      );

      this.getObjects(response, opts);
    }
  }
}
