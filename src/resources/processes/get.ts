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
      .subCommand<GetOptions, GetArgs>('processes <namespace> [name]')
      .alias('ps')
      .description('Get processes')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Jobs', optparse.parent.parsedOpts);
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
        var request = this.api.watchProcesses(args.namespace, ...this.getQueryOptions(opts, args));
      } else {
        var request = this.api.watchProcesses(args.namespace, ...this.getQueryOptions(opts, args));
      }

      this.watchObjects(response, opts, ['Name', 'Status', 'Took', 'Started', 'Ended'], resource => {
        return this.prettify(resource);
      });
    } else {
      if (args.name) {
        var response = await this.api.getProcess(args.namespace, this.getFields(opts));
      } else {
        var response = await this.api.getProcesses(args.namespace, ...this.getQueryOptions(opts, args));
      }

      this.getObjects(response, opts, ['Name', 'Status', 'Took', 'Started', 'Ended'], resource => {
        return this.prettify(resource);
      });
    }
  }

  /**
   * Prettify
   */
  protected prettify(resource) {
    var started = '<Not yet>';
    var ended = '<Not yet>';

    if (resource.status.code > 0) {
      started = ta.ago(resource.status.started);
    }

    if (resource.status.code > 2) {
      ended = ta.ago(resource.status.ended);
    }

    return [resource.name, Get.colorize(resource.status), this.timeDiff(resource) + 's', started, ended];
  }

  /**
   * Calc diff
   */
  protected timeDiff(process) {
    if (process.status.started == null || process.status.ended == null) {
      return 0;
    }

    var startDate = new Date(process.status.started);
    var endDate = new Date(process.status.ended);
    return (endDate.getTime() - startDate.getTime()) / 1000;
  }

  /**
   * Colorize process status
   */
  public static colorize(status): string {
    switch (status.code) {
      case 0:
        return colors.bgBlue(status.result);
        break;
      case 1:
        return colors.bgYellow(status.result);
        break;
      case 2:
        return colors.bgCyan(status.result);
        break;
      case 3:
        return colors.bgGreen(status.result);
        break;
      case 4:
      case 5:
      case 6:
      default:
        return colors.bgRed(status.result);
    }
  }
}
