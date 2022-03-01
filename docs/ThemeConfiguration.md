# ThemeConfiguration Reference

ThemeConfiguration file is named as `ThemeConfiguration.json`, and placed in a theme directory (ThemeDir). It defines client's pages and styles.

> Note: All paths in this document is a relative path, whose base path is ThemeDir.

### type: `Page`

`Page` object defines a page, including layout and styles.

#### property: `layout`

type: `string`

optional: `false`

Path to page's Layout HTML file.

#### property: `styleSheets`

type: `string[]`

optional: `false`

A array of paths to CSS files. These CSS files will be used for this page.

### property: `index`

type: `Page`

optional: `false`

Define index page's layout and styles.

### property: `styleSheets`

type: `string[]`

optional: `false`

A array of paths to CSS files. These CSS files will be used for all page.

### property: `pages`

type: `Record<string, Page>`

optional: `true`

A object defines extra pages. Each page defined in this object is also accessible via [`client-link` button](./LayoutHTML.md#functional-button)
