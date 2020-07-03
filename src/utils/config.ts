import _ from 'lodash'

import {
  AVAILABLE_PINS,
  AVAILABLE_DEVICE_TYPE_INPUT,
  AVAILABLE_DEVICE_TYPE_OUTPUT,
} from '../constants'
import validateBoardSchema from '../schemas/boardSchemaValidator'

interface Device {
  label: string
  pin: number
  type: string
}

interface Dependency {
  inputPin: number
  outputPin: number
}

type Devices = Array<Device>
type Dependencies = Array<Dependency>

export interface Config {
  devices?: Devices
  dependencies?: Array<Dependency>
}

const validateAndGetDevices = (devices?: Devices): object => {
  if (_.isUndefined(devices) || _.isEmpty(devices)) {
    throw Error('No "devices" provided')
  }

  if (!_.isArray(devices)) {
    throw Error('"devices" must be an array')
  }

  const allPins = _.chain(devices).map('pin').uniq().value()

  if (_.size(allPins) !== _.size(devices)) {
    throw Error('Review your "devices" configuration, seems there are duplicated pins')
  }

  const labels = _.chain(devices).map('label').uniq().value()

  if (_.size(labels) !== _.size(devices)) {
    throw Error('Review your "devices" configuration, seems there are duplicated labels')
  }

  return _.chain(AVAILABLE_PINS).reduce((memo, pin) => {
    const device = _.find(devices, { pin })

    if (device) {
      return {
        ...memo,
        [pin]: device,
      }
    }

    return {
      ...memo,
      [pin]: {
        pin,
      },
    }
  }, {}).value()
}

const validateAndGetDependencies = (devices: object, dependencies?: Dependencies): object => {
  if (_.isUndefined(dependencies) || _.isEmpty(dependencies)) {
    throw Error('No "dependencies" provided')
  }

  if (!_.isArray(dependencies)) {
    throw Error('"dependencies" must be an array')
  }

  const samePin = !!_.chain(dependencies)
    .filter(({ inputPin, outputPin }) => (inputPin === outputPin))
    .size()
    .value()

  if (samePin) {
    throw Error('Review your "dependencies" configuration, seems there is "inputPin" and "outputPin" with the same value')
  }

  _.each(dependencies, ({ inputPin, outputPin }) => {
    // @ts-ignore TS7053
    const validInputPin = _.includes(AVAILABLE_DEVICE_TYPE_INPUT, devices[inputPin].type)

    if (!validInputPin) {
      throw Error('Review your "dependencies" configuration, seems there is "inputPin" that is mapped to an invalid value')
    }

    // @ts-ignore TS7053
    const validOutputPin = _.includes(AVAILABLE_DEVICE_TYPE_OUTPUT, devices[outputPin].type)

    if (!validOutputPin) {
      throw Error('Review your "dependencies" configuration, seems there is "outputPin" that is mapped to an invalid value')
    }
  })

  return dependencies
}

export const validateDevice = (device: Device, devices?: Devices): void => {
  validateAndGetDevices([device, ...devices!] as Devices)
}

export const validateAndGetConfigObject = (config: Config): object => {
  if (_.isUndefined(config) || _.isEmpty(config)) {
    throw Error('Missing configuration object')
  }

  if (!_.isObject(config)) {
    throw Error('Configuration object must be a json object')
  }

  try {
    JSON.stringify(config)
  } catch (e) {
    throw Error('Configuration object must be a valid json object')
  }

  const isValid: boolean = validateBoardSchema(config)

  if (!isValid) {
    throw Error('Configuration object must agreed the defined schema')
  }

  const pins: object = validateAndGetDevices(config.devices)
  const dependencies: object = validateAndGetDependencies(pins, config.dependencies)

  return {
    pins,
    dependencies,
  }
}
