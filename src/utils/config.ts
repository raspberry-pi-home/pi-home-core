import _ from 'lodash'

import {
  AVAILABLE_PINS,
  AVAILABLE_PIN_TYPE_INPUT,
  AVAILABLE_PIN_TYPE_OUTPUT,
} from '../constants'
import validateBoardSchema from '../schemas/boardSchemaValidator'

interface PinSetting {
  label: string
  pin: number
  type: string
}

interface PinDependency {
  inputPin: number
  outputPin: number
}

type PinSettings = Array<PinSetting>
type PinDependencies = Array<PinDependency>

export interface Config {
  pins?: PinSettings
  dependencies?: Array<PinDependency>
}

const validateAndGetPinSettings = (pins?: PinSettings): object => {
  if (_.isUndefined(pins) || _.isEmpty(pins)) {
    throw Error('No "pins" provided')
  }

  if (!_.isArray(pins)) {
    throw Error('"pins" must be an array')
  }

  const allPins = _.chain(pins).map('pin').uniq().value()

  if (_.size(allPins) !== _.size(pins)) {
    throw Error('Review your "pins" configuration, seems there are duplicated pins')
  }

  const labels = _.chain(pins).map('label').uniq().value()

  if (_.size(labels) !== _.size(pins)) {
    throw Error('Review your "pins" configuration, seems there are duplicated labels')
  }

  return _.chain(AVAILABLE_PINS).reduce((memo, pin) => {
    const pinSetting = _.find(pins, { pin })

    if (pinSetting) {
      return {
        ...memo,
        [pin]: pinSetting,
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

const validateAndGetPinDependencies = (pins: object, dependencies?: PinDependencies): object => {
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
    const validInputPin = _.includes(AVAILABLE_PIN_TYPE_INPUT, pins[inputPin].type)

    if (!validInputPin) {
      throw Error('Review your "dependencies" configuration, seems there is "inputPin" that is mapped to an invalid value')
    }

    // @ts-ignore TS7053
    const validOutputPin = _.includes(AVAILABLE_PIN_TYPE_OUTPUT, pins[outputPin].type)

    if (!validOutputPin) {
      throw Error('Review your "dependencies" configuration, seems there is "outputPin" that is mapped to an invalid value')
    }
  })

  return dependencies
}

export const validatePins = (pin: PinSetting, pins?: PinSettings): void => {
  validateAndGetPinSettings([pin, ...pins!] as PinSettings)
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

  const pins: object = validateAndGetPinSettings(config.pins)
  const dependencies: object = validateAndGetPinDependencies(pins, config.dependencies)

  return {
    pins,
    dependencies,
  }
}
