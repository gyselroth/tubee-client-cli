import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import AccessRoles from '../resources/access-roles/get';
import Namespaces from '../resources/namespaces/get';
import AccessRules from '../resources/access-rules/get';
import Collections from '../resources/collections/get';
import DataObjects from '../resources/data-objects/get';
import Relations from '../resources/relations/get';
import Endpoints from '../resources/endpoints/get';
import EndpointObjects from '../resources/endpoint-objects/get';
import Jobs from '../resources/jobs/get';
import Processes from '../resources/processes/get';
import Workflows from '../resources/workflows/get';
import Secrets from '../resources/secrets/get';
import Users from '../resources/users/get';
import Config from '../resources/config/get';
import array from 'lodash/array';

var map = [
  AccessRoles,
  AccessRules,
  Namespaces,
  Collections,
  DataObjects,
  Relations,
  Endpoints,
  EndpointObjects,
  Jobs,
  Processes,
  Workflows,
  Secrets,
  Users,
  Config,
];

export interface GetOptions {
  output: string;
  watch: boolean;
  jsonQuery: string;
  fieldSelector: string;
  fieldFilter: string;
  history: boolean;
  diff: string;
  stream: boolean;
  sort: string;
  namespace: string;
  limit: number;
  tail: number;
  logs: boolean;
  trace: boolean;
}

export interface GetArgs {
  name?: string;
}

const children = [
  { resource: Namespaces, names: ['namespaces', 'ns'] },
  { resource: Collections, names: ['collections', 'co'] },
  { resource: Relations, names: ['relations', 'dor'] },
  { resource: Jobs, names: ['jobs'] },
  { resource: Processes, names: ['processes', 'ps'] },
  { resource: Secrets, names: ['secrets', 'se'] },
];

/**
 * Operation
 */
export default class Get {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse
      .subCommand<GetOptions, GetArgs>('get')
      .description('Get resources')
      .action((opts, args, rest) => {
        Get.execute(opts, args, rest, client, optparse, remote);
      });

    Get.applyOptions(remote);

    for (let resource of map) {
      let sub = resource.applyOptions(remote, client);
      Get.applyOptions(sub);

      sub.option('-w, --watch', 'Stream updates in realtime (Includes existing resources).');
      sub.option('--stream', 'Stream resources, useful for big datasets.');
      sub.option('-v, --history', 'Fetch the history of the requested resource');
      sub.option(
        '-d, --diff [name]',
        'Compare the current version to the last version (or an earlier version) (By default the diff tool is taken, you may change the diff tool by setting an env variable named DIFFTOOL (Example: DIFFTOOL=vimdiff tubectl))',
      );
    }
  }
  /**
   * Apply get options
   */
  protected static applyOptions(sub) {
    sub.option(
      '-n, --namespace <name>',
      'Most resources have a namespace, request different namespace. The default namespace is "default".',
    );
    sub.option(
      '-o, --output <name>',
      'Define the output format (One of list,yaml,json,cc=field:my.field). Using cc you may request a customized list with the fields you want.',
    );
    sub.option('--json-query <name>', 'Specify an advanced json query');
    sub.option(
      '-L --limit <number>',
      'Max number of resources to be returned. May not be higher than 100, otherwise use --stream.',
    );
    sub.option('-q, --field-selector <name>', 'Specify a comma separated field based query (Example: foo=bar,bar=foo)');
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
      '-t, --tail [number]',
      'If tail is specified, the output gets reversed. Meaning older resources are retrieved first.',
    );
  }

  /**
   * Execute
   */
  public static async execute(opts, args, rest, client, optparse, getCommand) {
    if (rest.length === 0) {
      process.stdout.write(getCommand.helpText());

      return;
    }

    opts.recursive = true;
    opts.whitelist = rest[0].split(',');

    var api = await client.factory('v1', optparse.parsedOpts);
    for (let child of children) {
      var instance = new child.resource(api);

      if (child.resource === Namespaces) {
        args.name = instance.getNamespace(opts);
      } else {
        delete args.name;
      }

      instance.execute(opts, args, rest);
    }
  }
}
