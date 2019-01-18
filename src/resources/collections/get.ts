import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';

/**
 *  * Edit resources
 *   */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('collections [name]')
      .alias('co')
      .description('Get collections')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Collections', optparse.parent.parsedOpts);
        var instance = new Get(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    if (opts.watch) {
      if (args.name) {
        var request = this.api.watchCollections(this.getNamespace(opts), ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = this.api.watchCollections(this.getNamespace(opts), ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        var response = await this.api.getCollection(this.getNamespace(opts), args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await this.api.getCollections(this.getNamespace(opts), ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
