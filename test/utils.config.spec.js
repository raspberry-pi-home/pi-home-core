import {validateAndGetConfigObject} from '../src/utils/config';
import validBoard from './__fixtures__/board.json';

describe('validateAndGetConfigObject', () => {
    test('should throw an error when configuration object is not passed', () => {
        expect(() => {
            validateAndGetConfigObject();
        }).toThrowError('Missing configuration object');
        expect(() => {
            validateAndGetConfigObject({});
        }).toThrowError('Missing configuration object');
    });

    test('should throw an error when configuration is not a json object', () => {
        expect(() => {
            validateAndGetConfigObject('foo');
        }).toThrowError('Configuration object must be a json object');
    });

    describe('pinSettings', () => {
        test('should throw an error when pinSettings object is missing', () => {
            expect(() => {
                validateAndGetConfigObject({
                    foo: 'bar',
                });
            }).toThrowError('No "pinSettings" provided');
        });

        test('should throw an error when pinSettings is not an array', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: 'foo',
                });
            }).toThrowError('Configuration object must agreed the defined schema');
        });

        test('should throw an error when pin setting is not an object', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: ['foo'],
                });
            }).toThrowError('Configuration object must agreed the defined schema');
        });

        test('should throw an error when pin setting is empty', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{}],
                });
            }).toThrowError('Configuration object must agreed the defined schema');
        });

        test('should throw an error when pin setting does not contain all the required properties', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        pin: 2,
                    }],
                });
            }).toThrowError('Configuration object must agreed the defined schema');
        });

        test('should throw an error when pins are duplicated', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }, {
                        label: 'Led 18',
                        pin: 17,
                        type: 'digitalOutput',
                    }],
                });
            }).toThrowError('Review your "pinSettings" configuration, seems there are duplicated pins');
        });

        test('should throw an error when labels are duplicated', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }, {
                        label: 'Led 17',
                        pin: 18,
                        type: 'digitalOutput',
                    }],
                });
            }).toThrowError('Review your "pinSettings" configuration, seems there are duplicated labels');
        });
    });

    describe('pinDependencies', () => {
        test('should throw an error when pinDependencies object is missing', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }],
                });
            }).toThrowError('No "pinDependencies" provided');
        });

        test('should throw an error when pinDependencies is not an array', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }],
                    pinDependencies: 'foo',
                });
            }).toThrowError('Configuration object must agreed the defined schema');
        });

        test('should throw an error when pin dependency is not an object', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }],
                    pinDependencies: ['foo'],
                });
            }).toThrowError('Configuration object must agreed the defined schema');
        });

        test('should throw an error when pin dependency is empty', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }],
                    pinDependencies: [{}],
                });
            }).toThrowError('Configuration object must agreed the defined schema');
        });

        test('should throw an error when pin dependency does not contain all the required properties', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }],
                    pinDependencies: [{
                        inputPin: 22,
                    }],
                });
            }).toThrowError('Configuration object must agreed the defined schema');
        });

        test('should throw an error when inputPin and outputPin are the same', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }],
                    pinDependencies: [{
                        inputPin: 22,
                        outputPin: 22,
                        type: 'direct',
                    }],
                });
            }).toThrowError('Review your "pinDependencies" configuration, seems there is "inputPin" and "outputPin" with the same value');
        });

        test('should throw an error when input pin does not match', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }, {
                        label: 'Button 22',
                        pin: 22,
                        type: 'digitalInput',
                    }],
                    pinDependencies: [{
                        inputPin: 17,
                        outputPin: 23,
                        type: 'toggle',
                    }],
                });
            }).toThrowError('Review your "pinDependencies" configuration, seems there is "inputPin" that is mapped to an ivalid value');
        });

        test('should throw an error when output pin does not match', () => {
            expect(() => {
                validateAndGetConfigObject({
                    pinSettings: [{
                        label: 'Led 17',
                        pin: 17,
                        type: 'digitalOutput',
                    }, {
                        label: 'Button 22',
                        pin: 22,
                        type: 'digitalInput',
                    }],
                    pinDependencies: [{
                        inputPin: 22,
                        outputPin: 16,
                        type: 'direct',
                    }],
                });
            }).toThrowError('Review your "pinDependencies" configuration, seems there is "outputPin" that is mapped to an ivalid value');
        });
    });

    test('should pass', () => {
        expect(() => {
            validateAndGetConfigObject(validBoard);
        }).not.toThrow();
    });
});
