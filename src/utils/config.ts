import _ from 'lodash'

import {
  AVAILABLE_PINS,
  AVAILABLE_PIN_TYPE_INPUT,
  AVAILABLE_PIN_TYPE_OUTPUT,
} from '../constants'
import validateBoardSchema from '../schemas/boardSchemaValidator'

interface PinSettings {
  label: string
  pin: number
  type: string
}

interface PinDependencies {
  inputPin: number
  outputPin: number
}

export interface Config {
  pinSettings?: Array<PinSettings>
  pinDependencies?: Array<PinDependencies>
}

const _validateAndGetPinSettings = (config: Config): object => {
  const { pinSettings } = config

  if (_.isUndefined(pinSettings) || _.isEmpty(pinSettings)) {
    throw Error('No "pinSettings" provided')
  }

  if (!_.isArray(pinSettings)) {
    throw Error('"pinSettings" must be an array')
  }

  const pins = new Set(_.map(pinSettings, 'pin'))

  if (_.size(pins) !== _.size(pinSettings)) {
    throw Error('Review your "pinSettings" configuration, seems there are duplicated or missing pins')
  }

  const labels = new Set(_.map(pinSettings, 'label'))

  if (_.size(labels) !== _.size(pinSettings)) {
    throw Error('Review your "pinSettings" configuration, seems there are duplicated or missing labels')
  }

  return _.chain(AVAILABLE_PINS).reduce((memo, pin) => {
    const pinSetting = _.find(pinSettings, { pin })

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

const _validateAndGetPinDependencies = (config: Config, pinSettings: object): object => {
  const { pinDependencies } = config

  if (_.isUndefined(pinDependencies) || _.isEmpty(pinDependencies)) {
    throw Error('No "pinDependencies" provided')
  }

  if (!_.isArray(pinDependencies)) {
    throw Error('"pinDependencies" must be an array')
  }

  const samePin = !!_.chain(pinDependencies)
    .filter(({ inputPin, outputPin }) => (inputPin === outputPin))
    .size()
    .value()

  if (samePin) {
    throw Error('Review your "pinDependencies" configuration, seems there is "inputPin" and "outputPin" with the same value')
  }

  _.each(pinDependencies, ({ inputPin, outputPin }) => {
    // @ts-ignore TS7053
    const validInputPin = _.includes(AVAILABLE_PIN_TYPE_INPUT, pinSettings[inputPin].type)

    if (!validInputPin) {
      throw Error('Review your "pinDependencies" configuration, seems there is "inputPin" that is mapped to an invalid value')
    }

    // @ts-ignore TS7053
    const validOutputPin = _.includes(AVAILABLE_PIN_TYPE_OUTPUT, pinSettings[outputPin].type)

    if (!validOutputPin) {
      throw Error('Review your "pinDependencies" configuration, seems there is "outputPin" that is mapped to an invalid value')
    }
  })

  return pinDependencies
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

  const pinSettings: object = _validateAndGetPinSettings(config)
  const pinDependencies: object = _validateAndGetPinDependencies(config, pinSettings)

  return {
    pinSettings,
    pinDependencies,
  }
}
