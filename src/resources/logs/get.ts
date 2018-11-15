import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
const JSONStream = require('JSONStream');
const es = require('event-stream');
const colors = require('colors');

/**
 *  * Edit resources
 *   */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<GetOptions, GetArgs>('logs <job> [process] [name]')
      .description('Get synchronization logs')
      .action(this.execute.bind(this));
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
          resource.data.category,
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
            data[1].data.category,
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
        return colors.bgOrange(status);
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
    var category = await this.client.factory('Jobs', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.process) {
        var request = category.watchProcessLogs(args.job, args.process, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = await category.watchJobLogs(args.job, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      }
    } else {
      if (args.log) {
        var response = await category.getProcessLog(args.job, args.process, args.logs, this.getFields(opts));
        this.getObjects(response, opts);
      } else if (args.process) {
        var response = await category.getProcessLogs(args.job, args.process, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      } else {
        var response = await category.getJobLogs(args.job, ...this.getQueryOptions(opts, args));
        this.getObjects(response, opts);
      }
    }
  }
}
