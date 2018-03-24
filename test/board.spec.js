import createBoard from '../src/board';

describe('board', () => {
    it('should pass', () => {
        expect(createBoard()).toBeUndefined();
    });
});
