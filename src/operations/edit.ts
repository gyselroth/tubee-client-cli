import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import AccessRoles from '../resources/access-roles/edit';
import Namespaces from '../resources/namespaces/edit';
import AccessRules from '../resources/access-rules/edit';
import Collections from '../resources/collections/edit';
import DataObjects from '../resources/data-objects/edit';
import Relations from '../resources/relations/edit';
import Endpoints from '../resources/endpoints/edit';
import Jobs from '../resources/jobs/edit';
import Workflows from '../resources/workflows/edit';
import Secrets from '../resources/secrets/edit';
import Users from '../resources/users/edit';

const map = [
  AccessRoles,
  AccessRules,
  Namespaces,
  Collections,
  DataObjects,
  Relations,
  Endpoints,
  Jobs,
  Workflows,
  Secrets,
  Users,
];

export interface EditOptions {
  output: string;
  file: string;
  jsonQuery: string;
  fieldFilter: string;
  fieldSelector: string;
  namespace: string;
  limit: number;
  sort: string;
  tail: boolean;
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
      let sub = resource.applyOptions(remote, client);
      sub
        .option('-n, --namespace <name>', 'Most resources have a namespace, request different namespace. The default namespace is "default".')
        .option('-o, --output <name>', 'Define the output format (One of yaml,json)')
        .option('-f, -file <name>', 'File to read from')
        .option('--json-query <name>', 'Specify an advanced json query')
        .option('-l --limit <number>', 'Max number of resources to be returned. May not be higher than 100.')
        .option('-q, --field-selector <name>', 'Specify a comma separated field based query (Example: foo=bar,bar=foo)')
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
