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
  'Job': Jobs,
};

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
  protected instances;

  public constructor(instances) {
    this.instances = instances;
  }

  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<CreateOptions, CreateArgs>('create').description('Create resources')
    .option('-f, --file <name>', 'File to read from')
    .action(async (opts, args, rest) => {
      var instances = {};
      for(let instance in map) {
        var api = await client.factory(instance+'s', optparse.parsedOpts);
        instances[instance] = new map[instance](api)
      }

      var op = new Create(instances);
      op.execute(opts, args, rest);
    });

    for (let resource in map) {
      let sub = map[resource].applyOptions(remote, client);
      sub
        .option('-i, --input <name>', 'Define the input format (One of yaml,json)')
        .option('-f, --file <name>', 'File to read from')
        .option('-s, --stdin', 'Read from stdin')
        .option('--from-template [name]', 'Opens the editor with a predefined template');
    }
  }

  public execute(opts, args, rest) {
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

          this.create(resources);
        } catch (error) {
        }
  }

  protected async create(resources) {
    if (resources instanceof Array) {
      for (let resource of resources) {
        let result = this.getKind(resource);

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
      return this.create([resources]);
    } else {
      console.log('Invalid resource definition, neither a list of resources nor a single valid resource');
    }
  }

  protected getKind(resource) {
    var endpoint = new RegExp("Endpoint$");
    if(endpoint.test(resource.kind)) {
      resource.kind = 'Endpoint';
    }

    if(!resource.kind || !this.instances[resource.kind]) {
      console.log('Invalid resource definition, invalid kind given');
      return null;
    }

    return this.instances[resource.kind];
  }
}
