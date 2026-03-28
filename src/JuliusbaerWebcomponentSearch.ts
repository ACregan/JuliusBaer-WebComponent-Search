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
      --ghost-white: #fffaff;
      --lavender: #e6e6e6;
      --thistle: #cbc0d3;
      --charcoal: #524f53;
      --cerulean: #2d728f;
      --cool-sky: #35a7ff;
      --banana: #ffe74c;
      display: block;
      padding: 25px;
      color: var(--charcoal, #000);

      font-family: Verdana, Geneva, Tahoma, Helvetica, sans-serif;
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
      box-sizing: border-box;
      padding: 10px;
      background: var(--lavender);
      border-radius: 10px;

      border: 5px solid var(--thistle);
    }
    #search-input {
      order: 0;
      flex: 1 1 auto;
      align-self: auto;
      height: 40px;
      margin-right: 10px;
      padding: 0 10px;
      border: 1px solid var(--thistle);
      border-radius: 4px;
    }
    #submit-button {
      order: 0;
      flex: 0 1 auto;
      align-self: auto;
      height: 40px;
      font-weight: 600;
      padding: 0 10px;
      border: 1px solid var(--thistle);
      border-radius: 4px;
    }
    #results-container {
      border-radius: 0 0 10px 10px;
      padding: 10px;
      border: 5px solid var(--thistle);
      border-top: none;
      background: var(--lavender);
      transform: translateY(-10px);
    }
    .result-item {
      border: 1px solid var(--thistle);
      margin-bottom: 2px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-content: stretch;
      align-items: stretch;
      padding: 5px;
    }
    .result-item:last-child {
      margin-bottom: 0;
      border-radius: 2px 2px 5px 5px;
    }
    .result-cell {
      order: 0;
      flex: 1 1 80px;
      align-self: auto;
      position: relative;
      padding-top: 15px;
    }
    .result-cell-key {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 11px;
      color: var(--charcoal);
      text-transform: capitalize;
    }
    .result-cell-value {
      font-weight: 600;
    }

    .highlight {
      background: var(--banana);
    }
  `;

  @query('#search-input')
  input!: HTMLInputElement;

  @property({ type: Array, attribute: 'search-data' }) data = [];

  @property({ type: String, attribute: 'placeholder' }) placeholder =
    'What would you like to find?';

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
          <input
            id="search-input"
            type="search"
            placeholder=${this.placeholder}
          />
          <button id="submit-button" type="submit" @click=${this.submitSearch}>
            SEARCH
          </button>
        </div>
        ${this.result.length > 0
          ? html`<div id="results-container">
              ${this.renderRows(this.result, this.input?.value)}
            </div>`
          : null}
      </div>
    `;
  }
}
