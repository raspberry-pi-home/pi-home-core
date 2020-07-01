import { validateAndGetConfigObject } from './config'
const validBoard = require('../__fixtures__/board.json')

describe('pinSettings', () => {
  test('should throw an error when pins are duplicated', () => {
    expect(() => {
      validateAndGetConfigObject({
        pinSettings: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }, {
          label: 'Led 18',
          pin: 17,
          type: 'led',
        }],
      })
    }).toThrowError('Review your "pinSettings" configuration, seems there are duplicated or missing pins')
  })

  test('should throw an error when labels are duplicated', () => {
    expect(() => {
      validateAndGetConfigObject({
        pinSettings: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }, {
          label: 'Led 17',
          pin: 18,
          type: 'led',
        }],
      })
    }).toThrowError('Review your "pinSettings" configuration, seems there are duplicated or missing labels')
  })
})

describe('pinDependencies', () => {
  test('should throw an error when pinDependencies object is missing', () => {
    expect(() => {
      validateAndGetConfigObject({
        pinSettings: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }],
      })
    }).toThrowError('No "pinDependencies" provided')
  })

  test('should throw an error when inputPin and outputPin are the same', () => {
    expect(() => {
      validateAndGetConfigObject({
        pinSettings: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }],
        pinDependencies: [{
          inputPin: 22,
          outputPin: 22,
        }],
      })
    }).toThrowError('Review your "pinDependencies" configuration, seems there is "inputPin" and "outputPin" with the same value')
  })

  test('should throw an error when input pin does not match', () => {
    expect(() => {
      validateAndGetConfigObject({
        pinSettings: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }, {
          label: 'Button 22',
          pin: 22,
          type: 'onOffButton',
        }],
        pinDependencies: [{
          inputPin: 17,
          outputPin: 23,
        }],
      })
    }).toThrowError('Review your "pinDependencies" configuration, seems there is "inputPin" that is mapped to an invalid value')
  })

  test('should throw an error when output pin does not match', () => {
    expect(() => {
      validateAndGetConfigObject({
        pinSettings: [{
          label: 'Led 17',
          pin: 17,
          type: 'led',
        }, {
          label: 'Button 22',
          pin: 22,
          type: 'onOffButton',
        }],
        pinDependencies: [{
          inputPin: 22,
          outputPin: 16,
        }],
      })
    }).toThrowError('Review your "pinDependencies" configuration, seems there is "outputPin" that is mapped to an invalid value')
  })
})

test('should pass', () => {
  expect(() => {
    validateAndGetConfigObject(validBoard)
  }).not.toThrow()
})
