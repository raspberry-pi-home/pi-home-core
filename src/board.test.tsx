import { Board } from './board'
const validBoard = require('./__fixtures__/board.json')

test('basic instantiation', () => {
  expect(() => new Board(validBoard)).not.toThrow()
})
