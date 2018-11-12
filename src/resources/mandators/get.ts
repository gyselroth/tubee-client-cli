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
      .subCommand<GetOptions, GetArgs>('mandators [name]')
      .alias('ma')
      .description('Get mandators')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Mandators', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchMandators(...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchMandators(...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        var response = await category.getMandator(args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await category.getMandators(...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
