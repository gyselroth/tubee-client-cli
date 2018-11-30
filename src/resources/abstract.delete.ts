import { Command } from 'commandpost';
import { DeleteOptions, DeleteArgs } from '../operations/delete';
import TubeeClient from '../tubee.client';
import AbstractOperation from './abstract.operation';

/**
 * Delete resources
 */
export default abstract class AbstractDelete extends AbstractOperation {
  protected api;

  /**
   * Construct
   */
  constructor(api) {
    super();
    this.api = api;
  }
}
