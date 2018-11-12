import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
const colors = require('colors');
const ta = require('time-ago');

/**
 *  * Edit resources
 *   */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<GetOptions, GetArgs>('processes [name]')
      .alias('ps')
      .description('Get processes')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Jobs', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchProcesses(...this.getQueryOptions(opts, args));
      } else {
        var request = category.watchProcesses(...this.getQueryOptions(opts, args));
      }

      this.watchObjects(response, opts, ['Name', 'Status', 'Ended', 'Took'], resource => {
        return [resource.name, this.colorize(resource.status.code), ta.ago(resource.changed), ta.ago(resource.created)];
      });
    } else {
      if (args.name) {
        var response = await category.getProcess(this.getFields(opts));
      } else {
        var response = await category.getProcesses(...this.getQueryOptions(opts, args));
      }

      this.getObjects(response, opts, ['Name', 'Status', 'Ended', 'Took'], resource => {
        return [resource.name, this.colorize(resource.status.code), ta.ago(resource.changed), ta.ago(resource.created)];
      });
    }
  }

  /**
   * Colorize process status
   */

  protected colorize(status): string {
    switch (status) {
      case 0:
        return colors.bgBlue(status);
        break;
      case 1:
        return colors.bgCyan(status);
        break;
      case 2:
        return colors.bgGreen(status);
        break;
      case 3:
      case 4:
      case 5:
      case 6:
      default:
        return colors.bgRed(status);
    }
  }
}
