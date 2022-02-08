# ClientConfiguration Reference

ClientConfiguration file is usually named as `ClientConfiguration.json`, and placed in root directory of client. It use JSON format, provide ability to custom client's UI.

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

Relative path to a user specific image, which displayed on loading screen as loading icon. Its base path is theme's directory.

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
