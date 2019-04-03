import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
import ProcessGet from '../processes/get';
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
      .subCommand<GetOptions, GetArgs>('jobs [name]')
      .description('Get synchronization jobs')
      .option('-l, --logs [name]', 'Request resource logs')
      .option('-t, --trace', 'Including log stacktraces')
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
          var response = await this.api.getJobLogs(
            this.getNamespace(opts),
            args.name,
            ...this.getQueryOptions(opts, args),
          );
          this.getObjects(response, args, opts);
        } else {
          var response = await this.api.getJobLog(
            this.getNamespace(opts),
            args.name,
            args.logs[0],
            this.getFields(opts),
          );
          this.getObjects(response, args, opts);
        }
      } else {
        var response = await this.api.getJob(this.getNamespace(opts), args.name, this.getFields(opts));
        this.getObjects(response, args, opts);
      }
    } else {
      var response = await this.api.getJobs(this.getNamespace(opts), ...this.getQueryOptions(opts, args));
      this.getObjects(
        response,
        args,
        opts,
        ['Name', 'Last status', 'Last execution', 'Last started at', 'Last ended at'],
        resource => {
          return this.prettify(resource);
        },
      );
    }
  }

  /**
   * Prettify
   */
  protected prettify(resource) {
    var started = '<Not yet>';
    var ended = '<Not yet>';
    var status;

    if (resource.status.status === true && resource.status.last_process.code > 0) {
      started = ta.ago(resource.status.last_process.started);
    }

    if (resource.status.status === true && resource.status.last_process.code > 2) {
      ended = ta.ago(resource.status.last_process.ended);
    }

    if (resource.status.status === false) {
      status = colors.bgRed('unknown');
    } else {
      status = ProcessGet.colorize(resource.status.last_process);
    }

    return [resource.name, status, this.timeDiff(resource) + 's', started, ended];
  }

  /**
   * Calc diff
   */
  protected timeDiff(resource) {
    if (
      resource.status.status === false ||
      resource.status.last_process.started == null ||
      resource.status.last_process.ended == null
    ) {
      return 0;
    }

    var startDate = new Date(resource.status.last_process.started);
    var endDate = new Date(resource.status.last_process.ended);
    return (endDate.getTime() - startDate.getTime()) / 1000;
  }
}
