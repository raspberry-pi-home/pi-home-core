import { validateAndGetConfigObject } from './utils/config'
import type { Config, Dependencies, Devices } from './utils/config'

export class Board {
  private config: Config = {} as Config
  private configured: boolean = false

  setConfig = (config: Config): void => {
    this.config = validateAndGetConfigObject(config)
    this.configured = true
  }

  devices = (): Devices => {
    if (!this.configured) {
      throw Error('Board is not configured')
    }

    return this.config.devices
  }

  dependencies = (): Dependencies => {
    if (!this.configured) {
      throw Error('Board is not configured')
    }

    return this.config.dependencies
  }

  availableTypesAndDirections = (): object => ({
    led: 'out',
    onOffButton: 'in',
    pushButton: 'in',
  })

  changeStatus = (pin: number): number => {
    if (!this.configured) {
      throw Error('Board is not configured')
    }

    return pin
  }
}
