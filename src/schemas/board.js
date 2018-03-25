export const pinSettingSchema = {
    'id': '/PinSetting',
    'type': 'object',
    'properties': {
        'label': {
            'type': 'string',
            'required': true,
        },
        'pin': {
            'type': 'number',
            'required': true,
            'format': 'availablePinNumbers',
        },
        'type': {
            'type': 'string',
            'required': true,
            'format': 'availablePinTypes',
        },
    },
};

export const pinSettingsSchema = {
    'id': '/PinSettings',
    'type': 'array',
    'uniqueItems': true,
    'items': {
        '$ref': '/PinSetting',
        'minItems': 1,
    },
};


export const pinDependencySchema = {
    'id': '/PinDependency',
    'type': 'object',
    'properties': {
        'inputPin': {
            'type': 'number',
            'required': true,
            'format': 'availablePinNumbers',
        },
        'outputPin': {
            'type': 'number',
            'required': true,
            'format': 'availablePinNumbers',
        },
        'type': {
            'type': 'string',
            'required': true,
            'format': 'availableDependencyTypes',
        },
    },
};

export const pinDependenciesSchema = {
    'id': '/PinDependencies',
    'type': 'array',
    'uniqueItems': true,
    'items': {
        '$ref': '/PinDependency',
        'minItems': 1,
    },
};

export const boardSchema = {
    'id': '/Config',
    'type': 'object',
    'properties': {
        'pinSettings': {
            '$ref': '/PinSettings',
        },
        'pinDependencies': {
            '$ref': '/PinDependencies',
        },
    },
};
