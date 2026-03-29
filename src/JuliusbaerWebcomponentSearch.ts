import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
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
      --thistle: #c5c5c5;
      --charcoal: #524f53;
      --cerulean: #2d728f;
      --cool-sky: #35a7ff;
      --banana: #ffe74c;

      --grey: #878787;
      --dark-grey: #595959;
      --darker-grey: #404040;

      --container-background: var(--lavender);
      --container-border: var(--thistle);

      display: block;
      padding: 25px;
      color: var(--charcoal, #000);
      font-family: Verdana, Geneva, Tahoma, Helvetica, sans-serif;
    }
    #root-container {
      width: 100%;
      margin-top: 20px;
    }
    #search-container {
      position: relative;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-content: stretch;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      background: var(--container-background);
      border-radius: 10px;

      border: 5px solid var(--container-border);
    }
    #search-label {
      position: absolute;
      top: -25px;
      left: 6px;
      padding: 5px 5px 0 5px;
      border-radius: 10px 10px 0 0;
      border: 5px solid var(--container-border);
      border-bottom: 0;
      font-size: 12px;
      font-weight: 600;
      background: var(--container-background);
      color: var(--charcoal);
    }
    #search-input {
      order: 0;
      flex: 1 1 auto;
      align-self: auto;
      height: 40px;
      padding: 0 10px;
      border: 1px solid var(--container-border);
      border-radius: 4px;
    }
    #submit-button {
      order: 0;
      flex: 0 1 auto;
      align-self: auto;
      height: 40px;
      font-weight: 600;
      padding: 0 10px;
      border: 1px solid var(--cerulean);
      border-radius: 4px;
      box-sizing: border-box;
      background: var(--cool-sky);
      color: var(--ghost-white);
      cursor: pointer;
    }
    #submit-button:active {
      background: var(--cerulean);
    }
    #results-container {
      border-radius: 0 0 10px 10px;
      padding: 10px;
      border: 5px solid var(--container-border);
      border-top: none;
      background: var(--container-background);
      transform: translateY(-13px);
    }
    .result-item {
      border-radius: 3px;
      border: 1px solid var(--container-border);
      margin-bottom: 3px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-content: stretch;
      align-items: stretch;
      padding: 5px;
      cursor: pointer;
    }
    .result-item:last-child {
      margin-bottom: 0;
      border-radius: 3px 3px 7px 7px;
    }
    .result-item:focus-within {
      box-shadow: 0 0 0 2px inset var(--cerulean);
      outline: none;
    }
    .result-item:has(input[type='checkbox']:checked) {
      background: var(--cool-sky);
    }

    .result-checkbox {
      margin: 0 15px 0 10px;
      border: 5px solid var(--charcoal);
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
      user-select: none;
    }
    .result-cell-value {
      font-weight: 600;
    }

    .highlight {
      background: var(--banana);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --container-background: var(--dark-grey);
        --container-border: var(--darker-grey);
      }

      #search-container,
      #results-container {
        background: var(--charcoal);
        border-color: var(--dark-grey);
      }

      #search-label {
        border-color: var(--dark-grey);
        background: var(--charcoal);
        color: var(--lavender);
      }
      #search-input {
        background: var(--grey);
        color: var(--ghost-white);
      }
      #search-input::-webkit-search-cancel-button {
        color: white;
        background: white;
        fill: white;
      }
      #search-input::placeholder {
        color: var(--ghost-white);
        opacity: 0.6;
      }
      #search-input::selection {
        background: var(--cool-sky);
      }

      .result-item {
        border-color: var(--grey);
      }
      .result-cell-key {
        color: var(--thistle);
      }
      .result-cell-value {
        color: var(--ghost-white);
      }
      .highlight {
        color: var(--charcoal);
      }
    }
  `;

  @property({ type: Array, attribute: 'search-data' }) data = [];

  @property({ type: String, attribute: 'placeholder' }) placeholder =
    'Type two or more characters to begin search.';

  @property({ type: String, attribute: 'label' }) label = 'Search';

  @property({ type: Array, attribute: false })
  result: Array<any> = [];

  submitSearch(textInput: string): void {
    this.result = [];
    this.data.forEach((dataItem: Record<string, any>) => {
      const hasData = findValueInNestedObject(dataItem, textInput);
      if (hasData) {
        // result.push(dataItem);
        this.result = [...this.result, dataItem];
      }
    });
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
      : html`
          <label
            class="result-item"
            for=${`datarow-${rowData.id}`}
            tabindex="0"
            @keydown=${(e: any) => this.keyboardNav(e, Number(rowData.id))}
          >
            <input
              class="result-checkbox"
              type="checkbox"
              id=${`datarow-${rowData.id}`}
              .value=${rowData.id}
              @click=${(e: any) =>
                this.toggleSelectedResult(Number(e.target.value))}
              .checked=${this.selectedResults.includes(rowData.id)}
              inert
            />
            ${resultCells}
          </label>
        `;
  }

  @property() textInput = '';

  onInput(e: Event) {
    const inputEl = e.target as HTMLInputElement;
    this.textInput = inputEl.value;
    if (inputEl.value.length > 1) {
      this.submitSearch(this.textInput);
    } else {
      this.result = [];
    }
  }

  @property({ type: Array, attribute: false })
  selectedResults: Array<number> = [];

  keyboardNav(e: KeyboardEvent, selectedId: number) {
    // console.log(e);
    if (e.code === 'Space') {
      this.toggleSelectedResult(selectedId);
    }
    console.log(this.selectedResults);
  }

  toggleSelectedResult(selectedId: number) {
    // console.log('IN SELECTED RESULT', this.selectedResults);
    if (this.selectedResults.includes(selectedId)) {
      const resultsWithClickedRemoved = this.selectedResults.filter(
        result => result !== selectedId,
      );
      // console.log('resultsWithClickedRemoved', resultsWithClickedRemoved);
      this.selectedResults = resultsWithClickedRemoved;
    } else {
      this.selectedResults = [...this.selectedResults, selectedId];
    }
    // console.log('OUT SELECTED RESULT', this.selectedResults);
  }

  render() {
    return html`
      <form id="root-container">
        <div id="search-container">
          <label id="search-label" for="search-input">${this.label}</label>
          <input
            id="search-input"
            type="search"
            placeholder=${this.placeholder}
            @input=${this.onInput}
          />
        </div>
        ${this.result.length > 0
          ? html`<div id="results-container">
              ${this.renderRows(this.result, this.textInput)}
            </div>`
          : null}
      </form>
    `;
  }
}
