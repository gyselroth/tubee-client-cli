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
      .subCommand<EditOptions, EditArgs>('datatypes <mandator> [name]')
      .alias('dt')
      .description('Edit datatype')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Datatypes', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getDatatype(args.mandator, args.name, this.getFields(opts));
    } else {
      var response = await api.getDatatypes(args.mandator, ...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateDatatype(args.mandator, name, patch);
    });
  }
}
