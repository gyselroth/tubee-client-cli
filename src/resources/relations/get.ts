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
      .subCommand<GetOptions, GetArgs>('relations <mandator> <datatype> <object> [name]')
      .alias('or')
      .description('Get data object relations')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Data', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchObjectRelatives(args.mandator, args.datatype, args.object, args.name, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchObjectRelative(args.mandator, args.datatype, args.name, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        var response = await category.getObjectRelative(args.mandator, args.datatype, args.object, args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await category.getObjectRelatives(args.mandator, args.datatype, args.object, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
