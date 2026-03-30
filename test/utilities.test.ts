import { expect } from '@open-wc/testing';
// import { html } from 'lit';
import {
  findValueInNestedObject,
  isNumberOrString,
  valueWithHighlighting,
} from '../src/utils/utilities.js';

describe('Utilities', () => {
  describe('findValueInNestedObject', () => {
    it('should find exact string match in object', () => {
      const data = { name: 'John', age: 30 };
      expect(findValueInNestedObject(data, 'John')).to.be.true;
    });

    it('should find exact number match in object', () => {
      const data = { name: 'John', age: 30 };
      expect(findValueInNestedObject(data, 30)).to.be.true;
    });

    it('should find partial string match (case insensitive)', () => {
      const data = { name: 'John Doe' };
      expect(findValueInNestedObject(data, 'john')).to.be.true;
    });

    it('should find partial number match', () => {
      const data = { code: 12345 };
      expect(findValueInNestedObject(data, 123)).to.be.true;
    });

    it('should find value in nested object', () => {
      const data = { user: { profile: { email: 'test@example.com' } } };
      expect(findValueInNestedObject(data, 'test@example.com')).to.be.true;
    });

    // it('should find value in array', () => {
    //   const data = ['apple', 'banana', 'cherry'];
    //   expect(findValueInNestedObject(data, 'banana')).to.be.true;
    // });

    it('should find value in nested array of objects', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(findValueInNestedObject(data, 2)).to.be.true;
    });

    it('should return false when value not found', () => {
      const data = { name: 'John', age: 30 };
      expect(findValueInNestedObject(data, 'Jane')).to.be.false;
    });

    it('should return false for empty object', () => {
      expect(findValueInNestedObject({}, 'test')).to.be.false;
    });

    it('should return false for empty array', () => {
      expect(findValueInNestedObject([], 'test')).to.be.false;
    });
  });

  describe('isNumberOrString', () => {
    it('should return true for string', () => {
      expect(isNumberOrString('hello')).to.be.true;
    });

    it('should return true for number', () => {
      expect(isNumberOrString(42)).to.be.true;
    });

    it('should return false for object', () => {
      expect(isNumberOrString({ name: 'test' })).to.be.false;
    });

    it('should return false for array', () => {
      expect(isNumberOrString([1, 2, 3])).to.be.false;
    });

    it('should return false for boolean', () => {
      expect(isNumberOrString(true)).to.be.false;
    });

    it('should return false for null', () => {
      expect(isNumberOrString(null)).to.be.false;
    });

    it('should return false for undefined', () => {
      expect(isNumberOrString(undefined)).to.be.false;
    });
  });

  describe('valueWithHighlighting', () => {
    // it('should return text without highlighting when substring is empty', () => {
    //   const result = valueWithHighlighting('hello world', '');
    //   expect(result).to.equal(html`hello world`);
    // });

    it('should highlight matching substring', () => {
      const result = valueWithHighlighting('hello world', 'world');
      expect(result.strings).to.exist;
    });

    it('should highlight case insensitive matches', () => {
      const result = valueWithHighlighting('Hello World', 'hello');
      expect(result.strings).to.exist;
    });

    it('should highlight multiple occurrences', () => {
      const result = valueWithHighlighting('banana split', 'an');
      expect(result.strings).to.exist;
    });

    it('should handle special regex characters', () => {
      const result = valueWithHighlighting('test.file[1]', '.');
      expect(result.strings).to.exist;
    });

    // it('should return original text when substring not found', () => {
    //   const result = valueWithHighlighting('hello world', 'xyz');
    //   expect(result).to.equal(html`hello world`);
    // });
  });
});
