import { validateAndGetConfigObject } from './config'
const validBoard = require('../__fixtures__/board.json')

describe('devices', () => {
  test('should throw an error when devices are duplicated', () => {
    expect(() => {
      validateAndGetConfigObject({
        devices: [{
          pin: 17,
          type: 'led',
          label: 'Led 17',
        }, {
          pin: 17,
          type: 'led',
          label: 'Led 18',
        }],
        dependencies: [],
      })
    }).toThrowError('Review your "devices" configuration, seems there are duplicated pins')
  })

  test('should throw an error when labels are duplicated', () => {
    expect(() => {
      validateAndGetConfigObject({
        devices: [{
          pin: 17,
          type: 'led',
          label: 'Led 17',
        }, {
          pin: 18,
          type: 'led',
          label: 'Led 17',
        }],
        dependencies: [],
      })
    }).toThrowError('Review your "devices" configuration, seems there are duplicated labels')
  })
})

describe('dependencies', () => {
  test('should throw an error when inputPin and outputPin are the same', () => {
    expect(() => {
      validateAndGetConfigObject({
        devices: [{
          pin: 17,
          type: 'led',
          label: 'Led 17',
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
        devices: [{
          pin: 17,
          type: 'led',
          label: 'Led 17',
        }, {
          pin: 22,
          type: 'onOffButton',
          label: 'Button 22',
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
        devices: [{
          pin: 17,
          type: 'led',
          label: 'Led 17',
        }, {
          pin: 22,
          type: 'onOffButton',
          label: 'Button 22',
        }],
        dependencies: [{
          inputPin: 22,
          outputPin: 16,
        }],
      })
    }).toThrowError('Review your "dependencies" configuration, seems there is "outputPin" that is mapped to an invalid value')
  })

  test('should throw an error when the input or outputPin pin is out of range', () => {
    expect(() => {
      validateAndGetConfigObject({
        devices: [{
          pin: 17,
          type: 'led',
          label: 'Led 17',
        }, {
          pin: 22,
          type: 'onOffButton',
          label: 'Button 22',
        }],
        dependencies: [{
          inputPin: 99,
          outputPin: 16,
        }],
      })
    }).toThrowError('Configuration object must agreed the defined schema')
  })
})

test('should pass (empty)', () => {
  expect(() => {
    validateAndGetConfigObject({
      devices: [],
      dependencies: [],
    })
  }).not.toThrow()
})

test('should pass', () => {
  expect(() => {
    validateAndGetConfigObject(validBoard)
  }).not.toThrow()
})
