import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';

/**
 * Get resoures
 */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('workflows [namespace] [collection] [endpoint] [name]')
      .alias('wf')
      .description('Get workflows')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Workflows', optparse.parent.parsedOpts);
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
        var request = this.api.watchWorkflows(
          args.namespace,
          args.collection,
          args.endpoint,
          ...this.getQueryOptions(opts, args),
        );
        this.watchObjects(request, opts);
      } else {
        var request = this.api.watchWorkflows(
          args.namespace,
          args.collection,
          args.endpoint,
          ...this.getQueryOptions(opts, args),
        );
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        var response = await this.api.getWorkflow(
          args.namespace,
          args.collection,
          args.endpoint,
          args.name,
          this.getFields(opts),
        );
        this.getObjects(response, opts);
      } else {
        var response = await this.api.getWorkflows(
          args.namespace,
          args.collection,
          args.endpoint,
          ...this.getQueryOptions(opts, args),
        );
        this.getObjects(response, opts);
      }
    }
  }
}
