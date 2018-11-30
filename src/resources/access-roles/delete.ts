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
      .subCommand<DeleteOptions, DeleteArgs>('access-roles <namespace> <name>')
      .alias('ar')
      .description('Delete access role')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('AccessRoles', this.optparse.parent.parsedOpts);
    await api.deleteAccessRole(args.name);
    console.log('resource %s has been deleted', args.name);
  }
}
