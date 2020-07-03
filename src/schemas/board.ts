export const deviceSchema = {
  'id': '/Device',
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
      'format': 'availableDeviceTypes',
    },
  },
}

export const devicesSchema = {
  'id': '/Devices',
  'type': 'array',
  'uniqueItems': true,
  'items': {
    '$ref': '/Device',
    'minItems': 1,
  },
}

export const dependencySchema = {
  'id': '/Dependency',
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
  },
}

export const dependenciesSchema = {
  'id': '/Dependencies',
  'type': 'array',
  'uniqueItems': true,
  'items': {
    '$ref': '/Dependency',
    'minItems': 1,
  },
}

export const boardSchema = {
  'id': '/Config',
  'type': 'object',
  'properties': {
    'devices': {
      '$ref': '/Devices',
    },
    'dependencies': {
      '$ref': '/Dependencies',
    },
  },
}
