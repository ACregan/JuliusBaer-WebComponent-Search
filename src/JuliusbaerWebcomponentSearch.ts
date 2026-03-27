import { html, css, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

// import ACCOUNTS from './data/accounts.js';
import TRANSACTIONS from './data/transactions.js';
import { findValueInNestedObject } from './utils/utilities.js';

export class JuliusbaerWebcomponentSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--juliusbaer-webcomponent-search-text-color, #000);
    }
  `;

  @query('#search-input')
  input!: HTMLInputElement;

  @property({ type: Array, attribute: 'search-data' }) data = TRANSACTIONS;

  submitSearch() {
    console.log('SUBMITTED FOR SEARCH', this.input.value);
    console.log('DATA TO BE SEARCHED', this.data);

    const result: typeof this.data = [];
    this.data.forEach(dataItem => {
      const hasData = findValueInNestedObject(dataItem, this.input.value);
      if (hasData) {
        result.push(dataItem);
      }
    });

    console.log('RESULTS', result);

    this.input.value = '';
  }

  render() {
    return html`
      <input id="search-input" type="search" />
      <button @click=${this.submitSearch}>SEARCH</button>
    `;
  }
}
