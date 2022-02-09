# CncClient

A new client for Command & Conquer games written in electron

## Why CncClient

1. For mod creators

   - Rendering complex element on client: drawing polygen buttons, linking video elements, etc.
   - Responsive client UI, looks good for every screen.
   - Interact with other softwares. [^1]
   - Scalable localization support

2. For players

   - Compatible with XNA-CncNet-Client.
   - Flexible UI modification via CSS.
   - Conventional theme system, also easy to extend. [^2]

3. For client developers

   - Render UI with state-driven GUI Library.
   - Extends functionality with ease.
   - Builtin auto-update

[^1]: e.g. what about showing latest information of your mod, and navigate to official website on click?
[^2]: Just place your theme configuration in specified location, client will auto detect. Specify a theme to extend, client find missing files form there.

**This project has many works todo, most functionalities are not available now.**

## Docs

There some Markdown document to help you getting started with CncClient. I may not have enough time on docs, so it's welcome to cooperate with you on development and document

1. [ClientConfiguration Reference](/docs/ClientConfiguration.md)

## Build

Just run `npm run pack:win`