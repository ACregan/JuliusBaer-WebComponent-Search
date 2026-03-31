import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  findValueInNestedObject,
  isNumberOrString,
  valueWithHighlighting,
} from './utils/utilities.js';
import getStyles from './JuliusbaerWebcomponentSearch.styles.js';

interface SearchItem {
  id: number;
  [key: string]: any;
}

export class JuliusbaerWebcomponentSearch extends LitElement {
  constructor() {
    super();
    this.onClickOutside = this.onClickOutside.bind(this);
    this.determineResultsContainerPosition =
      this.determineResultsContainerPosition.bind(this);
  }

  // CLICK OUTSIDE DETECTION
  // On Mount, add listeners for detecting clicks outside the search form
  // and detecting scroll position and recalculating result container position
  connectedCallback(): void {
    super.connectedCallback();
    // Add the global listener when the component is added to the DOM
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('scroll', this.determineResultsContainerPosition);
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    const previousUrl = changedProperties.get('url');
    if (changedProperties.has('url') && (this.url || previousUrl)) {
      queueMicrotask(() => {
        this.fetchData();
      });
    }
  }

  // On Dismount, remove the listeners
  disconnectedCallback(): void {
    super.disconnectedCallback();
    // Clean up the listener when the component is removed
    document.removeEventListener('click', this.onClickOutside);
    document.removeEventListener(
      'scroll',
      this.determineResultsContainerPosition,
    );
  }

  // function to be called when pointer event is outside of the search form
  onClickOutside(event: PointerEvent): void {
    // Check if the clicked element is NOT inside this component
    if (event.target instanceof Node && !this.contains(event.target)) {
      this.closeResultsElement();
    }
  }

  // CLOSE SEARCH DROPDOWN
  // Function to close the search dropdown
  closeResultsElement(): void {
    // ... logic to hide/close the component ...
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
  // WEB ELEMENT ATTRIBUTES
  // Input Name: Mandatory as required by event broadcaster
  @property({ type: String, attribute: 'name' })
  name = '';

  // URL from where the data will be loaded
  @property({ type: String, attribute: 'url' })
  url: string = '';

  // Search Input Placeholder String
  @property({ type: String, attribute: 'placeholder' })
  placeholder = 'Type two or more characters to begin search.';

  // Search Input Label Value
  @property({ type: String, attribute: 'label' })
  label = '';

  // DATA AND STATE
  // ALL Search Data Results
  @property({ type: Array, attribute: 'data' })
  data: Array<SearchItem> = [];

  // Search Input String
  @property({ type: String })
  textInput: string = '';

  // Filtered Search Data Results (objects from 'data' that contain values that partial match 'textInput')
  @property({ type: Array, attribute: false })
  result: Array<SearchItem> = [];

  // SELECTED Search Data Results - Array of ID's of all results with checkbox selected
  @property({ type: Array, attribute: false })
  selectedResults: Array<number> = [];

  // Boolean to force position of element
  @property({ type: Boolean })
  displayResultsAboveInput = false;

  @property({ type: Boolean, attribute: false })
  isLoading = false;

  @property({ type: String, attribute: false })
  loadError = '';

  // FETCH DATA
  async fetchData(): Promise<void> {
    if (!this.url) {
      this.isLoading = false;
      this.loadError = '';
      this.data = [];
      return;
    }

    this.isLoading = true;
    this.loadError = '';

    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const fetchedData = await response.json();
      this.data = Array.isArray(fetchedData) ? fetchedData : [];
    } catch (error) {
      this.data = [];
      this.loadError =
        error instanceof Error ? error.message : 'Unable to load search data.';
    } finally {
      this.isLoading = false;
    }
  }

  // CALCULATE WHERE TO DISPLAY RESULT - to be called on search input
  // If the input is nearer to the bottom of the viewport then display the results above the input
  determineResultsContainerPosition(): void {
    const rootContainer = this.renderRoot?.querySelector('#root-container');
    if (!(rootContainer instanceof HTMLElement)) {
      return;
    }

    const elementRect = rootContainer.getBoundingClientRect();
    const spaceAbove = elementRect.top;
    const spaceBelow = window.innerHeight - elementRect.bottom;

    this.displayResultsAboveInput = spaceBelow < spaceAbove;
  }

  // SUBMIT SEARCH
  submitSearch(textInput: string): void {
    this.result = [];
    this.data.forEach((dataItem: SearchItem) => {
      const hasData = findValueInNestedObject(dataItem, textInput);
      if (hasData) {
        // result.push(dataItem);
        this.result = [...this.result, dataItem];
      }
    });
  }

  // RESULT ROW RENDERER: Recursive function that iterates over object and
  // returns row at top level or returns a column cell if nested within object
  renderRows(
    rowData: any,
    searchString: string,
    entryKey?: string,
  ): TemplateResult {
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
    this.determineResultsContainerPosition();
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
  // unexplained reason. I suspect Lit is intercepting them. Investigate
  // further if time permits.
  keyboardNav(e: KeyboardEvent, selectedId: number) {
    if (e.code === 'Space') {
      this.toggleSelectedResult(selectedId);
    }
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
  }

  selectionSubmitButtonClick(): void {
    this.broadcastSelectedResultsEvent(this.selectedResults);
  }

  broadcastSelectedResultsEvent(results: Array<number>) {
    const eventName = `${this.name}_ResultUpdate`;
    const arrayOfSelectedItems = this.data.filter(item =>
      results.includes(item.id),
    );
    const newEvent = new CustomEvent<Array<SearchItem>>(eventName, {
      detail: arrayOfSelectedItems,
    });
    window.dispatchEvent(newEvent);
  }

  // ATTRIBUTE CHECKER - Avoid Rendering without mandatory attributes
  areMandatoryAttributesPresent() {
    if (!this.name || this.name === '') {
      return false;
    }
    if (this.data.length < 1 && !this.url) {
      return false;
    }
    return true;
  }

  // SELECT ALL FEATURE
  selectAllButtonClick(): void {
    // console.log('result', this.result);
    // console.log('selectedResults', this.selectedResults);
    const allItemsAreSelected =
      this.selectedResults.length === this.result.length;

    if (allItemsAreSelected) {
      this.selectedResults = [];
    } else {
      const allResultIds = this.result.map(resultItem => resultItem.id);
      this.selectedResults = allResultIds;
    }
  }

  render() {
    if (this.areMandatoryAttributesPresent() === false) {
      return html`<p id="attributesWarning">
        <span>
          WARNING: Mandatory Attributes Are Missing. Have you included a 'name'
          attribute and a 'data' attribute when using
          &lt;juliusbaer-webcomponent-search&gt;
        </span>
      </p>`;
    }

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
            placeholder=${this.loadError
              ? 'ERROR Loading Data.'
              : this.placeholder}
            @input=${this.onInput}
            .value=${this.textInput}
            ?disabled=${this.isLoading || !!this.loadError}
            class=${this.loadError ? 'error' : ''}
          />
        </div>
        ${this.isLoading
          ? html`<p id="status-message" role="status">DATA: Loading...</p>`
          : null}
        ${!this.isLoading && this.loadError
          ? html`<p id="status-message" class="error" role="alert">
              <span>ERROR:</span> ${this.loadError}
              <button @click=${() => this.fetchData()}>RETRY</button>
            </p>`
          : null}
        ${this.result.length > 0
          ? html`<div
              id="results-container"
              class=${this.displayResultsAboveInput ? 'positionAbove' : ''}
            >
              <div id="results-list">
                ${this.renderRows(this.result, this.textInput)}
              </div>
              <div id="select-all-container">
                <button
                  type="button"
                  id="select-all-button"
                  @click=${() => this.selectAllButtonClick()}
                >
                  <input
                    type="checkbox"
                    id="decorative-checkbox"
                    .checked=${this.selectedResults.length ===
                    this.result.length}
                  />
                  SELECT ALL
                </button>
                <p id="selected-records-detail">
                  ${this.selectedResults.length} / ${this.result.length} Records
                  Selected.
                </p>
              </div>
              <button
                type="button"
                id="selection-submit-button"
                @click=${() => this.selectionSubmitButtonClick()}
              >
                SUBMIT
              </button>
            </div> `
          : null}
      </form>
    `;
  }
}
