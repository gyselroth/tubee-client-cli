import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
const SwaggerParser = require('swagger-parser');
const specPath = 'node_modules/@gyselroth/tubee-sdk-node/openapi.yml';
import { mergeAllOf } from '../swagger';

export interface ExplainOptions {
  output: string;
}

export interface ExplainArgs {
  resource: string;
}

/**
 * Operation
 */
export default class Explain {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse
      .subCommand<ExplainOptions, ExplainArgs>('explain <resource>')
      .description('Describe a resource')
      .action((opts, args, rest) => {
        SwaggerParser.validate(specPath, (err, api) => {
          if (err) {
            console.error('Failed to retrieve the resource specification', err);
          } else {
            if (api.components.schemas[args.resource]) {
              Explain.describe(api.components.schemas[args.resource]);
            } else {
              console.log('The resource %s does not exists', args.resource);
            }
          }
        });
      });
  }

  /**
   * Describe api
   */
  protected static describe(api) {
    console.log('DESCRIPTION');
    console.log(''.padStart(4, ' ') + api.description + '\n');

    console.log('FIELDS');
    this.describeFields(mergeAllOf(api).properties);
  }

  /**
   * Recursively traverse fields
   */
  protected static describeFields(api, depth = 0, required=[]) {
    for (let key in api) {
      let name = key;
      if(api instanceof Array) {
        name = '*';
      }

      let require_suffix = '';
      if(required.indexOf(key) >= 0) {
        require_suffix = ' [REQUIRED]';
      }

      console.log(''.padStart(depth + 4, ' ') + name + ' <' + api[key].type + '>'+require_suffix);

      if (api[key].enum) {
        console.log(''.padStart(depth + 4, ' ') + 'Allowed Values: %s', api[key].enum.join(','));
      }

      if(api[key].oneOf) {
        console.log(''.padStart(depth + 8, ' ') + 'Must be one of: ');
        Explain.describeFields(api[key].oneOf, depth+4, api[key].required || []);
      } else {
        console.log(''.padStart(depth + 6, ' ') + api[key].description + '\n');

        if (api[key].type == 'object') {
          Explain.describeFields(api[key].properties, depth + 4, api[key].required || []);
        }
      }
    }
  }
}
