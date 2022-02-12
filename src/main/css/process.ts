import postcss from "postcss";
import { plugin } from "./postcss-ecc-modify";
import { readFile } from "fs/promises";
const processor = postcss().use(plugin);

export async function processCss(path: string) {
    const content = await readFile(path);
    const result = await processor.process(content, { from: path });
    return result.css;
}
