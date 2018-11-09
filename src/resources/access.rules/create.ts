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
      .subCommand<CreateOptions, CreateArgs>('access-rules [name]')
      .description('Create new access rules')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('AccessRules', this.optparse.parent.parsedOpts);

    this.createObjects('access-rule', args, opts, async resource => {
      return await api.addAccessRule(resource);
    });
  }
}
