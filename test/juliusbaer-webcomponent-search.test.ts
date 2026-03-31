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

  it('supports keyboard selection of result-item elements', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        .data=${[
          { id: 0, name: 'Case' },
          { id: 1, name: 'Molly' },
          { id: 2, name: 'Armitage' },
          { id: 3, name: 'Riviera' },
          { id: 4, name: 'Monica' },
        ]}
        label="Test Label"
      ></juliusbaer-webcomponent-search>
    `);

    const searchInput = el.shadowRoot?.querySelector(
      '#search-input',
    ) as HTMLInputElement;
    searchInput.value = 'mo';
    searchInput.dispatchEvent(
      new Event('input', { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const resultItems = Array.from(
      el.shadowRoot?.querySelectorAll('.result-item') ?? [],
    ) as HTMLElement[];
    expect(resultItems.length).to.equal(2);

    const resultCheckboxes = Array.from(
      el.shadowRoot?.querySelectorAll('.result-checkbox') ?? [],
    ) as HTMLInputElement[];
    const firstResultId = Number(resultCheckboxes[0].value);
    const secondResultId = Number(resultCheckboxes[1].value);

    resultItems[0].focus();
    resultItems[0].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;
    expect(el.selectedResults).to.deep.equal([firstResultId]);

    resultItems[1].focus();
    resultItems[1].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;
    expect(el.selectedResults).to.deep.equal([firstResultId, secondResultId]);
  });

  it('toggles the results container class when displayResultsAboveInput changes', async () => {
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

    const rootContainer = el.shadowRoot?.querySelector(
      '#root-container',
    ) as HTMLElement;
    const originalGetBoundingClientRect = rootContainer.getBoundingClientRect;

    rootContainer.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 700,
        width: 300,
        height: 80,
        top: 700,
        right: 300,
        bottom: 780,
        left: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    try {
      el.determineResultsContainerPosition();
      await el.updateComplete;

      const resultsContainer = el.shadowRoot?.querySelector(
        '#results-container',
      ) as HTMLElement;

      expect(el.displayResultsAboveInput).to.equal(true);
      expect(resultsContainer.classList.contains('positionAbove')).to.equal(
        true,
      );
    } finally {
      rootContainer.getBoundingClientRect = originalGetBoundingClientRect;
    }
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
});
