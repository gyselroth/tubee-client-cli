import { EditOptions, EditArgs } from '../../operations/edit';
import AbstractEdit from '../abstract.edit';

/**
 * Edit resources
 */
export default class Edit extends AbstractEdit {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<EditOptions, EditArgs>('namespaces [name]')
      .alias('ns')
      .description('Edit namespaces')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Namespaces', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getNamespace(args.name, this.getFields(opts));
    } else {
      var response = await api.getNamespaces(...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateNamespace(name, patch);
    });
  }
}
