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
      .subCommand<SyncOptions, SyncArgs>('datatypes <mandator> [name]')
      .alias('dt')
      .description('Sync datatypes')
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
        mandators: [args.mandator],
        datatypes: rest,
      }
    };

    this.addProcess(resource, opts, args, rest);
  }
}
