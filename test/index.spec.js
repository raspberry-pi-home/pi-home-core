import createBoard from '../src/index';

describe('pi-home-core', () => {
    describe('when I importing the library', () => {
        test('should return the main function', () => {
            expect(createBoard).toBeDefined();
        });
    });
});
