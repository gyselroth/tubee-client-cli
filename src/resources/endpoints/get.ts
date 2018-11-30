import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
const colors = require('colors');
const ta = require('time-ago');

/**
 * Get resources
 */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('endpoints <namespace> <collection> [name]')
      .alias('ep')
      .description('Get endpoints')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Endpoints', optparse.parent.parsedOpts);
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
        var request = this.api.watchEndpoints(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = this.api.watchEndpoints(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.watchObjects(response, opts, ['Name', 'Type', 'Status', 'Version', 'Getd', 'Changed'], resource => {
          return [
            resource.name,
            resource.data.type,
            this.colorize(resource.status.available),
            resource.version,
            ta.ago(resource.changed),
            ta.ago(resource.created),
          ];
        });
      }
    } else {
      if (args.name) {
        var response = await this.api.getEndpoint(args.namespace, args.collection, args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await this.api.getEndpoints(
          args.namespace,
          args.collection,
          ...this.getQueryOptions(opts, args),
        );
        this.getObjects(response, opts, ['Name', 'Type', 'Status', 'Version', 'Getd', 'Changed'], resource => {
          return [
            resource.name,
            resource.data.type,
            this.colorize(resource.status.available),
            resource.version,
            ta.ago(resource.changed),
            ta.ago(resource.created),
          ];
        });
      }
    }
  }

  /**
   * Colorize status
   */
  protected colorize(status): string {
    if (status === true) {
      return colors.bgGreen('ONLINE');
    }

    return colors.bgRed('OFFLIE');
  }
}
