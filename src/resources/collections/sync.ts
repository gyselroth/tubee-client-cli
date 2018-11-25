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
      .subCommand<SyncOptions, SyncArgs>('collections <namespace> [name]')
      .alias('co')
      .description('Sync collections')
      .action(this.execute.bind(this));
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
        namespaces: [args.namespace],
        collections: rest || ['*'],
        endpoints: ['*'],
      },
    };

    this.addProcess(resource, opts, args, rest);
  }
}
