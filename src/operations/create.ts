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
import Workflows from '../resources/workflows/create';
import Secrets from '../resources/secrets/create';
import Users from '../resources/users/create';

const map = {
  'AccessRole': AccessRoles,
  'AccessRule': AccessRules,
  'Namespace': Namespaces,
  'Collection': Collections,
  'DataObject': DataObjects,
  'Relation': Relations,
  'Endpoint': Endpoints,
  'Job': Jobs,
  'Workflow': Workflows,
  'Secret': Secrets,
  'User': Users,
};

var instances = {};

export interface CreateOptions {
  file: string;
  stdin: boolean;
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
    let remote = optparse.subCommand<CreateOptions, CreateArgs>('create').description('Create resources')
    .option('-f, --file <name>', 'File to read from')
    .action(Create.execute);

    for (let resource in map) {
      let instance = new map[resource](remote, client);
      let sub = instance.applyOptions();
      sub
        .option('-i, --input <name>', 'Define the input format (One of yaml,json)')
        .option('-f, --file <name>', 'File to read from')
        .option('-s, --stdin', 'Read from stdin')
        .option('--from-template [name]', 'Opens the editor with a predefined template');

      instances[resource] = instance;
    }
  }

  public static execute(opts) {
    var body = fs.readFileSync(opts.file[0]);
    var input = 'yaml';
    var resources;
        try {
          switch (input) {
            case 'json':
               resources = JSON.parse(body);
              break;

            case 'yaml':
            default:
              resources = yaml.safeLoad(body);
          }

          Create.create(resources);
        } catch (error) {
        }
  }

  protected static async create(resources) {
    if (resources instanceof Array) {
      for (let resource of resources) {
        let result = Create.getKind(resource);

        if(result === null) {
          continue;
        }

        result.create(resource).then(() => {
          console.log('Created new resource %s', resource.name);
        }).catch(() => {
          console.log('Failed to create new resource %s', resource);
        });
      }
    } else if (resources instanceof Object) {
      return Create.create([resources]);
    } else {
      console.log('Invalid resource definition, neither a list of resources nor a single valid resource');
    }
  }

  protected static getKind(resource) {
    var endpoint = new RegExp("Endpoint$");
    if(endpoint.test(resource.kind)) {
      resource.kind = 'Endpoint';
    }

    if(!resource.kind || !instances[resource.kind]) {
      console.log('Invalid resource definition, invalid kind given');
      return null;
    }
    
    return instances[resource.kind];
  }
}
