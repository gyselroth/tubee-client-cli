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
      .subCommand<GetOptions, GetArgs>('endpoints <namespace> <collection> [name]')
      .alias('ep')
      .description('Get endpoints')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Endpoints', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchEndpoints(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.watchObjects(request, opts);
      } else {
        var request = category.watchEndpoints(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
        this.watchObjects(response, opts, ['Name', 'Type', 'Status', 'Version', 'Created', 'Changed'], resource => {
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
        var response = await category.getEndpoint(args.namespace, args.collection, args.name, this.getFields(opts));
        this.getObjects(response, opts);
      } else {
        var response = await category.getEndpoints(
          args.namespace,
          args.collection,
          ...this.getQueryOptions(opts, args),
        );
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
