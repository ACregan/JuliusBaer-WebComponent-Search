import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  findValueInNestedObject,
  isNumberOrString,
  valueWithHighlighting,
} from './utils/utilities.js';

export class JuliusbaerWebcomponentSearch extends LitElement {
  // Click outside detection
  constructor() {
    super();
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  // On Mount, add listener for detecting clicks outside the search form
  connectedCallback() {
    super.connectedCallback();
    // Add the global listener when the component is added to the DOM
    document.addEventListener('click', this.onClickOutside);
  }

  // On Dismount, remove the listener
  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up the listener when the component is removed
    document.removeEventListener('click', this.onClickOutside);
  }

  // function to be called when pointer event is outside of the search form
  onClickOutside(event: PointerEvent) {
    // Check if the clicked element is NOT inside this component
    if (event.target instanceof Node && !this.contains(event.target)) {
      // console.log('Clicked outside the web component');
      // Put your logic here (e.g., close a dropdown or modal)
      this.closeMyElement();
    }
  }

  // Function to close the search dropdown
  closeMyElement() {
    // ... logic to hide/close the component ...
    // console.log('close element function called', this.selectedResults);
    // TODO: Provide a better UX than just flushing the results and textInput values
    // perhaps collapse the results container and reopen it when the user focuses on the input again?
    this.textInput = '';
    this.result = [];
  }

  // STYLES
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

    #results-container::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    #results-container::-webkit-scrollbar {
      width: 8px;
    }
    #results-container::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 0 2px var(--cool-sky);
      background-color: var(--cool-sky);
    }

    #results-container {
      border-radius: 0 0 10px 10px;
      padding: 10px;
      border: 5px solid var(--container-border);
      border-top: none;
      background: var(--container-background);
      transform: translateY(-13px);
      max-height: 40vh;
      overflow-y: scroll;
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

  // REACTIVE PROPERTIES
  // Search Input String
  @property({ type: String }) textInput = '';

  // ALL Search Data Results
  @property({ type: Array, attribute: 'search-data' }) data = [];

  // Search Input Placeholder String
  @property({ type: String, attribute: 'placeholder' }) placeholder =
    'Type two or more characters to begin search.';

  // Search Input Label Value
  @property({ type: String, attribute: 'label' }) label = 'Search';

  // FILTERED Search Data Results (that partial match textInput)
  @property({ type: Array, attribute: false })
  result: Array<any> = [];

  // SELECTED Seardh Data Results - Array of ID's of all results with checkbox selected
  @property({ type: Array, attribute: false })
  selectedResults: Array<number> = [];

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

  onInput(e: Event) {
    const inputEl = e.target as HTMLInputElement;
    this.textInput = inputEl.value;
    if (inputEl.value.length > 1) {
      this.submitSearch(this.textInput);
    } else {
      this.result = [];
    }
  }

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
    console.log('SELECTED RESULT ID LIST:', this.selectedResults);
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
            .value=${this.textInput}
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
