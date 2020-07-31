import { Board } from './board'
const validBoard = require('./__fixtures__/board.json')

test('basic instantiation', () => {
  const board = new Board()
  expect(() => board.setConfig(validBoard)).not.toThrow()
})

test('basic instantiation (empty)', () => {
  const board = new Board()
  expect(() => board.setConfig({
    devices: [],
    dependencies: [],
  })).not.toThrow()
})

test('devices', () => {
  const board = new Board()
  board.setConfig(validBoard)
  expect(board.devices()).toEqual([
    { pin: 2, type: 'led', label: 'Led 2', status: 0 },
    { pin: 3, type: 'led', label: 'Led 3', status: 0 },
    { pin: 4, type: 'led', label: 'Led 4', status: 0 },
    { pin: 5 },
    { pin: 6 },
    { pin: 7 },
    { pin: 8 },
    { pin: 9 },
    { pin: 10 },
    { pin: 11 },
    { pin: 12 },
    { pin: 13 },
    { pin: 14 },
    { pin: 15 },
    { pin: 16 },
    { pin: 17 },
    { pin: 18 },
    { pin: 19 },
    { pin: 20, type: 'onOffButton', label: 'Button 20' },
    { pin: 21, type: 'pushButton', label: 'Button 21' },
    { pin: 22 },
    { pin: 23 },
    { pin: 24 },
    { pin: 25 },
    { pin: 26 },
    { pin: 27 },
  ])
})

test('device', () => {
  const board = new Board()
  board.setConfig(validBoard)
  expect(board.device(2)).toEqual({
    pin: 2,
    type: 'led',
    label: 'Led 2',
    status: 0,
    dependencies: [{ pin: 20, type: 'onOffButton', label: 'Button 20' }],
  })
  expect(board.device(20)).toEqual({
    pin: 20,
    type: 'onOffButton',
    label: 'Button 20',
    dependencies: [
      { pin: 2, type: 'led', label: 'Led 2' },
      { pin: 3, type: 'led', label: 'Led 3' },
    ],
  })
})

test('dependencies', () => {
  const board = new Board()
  board.setConfig(validBoard)
  expect(board.dependencies()).toEqual([
    { inputPin: 20, outputPin: 2 },
    { inputPin: 20, outputPin: 3 },
    { inputPin: 21, outputPin: 4 },
  ])
})

test('changeStatus', () => {
  const board = new Board()
  board.setConfig(validBoard)
  expect(board.device(2)).toEqual({
    pin: 2,
    type: 'led',
    label: 'Led 2',
    status: 0,
    dependencies: [{ pin: 20, type: 'onOffButton', label: 'Button 20' }],
  })
  board.changeStatus(2)
  expect(board.device(2)).toEqual({
    pin: 2,
    type: 'led',
    label: 'Led 2',
    status: 1,
    dependencies: [{ pin: 20, type: 'onOffButton', label: 'Button 20' }],
  })
})
