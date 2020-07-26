import { Led, OnOffButton, PushButton } from 'pi-home-gpio'

import { validateAndGetConfigObject, validateConfig as validateConfiguration } from './utils/config'
import type { Config, Dependencies, Device, Devices, ValidationResponse } from './utils/config'

const deviceTypes: { [key: string]: object } = {
  led: Led,
  onOffButton: OnOffButton,
  pushButton: PushButton,
}

export class Board {
  private config: Config = {} as Config
  private configured: boolean = false
  private configuredDevices: { [key: number]: object } = {}

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

  validateConfig = (config: Config): ValidationResponse => validateConfiguration(config)

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
        const configuredDevice: object = this.configuredDevices[pin] as object

        // @ts-ignore TS2339
        if (configuredDevice && configuredDevice.device && configuredDevice.type === 'led') {
          return [
            ...memo,
            {
              ...deviceConfiguration,
              // @ts-ignore TS2339
              status: configuredDevice.device.value(),
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

  device = (pin: number): Device => {
    if (!this.configured) {
      throw Error('Board is not configured')
    }

    // @ts-ignore TS276
    const device: Device = this.config.devices.filter(deviceConfiguration => deviceConfiguration.pin === pin)[0] as Device

    if (!device) {
      throw Error('Device is not configured')
    }

    // @ts-ignore TS7053
    const configuredDevice: object = this.configuredDevices[pin] as object

    // @ts-ignore TS2339
    if (configuredDevice && configuredDevice.device && configuredDevice.type === 'led') {
      return {
        ...device,
        // @ts-ignore TS2339
        status: configuredDevice.device.value(),
      } as Device
    }

    return device as Device
  }

  changeStatus = (pin: number): number => {
    if (!this.configured) {
      throw Error('Board is not configured')
    }

    // @ts-ignore TS7053
    const device: object = this.configuredDevices[pin] as object
    if (!device) {
      throw Error('Device is not configured')
    }

    // @ts-ignore TS2339
    if (device.type !== 'led') {
      throw Error('Cannot change the status in this type of device')
    }

    // @ts-ignore TS2339
    device.device.toggle()

    // @ts-ignore TS2339
    return device.device.value()
  }

  availableTypesAndDirections = (): object => ({
    led: 'out',
    onOffButton: 'in',
    pushButton: 'in',
  })
}
