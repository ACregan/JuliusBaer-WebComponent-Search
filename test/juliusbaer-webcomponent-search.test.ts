import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { JuliusbaerWebcomponentSearch } from '../src/JuliusbaerWebcomponentSearch.js';
import '../src/juliusbaer-webcomponent-search.js';

describe('JuliusbaerWebcomponentSearch', () => {
  it('has a test label when provided a "label" attribute', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" label="Test Label">
      </juliusbaer-webcomponent-search>
    `);

    expect(el.label).to.equal('Test Label');
  });
  it('does NOT have a test label when "label" attribute is ommited', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test">
      </juliusbaer-webcomponent-search>
    `);

    expect(el.label).to.have.lengthOf(0);
  });

  //   it('increases the counter on button click', async () => {
  //     const el = await fixture<JuliusbaerWebcomponentSearch>(
  //       html`<juliusbaer-webcomponent-search></juliusbaer-webcomponent-search>`,
  //     );
  //     el.shadowRoot!.querySelector('button')!.click();

  //     expect(el.counter).to.equal(101);
  //   });

  //   it('can override the header via attribute', async () => {
  //     const el = await fixture<JuliusbaerWebcomponentSearch>(
  //       html`<juliusbaer-webcomponent-search
  //         header="attribute header"
  //       ></juliusbaer-webcomponent-search>`,
  //     );

  //     expect(el.header).to.equal('attribute header');
  //   });

  //   it('passes the a11y audit', async () => {
  //     const el = await fixture<JuliusbaerWebcomponentSearch>(
  //       html`<juliusbaer-webcomponent-search></juliusbaer-webcomponent-search>`,
  //     );

  //     await expect(el).shadowDom.to.be.accessible();
  //   });
});
