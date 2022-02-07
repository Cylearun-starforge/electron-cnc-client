import { join } from 'path';
import { readFile } from 'fs/promises';

export const ClientConfigName = 'ClientConfiguration.json';

const configPath = join(__dirname, process.env.CC_CLIENT_CONFIG ?? '.', ClientConfigName);

export async function readConfig() {
  console.log('reading config from', configPath);
  const buffer = await readFile(configPath);
  return JSON.stringify(buffer.toString())
}