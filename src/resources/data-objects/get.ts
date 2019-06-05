import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';

/**
 * Get resources
 */
export default class Get extends AbstractGet {
  /**
   * Names
   */
  protected names = ['data-objects', 'do'];

  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('data-objects <collection> [name]')
      .option('-l, --logs [name]', 'Request resource logs')
      .option('-T, --trace [name]', 'Request resource logs including stacktraces')
      .option('-r, --relations [name]', 'Get object relations')
      .alias('do')
      .description('Get data objects')
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
      if (opts.relations.length > 0) {
        if (opts.relations[0] === '') {
          var response = await this.api.getObjectRelations(
            this.getNamespace(opts),
            args.collection,
            args.name,
            ...this.getQueryOptions(opts, args),
          );
          this.getObjects(response, args, opts);
        } else {
        }
      } else if (opts.logs.length > 0) {
        if (opts.logs[0] == '') {
          var response = await this.api.getObjectLogs(
            this.getNamespace(opts),
            args.collection,
            args.name,
            ...this.getQueryOptions(opts, args),
          );
          this.getObjects(response, args, opts);
        } else {
          var response = await this.api.getObjectLog(
            this.getNamespace(opts),
            args.collection,
            args.name,
            args.logs[0],
            this.getFields(opts),
          );
          this.getObjects(response, args, opts);
        }
      } else if (opts.history || opts.diff.length > 0) {
        var response = await this.api.getObjectHistory(
          this.getNamespace(opts),
          args.collection,
          args.name,
          ...this.getQueryOptions(opts, args),
        );
        this.getObjects(response, args, opts);
      } else {
        var response = await this.api.getObject(
          this.getNamespace(opts),
          args.collection,
          args.name,
          this.getFields(opts),
        );
        this.getObjects(response, args, opts);
      }
    } else {
      var response = await this.api.getObjects(
        this.getNamespace(opts),
        args.collection,
        ...this.getQueryOptions(opts, args),
      );
      this.getObjects(response, args, opts);
    }
  }
}
