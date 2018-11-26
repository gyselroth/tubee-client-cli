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
      .subCommand<GetOptions, GetArgs>('secrets [name]')
      .alias('ar')
      .description('Get secrets')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Secrets', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchSecrets(...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchSecrets(...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        var response = await category.getSecret(args.name, ...this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await category.getSecrets(...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
