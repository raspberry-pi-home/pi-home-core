import { validateAndGetConfigObject } from './utils/config'
import type { Config, Dependencies, Devices } from './utils/config'

export class Board {
  private config: Config

  constructor(config: Config) {
    this.config = validateAndGetConfigObject(config)
  }

  devices = (): Devices => this.config.devices

  dependencies = (): Dependencies => this.config.dependencies

  availableTypesAndDirections = (): object => ({
    led: 'out',
    onOffButton: 'in',
    pushButton: 'in',
  })

  changeStatus = (pin: number): number => {
    return pin
  }

  run = (): void => {

  }
}
