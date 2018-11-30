import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
const JSONStream = require('JSONStream');
const es = require('event-stream');
const colors = require('colors');

/**
 * Edit resources
 */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('job-logs <job> [name]')
      .alias('jl')
      .description('Get synchronization logs')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Logs', optparse.parent.parsedOpts);
        var instance = new Get(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async getObjects(response, opts) {
    if (!opts.output[0] || opts.output[0] === 'message') {
      for (let resource of response.response.body.data) {
        console.log(
          '%s %s %s',
          resource.data.created,
          Get.colorize(resource.data.level_name),
          resource.data.this.api,
          resource.data.message,
        );
      }

      return;
    }

    return super.getObjects(response, opts);
  }

  /**
   * Realtime updates
   */
  public async watchObjects(request, opts) {
    if (!opts.output[0] || opts.output[0] === 'message') {
      return request.pipe(JSONStream.parse('*')).pipe(
        es.mapSync(data => {
          console.log(
            '%s %s %s',
            data[1].created,
            Get.colorize(data[1].data.level_name),
            data[1].data.this.api,
            data[1].data.message,
          );
        }),
      );
    }

    return super.watchObjects(request, opts);
  }

  /**
   * Colorize log level
   */
  public static colorize(status): string {
    switch (status) {
      case 'DEBUG':
        return colors.bgBlue(status);
        break;
      case 'INFO':
        return colors.bgCyan(status);
        break;
      case 'WARNING':
        return colors.bgYellow(status);
        break;
      case 'ERROR':
      default:
        return colors.bgRed(status);
    }
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    if (opts.watch) {
      if (args.name) {
        var request = this.api.watchJobLogs(args.job, args.name, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = await this.api.watchJobLogs(args.job, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.log) {
        var response = await this.api.getJobLog(args.job, args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await this.api.getJobLogs(args.job, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
