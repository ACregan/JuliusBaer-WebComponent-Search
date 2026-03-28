import { html, TemplateResult } from 'lit';

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

function valueWithHighlighting(
  text: string,
  substring: string,
): TemplateResult {
  if (!substring) return html`${text}`;
  const regex = new RegExp(
    substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'gi',
  );
  const matches = [...text.matchAll(regex)];
  if (matches.length === 0) return html`${text}`;
  let lastIndex = 0;
  const parts: (string | TemplateResult)[] = [];
  for (const match of matches) {
    parts.push(text.slice(lastIndex, match.index));
    parts.push(html`<span class="highlight">${match[0]}</span>`);
    lastIndex = match.index! + match[0].length;
  }
  parts.push(text.slice(lastIndex));
  return html`${parts}`;
}

export { findValueInNestedObject, isNumberOrString, valueWithHighlighting };
