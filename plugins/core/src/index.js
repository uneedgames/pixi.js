// export some core modules
import * as ecs from './ecs';
import * as data from './data';
import * as geometry from './geometry';
import * as settings from './settings';
import * as utils from './utils';

export {
    ecs,
    data,
    geometry,
    settings,
    utils,
};

// @ifdef DEBUG
import * as debug from './debug';
export { debug };
// @endif
