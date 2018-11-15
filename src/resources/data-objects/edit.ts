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
      .subCommand<EditOptions, EditArgs>('data-objects <mandator> <datatype> [name]')
      .alias('do')
      .description('Edit data objects')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Data', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getObject(args.mandator, args.datatype, args.name, this.getFields(opts));
    } else {
      var response = await api.getObjects(args.mandator, args.datatype, this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
console.log(name,patch);
      var r = await api.updateObject(args.mandator, args.datatype, name, patch);
console.log(r);
    });
  }
}
