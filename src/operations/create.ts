import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import AccessRoles from '../resources/access.roles/create';
import Namespaces from '../resources/namespaces/create';
import AccessRules from '../resources/access.rules/create';
import Collections from '../resources/collections/create';
import DataObjects from '../resources/data-objects/create';
import Relations from '../resources/relations/create';
import Endpoints from '../resources/endpoints/create';
import Jobs from '../resources/jobs/create';
import Workflows from '../resources/workflows/create';
import Secrets from '../resources/secrets/create';
import Users from '../resources/users/create';

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

export interface CreateOptions {
  file: string;
  input: string;
  fromTemplate: string;
}

export interface CreateArgs {
  resource: string;
  name?: string;
}

/**
 * Operation
 */
export default class Create {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<CreateOptions, CreateArgs>('create').description('Create resources');

    for (let resource of map) {
      let instance = new resource(remote, client);
      let sub = instance.applyOptions();
      sub
        .option('-i, --input <name>', 'Define the input format (One of yaml,json)')
        .option('-f, -file <name>', 'File to read from')
        .option('--from-template [name]', 'Opens the editor with a predefined template');
    }
  }
}
