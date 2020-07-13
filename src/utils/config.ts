import _ from 'lodash'

import {
  AVAILABLE_PINS,
  AVAILABLE_DEVICE_TYPE_INPUT,
  AVAILABLE_DEVICE_TYPE_OUTPUT,
} from '../constants'
import validateBoardSchema from '../schemas/boardSchemaValidator'

type Device = {
  label: string
  pin: number
  type: string
}

type Dependency = {
  inputPin: number
  outputPin: number
}

export type Devices = Array<Device>
export type Dependencies = Array<Dependency>

export type Config = {
  devices: Devices
  dependencies: Dependencies
}

const validateAndGetDevices = (devices: Devices): Devices => {
  if (_.isUndefined(devices)) {
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

  // @ts-ignore TS2345
  return _.chain(AVAILABLE_PINS).reduce((memo, pin) => {
    const device = _.find(devices, { pin })

    if (device) {
      return [
        ...memo,
        device,
      ]
    }

    return [
      ...memo,
      { pin },
    ]
  }, []).value()
}

const validateAndGetDependencies = (devices: Devices, dependencies: Dependencies): Dependencies => {
  if (_.isUndefined(dependencies)) {
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
    // @ts-ignore TS2532
    const validInputPin = _.includes(AVAILABLE_DEVICE_TYPE_INPUT, _.find(devices, { pin: inputPin }).type)

    if (!validInputPin) {
      throw Error('Review your "dependencies" configuration, seems there is "inputPin" that is mapped to an invalid value')
    }

    // @ts-ignore TS2532
    const validOutputPin = _.includes(AVAILABLE_DEVICE_TYPE_OUTPUT, _.find(devices, { pin: outputPin }).type)

    if (!validOutputPin) {
      throw Error('Review your "dependencies" configuration, seems there is "outputPin" that is mapped to an invalid value')
    }
  })

  return dependencies
}

export const validateConfig = (config: Config): boolean => {
  try {
    validateAndGetConfigObject(config)
    return true
  } catch (error) {
    if (process.env.DEBUG) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
  return false
}

export const validateAndGetConfigObject = (config: Config): Config => {
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

  const devices: Devices = validateAndGetDevices(config.devices)
  const dependencies: Dependencies = validateAndGetDependencies(devices, config.dependencies)

  return {
    devices,
    dependencies,
  } as Config
}
