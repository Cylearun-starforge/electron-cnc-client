# Theme Examples

These examples illustrate that electron-cnc-client have similar ability like DTA client (Xna-CncNet-Client).
These examples are also working in progress as the client itself has not finished yet.

You should also aware that electron-cnc-client uses web technologies, which is different with DTA Client. Don't try to simulate DTA Client!

For example, electron (and browsers) using [box models](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model), though you can still arrange elements using absolute positioning (specify `Location` field in DTA Client), using box models is a better approach is you want to write responsive UI.

I know HTML and CSS are difficult for some mod creators, that is the reason for these examples. Also, electron-cnc-client supports shared CSS files, intends to share styles between pages and modals. You can also use a CSS framework to develop your UI.

electron-cnc-client doesn't care about what framework you use, so you can modify theme for your framework, and do some optimization such as tree-share and minification. But some frameworks have a runtime JavaScript for dynamic elements, you can't use them because electron-cnc-client doesn't support user-defined JavaScript files now.

**In a word: Notes that you can only use the PURE CSS files!**

Here are some famous CSS frameworks:

- [Tailwind CSS](https://tailwindcss.com/): Our examples uses this framework. Run `generate-css.ps1` to generate a tree-shaked and minified css file.

- [Bootstrap](https://getbootstrap.com/): The most famous CSS framework.

- [Materialize](https://materializecss.com/): A CSS framework follows Google's `Material Design` guidelines.
