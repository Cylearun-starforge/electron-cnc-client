# electron-cnc-client

A new client for Command & Conquer games written in electron

## Why electron-cnc-client

1. For mod creators

   - Rendering complex element on client: drawing polygen buttons, linking video elements, etc.
   - Responsive client UI, looks good for every screen.
   - Interact with other softwares. [^1]
   - Scalable localization support.

2. For players

   - Compatible with XNA-CncNet-Client.
   - Flexible UI modification via CSS.
   - Conventional theme system, also easy to extend. [^2]
   - Better IME and language support, type any language or emoji.

3. For client developers

   - Render UI with state-driven UI library.
   - Extends functionality with ease.
   - Builtin auto-update.
   - Rich ecosystem on npmjs.org.
   - Build on latest technologies, no need to install out-of-date devtools or runtime.

[^1]: e.g. what about showing latest information of your mod, and navigate to official website on click?
[^2]: Just place your theme configuration in specified location, client will auto detect. Specify a theme to extend, client find missing files form there.

**This project has many works todo, most functionalities are not available now.**

## Docs

There some Markdown document to help you getting started with electron-cnc-client. I may not have enough time on docs, so it's welcome to cooperate with you on development and document

1. [ClientConfiguration Reference](/docs/ClientConfiguration.md)
2. [Layout HTML Reference](/docs/LayoutHTML.md)
3. [ThemeConfiguration Reference](/docs/ThemeConfiguration.md)

## Build

Just run `npm run pack:win`

## Examples

[`examples`](./examples/) folder provides some example on how to use electron-cnc-client to implement a DTA-like client UI.

Because electron-cnc-client's wording directory is set to `node_modules/.electron-run/app`,
we provide an environment variable `CC_CLIENT_CONFIG` to redirect working directory.
Run `$env:CC_CLIENT_CONFIG='../../../examples/mo'` to set working directory to Mental Omega example, then run `npm run dev` launch client.
