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
      .subCommand<GetOptions, GetArgs>('data-objects <namespace> <collection> [name]')
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
        var request = category.watchObjects(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchObjects(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        if (opts.history || opts.diff[0]) {
          var response = await category.getObjectHistory(
            args.namespace,
            args.collection,
            args.name,
            this.getFields(opts),
          );
          this.getObjects(response, opts);
        } else {
          var response = await category.getObject(args.namespace, args.collection, args.name, this.getFields(opts));
          this.getObjects(response, opts);
        }
      } else {
        var response = await category.getObjects(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
