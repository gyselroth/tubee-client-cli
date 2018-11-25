import { SyncOptions, SyncArgs } from '../../operations/sync';
import AbstractSync from '../abstract.sync';

/**
 * Sync resources
 */
export default class Sync extends AbstractSync {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<SyncOptions, SyncArgs>('data-objects <namespace> <collection> [name]')
      .alias('do')
      .description('Sync data objects')
      .action(this.execute.bind(this));
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
