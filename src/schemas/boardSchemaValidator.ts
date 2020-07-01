import { includes } from 'lodash'
import { Validator } from 'jsonschema'

import {
  // AVAILABLE_PIN_DEPENDENCY_TYPE,
  AVAILABLE_PINS,
  AVAILABLE_PIN_TYPES,
} from '../constants'
import {
  boardSchema,
  pinDependencySchema,
  pinDependenciesSchema,
  pinSettingSchema,
  pinSettingsSchema,
} from './board'

Validator.prototype.customFormats.availablePinNumbers = (pinNumber) => includes(AVAILABLE_PINS, pinNumber)
Validator.prototype.customFormats.availablePinTypes = (pinType) => includes(AVAILABLE_PIN_TYPES, pinType)
// Validator.prototype.customFormats.availableDependencyTypes = (pinType) => includes(AVAILABLE_PIN_DEPENDENCY_TYPE, pinType)

const validator = new Validator()

validator.addSchema(pinSettingSchema, '/PinSetting')
validator.addSchema(pinSettingsSchema, '/PinSettings')
validator.addSchema(pinDependencySchema, '/PinDependency')
validator.addSchema(pinDependenciesSchema, '/PinDependencies')

const validate = (config: object): boolean => {
  let result = validator.validate(config, boardSchema)

  if (process.env.DEBUG && !result.valid) {
    // eslint-disable-next-line no-console
    console.log(result)
  }

  return result.valid
}

export default validate
