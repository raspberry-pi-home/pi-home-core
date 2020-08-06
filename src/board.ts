import _ from 'lodash'
import { isAccessible as boardIsAccessible, Led, OnOffButton, PushButton } from 'pi-home-gpio'

import { validateAndGetConfigObject, validateConfig as validateConfiguration } from './utils/config'
import type { Config, Dependencies, Device, Devices, ValidationResponse } from './utils/config'

const deviceTypes: { [key: string]: object } = {
  led: Led,
  onOffButton: OnOffButton,
  pushButton: PushButton,
}

const availableTypesAndDirections: { [key: string]: string } = {
  led: 'out',
  onOffButton: 'in',
  pushButton: 'in',
}

const completeDeviceProperties = (board: object, deviceConfiguration: Device): Device => {
  let device: Device = deviceConfiguration

  if (device.type) {
    // @ts-ignore TS7053
    const configuredDevice: Device = board.configuredDevices[device.pin] as Device

    if (configuredDevice) {
      // add status
      if (configuredDevice.device && configuredDevice.type === 'led') {
        device = {
          ...device,
          // @ts-ignore TS2339
          status: configuredDevice.device.value(),
        } as Device
      }

      // add dependencies
      // @ts-ignore TS7053
      if (board.config.dependencies) {
        const direction = availableTypesAndDirections[device.type]

        let devicePins: Array<number> = []
        if (direction == 'in') {
          // @ts-ignore TS7053
          devicePins = _.chain(board.config.dependencies).filter({ inputPin: device.pin }).map('outputPin').value()
        } else if (direction == 'out') {
          // @ts-ignore TS7053
          devicePins = _.chain(board.config.dependencies).filter({ outputPin: device.pin }).map('inputPin').value()
        }

        // @ts-ignore TS7053
        const dependencies:Devices = devicePins.map(devicePin => _.find(board.config.devices, ({ pin: configDevicePin }) => configDevicePin === devicePin) as Device)

        device = {
          ...device,
          dependencies,
        } as Device
      }
    }
  }

  return device
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
      const { device: outputDevice } = this.configuredDevices[outputPin]

      // @ts-ignore TS7006
      inputDevice.onAction(value => {
        if (inputDeviceType === 'onOffButton') {
          outputDevice.value(value)
        } else if (inputDeviceType === 'pushButton') {
          outputDevice.toggle()
        }
      })
    })

    this.configured = true
  }

  public isAccessible: boolean = boardIsAccessible
  public availableDeviceTypes: Array<string> = Object.keys(deviceTypes)

  validateConfig = (config: Config): ValidationResponse => validateConfiguration(config)

  setConfig = (config: Config): void => {
    this.config = validateAndGetConfigObject(config)
    this.configureBoard()
  }

  devices = (): Devices => {
    if (!this.configured) {
      throw Error('Board is not configured')
    }

    return this.config.devices.map((device) => completeDeviceProperties(this, device)) as Devices
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
      throw Error('Device not found')
    }

    return completeDeviceProperties(this, device) as Device
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
}
