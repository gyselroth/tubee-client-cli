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
      .subCommand<DeleteOptions, DeleteArgs>('secrets <mandator> <name>')
      .alias('ar')
      .description('Delete secret')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Secrets', this.optparse.parent.parsedOpts);
    await api.deleteSecret(args.name);
    console.log('resource %s has been deleted', args.name);
  }
}
