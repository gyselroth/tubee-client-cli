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
      .subCommand<CreateOptions, CreateArgs>('secrets [name]')
      .alias('ar')
      .description('Create new secrets')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Secrets', this.optparse.parent.parsedOpts);

    this.createObjects('access-role', args, opts, async resource => {
      return await api.addSecret(resource);
    });
  }
}
