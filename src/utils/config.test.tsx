import { validateAndGetConfigObject, validatePins } from './config'
const validBoard = require('../__fixtures__/board.json')

describe('pins', () => {
  test('should throw an error when pins are duplicated', () => {
    expect(() => {
      validateAndGetConfigObject({
        pins: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }, {
          label: 'Led 18',
          pin: 17,
          type: 'led',
        }],
      })
    }).toThrowError('Review your "pins" configuration, seems there are duplicated pins')
  })

  test('should throw an error when labels are duplicated', () => {
    expect(() => {
      validateAndGetConfigObject({
        pins: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }, {
          label: 'Led 17',
          pin: 18,
          type: 'led',
        }],
      })
    }).toThrowError('Review your "pins" configuration, seems there are duplicated labels')
  })
})

describe('dependencies', () => {
  test('should throw an error when dependencies object is missing', () => {
    expect(() => {
      validateAndGetConfigObject({
        pins: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }],
      })
    }).toThrowError('No "dependencies" provided')
  })

  test('should throw an error when inputPin and outputPin are the same', () => {
    expect(() => {
      validateAndGetConfigObject({
        pins: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }],
        dependencies: [{
          inputPin: 22,
          outputPin: 22,
        }],
      })
    }).toThrowError('Review your "dependencies" configuration, seems there is "inputPin" and "outputPin" with the same value')
  })

  test('should throw an error when input pin does not match', () => {
    expect(() => {
      validateAndGetConfigObject({
        pins: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }, {
          label: 'Button 22',
          pin: 22,
          type: 'onOffButton',
        }],
        dependencies: [{
          inputPin: 17,
          outputPin: 23,
        }],
      })
    }).toThrowError('Review your "dependencies" configuration, seems there is "inputPin" that is mapped to an invalid value')
  })

  test('should throw an error when output pin does not match', () => {
    expect(() => {
      validateAndGetConfigObject({
        pins: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }, {
          label: 'Button 22',
          pin: 22,
          type: 'onOffButton',
        }],
        dependencies: [{
          inputPin: 22,
          outputPin: 16,
        }],
      })
    }).toThrowError('Review your "dependencies" configuration, seems there is "outputPin" that is mapped to an invalid value')
  })
})

describe('validatePins', () => {
  test('should throw an error when pins are duplicated', () => {
    expect(() => {
      validatePins({
        'label': 'Led 17',
        'pin': 17,
        'type': 'led',
      }, [{
        'label': 'Led 18',
        'pin': 17,
        'type': 'led',
      }])
    }).toThrowError('Review your "pins" configuration, seems there are duplicated pins')
  })

  test('should throw an error when labels are duplicated', () => {
    expect(() => {
      validatePins({
        'label': 'Led 17',
        'pin': 17,
        'type': 'led',
      }, [{
        'label': 'Led 17',
        'pin': 18,
        'type': 'led',
      }])
    }).toThrowError('Review your "pins" configuration, seems there are duplicated labels')
  })

  test('should pass', () => {
    expect(() => {
      validatePins({
        'label': 'Led 17',
        'pin': 17,
        'type': 'led',
      }, [{
        'label': 'Led 18',
        'pin': 18,
        'type': 'led',
      },
      {
        'label': 'Button 22',
        'pin': 22,
        'type': 'onOffButton',
      },
      {
        'label': 'Push Button 27',
        'pin': 27,
        'type': 'pushButton',
      }])
    }).not.toThrow()
  })
})

test('should pass', () => {
  expect(() => {
    validateAndGetConfigObject(validBoard)
  }).not.toThrow()
})
