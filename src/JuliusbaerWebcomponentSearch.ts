import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class JuliusbaerWebcomponentSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--juliusbaer-webcomponent-search-text-color, #000);
    }
  `;

  @property({ type: String }) header = 'Hey there';

  @property({ type: Number }) counter = 100;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <h2>${this.header} COUNT: ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
