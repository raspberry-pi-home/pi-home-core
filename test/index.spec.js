import createBoard from '../src/index';

describe('pi-home-engine', () => {
    describe('when I importing the library', () => {
        test('should return the main function', () => {
            expect(createBoard).toBeDefined();
        });
    });
});
