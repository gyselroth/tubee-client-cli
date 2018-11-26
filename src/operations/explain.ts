import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
const SwaggerParser = require('swagger-parser');
const specPath = 'node_modules/@gyselroth/tubee-sdk-node/swagger.yml';

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
      .subCommand<ExplainOptions, ExplainArgs>('explain [resource]')
      .description('Describe a resource')
      .action((opts, args, rest) => {
        SwaggerParser.validate(specPath, (err, api) => {
          if (err) {
            console.error('Failed to retrieve the resource specification', err);
          } else {
            if (api.definitions[args.resource]) {
              Explain.describe(api.definitions[args.resource]);
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
    this.describeFields(api.allOf[0].properties);
    this.describeFields(api.allOf[1].properties);
  }

  /**
   * Recursively traverse fields
   */
  protected static describeFields(api, depth = 0) {
    for (let key in api) {
      console.log(''.padStart(depth + 4, ' ') + key + ' <' + api[key].type + '>');

      if (api[key].enum) {
        console.log(''.padStart(depth + 4, ' ') + 'Allowed Values: %s', api[key].enum.join(','));
      }

      console.log(''.padStart(depth + 6, ' ') + api[key].description + '\n');

      if (api[key].type == 'object') {
        Explain.describeFields(api[key].properties, depth + 4);
      }
    }
  }
}
