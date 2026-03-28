import { html } from 'lit';

function findValueInNestedObject(
  data: any[] | object,
  valueToFind: string | number,
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
      if (val === valueToFind) {
        return true;
      }
      // Check the current value for partial match if String (case insensitive)
      if (typeof val === 'string' && typeof valueToFind === 'string') {
        const valLowercase = val.toLowerCase();
        const valToFindLowercase = valueToFind.toLowerCase();
        if (`${valLowercase}`.includes(`${valToFindLowercase}`)) {
          return true;
        }
      }
      // Check for partial match if number
      if (typeof val === 'number' && `${val}`.includes(`${valueToFind}`)) {
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

function isNumberOrString(itemToTest: any) {
  return typeof itemToTest === 'number' || typeof itemToTest === 'string';
}

function valueWithHighlighting(value: string, searchString: string) {
  const splitValue = value.split(new RegExp(searchString, 'ig'));
  console.log('splitValue', splitValue);
  return splitValue.length > 1
    ? html`${splitValue[0]}<span class="highlight">${searchString}</span
        >${splitValue[1]}`
    : html`${splitValue[0]}`;
}

export { findValueInNestedObject, isNumberOrString, valueWithHighlighting };
