# Things to update:

- Look at:
    * `math/shapes/`
- Remove the need to check SVGs like the current docs say (Texture)
- Change Texture docs to be correct after modifications
- Want to change this pattern of adding properties for storage on public objects, and instead create wrappers where they are needed internally.
    * Removed `TextureSource.touched`, which is used by texture GC
    * Removed `TextureSource._glTextures`, used by renderers
    * Removed `TextureSource.cacheId`, used by texture caching
    * Removed `TextureSource.textureCacheIds`, used by texture caching
        - Want to change this to be all textures in a map by uid, then user-friendly strings map to the UID of the texture they represent. Cache manager listens for destroy dispatches and clears objects from cache.
- Replace `TextureSource.dirtyId` with `TextureSource.updateId`.
- Change all `{*}` types to be specific types, especially if we can create jsdoc interfaces for them
- Implement `legacy` in the renderer in a way that is not global (right now it sets a static)


# Migration guide

- Removed `SystemRenderer`
- Removed `CanvasRenderer`
- `WebGLRenderer` -> `Renderer`
- `BaseTexture` -> `TextureSource`
    * `BaseTexture.from*()` -> `TextureSource.from()`
    * Constructor arguments are now `(resource, options)`
    * Load event is now `onReady` signal, other events are same name as signals (`onEvent`)
- `Texture.baseTexture` -> `Texture.source`
- `SystemRenderer` -> `BaseRenderer`
- Const migration `const.*` -> `data.*`
    * Removed `const.RENDERER_TYPE`
    * `BLEND_MODES` are now WebGL blending related constants, rather than pixi IDs for a blend mode. Use the `BlendMode` class instead.
        - Examples: `BLEND_MODES.NORMAL` -> `BlendMode.NORMAL`, `BLEND_MODES.ADD` -> `BlendMode.ADD`.
- Settings migration
    * `settings.SCALE_MODE`         -> `TextureSource.defaultScaleMode`
    * `settings.WRAP_MODE`          -> `TextureSource.defaultWrapMode`
    * `settings.MIPMAP_TEXTURES`    -> `TextureSource.defaultMipMap`
    * `settings.RESOLUTION`         -> `BaseRenderer.defaultResolution`
    * `settings.RENDER_OPTIONS`     -> `BaseRenderer.defaultOptions`
- `Texture#rotation` is in radians, not D8 anymore so all rotations are now supported
- Removed `.transform` property, it was unused except for plugins. Those plugins should use their own storage (see new dev patterns)
- All events changed to signals

# Definition of Terms

To explain the patterns used in Pixi I need to define a few terms first. Many of these terms may seem
familiar to you, but read carefully because they may be different than you expect.

- `Manager` - A Manager is responsible for the lifetime and functionality of some object(s).
    Generally the managed object(s) can only be created by the manager, is stored in the manager, and is
    accessed only through the manager. Additionally the manager can provide useful functionality around a feature.
    It provides a centralized implementation of a specific feature, or the utilities/state necessary for that feature.
    * Example: The `ContextManager` creates/destroys a context, and handles context lost/restored events. It manages the WebGL context object.
    * Example: The `TextureManager` creates/destroys GL Textures and provides an interface for uploading texture data to the GPU.
- `System` - A System is responsible for the functionality of an array of objects and the interactions between
    them, managers, and other systems. It does not create, destroy, or store these objects; but instead the objects are
    generally created/stored by the user. The objects that it operates upon share a common component or set of
    components that the system requires. Each system on a renderer is updated each frame.
    * Example: The `TextureSystem` interacts with the user-created Texture objects and uploads them via the `TextureManager`.
- `Component` - A Component is a small, specific piece of reusable properties & functionality. Components
    enable us to create objects composed of multiple small reusable bits, increasing code reuse. modularity, and flexibility.
    The functionality in a component only controls that specific component's data, and doesn't interact with other components;
    except indirectly via Signals. Generally, you do not create instances of component but instead use them as mixins to
    other classes that will then be created directly.
    * Example: The `UpdateComponent` adds a few properties to an object, including an `onUpdate` signal.
- `Assemblage` - An Assemblage is a class that combines multiple components to create a useful object that can be repeatedly created.
    * Example: The `Texture` assemblage combines a few components including the `UpdateComponent` and `UidComponent` so it
        has an `onUpdate` signal and a `uid` property.
