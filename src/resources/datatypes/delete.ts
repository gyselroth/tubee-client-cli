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
      .subCommand<DeleteOptions, DeleteArgs>('datatypes <name>')
      .alias('dt')
      .description('Delete datatype')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Datatypes', this.optparse.parent.parsedOpts);
    await api.deleteDatatype(args.mandator, args.name);
    console.log('resource %s has been deleted', args.name);
  }
}
