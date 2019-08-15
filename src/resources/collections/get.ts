import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';
import DataObjects from '../data-objects/get';
import Endpoints from '../endpoints/get';

/**
 * Get resources
 */
export default class Get extends AbstractGet {
  /**
   * Names
   */
  protected names = ['collections', 'co'];

  /**
   * Children
   */
  protected children = [
    { resource: DataObjects, names: ['data-objects', 'do'] },
    { resource: Endpoints, names: ['endpoints', 'eo'] },
  ];

  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('collections [name]')
      .option('-l, --logs [name]', 'Request resource logs')
      .option('-T, --trace [name]', 'Request resource logs including stacktraces')
      .alias('co')
      .description('Get collections')
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
          var response = await this.api.getCollectionLogs(
            this.getNamespace(opts),
            args.name,
            ...this.getQueryOptions(opts, args),
          );
          this.getObjects(response, args, opts);
        } else {
          var response = await this.api.getCollectionLog(
            this.getNamespace(opts),
            args.name,
            args.logs[0],
            this.getFields(opts),
          );
          this.getObjects(response, args, opts);
        }
      } else {
        var response = await this.api.getCollection(this.getNamespace(opts), args.name, this.getFields(opts));
        this.getObjects(response, args, opts);
      }
    } else {
      var response = await this.api.getCollections(this.getNamespace(opts), ...this.getQueryOptions(opts, args));
      this.getObjects(response, args, opts);
    }
  }

  /**
   * Get recursive resources
   */
  public async recursive(resource, opts, args) {
    for (let child of this.children) {
      let requested = child.names.filter(value => -1 !== opts.whitelist.indexOf(value));
      let newArgs = Object.assign({}, args);

      newArgs.collection = resource.name;
      var instance = new child.resource(this.api);

      if (requested.length === 0 && instance.getChildren().length === 0) {
        continue;
      }

      instance.execute(opts, newArgs, {});
    }
  }
}
