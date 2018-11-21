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
  public applyOptions() {
    return this.optparse
      .subCommand<GetOptions, GetArgs>('jobs [name]')
      .description('Get synchronization jobs')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Jobs', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchJobs(...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchJobs(...this.getQueryOptions(opts, args));
        this.watchObjects(response, opts, ['Name', 'Last status', 'Last execution', 'Last started at', 'Last ended at'], resource => {
          return this.prettify(resource);
        });
      }
    } else {
      if (args.name) {
        var response = await category.getJob(args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await category.getJobs(...this.getQueryOptions(opts, args));
        this.getObjects(response, opts, ['Name', 'Last status', 'Last execution', 'Last started at', 'Last ended at'], resource => {
          return this.prettify(resource);
        });
      }
    }
  }

  /**
   * Prettify
   */
  protected prettify(resource) {
    var started = '<Not yet>';
    var ended = '<Not yet>';
    var status;    

    if(resource.status.status === true && resource.status.last_process.code > 0) {
      started = ta.ago(resource.status.started);
    }
    
    if(resource.status.status === true && resource.status.last_process.code > 2) {
      ended = ta.ago(resource.status.ended);
    }

    if(resource.status.status === false) {
      status = colors.bgRed('unknown'); 
    } else {
      status = ProcessGet.colorize(resource.status.last_process);
    }

    return [resource.name, status, this.timeDiff(resource)+'s', started, ended];
  }

  /**
   * Calc diff
   */
  protected timeDiff(resource) {
    if(resource.status.status === false || resource.status.last_process.started == null || resource.status.last_process.ended == null) {
      return 0;
    }

    var startDate = new Date(resource.status.last_process.started);
    var endDate   = new Date(resource.status.last_process.ended);
    return (endDate.getTime() - startDate.getTime()) / 1000;
  }
}
