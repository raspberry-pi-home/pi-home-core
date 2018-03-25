import _ from 'lodash';

import boardSchemaValidator from './schemas/boardSchemaValidator';

const _validatePinSettings = (config) => {
    let {pinSettings} = config;

    if (_.isUndefined(pinSettings) || _.isEmpty(pinSettings)) {
        throw Error('No "pinSettings" provided');
    }

    if (!_.isArray(pinSettings)) {
        throw Error('"pinSettings" must be an array');
    }

    let pins = new Set(_.map(pinSettings, 'pin'));
    let labels = new Set(_.map(pinSettings, 'label'));

    if (_.size(pins) !== _.size(pinSettings)) {
        throw Error('Review your "pinSettings" configuration, seems there are duplicated pins');
    }

    if (_.size(labels) !== _.size(pinSettings)) {
        throw Error('Review your "pinSettings" configuration, seems there are duplicated labels');
    }
};

const _validateConfigObject = (config) => {
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

    if (!boardSchemaValidator(config)) {
        throw Error('Configuration object must agreed the defined schema');
    }

    _validatePinSettings(config);
};

const createBoard = (config, options = {}) => {
    _validateConfigObject(config);
};

export default createBoard;
