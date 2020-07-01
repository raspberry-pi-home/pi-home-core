import { validateAndGetConfigObject } from './utils/config'
import type { Config } from './utils/config'

export class Board {
  private config: object

  constructor(config: Config) {
    this.config = validateAndGetConfigObject(config)
  }
}
