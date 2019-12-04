import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
const colors = require('colors');
const moment = require('moment');
import EndpointObjects from '../endpoint-objects/get';
import Workflows from '../workflows/get';

/**
 * Get resources
 */
export default class Get extends AbstractGet {
  /**
   * Names
   */
  protected names = ['endpoints', 'ep'];

  /**
   * Children
   */
  protected children = [
    { resource: EndpointObjects, names: ['endpoint-objects', 'eo'] },
    { resource: Workflows, names: ['workflows', 'wf'] },
  ];

  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('endpoints <collection> [name]')
      .option('-l, --logs [name]', 'Request resource logs')
      .option('-T, --trace [name]', 'Request resource logs including stacktraces')
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

    this.getObjects(response, args, opts, ['Name', 'Type', 'Status', 'Version', 'Created', 'Changed'], resource => {
      return [
        resource.name,
        resource.data.type,
        this.colorize(resource.status.available),
        resource.version,
        moment(resource.changed).fromNow(),
        moment(resource.created).fromNow(),
      ];
    });
  }

  /**
   * Get recursive resources
   */
  public async recursive(resource, opts, args) {
    for (let child of this.children) {
      let requested = child.names.filter(value => -1 !== opts.whitelist.indexOf(value));
      let newArgs = Object.assign({}, args);

      newArgs.endpoint = resource.name;
      var instance = new child.resource(this.api);

      if (requested.length === 0 && instance.getChildren().length === 0) {
        continue;
      }

      instance.execute(opts, newArgs, {});
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
