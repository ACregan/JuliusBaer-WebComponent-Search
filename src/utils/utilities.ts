function findValueInNestedObject(
  data: any[] | object,
  valueToFind: any,
): boolean {
  if (Array.isArray(data)) {
    // Iterate through the array and call the function recursively for each item
    for (const item of data) {
      if (findValueInNestedObject(item, valueToFind)) {
        return true;
      }
    }
  } else if (typeof data === 'object' && data !== null) {
    // Get all values of the object's properties
    const values = Object.values(data);
    for (const val of values) {
      // Check the current value for full match
      if (val === valueToFind) {
        return true;
      }
      // Check the current value for partial match if String or Number
      if (
        (typeof val === 'string' || typeof val === 'number') &&
        `${val}`.includes(`${valueToFind}`)
      ) {
        return true;
      }
      // If the value is an object or array, recurse
      if (typeof val === 'object' && val !== null) {
        if (findValueInNestedObject(val, valueToFind)) {
          return true;
        }
      }
    }
  }
  // Value not found in this branch
  return false;
}

export { findValueInNestedObject };
