import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
const yaml = require('js-yaml');
const fs = require('fs');
import TubeeClient from '../tubee.client';
import AccessRoles from '../resources/access-roles/create';
import Namespaces from '../resources/namespaces/create';
import AccessRules from '../resources/access-rules/create';
import Collections from '../resources/collections/create';
import DataObjects from '../resources/data-objects/create';
import Relations from '../resources/relations/create';
import Endpoints from '../resources/endpoints/create';
import Jobs from '../resources/jobs/create';
import Processes from '../resources/processes/create';
import Workflows from '../resources/workflows/create';
import Secrets from '../resources/secrets/create';
import Users from '../resources/users/create';
import { getFile } from '../loader';
import { validate, identifierMap } from '../validator';

const map = {
  Namespace: Namespaces,
  Secret: Secrets,
  User: Users,
  AccessRole: AccessRoles,
  AccessRule: AccessRules,
  Collection: Collections,
  Endpoint: Endpoints,
  DataObject: DataObjects,
  DataObjectRelation: Relations,
  Workflow: Workflows,
  GarbageWorkflow: Workflows,
  Job: Jobs,
  Process: Processes,
};

const apiMap = {
  Namespace: 'Namespaces',
  Secret: 'Secrets',
  User: 'Users',
  AccessRole: 'AccessRoles',
  AccessRule: 'AccessRules',
  Collection: 'Collections',
  Endpoint: 'Endpoints',
  DataObject: 'DataObjects',
  DataObjectRelation: 'DataObjectRelations',
  Workflow: 'Workflows',
  GarbageWorkflow: 'Workflows',
  Job: 'Jobs',
  Process: 'Jobs',
};

export interface CreateOptions {
  file: string;
  stdin: boolean;
  input: string;
  fromTemplate: string;
  namespace: string;
}

export interface CreateArgs {
  resource: string;
  name?: string;
}

/**
 * Operation
 */
export default class Create {
  protected instances;

  public constructor(instances) {
    this.instances = instances;
  }

  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse
      .subCommand<CreateOptions, CreateArgs>('create')
      .description('Create resources')
      .option('-f, --file <name>', 'File to read from')
      .action(async (opts, args, rest) => {
        var instances = {};
        for (let instance in map) {
          var api = await client.factory(apiMap[instance], optparse.parsedOpts);
          instances[instance] = new map[instance](api);
        }

        var op = new Create(instances);
        op.execute(opts, args, rest);
      });

    for (let resource in map) {
      let sub = map[resource].applyOptions(remote, client);
      sub
        .option(
          '-n, --namespace <name>',
          'Most resources have a namespace, request different namespace. The default namespace is "default".',
        )
        .option('-i, --input <name>', 'Define the input format (One of yaml,json)')
        .option('-f, --file <name>', 'File to read from')
        .option('-s, --stdin', 'Read from stdin')
        .option('-t, --from-template [name]', 'Opens the editor with a predefined template');
    }
  }

  public async execute(opts, args, rest) {
    var body: string = await getFile(opts.file[0]);
    var input = 'yaml';
    var resources;

    try {
      switch (input) {
        case 'json':
          resources = JSON.parse(body);
          break;

        case 'yaml':
        default:
          resources = yaml.load(body);
      }

      this.create(resources);
    } catch (error) {}
  }

  protected async create(resources) {
    if (resources instanceof Array) {
      for (let resource of resources) {
        let result = this.getKind(resource);
        if (result === null) {
          continue;
        }

        if (validate(resource) === false) {
          console.log('resource is not valid, identifiers missing', {
            resource: resource,
            required: identifierMap[resource.kind],
          });

          continue;
        }

        result
          .create(resource)
          .then(() => {
            console.log('Created new resource %s', resource.name);
          })
          .catch((error) => {
            console.log(
              '%s <%s> failed [%s: %s]',
              resource.kind,
              resource.name,
              error.response.body.error,
              error.response.body.message,
            );
          });
      }
    } else if (resources instanceof Object) {
      return this.create([resources]);
    } else {
      console.log('Invalid resource definition, neither a list of resources nor a single valid resource');
    }
  }

  protected getKind(resource) {
    var endpoint = new RegExp('Endpoint$');
    if (endpoint.test(resource.kind)) {
      resource.kind = 'Endpoint';
    }

    if (!resource.kind || !this.instances[resource.kind]) {
      console.log('Invalid resource definition, invalid kind given');
      return null;
    }

    return this.instances[resource.kind];
  }
}
