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
      .subCommand<SyncOptions, SyncArgs>('collections [name]')
      .alias('co')
      .description('Sync collections')
      .action(async (opts, args, rest) => {
        var api = await client.factory('v1', optparse.parent.parsedOpts);
        var instance = new Sync(api);
        this.executeOperation(instance.execute(opts, args, rest));
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    if (args.name) {
      rest.push(args.name);
    }

    var resource = {
      data: {
        collections: rest || ['*'],
        endpoints: ['*'],
      },
    };

    this.addProcess(this.getNamespace(opts), resource, opts, args, rest);
  }
}
