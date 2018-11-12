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
      .subCommand<EditOptions, EditArgs>('mandators [name]')
      .alias('ma')
      .description('Edit mandators')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Mandators', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getMandator(args.name, this.getFields(opts));
    } else {
      var response = await api.getMandators(...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateMandator(name, patch);
    });
  }
}
