import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { SyncOptions, SyncArgs } from '../../operations/sync';
import AbstractSync from '../abstract.sync';

/**
 * Sync resources
 */
export default class Sync extends AbstractSync {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<SyncOptions, SyncArgs>, client: TubeeClient) {
    return optparse
      .subCommand<SyncOptions, SyncArgs>('data-objects <namespace> <collection> [name]')
      .alias('do')
      .description('Sync data objects')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Jobs', optparse.parent.parsedOpts);
        var instance = new Sync(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var filter = null;
    if (args.name) {
      rest.push(args.name);
    }

    var resource = {
      data: {
        namespaces: [args.namespace],
        collections: [args.collection],
        filter: rest,
      },
    };

    this.addProcess(resource, opts, args, rest);
  }
}
