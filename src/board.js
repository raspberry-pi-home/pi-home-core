import {validateAndGetConfigObject} from './utils/config';

const createBoard = (config) => {
    let newConfig = validateAndGetConfigObject(config);

    if (process.env.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(newConfig);
    }
};

export default createBoard;
