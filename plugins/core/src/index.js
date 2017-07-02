// export some core modules
import * as ecs from './ecs';
import * as material from './material';
import * as math from './math';
import * as utils from './utils';

export {
    ecs,
    material,
    math,
    utils,
};

// @ifdef DEBUG
import * as debug from './debug';
export { debug };
// @endif
