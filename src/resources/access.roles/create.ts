import { CreateOptions, CreateArgs } from '../../operations/create';
import AbstractCreate from '../abstract.create';

/**
 * Create resources
 */
export default class Create extends AbstractCreate {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<CreateOptions, CreateArgs>('access-roles [name]')
      .description('Create new access roles')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('AccessRoles', this.optparse.parent.parsedOpts);

    this.createObjects('access-role', args, opts, async resource => {
      return await api.addAccessRole(resource);
    });
  }
}
