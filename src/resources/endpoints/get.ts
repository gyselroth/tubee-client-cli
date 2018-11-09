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
      .subCommand<GetOptions, GetArgs>('endpoints <mandator> <datatype> [name]')
      .description('Get endpoints')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Endpoints', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchEndpoints(args.mandator, args.datatype, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchEndpoints(args.mandator, args.datatype, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        var response = await category.getEndpoint(args.mandator, args.datatype, args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await category.getEndpoints(args.mandator, args.datatype, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
