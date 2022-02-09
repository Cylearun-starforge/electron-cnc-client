const randomRecord = new Set<string>();
export const randomString = () => {
  let str = Math.random().toString(36).slice(2);
  while (randomRecord.has(str)) {
    str = Math.random().toString(36).slice(2);
  }
  randomRecord.add(str);
  return str;
};
