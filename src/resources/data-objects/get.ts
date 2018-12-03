import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';

/**
 * Get resources
 */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('data-objects <namespace> <collection> [name]')
      .alias('do')
      .description('Get data objects')
      .action(async (opts, args, rest) => {
        var api = await client.factory('DataObjects', optparse.parent.parsedOpts);
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
        var request = this.api.watchObjects(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = this.api.watchObjects(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        if (opts.history || opts.diff[0]) {
          var response = await this.api.getObjectHistory(
            args.namespace,
            args.collection,
            args.name,
            this.getFields(opts),
          );
          this.getObjects(response, opts);
        } else {
          var response = await this.api.getObject(args.namespace, args.collection, args.name, this.getFields(opts));
          this.getObjects(response, opts);
        }
      } else {
        var response = await this.api.getObjects(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
