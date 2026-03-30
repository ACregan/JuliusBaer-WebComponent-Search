import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  findValueInNestedObject,
  isNumberOrString,
  valueWithHighlighting,
} from './utils/utilities.js';
import getStyles from './JuliusbaerWebcomponentSearch.styles.js';

export class JuliusbaerWebcomponentSearch extends LitElement {
  // CLICK OUTSIDE DETECTION
  constructor() {
    super();
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  // On Mount, add listener for detecting clicks outside the search form
  connectedCallback(): void {
    super.connectedCallback();
    // Add the global listener when the component is added to the DOM
    document.addEventListener('click', this.onClickOutside);
  }

  // On Dismount, remove the listener
  disconnectedCallback(): void {
    super.disconnectedCallback();
    // Clean up the listener when the component is removed
    document.removeEventListener('click', this.onClickOutside);
  }

  // function to be called when pointer event is outside of the search form
  onClickOutside(event: PointerEvent): void {
    // Check if the clicked element is NOT inside this component
    if (event.target instanceof Node && !this.contains(event.target)) {
      // console.log('Clicked outside the web component');
      // Put your logic here (e.g., close a dropdown or modal)
      this.closeMyElement();
    }
  }

  // CLOSE SEARCH DROPDOWN
  // Function to close the search dropdown
  closeMyElement(): void {
    // ... logic to hide/close the component ...
    // console.log('close element function called', this.selectedResults);
    // TODO: Provide a better UX than just flushing the results and textInput values
    // perhaps collapse the results container and reopen it when the user focuses on the input again?
    this.resetForm();
  }

  // RESET FORM STATE
  // Reset entire form: Clear search string, flush results list and checked items list
  resetForm(): void {
    this.textInput = '';
    this.result = [];
    this.selectedResults = [];
  }

  // STYLES
  static styles = getStyles();

  // REACTIVE PROPERTIES
  // Search Input String
  @property({ type: String }) textInput = '';

  // ALL Search Data Results
  @property({ type: Array, attribute: 'search-data' }) data = [];

  // Search Input Placeholder String
  @property({ type: String, attribute: 'placeholder' }) placeholder =
    'Type two or more characters to begin search.';

  // Search Input Label Value
  @property({ type: String, attribute: 'label' }) label = '';

  // Filtered Search Data Results (objects from 'data' that contain values that partial match 'textInput')
  @property({ type: Array, attribute: false })
  result: Array<any> = [];

  // SELECTED Search Data Results - Array of ID's of all results with checkbox selected
  @property({ type: Array, attribute: false })
  selectedResults: Array<number> = [];

  // SUBMIT SEARCH
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

  // RESULT ROW RENDERER: Recursive function that itterates over object returns row
  // at top level or column cell if nested within object
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

  // SEARCH INPUT function - on input change submitSearch is called when
  // value string is 2 chars or more in length
  onInput(e: Event) {
    const inputEl = e.target as HTMLInputElement;
    this.textInput = inputEl.value;
    if (inputEl.value.length > 1) {
      this.submitSearch(this.textInput);
    } else {
      this.result = [];
    }
  }

  // KEYBOARD NAVIGATION CAPTURE - captures keydown events and simulates
  // native space-key select behaviour on checkboxes. This was required
  // because the native behaviour (label acting as proxy for any contained
  // checkbox elements) browser events were not being triggered for some
  // unexplained reason. Investigate further if time permits.
  keyboardNav(e: KeyboardEvent, selectedId: number) {
    // console.log(e);
    if (e.code === 'Space') {
      this.toggleSelectedResult(selectedId);
    }
    // console.log(this.selectedResults);
  }

  // TOGGLE SELECTED RESULT - Add it if its not in the list, remove it if it is
  toggleSelectedResult(selectedId: number) {
    if (this.selectedResults.includes(selectedId)) {
      // If its already in the list, remove it.
      const resultsWithClickedRemoved = this.selectedResults.filter(
        result => result !== selectedId,
      );
      this.selectedResults = resultsWithClickedRemoved;
    } else {
      // If its not in the list, add it.
      this.selectedResults = [...this.selectedResults, selectedId];
    }
    console.log('SELECTED RESULT ID LIST:', this.selectedResults);
  }

  render() {
    return html`
      <form id="root-container">
        <div id="search-container">
          ${this.label.length > 0
            ? html`<label id="search-label" for="search-input"
                >${this.label}</label
              >`
            : null}
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
