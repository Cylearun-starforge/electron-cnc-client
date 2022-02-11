# ClientConfiguration Reference

ClientConfiguration file is usually named as `ClientConfiguration.json`, and placed in root directory of client. It use JSON format, provide ability to custom client's UI.

**Warn**: Although most settings are optional or complementary, you should specify on least 1 of them, otherwise you will get a white screen without any fallback.

#### defaultTheme

type: `string`

optional: `false`

indicate the fallback theme. If client failed to load a custom theme, it use this theme.

#### styleSheets

type: `string[]`

optional: `true`

A list of css files used for client. Each element in this array is a relative path, whose base path is theme directory. Only local css file is supported, don't try to make client load remove css file.

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

type: `string`

optional: `false`

Client index layout. This field is a relative path to your custom HTML file. Because electron-cnc-client builds on chromium, you can make UI in HTML5 and CSS3. But electron-cnc-client has some extension tags to help you write beautiful UI. See [LayoutHTML](./LayoutHTML.md).
