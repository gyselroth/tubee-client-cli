import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import AccessRoles from '../resources/access.roles/get';
import Mandators from '../resources/mandators/get';
import AccessRules from '../resources/access.rules/get';
import DataTypes from '../resources/datatypes/get';
import DataObjects from '../resources/data-objects/get';
import Endpoints from '../resources/endpoints/get';
import EndpointObjects from '../resources/endpoint-objects/get';
import Jobs from '../resources/jobs/get';
import Processes from '../resources/processes/get';
import Logs from '../resources/logs/get';
import Workflows from '../resources/workflows/get';

const map = [
  AccessRoles,
  AccessRules,
  Mandators,
  DataTypes,
  DataObjects,
  Endpoints,
  EndpointObjects,
  Jobs,
  Processes,
  Logs,
  Workflows,
];

export interface GetOptions {
  output: string;
  watch: boolean;
  jsonQuery: string;
  fieldSelector: string;
  history: boolean;
  diff: string;
}

export interface GetArgs {
  name?: string;
}

/**
 * Operation
 */
export default class Get {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<GetOptions, GetArgs>('get').description('Get resources');

    for (let resource of map) {
      let instance = new resource(remote, client);
      let sub = instance.applyOptions();
      sub.option('-o, --output <name>', 'Define the output format (One of list,yaml,json)');
      sub.option('-w, --watch', 'Monitor updates in realtime.');
      sub.option('--json-query <name>', 'Specify an advanced json query');
      sub.option(
        '-F, --field-selector <name>',
        'Specify a comma separated field based query (Example: foo=bar,bar=foo)',
      );
      sub.option('-H, --history', 'Will fetch the histroy of the requested resource');
      sub.option(
        '-d, --diff <name>',
        'Compare current version to another version (You will need to expose an environment variable DIFFTOOL (Example: DIFFTOOL=vimdiff tubeectl))',
      );
      sub.option(
        '--field-filter <name>',
        'Specify a comma separated list what attributes should be requested, by default all attributes gets returned. (Example: kind,name)',
      );
      sub.option(
        '-s, --sort <name>',
        'Specify a comma separated list with a sort query (Example: name=asc,changed=desc)',
      );
      sub.option('--json-sort <name>', 'Specify an advanced json sort');
      sub.option(
        '-t, --tail <number>',
        'If tail is specified, the last n objects are retrieved, if numer is not set the last 10 objects get retrieved.',
      );
    }
  }
}
