import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import Namespaces from '../resources/namespaces/sync';
import Collections from '../resources/collections/sync';
import DataObjects from '../resources/data-objects/sync';
import Endpoints from '../resources/endpoints/sync';
import Jobs from '../resources/jobs/sync';

const map = [Namespaces, Collections, DataObjects, Endpoints, Jobs];

export interface SyncOptions {
  follow: boolean;
  trace: boolean;
  abortOnError: boolean;
  level: string;
  output: string;
  namespace: string;
}

export interface SyncArgs {
  resource: string;
  name?: string;
}

/**
 * Operation
 */
export default class Sync {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<SyncOptions, SyncArgs>('sync').description('Sync resources');

    for (let resource of map) {
      let sub = resource.applyOptions(remote, client);
      sub.option(
        '-n, --namespace <name>',
        'Most resources have a namespace, request different namespace. The default namespace is "default".',
      );
      sub.option('-f, --follow', 'Follow process and watch in forderground');
      sub.option('-t, --trace', 'Follow process and watch in forderground but include full backtraces');
      sub.option('-l, --level <name>', 'Specify log level for the process (emerg,error,warning,info,debug)');
      sub.option('-s, --simulate', 'Simulate sync process (No changes are made)');
      sub.option('--abort-on-error', 'Abort process if an error occurs');
      sub.option(
        '-o, --output <name>',
        'Define the output format (One of list,yaml,json,cc=field:my.field). Using cc you may request a customized list with the fields you want.',
      );
    }
  }
}
