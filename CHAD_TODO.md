# Things to update:

- Change texture rotation to not be D8, but true rotation
    * Change Texture::rotate param to be in radians
- Remove the need to check SVGs like the current docs say (Texture)
- Change Texture docs to be correct after modifications

# Migration guide

1. `settings.MIPMAP_TEXTURES` -> `TextureSource.defaultMipMap`
2.

