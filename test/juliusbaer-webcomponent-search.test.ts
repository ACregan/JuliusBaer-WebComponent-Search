import { html } from 'lit';
import { fixture, expect, fixtureCleanup } from '@open-wc/testing';
import { JuliusbaerWebcomponentSearch } from '../src/JuliusbaerWebcomponentSearch.js';
import '../src/juliusbaer-webcomponent-search.js';

describe('JuliusbaerWebcomponentSearch', () => {
  const originalFetch = window.fetch;
  const defaultResultsUrl = '/api/search-results';
  const defaultData = [
    { id: 0, name: 'Case' },
    { id: 1, name: 'Molly' },
    { id: 2, name: 'Armitage' },
    { id: 3, name: 'Riviera' },
    { id: 4, name: 'Monica' },
  ];

  beforeEach(() => {
    window.fetch = (async input => {
      if (String(input) === defaultResultsUrl) {
        return new Response(JSON.stringify(defaultData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;
  });

  afterEach(() => {
    window.fetch = originalFetch;
    fixtureCleanup();
  });
  // ATTRIBUTES
  // 'name' Attribute (mandatory)
  it('does not render when missing "name" attribute', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        label="Test Label"
        url="${defaultResultsUrl}"
      >
      </juliusbaer-webcomponent-search>
    `);
    // console.log(el.shadowRoot?.innerHTML);
    expect(el.shadowRoot?.innerHTML).to.contain(
      'Mandatory Attributes Are Missing.',
    );
  });

  it('does not render when missing "url" attribute', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" label="Test Label" url="">
      </juliusbaer-webcomponent-search>
    `);
    // console.log(el.shadowRoot?.innerHTML);
    expect(el.shadowRoot?.innerHTML).to.contain(
      'Mandatory Attributes Are Missing.',
    );
  });

  // 'label' Attribute (optional)
  it('has a test label when provided a "label" attribute', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="${defaultResultsUrl}"
        label="Test Label"
      >
      </juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    expect(el.shadowRoot?.innerHTML).to.contain('Test Label');
  });
  it('does NOT have a label when "label" attribute is ommited', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" url="${defaultResultsUrl}">
      </juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    expect(el.label).to.have.lengthOf(0); // Urgh. Is this REALLY how to check if element does not exist?
  });

  // BEHAVIOUR
  //
  it('does NOT show search results without a search query', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="${defaultResultsUrl}"
        label="Test Label"
      >
      </juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    expect(el.shadowRoot?.innerHTML).to.not.contain('results-container');
  });

  it('does show search results with a search query of more than 2 characters', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="${defaultResultsUrl}"
        label="Test Label"
      ></juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

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
        url="${defaultResultsUrl}"
        label="Test Label"
      ></juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

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
        url="${defaultResultsUrl}"
        label="Test Label"
      ></juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

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

  it('fetches data from the url property and stores it in data', async () => {
    window.fetch = (async input => {
      expect(String(input)).to.equal('/api/search-results');

      return new Response(JSON.stringify([{ id: 10, name: 'Monica' }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" url="/api/search-results">
      </juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    expect(el.data).to.deep.equal([{ id: 10, name: 'Monica' }]);
    expect(el.loadError).to.equal('');
    expect(el.isLoading).to.equal(false);
  });

  it('renders a loading state while url data is being fetched', async () => {
    let resolveFetch: ((value: Response) => void) | undefined;

    window.fetch = (input => {
      expect(String(input)).to.equal('/api/pending-search-results');

      return new Promise<Response>(resolve => {
        resolveFetch = resolve;
      });
    }) as typeof fetch;

    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="/api/pending-search-results"
      >
      </juliusbaer-webcomponent-search>
    `);

    await el.updateComplete;
    await Promise.resolve();
    await el.updateComplete;

    const statusMessage = el.shadowRoot?.querySelector(
      '#status-message',
    ) as HTMLElement;
    const searchInput = el.shadowRoot?.querySelector(
      '#search-input',
    ) as HTMLInputElement;

    expect(el.isLoading).to.equal(true);
    expect(statusMessage.textContent).to.contain('DATA: Loading...');
    expect(searchInput.disabled).to.equal(true);

    resolveFetch?.(
      new Response(JSON.stringify([{ id: 11, name: 'Case' }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await Promise.resolve();
    await el.updateComplete;
  });

  it('renders an error state when url data loading fails', async () => {
    window.fetch = (async () =>
      new Response(JSON.stringify({ message: 'nope' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch;

    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="/api/failing-search-results"
      >
      </juliusbaer-webcomponent-search>
    `);

    await el.updateComplete;
    await Promise.resolve();
    await el.updateComplete;

    const statusMessage = el.shadowRoot?.querySelector(
      '#status-message',
    ) as HTMLElement;
    const searchInput = el.shadowRoot?.querySelector(
      '#search-input',
    ) as HTMLInputElement;

    expect(el.data).to.deep.equal([]);
    expect(el.loadError).to.equal('HTTP 500');
    expect(el.isLoading).to.equal(false);
    expect(statusMessage.textContent).to.contain('ERROR: HTTP 500');
    expect(searchInput.disabled).to.equal(true);
  });

  it('sets data to an empty array when fetched payload is not an array', async () => {
    window.fetch = (async () =>
      new Response(JSON.stringify({ id: 1, name: 'Not an array' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch;

    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" url="/api/object-payload">
      </juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    expect(el.data).to.deep.equal([]);
    expect(el.loadError).to.equal('');
  });

  it('uses the thrown error message when an Error value is thrown', async () => {
    window.fetch = (async () => {
      throw new Error('network-failed');
    }) as typeof fetch;

    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="/api/non-error-throw"
      ></juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    expect(el.data).to.deep.equal([]);
    expect(el.loadError).to.equal('network-failed');
  });

  it('renders nested key prefixes for nested object result values', async () => {
    window.fetch = (async () =>
      new Response(
        JSON.stringify([
          { id: 10, profile: { email: 'case@example.com' }, name: 'Case' },
        ]),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )) as typeof fetch;

    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" url="/api/nested-results">
      </juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    const searchInput = el.shadowRoot?.querySelector(
      '#search-input',
    ) as HTMLInputElement;
    searchInput.value = 'case@';
    searchInput.dispatchEvent(
      new Event('input', { bubbles: true, composed: true }),
    );

    await el.updateComplete;

    const renderedKeys = Array.from(
      el.shadowRoot?.querySelectorAll('.result-cell-key') ?? [],
    )
      .map(key => key.textContent?.trim())
      .filter(Boolean);

    expect(renderedKeys).to.contain('profile.email');
  });

  it('resets fetch state when url is empty', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" url="">
      </juliusbaer-webcomponent-search>
    `);

    el.isLoading = true;
    el.loadError = 'something failed';
    el.data = [{ id: 99, name: 'Existing' }];

    await el.fetchData();
    await el.updateComplete;

    expect(el.isLoading).to.equal(false);
    expect(el.loadError).to.equal('');
    expect(el.data).to.deep.equal([]);
  });

  it('returns safely when position calculation cannot find root container', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        label="Test Label"
        url="${defaultResultsUrl}"
      >
      </juliusbaer-webcomponent-search>
    `);

    el.displayResultsAboveInput = false;
    el.determineResultsContainerPosition();

    expect(el.displayResultsAboveInput).to.equal(false);
  });

  it('clears selected and filtered results for short input strings', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="${defaultResultsUrl}"
        label="Test Label"
      ></juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    el.selectedResults = [0, 1];
    el.result = [{ id: 0, name: 'Case' }];

    const searchInput = el.shadowRoot?.querySelector(
      '#search-input',
    ) as HTMLInputElement;
    searchInput.value = 'm';
    searchInput.dispatchEvent(
      new Event('input', { bubbles: true, composed: true }),
    );

    await el.updateComplete;

    expect(el.selectedResults).to.deep.equal([]);
    expect(el.result).to.deep.equal([]);
  });

  it('removes an already selected id when toggled again', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search name="Test" url="${defaultResultsUrl}">
      </juliusbaer-webcomponent-search>
    `);

    el.selectedResults = [1, 2, 3];
    el.toggleSelectedResult(2);

    expect(el.selectedResults).to.deep.equal([1, 3]);
  });

  it('dispatches selected result event when submit button is clicked', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="${defaultResultsUrl}"
        label="Test Label"
      ></juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    el.selectedResults = [1, 3];
    el.result = [...el.data];
    await el.updateComplete;

    const eventPromise = new Promise<Array<{ id: number; name: string }>>(
      resolve => {
        window.addEventListener(
          'Test_ResultUpdate',
          (event: Event) => {
            const customEvent = event as CustomEvent<
              Array<{ id: number; name: string }>
            >;
            resolve(customEvent.detail);
          },
          { once: true },
        );
      },
    );

    const submitButton = el.shadowRoot?.querySelector(
      '#selection-submit-button',
    ) as HTMLButtonElement;
    submitButton.click();

    const eventDetail = await eventPromise;
    expect(eventDetail.map(item => item.id)).to.deep.equal([1, 3]);
  });

  it('select-all button toggles between selecting all and clearing all', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="${defaultResultsUrl}"
        label="Test Label"
      ></juliusbaer-webcomponent-search>
    `);

    await el.fetchData();
    await el.updateComplete;

    el.result = [...el.data];
    el.selectedResults = [];
    await el.updateComplete;

    const selectAllButton = el.shadowRoot?.querySelector(
      '#select-all-button',
    ) as HTMLButtonElement;

    selectAllButton.click();
    await el.updateComplete;
    expect(el.selectedResults).to.deep.equal([0, 1, 2, 3, 4]);

    selectAllButton.click();
    await el.updateComplete;
    expect(el.selectedResults).to.deep.equal([]);
  });

  it('when search results are showing, clicking outside of the component will close the results', async () => {
    const el = await fixture<JuliusbaerWebcomponentSearch>(html`
      <juliusbaer-webcomponent-search
        name="Test"
        url="${defaultResultsUrl}"
        label="Test Label"
      ></juliusbaer-webcomponent-search>
      <hr />
      <p id="outside-element-selector">
        SOME RANDOM TEXT OUTSIDE OF SHADOW DOM
      </p>
    `);

    await el.fetchData();
    await el.updateComplete;

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
