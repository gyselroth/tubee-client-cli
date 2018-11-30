import { Command } from 'commandpost';
import { CreateOptions, CreateArgs } from '../operations/create';
import TubeeClient from '../tubee.client';

/**
 * Create resources
 */
export default abstract class AbstractApply {
  protected optparse: Command<CreateOptions, CreateArgs>;
  protected client: TubeeClient;

  /**
   * Construct
   */
  constructor(optparse: Command<CreateOptions, CreateArgs>, client: TubeeClient) {
    this.optparse = optparse;
    this.client = client;
  }
}
