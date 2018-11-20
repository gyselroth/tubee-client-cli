import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import AccessRoles from '../resources/access.roles/edit';
import Mandators from '../resources/mandators/edit';
import AccessRules from '../resources/access.rules/edit';
import DataTypes from '../resources/datatypes/edit';
import DataObjects from '../resources/data-objects/edit';
import Endpoints from '../resources/endpoints/edit';
import Jobs from '../resources/jobs/edit';
import Workflows from '../resources/workflows/edit';
import Secrets from '../resources/secrets/edit';
import Users from '../resources/users/edit';


const map = [AccessRoles, AccessRules, Mandators, DataTypes, DataObjects, Endpoints, Jobs, Workflows, Secrets, Users];

export interface EditOptions {
  output: string;
  file: string;
  jsonQuery: string;
  fieldSelector: string;
}

export interface EditArgs {
  resource: string;
  name?: string;
}

/**
 * Operation
 */
export default class Edit {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<EditOptions, EditArgs>('edit').description('Edit resources');

    for (let resource of map) {
      let instance = new resource(remote, client);
      let sub = instance.applyOptions();
      sub
        .option('-o, --output <name>', 'Define the output format (One of yaml,json)')
        .option('-f, -file <name>', 'File to read from')
        .option('--json-query <name>', 'Specify an advanced json query')
        .option('-F, --field-selector <name>', 'Specify a comma separated field based query (Example: foo=bar,bar=foo)')
        .option(
          '--field-filter <name>',
          'Specify a comma separated list what attributes should be requested, by default all attributes gets returned. (Example: kind,name)',
        )
        .option(
          '-s, --sort <name>',
          'Specify a comma separated list with a sort query (Example: name=asc,changed=desc)',
        )
        .option('--json-sort <name>', 'Specify an advanced json sort')
        .option(
          '-t, --tail <number>',
          'If tail is specified, the last n objects are retrieved, if numer is not set the last 10 objects get retrieved.',
        );
    }
  }
}
