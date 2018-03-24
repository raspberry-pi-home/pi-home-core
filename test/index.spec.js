import {Cat, Dog} from '../src/index';

describe('Given an instance of my Cat library', () => {
    let lib = new Cat();

    describe('when I need the name', () => {
        it('should return the name', () => {
            expect(lib.name).toEqual('Cat');
        });
    });
});

describe('Given an instance of my Dog library', () => {
    let lib = new Dog();

    describe('when I need the name', () => {
        it('should return the name', () => {
            expect(lib.name).toEqual('Dog');
        });
    });
});
