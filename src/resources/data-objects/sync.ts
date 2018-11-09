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
      .subCommand<SyncOptions, SyncArgs>('data-objects <mandator> <datatype> [name]')
      .description('Sync data objects')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Jobs', this.optparse.parent.parsedOpts);

    if (args.name) {
      rest.push(args.name);
    }

    var result = await api.addProcess({
      mandators: [args.mandator],
      datatypes: [args.datatype],
      filter: rest,
    });

    this.sync(result, opts);
  }
}
