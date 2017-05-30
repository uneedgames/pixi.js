// Taken From: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

/**
 * @namespace GLConstants
 * @memberof gl
 */

/**
 * Standard WebGL 1 constants
 * These constants are defined on the WebGLRenderingContext interface.
 */

// Clearing buffers
// Constants passed to WebGLRenderingContext.clear() to clear buffer masks.

export const DEPTH_BUFFER_BIT = 0x00000100; // Passed to clear to clear the current depth buffer.
export const STENCIL_BUFFER_BIT = 0x00000400; // Passed to clear to clear the current stencil buffer.
export const COLOR_BUFFER_BIT = 0x00004000; // Passed to clear to clear the current color buffer.

// Rendering primitives
// Constants passed to WebGLRenderingContext.drawElements() or WebGLRenderingContext.drawArrays() to specify what kind of primitive to render.

export const POINTS = 0x0000; // Passed to drawElements or drawArrays to draw single points.
export const LINES = 0x0001; // Passed to drawElements or drawArrays to draw lines. Each vertex connects to the one after it.
export const LINE_LOOP = 0x0002; // Passed to drawElements or drawArrays to draw lines. Each set of two vertices is treated as a separate line segment.
export const LINE_STRIP = 0x0003; // Passed to drawElements or drawArrays to draw a connected group of line segments from the first vertex to the last.
export const TRIANGLES = 0x0004; // Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle.
export const TRIANGLE_STRIP = 0x0005; // Passed to drawElements or drawArrays to draw a connected group of triangles.
export const TRIANGLE_FAN = 0x0006; // Passed to drawElements or drawArrays to draw a connected group of triangles. Each vertex connects to the previous and the first vertex in the fan.

// Blending modes
// Constants passed to WebGLRenderingContext.blendFunc() or WebGLRenderingContext.blendFuncSeparate() to specify the blending mode (for both, RBG and alpha, or separately).

export const ZERO = 0; // Passed to blendFunc or blendFuncSeparate to turn off a component.
export const ONE = 1; // Passed to blendFunc or blendFuncSeparate to turn on a component.
export const SRC_COLOR = 0x0300; // Passed to blendFunc or blendFuncSeparate to multiply a component by the source elements color.
export const ONE_MINUS_SRC_COLOR = 0x0301; // Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source elements color.
export const SRC_ALPHA = 0x0302; // Passed to blendFunc or blendFuncSeparate to multiply a component by the source's alpha.
export const ONE_MINUS_SRC_ALPHA = 0x0303; // Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source's alpha.
export const DST_ALPHA = 0x0304; // Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's alpha.
export const ONE_MINUS_DST_ALPHA = 0x0305; // Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's alpha.
export const DST_COLOR = 0x0306; // Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's color.
export const ONE_MINUS_DST_COLOR = 0x0307; // Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's color.
export const SRC_ALPHA_SATURATE = 0x0308; // Passed to blendFunc or blendFuncSeparate to multiply a component by the minimum of source's alpha or one minus the destination's alpha.
export const CONSTANT_COLOR = 0x8001; // Passed to blendFunc or blendFuncSeparate to specify a constant color blend function.
export const ONE_MINUS_CONSTANT_COLOR = 0x8002; // Passed to blendFunc or blendFuncSeparate to specify one minus a constant color blend function.
export const CONSTANT_ALPHA = 0x8003; // Passed to blendFunc or blendFuncSeparate to specify a constant alpha blend function.
export const ONE_MINUS_CONSTANT_ALPHA = 0x8004; // Passed to blendFunc or blendFuncSeparate to specify one minus a constant alpha blend function.

// Blending equations
// Constants passed to WebGLRenderingContext.blendEquation() or WebGLRenderingContext.blendEquationSeparate() to control how the blending is calculated (for both, RBG and alpha, or separately).

export const FUNC_ADD = 0x8006; // Passed to blendEquation or blendEquationSeparate to set an addition blend function.
export const FUNC_SUBTRACT = 0x800A; // Passed to blendEquation or blendEquationSeparate to specify a subtraction blend function (source - destination).
export const FUNC_REVERSE_SUBTRACT = 0x800B; // Passed to blendEquation or blendEquationSeparate to specify a reverse subtraction blend function (destination - source).

// Getting GL parameter information
// Constants passed to WebGLRenderingContext.getParameter() to specify what information to return.

export const BLEND_EQUATION = 0x8009; // Passed to getParameter to get the current RGB blend function.
export const BLEND_EQUATION_RGB = 0x8009; // Passed to getParameter to get the current RGB blend function. Same as BLEND_EQUATION
export const BLEND_EQUATION_ALPHA = 0x883D; // Passed to getParameter to get the current alpha blend function. Same as BLEND_EQUATION
export const BLEND_DST_RGB = 0x80C8; // Passed to getParameter to get the current destination RGB blend function.
export const BLEND_SRC_RGB = 0x80C9; // Passed to getParameter to get the current destination RGB blend function.
export const BLEND_DST_ALPHA = 0x80CA; // Passed to getParameter to get the current destination alpha blend function.
export const BLEND_SRC_ALPHA = 0x80CB; // Passed to getParameter to get the current source alpha blend function.
export const BLEND_COLOR = 0x8005; // Passed to getParameter to return a the current blend color.
export const ARRAY_BUFFER_BINDING = 0x8894; // Passed to getParameter to get the array buffer binding.
export const ELEMENT_ARRAY_BUFFER_BINDING = 0x8895; // Passed to getParameter to get the current element array buffer.
export const LINE_WIDTH = 0x0B21; // Passed to getParameter to get the current lineWidth (set by the lineWidth method).
export const ALIASED_POINT_SIZE_RANGE = 0x846D; // Passed to getParameter to get the current size of a point drawn with gl.POINTS
export const ALIASED_LINE_WIDTH_RANGE = 0x846E; // Passed to getParameter to get the range of available widths for a line. Returns a length-2 array with the lo value at 0, and hight at 1.
export const CULL_FACE_MODE = 0x0B45; // Passed to getParameter to get the current value of cullFace. Should return FRONT, BACK, or FRONT_AND_BACK
export const FRONT_FACE = 0x0B46; // Passed to getParameter to determine the current value of frontFace. Should return CW or CCW.
export const DEPTH_RANGE = 0x0B70; // Passed to getParameter to return a length-2 array of floats giving the current depth range.
export const DEPTH_WRITEMASK = 0x0B72; // Passed to getParameter to determine if the depth write mask is enabled.
export const DEPTH_CLEAR_VALUE = 0x0B73; // Passed to getParameter to determine the current depth clear value.
export const DEPTH_FUNC = 0x0B74; // Passed to getParameter to get the current depth function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL.
export const STENCIL_CLEAR_VALUE = 0x0B91; // Passed to getParameter to get the value the stencil will be cleared to.
export const STENCIL_FUNC = 0x0B92; // Passed to getParameter to get the current stencil function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL.
export const STENCIL_FAIL = 0x0B94; // Passed to getParameter to get the current stencil fail function. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
export const STENCIL_PASS_DEPTH_FAIL = 0x0B95; // Passed to getParameter to get the current stencil fail function should the depth buffer test fail. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
export const STENCIL_PASS_DEPTH_PASS = 0x0B96; // Passed to getParameter to get the current stencil fail function should the depth buffer test pass. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
export const STENCIL_REF = 0x0B97; // Passed to getParameter to get the reference value used for stencil tests.
export const STENCIL_VALUE_MASK = 0x0B93; //
export const STENCIL_WRITEMASK = 0x0B98; //
export const STENCIL_BACK_FUNC = 0x8800; //
export const STENCIL_BACK_FAIL = 0x8801; //
export const STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802; //
export const STENCIL_BACK_PASS_DEPTH_PASS = 0x8803; //
export const STENCIL_BACK_REF = 0x8CA3; //
export const STENCIL_BACK_VALUE_MASK = 0x8CA4; //
export const STENCIL_BACK_WRITEMASK = 0x8CA5; //
export const VIEWPORT = 0x0BA2; // Returns an Int32Array with four elements for the current viewport dimensions.
export const SCISSOR_BOX = 0x0C10; // Returns an Int32Array with four elements for the current scissor box dimensions.
export const COLOR_CLEAR_VALUE = 0x0C22; //
export const COLOR_WRITEMASK = 0x0C23; //
export const UNPACK_ALIGNMENT = 0x0CF5; //
export const PACK_ALIGNMENT = 0x0D05; //
export const MAX_TEXTURE_SIZE = 0x0D33; //
export const MAX_VIEWPORT_DIMS = 0x0D3A; //
export const SUBPIXEL_BITS = 0x0D50; //
export const RED_BITS = 0x0D52; //
export const GREEN_BITS = 0x0D53; //
export const BLUE_BITS = 0x0D54; //
export const ALPHA_BITS = 0x0D55; //
export const DEPTH_BITS = 0x0D56; //
export const STENCIL_BITS = 0x0D57; //
export const POLYGON_OFFSET_UNITS = 0x2A00; //
export const POLYGON_OFFSET_FACTOR = 0x8038; //
export const TEXTURE_BINDING_2D = 0x8069; //
export const SAMPLE_BUFFERS = 0x80A8; //
export const SAMPLES = 0x80A9; //
export const SAMPLE_COVERAGE_VALUE = 0x80AA; //
export const SAMPLE_COVERAGE_INVERT = 0x80AB; //
export const COMPRESSED_TEXTURE_FORMATS = 0x86A3; //
export const VENDOR = 0x1F00; //
export const RENDERER = 0x1F01; //
export const VERSION = 0x1F02; //
export const IMPLEMENTATION_COLOR_READ_TYPE = 0x8B9A; //
export const IMPLEMENTATION_COLOR_READ_FORMAT = 0x8B9B; //
export const BROWSER_DEFAULT_WEBGL = 0x9244; //

// Buffers
// Constants passed to WebGLRenderingContext.bufferData(), WebGLRenderingContext.bufferSubData(), WebGLRenderingContext.bindBuffer(), or WebGLRenderingContext.getBufferParameter().

export const STATIC_DRAW = 0x88E4; // Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often.
export const STREAM_DRAW = 0x88E0; // Passed to bufferData as a hint about whether the contents of the buffer are likely to not be used often.
export const DYNAMIC_DRAW = 0x88E8; // Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and change often.
export const ARRAY_BUFFER = 0x8892; // Passed to bindBuffer or bufferData to specify the type of buffer being used.
export const ELEMENT_ARRAY_BUFFER = 0x8893; // Passed to bindBuffer or bufferData to specify the type of buffer being used.
export const BUFFER_SIZE = 0x8764; // Passed to getBufferParameter to get a buffer's size.
export const BUFFER_USAGE = 0x8765; // Passed to getBufferParameter to get the hint for the buffer passed in when it was created.

// Vertex attributes
// Constants passed to WebGLRenderingContext.getVertexAttrib().

export const CURRENT_VERTEX_ATTRIB = 0x8626; // Passed to getVertexAttrib to read back the current vertex attribute.
export const VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622; //
export const VERTEX_ATTRIB_ARRAY_SIZE = 0x8623; //
export const VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624; //
export const VERTEX_ATTRIB_ARRAY_TYPE = 0x8625; //
export const VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886A; //
export const VERTEX_ATTRIB_ARRAY_POINTER = 0x8645; //
export const VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F; //

// Culling
// Constants passed to WebGLRenderingContext.cullFace().

export const CULL_FACE = 0x0B44; // Passed to enable/disable to turn on/off culling. Can also be used with getParameter to find the current culling method.
export const FRONT = 0x0404; // Passed to cullFace to specify that only front faces should be drawn.
export const BACK = 0x0405; // Passed to cullFace to specify that only back faces should be drawn.
export const FRONT_AND_BACK = 0x0408; // Passed to cullFace to specify that front and back faces should be drawn.

// Enabling and disabling
// Constants passed to WebGLRenderingContext.enable() or WebGLRenderingContext.disable().

export const BLEND = 0x0BE2; // Passed to enable/disable to turn on/off blending. Can also be used with getParameter to find the current blending method.
export const DEPTH_TEST = 0x0B71; // Passed to enable/disable to turn on/off the depth test. Can also be used with getParameter to query the depth test.
export const DITHER = 0x0BD0; // Passed to enable/disable to turn on/off dithering. Can also be used with getParameter to find the current dithering method.
export const POLYGON_OFFSET_FILL = 0x8037; // Passed to enable/disable to turn on/off the polygon offset. Useful for rendering hidden-line images, decals, and or solids with highlighted edges. Can also be used with getParameter to query the scissor test.
export const SAMPLE_ALPHA_TO_COVERAGE = 0x809E; // Passed to enable/disable to turn on/off the alpha to coverage. Used in multi-sampling alpha channels.
export const SAMPLE_COVERAGE = 0x80A0; // Passed to enable/disable to turn on/off the sample coverage. Used in multi-sampling.
export const SCISSOR_TEST = 0x0C11; // Passed to enable/disable to turn on/off the scissor test. Can also be used with getParameter to query the scissor test.
export const STENCIL_TEST = 0x0B90; // Passed to enable/disable to turn on/off the stencil test. Can also be used with getParameter to query the stencil test.

// Errors
// Constants returned from WebGLRenderingContext.getError().

export const NO_ERROR = 0; // Returned from getError.
export const INVALID_ENUM = 0x0500; // Returned from getError.
export const INVALID_VALUE = 0x0501; // Returned from getError.
export const INVALID_OPERATION = 0x0502; // Returned from getError.
export const OUT_OF_MEMORY = 0x0505; // Returned from getError.
export const CONTEXT_LOST_WEBGL = 0x9242; // Returned from getError.

// Front face directions
// Constants passed to WebGLRenderingContext.frontFace().

export const CW = 0x0900; // Passed to frontFace to specify the front face of a polygon is drawn in the clockwise direction
export const CCW = 0x0901; // Passed to frontFace to specify the front face of a polygon is drawn in the counter clockwise direction

// Hints
// Constants passed to WebGLRenderingContext.hint()

export const DONT_CARE = 0x1100; // There is no preference for this behavior.
export const FASTEST = 0x1101; // The most efficient behavior should be used.
export const NICEST = 0x1102; // The most correct or the highest quality option should be used.
export const GENERATE_MIPMAP_HINT = 0x8192; // Hint for the quality of filtering when generating mipmap images with WebGLRenderingContext.generateMipmap().

// Data types

export const BYTE = 0x1400; //
export const UNSIGNED_BYTE = 0x1401; //
export const SHORT = 0x1402; //
export const UNSIGNED_SHORT = 0x1403; //
export const INT = 0x1404; //
export const UNSIGNED_INT = 0x1405; //
export const FLOAT = 0x1406; //

// Pixel formats

export const DEPTH_COMPONENT = 0x1902; //
export const ALPHA = 0x1906; //
export const RGB = 0x1907; //
export const RGBA = 0x1908; //
export const LUMINANCE = 0x1909; //
export const LUMINANCE_ALPHA = 0x190A; //

// Pixel types

// export const UNSIGNED_BYTE = 0x1401; //
export const UNSIGNED_SHORT_4_4_4_4 = 0x8033; //
export const UNSIGNED_SHORT_5_5_5_1 = 0x8034; //
export const UNSIGNED_SHORT_5_6_5 = 0x8363; //

// Shaders
// Constants passed to WebGLRenderingContext.createShader() or WebGLRenderingContext.getShaderParameter()

export const FRAGMENT_SHADER = 0x8B30; // Passed to createShader to define a fragment shader.
export const VERTEX_SHADER = 0x8B31; // Passed to createShader to define a vertex shader
export const COMPILE_STATUS = 0x8B81; // Passed to getShaderParamter to get the status of the compilation. Returns false if the shader was not compiled. You can then query getShaderInfoLog to find the exact error
export const DELETE_STATUS = 0x8B80; // Passed to getShaderParamter to determine if a shader was deleted via deleteShader. Returns true if it was, false otherwise.
export const LINK_STATUS = 0x8B82; // Passed to getProgramParameter after calling linkProgram to determine if a program was linked correctly. Returns false if there were errors. Use getProgramInfoLog to find the exact error.
export const VALIDATE_STATUS = 0x8B83; // Passed to getProgramParameter after calling validateProgram to determine if it is valid. Returns false if errors were found.
export const ATTACHED_SHADERS = 0x8B85; // Passed to getProgramParameter after calling attachShader to determine if the shader was attached correctly. Returns false if errors occurred.
export const ACTIVE_ATTRIBUTES = 0x8B89; // Passed to getProgramParameter to get the number of attributes active in a program.
export const ACTIVE_UNIFORMS = 0x8B86; // Passed to getProgramParamter to get the number of uniforms active in a program.
export const MAX_VERTEX_ATTRIBS = 0x8869; //
export const MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB; //
export const MAX_VARYING_VECTORS = 0x8DFC; //
export const MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D; //
export const MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C; //
export const MAX_TEXTURE_IMAGE_UNITS = 0x8872; // Implementation dependent number of maximum texture units. At least 8.
export const MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD; //
export const SHADER_TYPE = 0x8B4F; //
export const SHADING_LANGUAGE_VERSION = 0x8B8C; //
export const CURRENT_PROGRAM = 0x8B8D; //

// Depth or stencil tests
// Constants passed to WebGLRenderingContext.depthFunc() or WebGLRenderingContext.stencilFunc().

export const NEVER = 0x0200; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn.
export const ALWAYS = 0x0207; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn.
export const LESS = 0x0201; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value.
export const EQUAL = 0x0202; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value.
export const LEQUAL = 0x0203; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value.
export const GREATER = 0x0204; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value.
export const GEQUAL = 0x0206; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value.
export const NOTEQUAL = 0x0205; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value.

// Stencil actions
// Constants passed to WebGLRenderingContext.stencilOp().

export const KEEP = 0x1E00; //
export const REPLACE = 0x1E01; //
export const INCR = 0x1E02; //
export const DECR = 0x1E03; //
export const INVERT = 0x150A; //
export const INCR_WRAP = 0x8507; //
export const DECR_WRAP = 0x8508; //

// Textures
// Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(), WebGLRenderingContext.bindTexture(), WebGLRenderingContext.texImage2D(), and others.

export const NEAREST = 0x2600; //
export const LINEAR = 0x2601; //
export const NEAREST_MIPMAP_NEAREST = 0x2700; //
export const LINEAR_MIPMAP_NEAREST = 0x2701; //
export const NEAREST_MIPMAP_LINEAR = 0x2702; //
export const LINEAR_MIPMAP_LINEAR = 0x2703; //
export const TEXTURE_MAG_FILTER = 0x2800; //
export const TEXTURE_MIN_FILTER = 0x2801; //
export const TEXTURE_WRAP_S = 0x2802; //
export const TEXTURE_WRAP_T = 0x2803; //
export const TEXTURE_2D = 0x0DE1; //
export const TEXTURE = 0x1702; //
export const TEXTURE_CUBE_MAP = 0x8513; //
export const TEXTURE_BINDING_CUBE_MAP = 0x8514; //
export const TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515; //
export const TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516; //
export const TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517; //
export const TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518; //
export const TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519; //
export const TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A; //
export const MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C; //
export const TEXTURE0 = 0x84C0; //
export const TEXTURE1 = 0x84C1; //
export const TEXTURE2 = 0x84C2; //
export const TEXTURE3 = 0x84C3; //
export const TEXTURE4 = 0x84C4; //
export const TEXTURE5 = 0x84C5; //
export const TEXTURE6 = 0x84C6; //
export const TEXTURE7 = 0x84C7; //
export const TEXTURE8 = 0x84C8; //
export const TEXTURE9 = 0x84C9; //
export const TEXTURE10 = 0x84CA; //
export const TEXTURE11 = 0x84CB; //
export const TEXTURE12 = 0x84CC; //
export const TEXTURE13 = 0x84CD; //
export const TEXTURE14 = 0x84CE; //
export const TEXTURE15 = 0x84CF; //
export const TEXTURE16 = 0x84D0; //
export const TEXTURE17 = 0x84D1; //
export const TEXTURE18 = 0x84D2; //
export const TEXTURE19 = 0x84D3; //
export const TEXTURE20 = 0x84D4; //
export const TEXTURE21 = 0x84D5; //
export const TEXTURE22 = 0x84D6; //
export const TEXTURE23 = 0x84D7; //
export const TEXTURE24 = 0x84D8; //
export const TEXTURE25 = 0x84D9; //
export const TEXTURE26 = 0x84DA; //
export const TEXTURE27 = 0x84DB; //
export const TEXTURE28 = 0x84DC; //
export const TEXTURE29 = 0x84DD; //
export const TEXTURE30 = 0x84DE; //
export const TEXTURE31 = 0x84DF; //
export const ACTIVE_TEXTURE = 0x84E0; // The current active texture unit.
export const REPEAT = 0x2901; //
export const CLAMP_TO_EDGE = 0x812F; //
export const MIRRORED_REPEAT = 0x8370; //

// Uniform types

export const FLOAT_VEC2 = 0x8B50; //
export const FLOAT_VEC3 = 0x8B51; //
export const FLOAT_VEC4 = 0x8B52; //
export const INT_VEC2 = 0x8B53; //
export const INT_VEC3 = 0x8B54; //
export const INT_VEC4 = 0x8B55; //
export const BOOL = 0x8B56; //
export const BOOL_VEC2 = 0x8B57; //
export const BOOL_VEC3 = 0x8B58; //
export const BOOL_VEC4 = 0x8B59; //
export const FLOAT_MAT2 = 0x8B5A; //
export const FLOAT_MAT3 = 0x8B5B; //
export const FLOAT_MAT4 = 0x8B5C; //
export const SAMPLER_2D = 0x8B5E; //
export const SAMPLER_CUBE = 0x8B60; //

// Shader precision-specified types

export const LOW_FLOAT = 0x8DF0; //
export const MEDIUM_FLOAT = 0x8DF1; //
export const HIGH_FLOAT = 0x8DF2; //
export const LOW_INT = 0x8DF3; //
export const MEDIUM_INT = 0x8DF4; //
export const HIGH_INT = 0x8DF5; //

// Framebuffers and renderbuffers

export const FRAMEBUFFER = 0x8D40; //
export const RENDERBUFFER = 0x8D41; //
export const RGBA4 = 0x8056; //
export const RGB5_A1 = 0x8057; //
export const RGB565 = 0x8D62; //
export const DEPTH_COMPONENT16 = 0x81A5; //
export const STENCIL_INDEX = 0x1901; //
export const STENCIL_INDEX8 = 0x8D48; //
export const DEPTH_STENCIL = 0x84F9; //
export const RENDERBUFFER_WIDTH = 0x8D42; //
export const RENDERBUFFER_HEIGHT = 0x8D43; //
export const RENDERBUFFER_INTERNAL_FORMAT = 0x8D44; //
export const RENDERBUFFER_RED_SIZE = 0x8D50; //
export const RENDERBUFFER_GREEN_SIZE = 0x8D51; //
export const RENDERBUFFER_BLUE_SIZE = 0x8D52; //
export const RENDERBUFFER_ALPHA_SIZE = 0x8D53; //
export const RENDERBUFFER_DEPTH_SIZE = 0x8D54; //
export const RENDERBUFFER_STENCIL_SIZE = 0x8D55; //
export const FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8CD0; //
export const FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8CD1; //
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8CD2; //
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3; //
export const COLOR_ATTACHMENT0 = 0x8CE0; //
export const DEPTH_ATTACHMENT = 0x8D00; //
export const STENCIL_ATTACHMENT = 0x8D20; //
export const DEPTH_STENCIL_ATTACHMENT = 0x821A; //
export const NONE = 0; //
export const FRAMEBUFFER_COMPLETE = 0x8CD5; //
export const FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6; //
export const FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7; //
export const FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9; //
export const FRAMEBUFFER_UNSUPPORTED = 0x8CDD; //
export const FRAMEBUFFER_BINDING = 0x8CA6; //
export const RENDERBUFFER_BINDING = 0x8CA7; //
export const MAX_RENDERBUFFER_SIZE = 0x84E8; //
export const INVALID_FRAMEBUFFER_OPERATION = 0x0506; //

// Pixel storage modes
// Constants passed to WebGLRenderingContext.pixelStorei().

export const UNPACK_FLIP_Y_WEBGL = 0x9240; //
export const UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241; //
export const UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243; //

/**
 * Additional constants defined WebGL 2
 * These constants are defined on the WebGL2RenderingContext interface. All WebGL 1 constants are also available in a WebGL 2 context.
 */

// Getting GL parameter information
// Constants passed to WebGLRenderingContext.getParameter() to specify what information to return.

export const READ_BUFFER = 0x0C02; //
export const UNPACK_ROW_LENGTH = 0x0CF2; //
export const UNPACK_SKIP_ROWS = 0x0CF3; //
export const UNPACK_SKIP_PIXELS = 0x0CF4; //
export const PACK_ROW_LENGTH = 0x0D02; //
export const PACK_SKIP_ROWS = 0x0D03; //
export const PACK_SKIP_PIXELS = 0x0D04; //
export const TEXTURE_BINDING_3D = 0x806A; //
export const UNPACK_SKIP_IMAGES = 0x806D; //
export const UNPACK_IMAGE_HEIGHT = 0x806E; //
export const MAX_3D_TEXTURE_SIZE = 0x8073; //
export const MAX_ELEMENTS_VERTICES = 0x80E8; //
export const MAX_ELEMENTS_INDICES = 0x80E9; //
export const MAX_TEXTURE_LOD_BIAS = 0x84FD; //
export const MAX_FRAGMENT_UNIFORM_COMPONENTS = 0x8B49; //
export const MAX_VERTEX_UNIFORM_COMPONENTS = 0x8B4A; //
export const MAX_ARRAY_TEXTURE_LAYERS = 0x88FF; //
export const MIN_PROGRAM_TEXEL_OFFSET = 0x8904; //
export const MAX_PROGRAM_TEXEL_OFFSET = 0x8905; //
export const MAX_VARYING_COMPONENTS = 0x8B4B; //
export const FRAGMENT_SHADER_DERIVATIVE_HINT = 0x8B8B; //
export const RASTERIZER_DISCARD = 0x8C89; //
export const VERTEX_ARRAY_BINDING = 0x85B5; //
export const MAX_VERTEX_OUTPUT_COMPONENTS = 0x9122; //
export const MAX_FRAGMENT_INPUT_COMPONENTS = 0x9125; //
export const MAX_SERVER_WAIT_TIMEOUT = 0x9111; //
export const MAX_ELEMENT_INDEX = 0x8D6B; //

// Textures
// Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(), WebGLRenderingContext.bindTexture(), WebGLRenderingContext.texImage2D(), and others.

export const RED = 0x1903; //
export const RGB8 = 0x8051; //
export const RGBA8 = 0x8058; //
export const RGB10_A2 = 0x8059; //
export const TEXTURE_3D = 0x806F; //
export const TEXTURE_WRAP_R = 0x8072; //
export const TEXTURE_MIN_LOD = 0x813A; //
export const TEXTURE_MAX_LOD = 0x813B; //
export const TEXTURE_BASE_LEVEL = 0x813C; //
export const TEXTURE_MAX_LEVEL = 0x813D; //
export const TEXTURE_COMPARE_MODE = 0x884C; //
export const TEXTURE_COMPARE_FUNC = 0x884D; //
export const SRGB = 0x8C40; //
export const SRGB8 = 0x8C41; //
export const SRGB8_ALPHA8 = 0x8C43; //
export const COMPARE_REF_TO_TEXTURE = 0x884E; //
export const RGBA32F = 0x8814; //
export const RGB32F = 0x8815; //
export const RGBA16F = 0x881A; //
export const RGB16F = 0x881B; //
export const TEXTURE_2D_ARRAY = 0x8C1A; //
export const TEXTURE_BINDING_2D_ARRAY = 0x8C1D; //
export const R11F_G11F_B10F = 0x8C3A; //
export const RGB9_E5 = 0x8C3D; //
export const RGBA32UI = 0x8D70; //
export const RGB32UI = 0x8D71; //
export const RGBA16UI = 0x8D76; //
export const RGB16UI = 0x8D77; //
export const RGBA8UI = 0x8D7C; //
export const RGB8UI = 0x8D7D; //
export const RGBA32I = 0x8D82; //
export const RGB32I = 0x8D83; //
export const RGBA16I = 0x8D88; //
export const RGB16I = 0x8D89; //
export const RGBA8I = 0x8D8E; //
export const RGB8I = 0x8D8F; //
export const RED_INTEGER = 0x8D94; //
export const RGB_INTEGER = 0x8D98; //
export const RGBA_INTEGER = 0x8D99; //
export const R8 = 0x8229; //
export const RG8 = 0x822B; //
export const R16F = 0x822D; //
export const R32F = 0x822E; //
export const RG16F = 0x822F; //
export const RG32F = 0x8230; //
export const R8I = 0x8231; //
export const R8UI = 0x8232; //
export const R16I = 0x8233; //
export const R16UI = 0x8234; //
export const R32I = 0x8235; //
export const R32UI = 0x8236; //
export const RG8I = 0x8237; //
export const RG8UI = 0x8238; //
export const RG16I = 0x8239; //
export const RG16UI = 0x823A; //
export const RG32I = 0x823B; //
export const RG32UI = 0x823C; //
export const R8_SNORM = 0x8F94; //
export const RG8_SNORM = 0x8F95; //
export const RGB8_SNORM = 0x8F96; //
export const RGBA8_SNORM = 0x8F97; //
export const RGB10_A2UI = 0x906F; //
export const TEXTURE_IMMUTABLE_FORMAT = 0x912F; //
export const TEXTURE_IMMUTABLE_LEVELS = 0x82DF; //

// Pixel types

export const UNSIGNED_INT_2_10_10_10_REV = 0x8368; //
export const UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B; //
export const UNSIGNED_INT_5_9_9_9_REV = 0x8C3E; //
export const FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD; //
export const UNSIGNED_INT_24_8 = 0x84FA; //
export const HALF_FLOAT = typeof WebGL2RenderingContext !== 'undefined' ? 0x140B : 0x8D61; // If we only have WebGL1 support, use the OES_texture_half_float value for HALF_FLOAT; don't force them to use the OES const.
export const RG = 0x8227; //
export const RG_INTEGER = 0x8228; //
export const INT_2_10_10_10_REV = 0x8D9F; //

// Queries

export const CURRENT_QUERY = 0x8865; //
export const QUERY_RESULT = 0x8866; //
export const QUERY_RESULT_AVAILABLE = 0x8867; //
export const ANY_SAMPLES_PASSED = 0x8C2F; //
export const ANY_SAMPLES_PASSED_CONSERVATIVE = 0x8D6A; //

// Draw buffers

export const MAX_DRAW_BUFFERS = 0x8824; //
export const DRAW_BUFFER0 = 0x8825; //
export const DRAW_BUFFER1 = 0x8826; //
export const DRAW_BUFFER2 = 0x8827; //
export const DRAW_BUFFER3 = 0x8828; //
export const DRAW_BUFFER4 = 0x8829; //
export const DRAW_BUFFER5 = 0x882A; //
export const DRAW_BUFFER6 = 0x882B; //
export const DRAW_BUFFER7 = 0x882C; //
export const DRAW_BUFFER8 = 0x882D; //
export const DRAW_BUFFER9 = 0x882E; //
export const DRAW_BUFFER10 = 0x882F; //
export const DRAW_BUFFER11 = 0x8830; //
export const DRAW_BUFFER12 = 0x8831; //
export const DRAW_BUFFER13 = 0x8832; //
export const DRAW_BUFFER14 = 0x8833; //
export const DRAW_BUFFER15 = 0x8834; //
export const MAX_COLOR_ATTACHMENTS = 0x8CDF; //
export const COLOR_ATTACHMENT1 = 0x8CE1; //
export const COLOR_ATTACHMENT2 = 0x8CE2; //
export const COLOR_ATTACHMENT3 = 0x8CE3; //
export const COLOR_ATTACHMENT4 = 0x8CE4; //
export const COLOR_ATTACHMENT5 = 0x8CE5; //
export const COLOR_ATTACHMENT6 = 0x8CE6; //
export const COLOR_ATTACHMENT7 = 0x8CE7; //
export const COLOR_ATTACHMENT8 = 0x8CE8; //
export const COLOR_ATTACHMENT9 = 0x8CE9; //
export const COLOR_ATTACHMENT10 = 0x8CEA; //
export const COLOR_ATTACHMENT11 = 0x8CEB; //
export const COLOR_ATTACHMENT12 = 0x8CEC; //
export const COLOR_ATTACHMENT13 = 0x8CED; //
export const COLOR_ATTACHMENT14 = 0x8CEE; //
export const COLOR_ATTACHMENT15 = 0x8CEF; //

// Samplers

export const SAMPLER_3D = 0x8B5F; //
export const SAMPLER_2D_SHADOW = 0x8B62; //
export const SAMPLER_2D_ARRAY = 0x8DC1; //
export const SAMPLER_2D_ARRAY_SHADOW = 0x8DC4; //
export const SAMPLER_CUBE_SHADOW = 0x8DC5; //
export const INT_SAMPLER_2D = 0x8DCA; //
export const INT_SAMPLER_3D = 0x8DCB; //
export const INT_SAMPLER_CUBE = 0x8DCC; //
export const INT_SAMPLER_2D_ARRAY = 0x8DCF; //
export const UNSIGNED_INT_SAMPLER_2D = 0x8DD2; //
export const UNSIGNED_INT_SAMPLER_3D = 0x8DD3; //
export const UNSIGNED_INT_SAMPLER_CUBE = 0x8DD4; //
export const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7; //
export const MAX_SAMPLES = 0x8D57; //
export const SAMPLER_BINDING = 0x8919; //

// Buffers

export const PIXEL_PACK_BUFFER = 0x88EB; //
export const PIXEL_UNPACK_BUFFER = 0x88EC; //
export const PIXEL_PACK_BUFFER_BINDING = 0x88ED; //
export const PIXEL_UNPACK_BUFFER_BINDING = 0x88EF; //
export const COPY_READ_BUFFER = 0x8F36; //
export const COPY_WRITE_BUFFER = 0x8F37; //
export const COPY_READ_BUFFER_BINDING = 0x8F36; //
export const COPY_WRITE_BUFFER_BINDING = 0x8F37; //

// Data types

export const FLOAT_MAT2x3 = 0x8B65; //
export const FLOAT_MAT2x4 = 0x8B66; //
export const FLOAT_MAT3x2 = 0x8B67; //
export const FLOAT_MAT3x4 = 0x8B68; //
export const FLOAT_MAT4x2 = 0x8B69; //
export const FLOAT_MAT4x3 = 0x8B6A; //
export const UNSIGNED_INT_VEC2 = 0x8DC6; //
export const UNSIGNED_INT_VEC3 = 0x8DC7; //
export const UNSIGNED_INT_VEC4 = 0x8DC8; //
export const UNSIGNED_NORMALIZED = 0x8C17; //
export const SIGNED_NORMALIZED = 0x8F9C; //

// Vertex attributes

export const VERTEX_ATTRIB_ARRAY_INTEGER = 0x88FD; //
export const VERTEX_ATTRIB_ARRAY_DIVISOR = 0x88FE; //

// Transform feedback

export const TRANSFORM_FEEDBACK_BUFFER_MODE = 0x8C7F; //
export const MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS = 0x8C80; //
export const TRANSFORM_FEEDBACK_VARYINGS = 0x8C83; //
export const TRANSFORM_FEEDBACK_BUFFER_START = 0x8C84; //
export const TRANSFORM_FEEDBACK_BUFFER_SIZE = 0x8C85; //
export const TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN = 0x8C88; //
export const MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 0x8C8A; //
export const MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS = 0x8C8B; //
export const INTERLEAVED_ATTRIBS = 0x8C8C; //
export const SEPARATE_ATTRIBS = 0x8C8D; //
export const TRANSFORM_FEEDBACK_BUFFER = 0x8C8E; //
export const TRANSFORM_FEEDBACK_BUFFER_BINDING = 0x8C8F; //
export const TRANSFORM_FEEDBACK = 0x8E22; //
export const TRANSFORM_FEEDBACK_PAUSED = 0x8E23; //
export const TRANSFORM_FEEDBACK_ACTIVE = 0x8E24; //
export const TRANSFORM_FEEDBACK_BINDING = 0x8E25; //

// Framebuffers and renderbuffers

export const FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING = 0x8210; //
export const FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE = 0x8211; //
export const FRAMEBUFFER_ATTACHMENT_RED_SIZE = 0x8212; //
export const FRAMEBUFFER_ATTACHMENT_GREEN_SIZE = 0x8213; //
export const FRAMEBUFFER_ATTACHMENT_BLUE_SIZE = 0x8214; //
export const FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE = 0x8215; //
export const FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE = 0x8216; //
export const FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE = 0x8217; //
export const FRAMEBUFFER_DEFAULT = 0x8218; //
// export const DEPTH_STENCIL_ATTACHMENT = 0x821A; //
// export const DEPTH_STENCIL = 0x84F9; //
export const DEPTH24_STENCIL8 = 0x88F0; //
export const DRAW_FRAMEBUFFER_BINDING = 0x8CA6; //
export const READ_FRAMEBUFFER = 0x8CA8; //
export const DRAW_FRAMEBUFFER = 0x8CA9; //
export const READ_FRAMEBUFFER_BINDING = 0x8CAA; //
export const RENDERBUFFER_SAMPLES = 0x8CAB; //
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 0x8CD4; //
export const FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 0x8D56; //

// Uniforms

export const UNIFORM_BUFFER = 0x8A11; //
export const UNIFORM_BUFFER_BINDING = 0x8A28; //
export const UNIFORM_BUFFER_START = 0x8A29; //
export const UNIFORM_BUFFER_SIZE = 0x8A2A; //
export const MAX_VERTEX_UNIFORM_BLOCKS = 0x8A2B; //
export const MAX_FRAGMENT_UNIFORM_BLOCKS = 0x8A2D; //
export const MAX_COMBINED_UNIFORM_BLOCKS = 0x8A2E; //
export const MAX_UNIFORM_BUFFER_BINDINGS = 0x8A2F; //
export const MAX_UNIFORM_BLOCK_SIZE = 0x8A30; //
export const MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS = 0x8A31; //
export const MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS = 0x8A33; //
export const UNIFORM_BUFFER_OFFSET_ALIGNMENT = 0x8A34; //
export const ACTIVE_UNIFORM_BLOCKS = 0x8A36; //
export const UNIFORM_TYPE = 0x8A37; //
export const UNIFORM_SIZE = 0x8A38; //
export const UNIFORM_BLOCK_INDEX = 0x8A3A; //
export const UNIFORM_OFFSET = 0x8A3B; //
export const UNIFORM_ARRAY_STRIDE = 0x8A3C; //
export const UNIFORM_MATRIX_STRIDE = 0x8A3D; //
export const UNIFORM_IS_ROW_MAJOR = 0x8A3E; //
export const UNIFORM_BLOCK_BINDING = 0x8A3F; //
export const UNIFORM_BLOCK_DATA_SIZE = 0x8A40; //
export const UNIFORM_BLOCK_ACTIVE_UNIFORMS = 0x8A42; //
export const UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 0x8A43; //
export const UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 0x8A44; //
export const UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8A46; //

// Sync objects

export const OBJECT_TYPE = 0x9112; //
export const SYNC_CONDITION = 0x9113; //
export const SYNC_STATUS = 0x9114; //
export const SYNC_FLAGS = 0x9115; //
export const SYNC_FENCE = 0x9116; //
export const SYNC_GPU_COMMANDS_COMPLETE = 0x9117; //
export const UNSIGNALED = 0x9118; //
export const SIGNALED = 0x9119; //
export const ALREADY_SIGNALED = 0x911A; //
export const TIMEOUT_EXPIRED = 0x911B; //
export const CONDITION_SATISFIED = 0x911C; //
export const WAIT_FAILED = 0x911D; //
export const SYNC_FLUSH_COMMANDS_BIT = 0x00000001; //

// Miscellaneous constants

export const COLOR = 0x1800; //
export const DEPTH = 0x1801; //
export const STENCIL = 0x1802; //
export const MIN = 0x8007; //
export const MAX = 0x8008; //
export const DEPTH_COMPONENT24 = 0x81A6; //
export const STREAM_READ = 0x88E1; //
export const STREAM_COPY = 0x88E2; //
export const STATIC_READ = 0x88E5; //
export const STATIC_COPY = 0x88E6; //
export const DYNAMIC_READ = 0x88E9; //
export const DYNAMIC_COPY = 0x88EA; //
export const DEPTH_COMPONENT32F = 0x8CAC; //
export const DEPTH32F_STENCIL8 = 0x8CAD; //
export const INVALID_INDEX = 0xFFFFFFFF; //
TIMEOUT_IGNORED	-1
export const MAX_CLIENT_WAIT_TIMEOUT_WEBGL = 0x9247; //

/**
 * Constants defined in WebGL extensions
 */

// ANGLE_instanced_arrays

export const VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE = 0x88FE; // Describes the frequency divisor used for instanced rendering.

// WEBGL_debug_renderer_info

export const UNMASKED_VENDOR_WEBGL = 0x9245; // Passed to getParameter to get the vendor string of the graphics driver.
export const UNMASKED_RENDERER_WEBGL = 0x9246; // Passed to getParameter to get the renderer string of the graphics driver.

// EXT_texture_filter_anisotropic

export const MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF; // Returns the maximum available anisotropy.
export const TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE; // Passed to texParameter to set the desired maximum anisotropy for a texture.

// WEBGL_compressed_texture_s3tc

export const COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0; // A DXT1-compressed image in an RGB image format.
export const COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1; // A DXT1-compressed image in an RGB image format with a simple on/off alpha value.
export const COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2; // A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression.
export const COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3; // A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done.

// WEBGL_compressed_texture_etc

export const COMPRESSED_R11_EAC = 0x9270; // One-channel (red) unsigned format compression.
export const COMPRESSED_SIGNED_R11_EAC = 0x9271; // One-channel (red) signed format compression.
export const COMPRESSED_RG11_EAC = 0x9272; // Two-channel (red and green) unsigned format compression.
export const COMPRESSED_SIGNED_RG11_EAC = 0x9273; // Two-channel (red and green) signed format compression.
export const COMPRESSED_RGB8_ETC2 = 0x9274; // Compresses RBG8 data with no alpha channel.
export const COMPRESSED_RGBA8_ETC2_EAC = 0x9275; // Compresses RGBA8 data. The RGB part is encoded the same as RGB_ETC2, but the alpha part is encoded separately.
export const COMPRESSED_SRGB8_ETC2 = 0x9276; // Compresses sRBG8 data with no alpha channel.
export const COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 0x9277; // Compresses sRGBA8 data. The sRGB part is encoded the same as SRGB_ETC2, but the alpha part is encoded separately.
export const COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9278; // Similar to RGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.
export const COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9279; // Similar to SRGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.

// WEBGL_compressed_texture_pvrtc

export const COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00; // RGB compression in 4-bit mode. One block for each 4×4 pixels.
export const COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02; // RGBA compression in 4-bit mode. One block for each 4×4 pixels.
export const COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01; // RGB compression in 2-bit mode. One block for each 8×4 pixels.
export const COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03; // RGBA compression in 2-bit mode. One block for each 8×4 pixe

// WEBGL_compressed_texture_etc1

export const COMPRESSED_RGB_ETC1_WEBGL = 0x8D64; // Compresses 24-bit RGB data with no alpha channel.

// WEBGL_compressed_texture_atc

export const COMPRESSED_RGB_ATC_WEBGL = 0x8C92; // Compresses RGB textures with no alpha channel.
export const COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C92; // Compresses RGBA textures using explicit alpha encoding (useful when alpha transitions are sharp).
export const COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE; // Compresses RGBA textures using interpolated alpha encoding (useful when alpha transitions are gradient).

// WEBGL_depth_texture

export const UNSIGNED_INT_24_8_WEBGL = 0x84FA; // Unsigned integer type for 24-bit depth texture data.

// OES_texture_half_float

export const HALF_FLOAT_OES = 0x8D61; // Half floating-point type (16-bit).

// WEBGL_color_buffer_float

export const RGBA32F_EXT = 0x8814; // RGBA 32-bit floating-point color-renderable format.
export const RGB32F_EXT = 0x8815; // RGB 32-bit floating-point color-renderable format.
export const FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT = 0x8211; //
export const UNSIGNED_NORMALIZED_EXT = 0x8C17; //

// EXT_blend_minmax

export const MIN_EXT = 0x8007; // Produces the minimum color components of the source and destination colors.
export const MAX_EXT = 0x8008; // Produces the maximum color components of the source and destination colors.

// EXT_sRGB

export const SRGB_EXT = 0x8C40; // Unsized sRGB format that leaves the precision up to the driver.
export const SRGB_ALPHA_EXT = 0x8C42; // Unsized sRGB format with unsized alpha component.
export const SRGB8_ALPHA8_EXT = 0x8C43; // Sized (8-bit) sRGB and alpha formats.
export const FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT = 0x8210; // Returns the framebuffer color encoding.

// OES_standard_derivatives

export const FRAGMENT_SHADER_DERIVATIVE_HINT_OES = 0x8B8B; // Indicates the accuracy of the derivative calculation for the GLSL built-in functions: dFdx, dFdy, and fwidth.

// WEBGL_draw_buffers

export const COLOR_ATTACHMENT0_WEBGL = 0x8CE0; // Framebuffer color attachment point
export const COLOR_ATTACHMENT1_WEBGL = 0x8CE1; // Framebuffer color attachment point
export const COLOR_ATTACHMENT2_WEBGL = 0x8CE2; // Framebuffer color attachment point
export const COLOR_ATTACHMENT3_WEBGL = 0x8CE3; // Framebuffer color attachment point
export const COLOR_ATTACHMENT4_WEBGL = 0x8CE4; // Framebuffer color attachment point
export const COLOR_ATTACHMENT5_WEBGL = 0x8CE5; // Framebuffer color attachment point
export const COLOR_ATTACHMENT6_WEBGL = 0x8CE6; // Framebuffer color attachment point
export const COLOR_ATTACHMENT7_WEBGL = 0x8CE7; // Framebuffer color attachment point
export const COLOR_ATTACHMENT8_WEBGL = 0x8CE8; // Framebuffer color attachment point
export const COLOR_ATTACHMENT9_WEBGL = 0x8CE9; // Framebuffer color attachment point
export const COLOR_ATTACHMENT10_WEBGL = 0x8CEA; // Framebuffer color attachment point
export const COLOR_ATTACHMENT11_WEBGL = 0x8CEB; // Framebuffer color attachment point
export const COLOR_ATTACHMENT12_WEBGL = 0x8CEC; // Framebuffer color attachment point
export const COLOR_ATTACHMENT13_WEBGL = 0x8CED; // Framebuffer color attachment point
export const COLOR_ATTACHMENT14_WEBGL = 0x8CEE; // Framebuffer color attachment point
export const COLOR_ATTACHMENT15_WEBGL = 0x8CEF; // Framebuffer color attachment point
export const DRAW_BUFFER0_WEBGL = 0x8825; // Draw buffer
export const DRAW_BUFFER1_WEBGL = 0x8826; // Draw buffer
export const DRAW_BUFFER2_WEBGL = 0x8827; // Draw buffer
export const DRAW_BUFFER3_WEBGL = 0x8828; // Draw buffer
export const DRAW_BUFFER4_WEBGL = 0x8829; // Draw buffer
export const DRAW_BUFFER5_WEBGL = 0x882A; // Draw buffer
export const DRAW_BUFFER6_WEBGL = 0x882B; // Draw buffer
export const DRAW_BUFFER7_WEBGL = 0x882C; // Draw buffer
export const DRAW_BUFFER8_WEBGL = 0x882D; // Draw buffer
export const DRAW_BUFFER9_WEBGL = 0x882E; // Draw buffer
export const DRAW_BUFFER10_WEBGL = 0x882F; // Draw buffer
export const DRAW_BUFFER11_WEBGL = 0x8830; // Draw buffer
export const DRAW_BUFFER12_WEBGL = 0x8831; // Draw buffer
export const DRAW_BUFFER13_WEBGL = 0x8832; // Draw buffer
export const DRAW_BUFFER14_WEBGL = 0x8833; // Draw buffer
export const DRAW_BUFFER15_WEBGL = 0x8834; // Draw buffer
export const MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF; // Maximum number of framebuffer color attachment points
export const MAX_DRAW_BUFFERS_WEBGL = 0x8824; // Maximum number of draw buffers

// OES_vertex_array_object

export const VERTEX_ARRAY_BINDING_OES = 0x85B5; // The bound vertex array object (VAO).

// EXT_disjoint_timer_query

export const QUERY_COUNTER_BITS_EXT = 0x8864; // The number of bits used to hold the query result for the given target.
export const CURRENT_QUERY_EXT = 0x8865; // The currently active query.
export const QUERY_RESULT_EXT = 0x8866; // The query result.
export const QUERY_RESULT_AVAILABLE_EXT = 0x8867; // A Boolean indicating whether or not a query result is available.
export const TIME_ELAPSED_EXT = 0x88BF; // Elapsed time (in nanoseconds).
export const TIMESTAMP_EXT = 0x8E28; // The current time.
export const GPU_DISJOINT_EXT = 0x8FBB; // A Boolean indicating whether or not the GPU performed any disjoint operation.
