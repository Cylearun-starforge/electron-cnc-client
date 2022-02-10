# ClientConfiguration Reference

ClientConfiguration file is usually named as `ClientConfiguration.json`, and placed in root directory of client. It use JSON format, provide ability to custom client's UI.

**Warn**: Although most settings are optional or complementary, you should specify on least 1 of them, otherwise you will get a white screen without any fallback.

#### defaultTheme

type: `string`

optional: `false`

indicate the fallback theme. If client failed to load a custom theme, it use this theme.

### loading

type: `object`

optional: `false`

Loading screen settings.

#### loading.image

type: `string`

optional: `true`

Relative path to a user specific image, which displayed on loading screen as loading icon. Its base path is theme's root directory.

#### loading.text

type: `string`

optional: `true`

Text displayed on loading screen if `loading.image` is missing.

#### loading.styles

type: `object`

optional: `true`

**Unstable:** This property is unstable, and could be remove in future.

Custom your loading element's (`loading.image` or `loading.text`) style. This object is `React.CSSProperties` object [^1]

[^1]: `React.CSSProperties` is React's CSS-in-JS wrapper, see [React docs](https://reactjs.org/docs/dom-elements.html#style) and [MDN CSS docs](https://developer.mozilla.org/en-US/docs/Web/CSS) to learn CSS

### main

type: `object`

optional: `false`

Client index settings.

#### main.background

type: `array`

optional: `true`

Set client background image. Each element in this array is a [BackgroundImage](#BackgroundImage) object. You can specify as more images as you want, the layer depends on declaration order.

Say that you declared images like:

```json
"background": [
  {
    "image": "image1.png",
  },
  {
    "image": "image2.png",
  },
  {
    "image": "image3.png",
  },
]
```

It will rendered like:

```
+-------+------------+
| layer | image3.png |
+-------+------------+
|  -1   | image3.png |
+-------+------------+
|  -2   | image2.png |
+-------+------------+
|  -3   | image1.png |
+-------+------------+

```

### BackgroundImage

type: `object`

Describe a background image used for client index, with optional features: follow mouse.

#### BackgroundImage.image

type: `string`

optional: `false`

Relative path points to a image file. Base path is theme's root directory. Supports MIME image types: jpg, png, gif, webp

#### BackgroundImage.styles

type: `object`

optional: `true`

**Unstable:** This property is unstable, and could be remove in future.

Custom image style. This object is `React.CSSProperties` object [^1]

#### BackgroundImage.followMouse

type: `object`

optional: `true`

Make this image move when mouse moves. see [FollowMouseMoveProperties](#FollowMouseMoveProperties) for details.

### FollowMouseMoveProperties

type: `object`

With these settings, you specify an element move while mouse moves.
Formula to calculate element move (in pixel): see https://github.com/Cylearun-starforge/electron-cnc-client/blob/a5c907bc2f588770cf1f034754027bf72aada792/src/renderer/util/followMouse.ts#L31

> This feature is implement by modifying element's style, which means you should set element's position style to `fixed` or `absolute`

#### FollowMouseMoveProperties.speed

type: `{x: number, y: number}`

optional: `true`

Specify move speed of element. `x` field specify the speed on x-axis, and `y` field specify on y-axis. Values of these fields are rate that used to multiply by mouse offset on screen center. The property itself, `x` and `y` are all optional. Missing fields will fall back to `1`.

#### FollowMouseMoveProperties.base

type: `{x: "left" | "right", y: "top" | "bottom"}`

optional: `true`

Specify `finalMove` sets on which css property. The property itself, `x` and `y` are all optional. `x` fallbacks to `"left"`, and `y` fallbacks to `"top"`.

#### FollowMouseMoveProperties.offset

type: `{x: number, y: number}`

optional: `true`

A fixed offset (in pixel) of the element position.

#### FollowMouseMoveProperties.maxMove

type: `{top: number, left: number, bottom: number, right: number}`

optional: `true`

Specify max move range on each side (in pixel). Missing fields fallback to `Infinity`, which means unlimited.