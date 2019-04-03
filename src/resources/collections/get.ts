import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';

/**
 *  * Edit resources
 *   */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('collections [name]')
      .option('-l, --logs [name]', 'Request resource logs')
      .option('-t, --trace [name]', 'Request resource logs including stacktraces')
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
}
