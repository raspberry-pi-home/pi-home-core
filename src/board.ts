import { EventEmitter } from 'events'
import { isAccessible as boardIsAccessible, Led, OnOffButton, PushButton } from 'pi-home-gpio'

import { availablePins } from './constants'

type DeviceStatus = 0 | 1
export type DeviceType = 'led' | 'onOffButton' | 'pushButton'

interface GpioDevice {
  new (pin: number): GpioDevice
  value(value?: DeviceStatus): DeviceStatus | void
  toggle(): void
  onAction(callback: (value: DeviceStatus) => void): void
}

interface InnerDevice {
  pin: number
  label: string
  type: DeviceType
}

interface Device {
  pin: number
  label: string
  type: DeviceType
  gpioDevice?: GpioDevice
  dependencies: InnerDevice[]
  status?: DeviceStatus
}

interface DeviceAddProps {
  pin: number
  label: string
  type: DeviceType
}

interface DeviceEditProps {
  label: string
}

interface DependencyProps {
  inputPin: number
  outputPin: number
}

const deviceTypes: { [key: string]: object } = {
  led: Led as GpioDevice,
  onOffButton: OnOffButton as GpioDevice,
  pushButton: PushButton as GpioDevice,
}

const completeDeviceProperties = (deviceProps: Device): Device => {
  let { gpioDevice, ...device } = deviceProps

  // add status for leds
  if (device.type === 'led') {
    device = {
      ...device,
      status: gpioDevice?.value(),
    } as Device
  }

  return device
}

const emit = (emitter: EventEmitter, eventName: string, data: object) => {
  emitter.emit(eventName, data)
  emitter.emit('all', eventName, data)
}

export class Board extends EventEmitter {
  private configuredDevices: { [key: number]: Device } = {}

  public isAccessible: boolean = boardIsAccessible

  getAvailableDevices = () => {
    const usedPins = Object.values(this.configuredDevices).map(({ pin }) => pin)
    const unUsedPins = availablePins.filter(pin => !usedPins.includes(pin))

    return Object.keys(deviceTypes).reduce((memo, type) => ({ ...memo, [type]: unUsedPins }), {})
  }

  getDevices = (): Device[] => {
    return Object.values(this.configuredDevices).map(device => completeDeviceProperties(device)) as Device[]
  }

  getDevice = (pin: number): Device => {
    const device = this.configuredDevices[pin]
    if (!device) {
      throw Error('device not found')
    }

    return completeDeviceProperties(device)
  }

  addDevice = ({ pin, label, type }: DeviceAddProps): Device => {
    if (!availablePins.includes(pin)) {
      throw Error('invalid pin')
    }

    if (Object.values(this.configuredDevices).map(({ pin }) => pin).includes(pin)) {
      throw Error('duplicated pin')
    }

    if (Object.values(this.configuredDevices).map(({ label }) => label).includes(label)) {
      throw Error('duplicated label')
    }

    if (!['led', 'onOffButton', 'pushButton'].includes(type)) {
      throw Error('invalid device type')
    }

    const device: Device = {
      pin,
      label,
      type,
      dependencies: [],
      gpioDevice: new (deviceTypes[type] as GpioDevice)(pin),
    }

    this.configuredDevices[pin] = device

    emit(this, 'deviceAdded', { device: completeDeviceProperties(device) })

    return completeDeviceProperties(device)
  }

  editDevice = (pin: number, { label }: DeviceEditProps): Device => {
    const device = this.configuredDevices[pin]
    if (!device) {
      throw Error('device not found')
    }

    device.label = label

    emit(this, 'deviceEdited', { device: completeDeviceProperties(device) })

    return completeDeviceProperties(device)
  }

  deleteDevice = (pin: number): void => {
    const device = this.configuredDevices[pin]
    if (!device) {
      throw Error('device not found')
    }

    if (device.dependencies.length) {
      throw Error('device has some linked devices and cannot be deleted')
    }

    emit(this, 'deviceDeleted', { device: completeDeviceProperties(device) })

    delete this.configuredDevices[pin]
  }

  changeDeviceStatus = (pin: number): DeviceStatus => {
    const device = this.configuredDevices[pin]
    if (!device) {
      throw Error('device not found')
    }

    if (device.type !== 'led') {
      throw Error('cannot change the status in this type of device')
    }

    device.gpioDevice?.toggle()

    emit(this, 'deviceStatusChanged', { device: completeDeviceProperties(device) })

    return device.gpioDevice?.value() as DeviceStatus
  }

  linkDevices = ({ inputPin, outputPin }: DependencyProps): void => {
    const inputDevice = this.configuredDevices[inputPin]
    if (!inputDevice) {
      throw Error('input device not found')
    }
    if (!['onOffButton', 'pushButton'].includes(inputDevice.type)) {
      throw Error('invalid input device type')
    }

    const outputDevice = this.configuredDevices[outputPin]
    if (!outputDevice) {
      throw Error('output device not found')
    }
    if (!['led'].includes(outputDevice.type)) {
      throw Error('invalid output device type')
    }

    if (inputDevice.dependencies.find(innerDevice => innerDevice.pin === outputDevice.pin)) {
      throw Error('the input pin is already linked to the output pin')
    }

    if (outputDevice.dependencies.find(innerDevice => innerDevice.pin === inputDevice.pin)) {
      throw Error('the output pin is already linked to the input pin')
    }

    inputDevice.dependencies = [...inputDevice.dependencies, {
      pin: outputDevice.pin,
      label: outputDevice.label,
      type: outputDevice.type,
    } as InnerDevice]

    outputDevice.dependencies = [...outputDevice.dependencies, {
      pin: inputDevice.pin,
      label: inputDevice.label,
      type: inputDevice.type,
    } as InnerDevice]

    inputDevice.gpioDevice?.onAction(value => {
      inputDevice.dependencies.forEach(innerDevice => {
        if (inputDevice.type === 'onOffButton') {
          this.configuredDevices[innerDevice.pin].gpioDevice?.toggle()
        } else if (inputDevice.type === 'pushButton') {
          this.configuredDevices[innerDevice.pin].gpioDevice?.value(value)
        }
      })
    })

    emit(this, 'devicesLinked', {
      inputDevice: completeDeviceProperties(inputDevice),
      outputDevice: completeDeviceProperties(outputDevice),
    })
  }

  unlinkDevices = ({ inputPin, outputPin }: DependencyProps): void => {
    const inputDevice = this.configuredDevices[inputPin]
    if (!inputDevice) {
      throw Error('input device not found')
    }
    if (!(inputDevice.type === 'onOffButton' || inputDevice.type === 'pushButton')) {
      throw Error('invalid input device type')
    }

    const outputDevice = this.configuredDevices[outputPin]
    if (!outputDevice) {
      throw Error('output device not found')
    }
    if (outputDevice.type !== 'led') {
      throw Error('invalid output device type')
    }

    inputDevice.dependencies = inputDevice.dependencies.filter(innerDevice => innerDevice.pin !== outputPin)
    outputDevice.dependencies = outputDevice.dependencies.filter(innerDevice => innerDevice.pin !== inputPin)

    emit(this, 'devicesUnlinked', {
      inputDevice: completeDeviceProperties(inputDevice),
      outputDevice: completeDeviceProperties(outputDevice),
    })
  }
}
