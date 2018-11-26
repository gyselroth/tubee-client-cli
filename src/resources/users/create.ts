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
      .subCommand<CreateOptions, CreateArgs>('users [name]')
      .alias('ar')
      .description('Create new users')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Users', this.optparse.parent.parsedOpts);

    this.createObjects('user', args, opts, async resource => {
      return await api.addUser(resource);
    });
  }
}
