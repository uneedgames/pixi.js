# Things to update:

- Remove the need to check SVGs like the current docs say (Texture)
- Change Texture docs to be correct after modifications
- Want to change this pattern of adding properties for storage on public objects, and instead create wrappers where they are needed internally.
    * Removed `TextureSource.touched`, which is used by texture GC
    * Removed `TextureSource._glTextured`, used by renderers
    * Removed `TextureSource.cacheId`, used by texture caching
    * Removed `TextureSource.textureCacheIds`, used by texture caching
        - Want to change this to be all textures in a map by uid, then user-friendly strings map to the UID of the texture they represent. Cache manager listens for destroy dispatches and clears objects from cache.
- Replace `TextureSource.dirtyId` with `TextureSource.updateId`.

# Migration guide

- `BaseTexture` -> `TextureSource`
    * `BaseTexture.from*()` -> `TextureSource.from()`
    * Constructor arguments are now `(resource, options)`
    * Load event is now `onReady` signal, other events are same name as signals (`onEvent`)
- `Texture.baseTexture` -> `Texture.source`
- Settings migration
    * `settings.SCALE_MODE`         -> `TextureSource.defaultScaleMode`
    * `settings.WRAP_MODE`          -> `TextureSource.defaultWrapMode`
    * `settings.MIPMAP_TEXTURES`    -> `TextureSource.defaultMipMap`
- Texture rotation is in radians, not D8
- Removed `.transform` property, it was unused except for plugins. Those plugins should use their own storage.
- All events changed to signals
