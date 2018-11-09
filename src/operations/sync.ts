import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import Mandators from '../resources/mandators/sync';
import DataTypes from '../resources/datatypes/sync';
import DataObjects from '../resources/data-objects/sync';
import Endpoints from '../resources/endpoints/sync';

const map = [Mandators, DataTypes, DataObjects, Endpoints];

export interface SyncOptions {
  follow: boolean;
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
      let instance = new resource(remote, client);
      let sub = instance.applyOptions();
      sub.option('-l, --follow', 'Follow process and watch in forderground');
    }
  }
}
