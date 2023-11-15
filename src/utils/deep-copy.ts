/** TODO */
export const deepCopy = <T>(itemToCopy: T) => {
  return JSON.parse(JSON.stringify(itemToCopy)) as T;
};
