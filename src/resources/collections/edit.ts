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
      .subCommand<EditOptions, EditArgs>('collections <namespace> [name]')
      .alias('co')
      .description('Edit collection')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Datatypes', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getDatatype(args.namespace, args.name, this.getFields(opts));
    } else {
      var response = await api.getDatatypes(args.namespace, ...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateDatatype(args.namespace, name, patch);
    });
  }
}
