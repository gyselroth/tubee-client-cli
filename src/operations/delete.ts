import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import AccessRoles from '../resources/access-roles/delete';
import Namespaces from '../resources/namespaces/delete';
import AccessRules from '../resources/access-rules/delete';
import Collections from '../resources/collections/delete';
import DataObjects from '../resources/data-objects/delete';
import Relations from '../resources/relations/delete';
import Endpoints from '../resources/endpoints/delete';
import Jobs from '../resources/jobs/delete';
import Workflows from '../resources/workflows/delete';
import Secrets from '../resources/secrets/delete';
import Users from '../resources/users/delete';

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
      resourece.applyOptions(remote, client);
    }
  }
}
