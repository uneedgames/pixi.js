// import polyfills. Done as an export to make sure polyfills are imported first
export * from './polyfill';

// export core
export * from './core/index.graphics';

import { utils } from './core/index.graphics';
utils.mixins.performMixins();

// Always export PixiJS globally.
global.PIXI = exports; // eslint-disable-line

