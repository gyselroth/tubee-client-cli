import { DeleteOptions, DeleteArgs } from '../../operations/delete';
import AbstractDelete from '../abstract.delete';

/**
 * Delete resources
 */
export default class Delete extends AbstractDelete {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<DeleteOptions, DeleteArgs>('relations <mandator> <datatype> <object> <relative')
      .alias('or')
      .description('Delete data object relation')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Data', this.optparse.parent.parsedOpts);
    await api.deleteObjectRelative(args.mandator, args.datatype, args.object, args.relative);
    console.log('resource %s has been deleted', args.name);
  }
}
