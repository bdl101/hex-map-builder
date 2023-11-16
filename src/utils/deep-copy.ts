/** Create a deep copy of the provided item. */
export const deepCopy = <T>(itemToCopy: T) => {
  return JSON.parse(JSON.stringify(itemToCopy)) as T;
};
