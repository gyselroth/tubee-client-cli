import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import AccessRoles from '../resources/access.roles/delete';
import Mandators from '../resources/mandators/delete';
import AccessRules from '../resources/access.rules/delete';
import DataTypes from '../resources/datatypes/delete';
import DataObjects from '../resources/data-objects/delete';
import Endpoints from '../resources/endpoints/delete';
import Jobs from '../resources/jobs/delete';
import Workflows from '../resources/workflows/delete';

const map = [AccessRoles, AccessRules, Mandators, DataTypes, DataObjects, Endpoints, Jobs, Workflows];

export interface DeleteOptions {}

export interface DeleteArgs {
  resource: string;
  name?: string[];
}

/**
 * Operation
 */
export default class Delete {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<DeleteOptions, DeleteArgs>('delete').description('Delete resources');

    for (let resource of map) {
      let instance = new resource(remote, client);
      let sub = instance.applyOptions();
    }
  }
}
