import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
const colors = require('colors');
const prettyMilliseconds = require('pretty-ms');
const moment = require('moment');

/**
 * Get resources
 */
export default class Get extends AbstractGet {
  /**
   * Names
   */
  protected names = ['processes', 'ps'];

  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('processes [name]')
      .option('-l, --logs [name]', 'Request resource logs')
      .option('-T, --trace [name]', 'Request resource logs including stacktraces')
      .alias('ps')
      .description('Get processes')
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
          var response = await this.api.getProcessLogs(
            this.getNamespace(opts),
            args.name,
            ...this.getQueryOptions(opts, args),
          );
        } else {
          var response = await this.api.getProcessLog(
            this.getNamespace(opts),
            args.name,
            args.logs[0],
            ...this.getQueryOptions(opts, args),
          );
        }
      } else {
        var response = await this.api.getProcess(
          this.getNamespace(opts),
          args.name,
          ...this.getQueryOptions(opts, args),
        );
      }
    } else {
      var response = await this.api.getProcesses(this.getNamespace(opts), ...this.getQueryOptions(opts, args));
    }

    this.getObjects(
      response,
      args,
      opts,
      ['Name', 'Status', 'Progress', 'Started', 'Estimated', 'Took', 'Parent'],
      (resource) => {
        return this.prettify(resource);
      },
    );
  }

  /**
   * Prettify
   */
  protected prettify(resource) {
    var started = '<Not yet>';
    var estimated = '<finished>';

    if (resource.status.code > 0) {
      started = moment(resource.status.started).fromNow();
    }

    switch (resource.status.code) {
      case 0:
      case 1:
        estimated = '<Not yet>';
        break;

      case 2:
        if (resource.status.estimated === null) {
          estimated = '<Not data>';
        } else {
          estimated = moment(resource.status.estimated).fromNow();
        }
        break;

      case 5:
        started = '<Not data>';
        estimated = '<Not data>';
        break;

      default:
        estimated = moment(resource.status.ended).fromNow();
    }

    return [
      resource.name,
      Get.colorize(resource.status),
      resource.status.progress + '%',
      started,
      estimated,
      this.timeDiff(resource),
      resource.status.parent || '<main>',
    ];
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
    return prettyMilliseconds(endDate.getTime() - startDate.getTime(), { compact: true });
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
