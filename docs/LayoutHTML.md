# Layout HTML Reference

electron-cnc-client use HTML5 and CSS3 to render UI. However, both HTML and CSS are intend to make static UI,
to bring you the ability to write dynamic UI, we provide some extension tags.
We call the HTML with extension tags `Layout HTML`.

## Limitations

Because we have extension tags, you can't preview Layout HTML in other editors or IDEs. The only approach is let electron-cnc-client render it.

For security reasons, you can't link other files like css. To use CSS, add css files in [`ClientConfiguration.json`](./ClientConfiguration.md)

## Extension Tags

You use these tags just like normal HTML tags, and they will render to normal DOM.

### follow-mouse

With this element , you specify its child element move while mouse moves.
Formula to calculate element move (in pixel): see https://github.com/Cylearun-starforge/electron-cnc-client/blob/a5c907bc2f588770cf1f034754027bf72aada792/src/renderer/util/followMouse.ts#L31

> This feature is implement by adding an `div` element with style `position: absolute`, check your child element to make sure this `div` element won't affect your layout

#### property: `speed-x`, `speed-y`

Specify move speed of element. `speed-x` field specify the speed on x-axis, and `speed-y` field specify on y-axis. Values of these fields are rate that used to multiply by mouse offset on screen center. Default value: `1`, means move as faster as pointer's speed

#### property: `offset-x`, `offset-y`

A fixed offset (in pixel) of the element position.

#### property: `base-x`

Specify which css property is affected by mouse movement. Default value: `left`

#### property: `base-y`

Specify which css property is affected by mouse movement. Default value: `top`

#### property: `max-move-top`, `max-move-bottom`, `max-move-left`, `max-move-right`

Specify max move range on each side (in pixel). Missing fields fallback to `Infinity`, which means unlimited.

#### property: `z-index`

Specify wrapper element's `z-index`. Default value: 0
