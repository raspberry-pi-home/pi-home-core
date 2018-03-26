import _ from 'lodash';

import {
    AVAILABLE_PINS,
    AVAILABLE_PIN_TYPE_INPUT,
    AVAILABLE_PIN_TYPE_OUTPUT
} from './constants';
import validateBoardSchema from './schemas/boardSchemaValidator';

const _validateAndGetPinSettings = ({pinSettings}) => {
    if (_.isUndefined(pinSettings) || _.isEmpty(pinSettings)) {
        throw Error('No "pinSettings" provided');
    }

    if (!_.isArray(pinSettings)) {
        throw Error('"pinSettings" must be an array');
    }

    let pins = new Set(_.map(pinSettings, 'pin'));

    if (_.size(pins) !== _.size(pinSettings)) {
        throw Error('Review your "pinSettings" configuration, seems there are duplicated pins');
    }

    let labels = new Set(_.map(pinSettings, 'label'));

    if (_.size(labels) !== _.size(pinSettings)) {
        throw Error('Review your "pinSettings" configuration, seems there are duplicated labels');
    }

    return _.chain(AVAILABLE_PINS).reduce((memo, pin) => {
        let pinSetting = _.find(pinSettings, {pin});

        if (pinSetting) {
            return {
                ...memo,
                [pin]: pinSetting,
            };
        }

        return {
            ...memo,
            [pin]: {
                pin,
            },
        };
    }, {}).value();
};

const _validateAndGetPinDependencies = ({pinDependencies}, pinSettings) => {
    if (_.isUndefined(pinDependencies) || _.isEmpty(pinDependencies)) {
        throw Error('No "pinDependencies" provided');
    }

    if (!_.isArray(pinDependencies)) {
        throw Error('"pinDependencies" must be an array');
    }

    let samePin = !!_.chain(pinDependencies)
        .filter(({inputPin, outputPin}) => (inputPin === outputPin))
        .size()
        .value();

    if (samePin) {
        throw Error('Review your "pinDependencies" configuration, seems there is "inputPin" and "outputPin" with the same value');
    }

    _.each(pinDependencies, ({inputPin, outputPin}) => {
        let validInputPin = _.includes(AVAILABLE_PIN_TYPE_INPUT, pinSettings[`${inputPin}`].type);

        if (!validInputPin) {
            throw Error('Review your "pinDependencies" configuration, seems there is "inputPin" that is mapped to an ivalid value');
        }

        let validOutputPin = _.includes(AVAILABLE_PIN_TYPE_OUTPUT, pinSettings[`${outputPin}`].type);

        if (!validOutputPin) {
            throw Error('Review your "pinDependencies" configuration, seems there is "outputPin" that is mapped to an ivalid value');
        }
    });

    return pinDependencies;
};

const _validateAndGetConfigObject = (config) => {
    if (_.isUndefined(config) || _.isEmpty(config)) {
        throw Error('Missing configuration object');
    }

    if (!_.isObject(config)) {
        throw Error('Configuration object must be a json object');
    }

    try {
        JSON.stringify(config);
    } catch (e) {
        throw Error('Configuration object must be a valid json object');
    }

    let isValid = validateBoardSchema(config);

    if (!isValid) {
        throw Error('Configuration object must agreed the defined schema');
    }

    let pinSettings = _validateAndGetPinSettings(config);
    let pinDependencies = _validateAndGetPinDependencies(config, pinSettings);

    return {
        pinSettings,
        pinDependencies,
    };
};

const createBoard = (config) => {
    let newConfig = _validateAndGetConfigObject(config);

    if (process.env.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(newConfig);
    }
};

export default createBoard;
