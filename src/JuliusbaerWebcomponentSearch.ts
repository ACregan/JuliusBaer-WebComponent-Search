import { html, css, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

// import ACCOUNTS from './data/accounts.js';
// import TRANSACTIONS from './data/transactions.js';
import {
  findValueInNestedObject,
  isNumberOrString,
  valueWithHighlighting,
} from './utils/utilities.js';

export class JuliusbaerWebcomponentSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--juliusbaer-webcomponent-search-text-color, #000);
    }
    #root-container {
      width: 100%;
    }
    #search-container {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-content: stretch;
      align-items: center;
      width: 100%;
    }
    #search-input {
      order: 0;
      flex: 1 1 auto;
      align-self: auto;
    }
    #submit-button {
      order: 0;
      flex: 0 1 auto;
      align-self: auto;
    }
    #results-container {
    }
    .result-item {
      border: 1px solid black;

      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-content: stretch;
      align-items: stretch;

      font-family: Arial, Helvetica, sans-serif;
    }
    .result-cell {
      order: 0;
      flex: 1 1 5px;
      align-self: auto;
      position: relative;
      padding-top: 15px;
    }
    .result-cell-key {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 11px;
      font-weight: 600;
      color: #a6a6a6;
      text-transform: capitalize;
    }
    .result-cell-value {
    }

    .highlight {
      background: yellow;
    }
  `;

  @query('#search-input')
  input!: HTMLInputElement;

  @property({ type: Array, attribute: 'search-data' }) data = [];

  @property({ type: Array, attribute: false })
  result: Array<any> = [];

  submitSearch() {
    console.log('SUBMITTED FOR SEARCH', this.input.value);
    console.log('DATA TO BE SEARCHED', this.data);

    this.result = [];
    // const result: typeof this.data = [];
    this.data.forEach(dataItem => {
      const hasData = findValueInNestedObject(dataItem, this.input.value);
      if (hasData) {
        // result.push(dataItem);
        this.result = [...this.result, dataItem];
      }
    });

    console.log('RESULTS', this.result);

    // this.input.value = '';
  }

  renderRows(rowData: any, searchString: string, entryKey?: string): any {
    // Get Object Keys
    const resultItemEntries = Object.keys(rowData);
    // Identify if key is from object property or just a numeric key
    const isEntryKeyString = Number.isNaN(Number(entryKey));
    // Display result cell if key/value pair,
    // if object recursively recall this function with that object
    const resultCells = resultItemEntries.map(entry =>
      isNumberOrString(rowData[entry])
        ? html`
            <div class="result-cell">
              <span class="result-cell-key"
                >${isEntryKeyString && entryKey
                  ? `${entryKey}.`
                  : ''}${entry}</span
              >
              <span class="result-cell-value"
                >${valueWithHighlighting(
                  rowData[entry].toString(),
                  searchString,
                )}</span
              >
            </div>
          `
        : this.renderRows(rowData[entry], searchString, entry),
    );
    return isEntryKeyString
      ? html`${resultCells}`
      : html`<div class="result-item">${resultCells}</div>`;
  }

  render() {
    return html`
      <div id="root-container">
        <div id="search-container">
          <input id="search-input" type="search" />
          <button id="submit-button" type="submit" @click=${this.submitSearch}>
            SEARCH
          </button>
        </div>
        <div id="results-container">
          ${this.renderRows(this.result, this.input?.value)}
        </div>
        <div>${valueWithHighlighting('YO MAMA IS SO FAT', 'MAMA')}</div>
        <div>${valueWithHighlighting('YO MAMA IS SO FAT', 'PAPA')}</div>
      </div>
    `;
  }
}
