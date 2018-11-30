import { Command } from 'commandpost';
import { CreateOptions, CreateArgs } from '../operations/create';
import TubeeClient from '../tubee.client';

/**
 * Create resources
 */
export default abstract class AbstractApply {
  protected api;

  /**
   * Construct
   */
  constructor(api) {
    this.api = api;
  }
}
