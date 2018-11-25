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
      .subCommand<CreateOptions, CreateArgs>('namespaces [name]')
      .alias('ns')
      .description('Create new namespaces')
      .option('-s, --sync', 'Sync namespace immediately')
      .option('-l, --follow', 'Watch triggered sync process in forderground (requires --sync)')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Mandators', this.optparse.parent.parsedOpts);

    this.createObjects('namespace', args, opts, async resource => {
      return await api.addMandator(resource.name, resource);
    });
  }
}