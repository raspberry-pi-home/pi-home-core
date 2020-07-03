import { includes } from 'lodash'
import { Validator } from 'jsonschema'

import type { Config } from '../utils/config'

import {
  AVAILABLE_PINS,
  AVAILABLE_DEVICE_TYPES,
} from '../constants'
import {
  boardSchema,
  dependencySchema,
  dependenciesSchema,
  deviceSchema,
  devicesSchema,
} from './board'

Validator.prototype.customFormats.availablePinNumbers = (pinNumber) => includes(AVAILABLE_PINS, pinNumber)
Validator.prototype.customFormats.availableDeviceTypes = (deviceType) => includes(AVAILABLE_DEVICE_TYPES, deviceType)

const validator = new Validator()

validator.addSchema(deviceSchema, '/Device')
validator.addSchema(devicesSchema, '/Devices')
validator.addSchema(dependencySchema, '/Dependency')
validator.addSchema(dependenciesSchema, '/Dependencies')

const validate = (config: Config): boolean => {
  const result = validator.validate(config, boardSchema)

  if (process.env.DEBUG && !result.valid) {
    // eslint-disable-next-line no-console
    console.log(result)
  }

  return result.valid
}

export default validate
