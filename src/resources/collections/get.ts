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
      .subCommand<GetOptions, GetArgs>('collections <namespace> [name]')
      .alias('co')
      .description('Get collections')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Collections', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchCollections(args.namespace, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchCollections(args.namespace, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        var response = await category.getCollection(args.namespace, args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await category.getCollections(args.namespace, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
