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
      .subCommand<GetOptions, GetArgs>('data-objects <mandator> <datatype> [name]')
      .alias('do')
      .description('Get data objects')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Data', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchObjects(args.mandator, args.datatype, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchObjects(args.mandator, args.datatype, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        if(opts.history) {
          var response = await category.getObjectHistory(args.mandator, args.datatype, args.name, this.getFields(opts));
          this.getObjects(response, opts);
        } else {
          var response = await category.getObject(args.mandator, args.datatype, args.name, this.getFields(opts));
          this.getObjects(response, opts);
        }
      } else {
        var response = await category.getObjects(args.mandator, args.datatype, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
