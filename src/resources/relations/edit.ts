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
      .subCommand<EditOptions, EditArgs>('relations <mandator> <datatype> <object> [name]')
      .alias('or')
      .description('Edit data object relations')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Data', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getObjectRelative(args.mandator, args.datatype, args.object, args.name, this.getFields(opts));
    } else {
      var response = await api.getObjectRelatives(args.mandator, args.datatype, args.object, this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateObjectRelative(args.mandator, args.datatype, args.object, name, patch);
    });
  }
}
