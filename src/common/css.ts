import postcss, { PluginCreator } from 'postcss';
import postcssJs from 'postcss-js';
import { CSSProperties } from 'react';
export const PluginName = 'postcss-process-client-style';
export const StyleProcessPlugin: PluginCreator<undefined> = a => {
  return {
    postcssPlugin: PluginName,
    Document(doc, helper) {
      console.log('doc', doc);
      console.log('helper', helper);
    },
    Once(root, helper) {
      console.log('root', root);

    }
  };
};

StyleProcessPlugin.postcss = true;
// used to stringify css object into string
const postcssJsProcessor = postcss();
postcssJsProcessor.process({}, { parser: postcssJs });

function stringify(css: object) {
  return new Promise<string>(res => {
    postcssJsProcessor.process(css, { parser: postcssJs, from: undefined }).then(result => {
      res(result.css);
    });
  });
}

const processor = postcss([StyleProcessPlugin()]);

export async function processCss<T extends CSSProperties = CSSProperties>(css: T) {
  const cssString = await stringify(css);
  return new Promise<string>(res => {
    processor.process(cssString, { from: undefined }).then(result => {
      res(result.css);
    });
  });
}
