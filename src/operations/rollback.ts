import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
import DataObjects from '../resources/data-objects/rollback';

const map = [
  DataObjects,
];

export interface RollbackOptions {
  revision: number;
}

export interface RollbackArgs {
  resource: string;
  name?: string;
}

/**
 * Operation
 */
export default class Rollback {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<RollbackOptions, RollbackArgs>('rollback').description('Rollback resources');

    for (let resource of map) {
      let sub = resource.applyOptions(remote, client);
      sub
        .option(
          '-n, --namespace <name>',
          'Most resources have a namespace, request different namespace. The default namespace is "default".',
        )
        .option('-r, --revision <name>', 'Specify a resource version. If no resource version was given the resource will be reverted to the previous version.')
    }
  }
}
