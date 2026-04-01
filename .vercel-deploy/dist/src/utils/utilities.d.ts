import { TemplateResult } from 'lit';
declare function findValueInNestedObject(data: any[] | object, valueToFind: string | number): boolean;
declare function isNumberOrString(itemToTest: any): itemToTest is string | number;
declare function valueWithHighlighting(text: string, substring: string): TemplateResult;
export { findValueInNestedObject, isNumberOrString, valueWithHighlighting };
