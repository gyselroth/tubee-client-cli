import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import Endpoints from '../resources/endpoints/apply';
import AccessRoles from '../resources/access-roles/apply';
import Namespaces from '../resources/namespaces/apply';
import AccessRules from '../resources/access-rules/apply';
import Collections from '../resources/collections/apply';
import DataObjects from '../resources/data-objects/apply';
import Relations from '../resources/relations/apply';
import Jobs from '../resources/jobs/apply';
import Processes from '../resources/processes/apply';
import Workflows from '../resources/workflows/apply';
import Secrets from '../resources/secrets/apply';
import Users from '../resources/users/apply';
import { getFile } from '../loader';
import { validate, identifierMap } from '../validator';
const yaml = require('js-yaml');
const fs = require('fs');
const lodash = require('lodash');
const colors = require('colors');

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

var priorities = [];
var i = 0;
for (let resource in map) {
  priorities[resource] = i++;
}

export interface ApplyOptions {
  file: string;
}

export interface ApplyArgs {}

/**
 * Operation
 */
export default class Apply {
  protected instances;

  /**
   * Construct
   */
  public constructor(instances) {
    this.instances = instances;
  }

  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse
      .subCommand<ApplyOptions, ApplyArgs>('apply')
      .description('Apply resources')
      .option('-f, --file <name>', 'File to read from')
      .action(async (opts, args, rest) => {
        var instances = {};
        for (let instance in map) {
          var api = await client.factory(apiMap[instance], optparse.parsedOpts);
          instances[instance] = new map[instance](api);
        }

        var op = new Apply(instances);
        op.execute(opts);
      });
  }

  /**
   * Switch to Endpoint if *Endpoint
   */
  public transformKind(kind) {
    var endpoint = new RegExp('Endpoint$');
    if (endpoint.test(kind)) {
      kind = 'Endpoint';
    }

    return kind;
  }

  /**
   * Execute
   */
  public async execute(opts) {
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
          resources = yaml.loadAll(body);
      }

      var inbound = [];
      for (let sub of resources) {
        if (sub === null) {
          continue;
        } else if (sub.kind === 'List') {
          inbound = inbound.concat(sub.data);
        } else {
          inbound.push(sub);
        }
      }

      inbound.sort((a, b) => {
        if (b === null || a === null) {
          return 0;
        }

        var a = priorities[this.transformKind(a.kind)];
        var b = priorities[this.transformKind(b.kind)];

        if (a > b) {
          return 1;
        } else if (b > a) {
          return -1;
        } else {
          return 0;
        }
      });

      this.apply(inbound);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * this resource
   */
  protected async apply(resources) {
    if (resources instanceof Array) {
      var stack = [];
      var last_kind = null;
      var processed = [];

      for (let resource of resources) {
        if (resource === null) {
          continue;
        }

        if (validate(resource) === false) {
          console.log('[%s] resource is not valid, identifiers missing', colors.red.bold('ERROR'), {
            resource: resource,
            required: identifierMap[resource.kind],
          });

          continue;
        }

        let result = this.getKind(resource);
        let identifiers = JSON.stringify(lodash.pick(resource, identifierMap[resource.kind]));

        if (processed.indexOf(identifiers) !== -1) {
          console.log(
            '[%s] %s <%s> ignored, duplicate resource',
            colors.yellow.bold('WARN'),
            resource.kind,
            resource.name,
            {
              resource: resource,
            },
          );

          continue;
        } else {
          processed.push(identifiers);
        }

        if (last_kind !== result && last_kind !== null) {
          await Promise.all(stack);
          stack = [];
        }

        last_kind = result;

        if (result === null) {
          continue;
        }

        stack.push(
          result
            .apply(resource)
            .then((response) => {
              console.log('[%s] %s <%s> updated', colors.green.bold('OK'), resource.kind, resource.name);
            })
            .catch((error) => {
              console.log(
                '[%s] %s <%s> failed [%s: %s]',
                colors.red.bold('ERROR'),
                resource.kind,
                resource.name,
                error.response.body.error,
                error.response.body.message,
              );
            }),
        );
      }
    } else if (resources instanceof Object) {
      return this.apply([resources]);
    } else {
      console.log('Invalid resource definition, neither a list of resources nor a single valid resource');
    }
  }

  /**
   * Get controller instance
   */
  protected getKind(resource) {
    var kind = this.transformKind(resource.kind);
    if (!resource.kind || !this.instances[kind]) {
      console.log('Invalid resource definition, invalid kind given');
      return null;
    }

    return this.instances[kind];
  }
}
