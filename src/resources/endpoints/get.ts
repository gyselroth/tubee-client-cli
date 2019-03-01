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
      .subCommand<GetOptions, GetArgs>('endpoints <collection> [name]')
      .option('-l, --logs [name]', 'Request resource logs')
      .option('-t, --trace [name]', 'Request resource logs including stacktraces')
      .alias('ep')
      .description('Get endpoints')
      .action(async (opts, args, rest) => {
        var api = await client.factory('v1', optparse.parent.parsedOpts);
        var instance = new Get(api);
        this.executeOperation(instance.execute(opts, args, rest));
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    if (args.name) {
      if (opts.logs.length > 0) {
        if (opts.logs[0] == '') {
          var response = await this.api.getEndpointLogs(
            this.getNamespace(opts),
            args.collection,
            args.name,
            ...this.getQueryOptions(opts, args),
          );
        } else {
          var response = await this.api.getEndpointLog(
            this.getNamespace(opts),
            args.collection,
            args.name,
            args.logs[0],
            this.getFields(opts),
          );
        }
      } else {
        var response = await this.api.getEndpoint(
          this.getNamespace(opts),
          args.collection,
          args.name,
          this.getFields(opts),
        );
      }
    } else {
      var response = await this.api.getEndpoints(
        this.getNamespace(opts),
        args.collection,
        ...this.getQueryOptions(opts, args),
      );
    }

    this.getObjects(response, opts, ['Name', 'Type', 'Status', 'Version', 'Created', 'Changed'], resource => {
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
