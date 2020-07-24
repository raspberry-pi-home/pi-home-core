import { Led, OnOffButton, PushButton } from 'pi-home-gpio'

import { validateAndGetConfigObject } from './utils/config'
import type { Config, Dependencies, Device, Devices } from './utils/config'

const deviceTypes: object = {
  led: Led,
  onOffButton: OnOffButton,
  pushButton: PushButton,
}

export class Board {
  private config: Config = {} as Config
  private configured: boolean = false
  private configuredDevices: object = {}

  private configureBoard = () => {
    // @ts-ignore TS276
    this.configuredDevices = this.config.devices.reduce((memo, deviceConfiguration) => {
      const { pin, type } = deviceConfiguration

      if (type) {
        return {
          ...memo,
          [pin]: {
            ...deviceConfiguration,
            // @ts-ignore TS7053
            device: new deviceTypes[type](pin),
          } as Device,
        }
      }

      return memo
    }, {})

    this.config.dependencies.forEach(dependencyConfiguration => {
      const { inputPin, outputPin } = dependencyConfiguration

      // @ts-ignore TS7053
      const { type: inputDeviceType, device: inputDevice } = this.configuredDevices[inputPin]
      // @ts-ignore TS7053
      const { type: outputDeviceType, device: outputDevice } = this.configuredDevices[outputPin]

      if (outputDeviceType === 'onOffButton') {
        outputDevice.onAction(inputDeviceType.value)
      } else if (outputDeviceType === 'pushButton') {
        outputDevice.onAction(inputDeviceType.toggle)
      }
    })

    this.configured = true
  }

  setConfig = (config: Config): void => {
    this.config = validateAndGetConfigObject(config)
    this.configureBoard()
  }

  devices = (): Devices => {
    if (!this.configured) {
      throw Error('Board is not configured')
    }

    // @ts-ignore TS276
    const devices = this.config.devices.reduce((memo, deviceConfiguration) => {
      const { pin, type } = deviceConfiguration

      if (type) {
        // @ts-ignore TS7053
        const device = this.configuredDevices[pin].device

        if (type === 'led') {
          return [
            ...memo,
            {
              ...deviceConfiguration,
              status: device.value(),
            } as Device,
          ] as Devices
        }
      }

      return [
        ...memo,
        deviceConfiguration as Device,
      ] as Devices
    }, []) as Devices

    return devices
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

    // @ts-ignore TS7053
    const device = this.configuredDevices[pin]
    if (!device) {
      throw Error('Device is not configured')
    }

    if (device.type !== 'led') {
      throw Error('Cannot change the status in this type of device')
    }

    device.device.toggle()

    return device.device.value()
  }
}
