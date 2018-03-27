import createBoard from '../src/board';
import validBoard from './__fixtures__/board.json';

describe('board', () => {
    describe('createBoard', () => {
        test('should pass', () => {
            expect(() => {
                createBoard(validBoard);
            }).not.toThrow();
        });
    });
});
