import { html } from 'lit';
import { fixture, expect, fixtureCleanup } from '@open-wc/testing';
import { JuliusbaerWebcomponentSearch } from '../src/JuliusbaerWebcomponentSearch.js';
import '../src/juliusbaer-webcomponent-search.js';

describe('JuliusbaerWebcomponentSearch', () => {
  afterEach(() => {
    fixtureCleanup();
  });
  // ATTRIBUTES
  // 'name' Attribute (mandatory)
  it('does not render when missing "name" attribute', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        label="Test Label"
        .data=${[
          { id: 0, name: 'Case' },
          { id: 1, name: 'Molly' },
          { id: 2, name: 'Armitage' },
          { id: 3, name: 'Riviera' },
        ]}
      >
      </juliusbaer-webcomponent-search>
    `);
    // console.log(el.shadowRoot?.innerHTML);
    expect(el.shadowRoot?.innerHTML).to.contain(
      'WARNING: Mandatory Attributes Are Missing.',
    );
  });

  // 'data' Attribute (mandatory)
  it('does not render when missing "data" attribute', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" label="Test Label">
      </juliusbaer-webcomponent-search>
    `);
    // console.log(el.shadowRoot?.innerHTML);
    expect(el.shadowRoot?.innerHTML).to.contain(
      'WARNING: Mandatory Attributes Are Missing.',
    );
  });

  // 'label' Attribute (optional)
  it('has a test label when provided a "label" attribute', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        .data=${[
          { id: 0, name: 'Case' },
          { id: 1, name: 'Molly' },
          { id: 2, name: 'Armitage' },
          { id: 3, name: 'Riviera' },
        ]}
        label="Test Label"
      >
      </juliusbaer-webcomponent-search>
    `);

    expect(el.shadowRoot?.innerHTML).to.contain('Test Label');
  });
  it('does NOT have a test label when "label" attribute is ommited', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        data='[{"id":0, "name": "Case"}, {"id":1, "name": "Molly"}, {"id":2, "name": "Armitage"}, {"id":3, "name": "Riviera"}]'
      >
      </juliusbaer-webcomponent-search>
    `);

    expect(el.label).to.have.lengthOf(0); // Urgh. Is this REALLY how to check if element does not exist?
  });

  // BEHAVIOUR
  //
  it('does NOT show search results without a search query', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        .data=${[
          { id: 0, name: 'Case' },
          { id: 1, name: 'Molly' },
          { id: 2, name: 'Armitage' },
          { id: 3, name: 'Riviera' },
        ]}
        label="Test Label"
      >
      </juliusbaer-webcomponent-search>
    `);

    expect(el.shadowRoot?.innerHTML).to.not.contain('results-container');
  });

  it('does show search results with a search query of more than 2 characters', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        .data=${[
          { id: 0, name: 'Case' },
          { id: 1, name: 'Molly' },
          { id: 2, name: 'Armitage' },
          { id: 3, name: 'Riviera' },
        ]}
        label="Test Label"
      ></juliusbaer-webcomponent-search>
    `);

    const searchInput = el.shadowRoot?.querySelector(
      '#search-input',
    ) as HTMLInputElement;

    searchInput.value = 'MO';
    searchInput.dispatchEvent(
      new Event('input', { bubbles: true, composed: true }),
    );

    await el.updateComplete;

    expect(searchInput.value).to.equal('MO');
    expect(el.shadowRoot?.innerHTML).to.contain('results-container');
  });

  it('when search results are showing, clicking outside of the component will close the results', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        .data=${[
          { id: 0, name: 'Case' },
          { id: 1, name: 'Molly' },
          { id: 2, name: 'Armitage' },
          { id: 3, name: 'Riviera' },
        ]}
        label="Test Label"
      ></juliusbaer-webcomponent-search>
      <hr />
      <p id="outside-element-selector">
        SOME RANDOM TEXT OUTSIDE OF SHADOW DOM
      </p>
    `);

    const searchInput = el.shadowRoot?.querySelector(
      '#search-input',
    ) as HTMLInputElement;
    searchInput.value = 'MO';
    searchInput.dispatchEvent(
      new Event('input', { bubbles: true, composed: true }),
    );

    await el.updateComplete;

    expect(searchInput.value).to.equal('MO');
    expect(el.shadowRoot?.innerHTML).to.contain('results-container');

    const outsideElement = el.parentElement?.querySelector(
      '#outside-element-selector',
    ) as HTMLElement;
    outsideElement.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );

    await el.updateComplete;
    expect(el.shadowRoot?.innerHTML).to.not.contain('results-container');
  });

  // it('when there is too little space below the search input, the results-container should render above the input', async () => {
  //   const el = await fixture<JuliusbaerWebcomponentSearch>(html`
  //     <juliusbaer-webcomponent-search
  //       name="Test"
  //       .data=${[
  //         { id: 0, name: 'Case' },
  //         { id: 1, name: 'Molly' },
  //         { id: 2, name: 'Armitage' },
  //         { id: 3, name: 'Riviera' },
  //       ]}
  //       label="Test Label"
  //     ></juliusbaer-webcomponent-search>
  //   `);

  //   const searchInput = el.shadowRoot?.querySelector(
  //     '#search-input',
  //   ) as HTMLInputElement;

  //   console.log(searchInput);

  //   searchInput.value = 'MO';
  //   searchInput.dispatchEvent(
  //     new Event('input', { bubbles: true, composed: true }),
  //   );

  //   await el.updateComplete;

  //   expect(searchInput.value).to.equal('MO');
  //   expect(el.shadowRoot?.innerHTML).to.contain('positionAbove');
  // });

  // OLD TESTS AUTOGENERATED WITH OPEN WC GENERATOR

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
