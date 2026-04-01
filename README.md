# JuliusBaer-WebComponent-Search

## Purpose

This repo contains a Web Component designed to enable a user to search for specific values amongst data, filter amongst the results and provide user interaction such as selection of results. It should provide keyboard navigation, be mobile friendly, compatible with screen-reader tech and provide clear visual feedback to the user.

The specification for this web component was provided by Julius Baer as part of the interview process for a Front-end Developer role vacancy.

## Requirements

- [Node.js & NPM](https://nodejs.org/)

---

## Installation

Clone the repo

```bash
git clone https://github.com/ACregan/JuliusBaer-WebComponent-Search.git
```

In your terminal, change to the project directory

```bash
cd JuliusBaer-WebComponent-Search
```

Install Dependencies

```bash
npm install
```

---

## Demo

Now that we have cloned the project and installed the dependancies, we can run the project locally to see its features in action:

```bash
npm run start
```

This will build and load the component in a local environment which can be accessed at [localhost:8000/demo](http://localhost:8000/demo/)

---

## Testing

We can also run a suite of tests designed to test the functionality of the component. The testing setup in this repo was provided out-of-the-box with the Open Web Component dev environment that this project was built upon.

To run the test suite simply `cd` into the project folder in your terminal and run:

```bash
npm test
```

This will also provide a coverage report which can be accessed from the `/coverage` folder. To view it you can simply drag the file `/coverage/lcov-report/index.html` into a blank browser tab.

Alternatively, to run the tests in interactive watch mode run:

```bash
npm run test:watch
```

---

## Storybook

Storybook provides a playground for testing the various features and states of the component. To load Storybook simply `cd` into the project folder in your terminal and run:

```bash
npm run storybook
```

---

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

---

## Build

To create a build of this Web Component for use in external applications please run:

```bash
npm run build
```

The output of this will be placed in the `dist` folder at the project root folder.

---

## Usage

```html
<script type="module">
  import 'juliusbaer-webcomponent-search/juliusbaer-webcomponent-search.js';
</script>

<juliusbaer-webcomponent-search
  name="Name_Of_Search_Data"
  url="https://domain.com/path/to/data/file.json"
  label="A Label"
  placeholder="Type to search."
>
</juliusbaer-webcomponent-search>
```

<!-- ```html
<div id="search-container"></div>
<script type="module">
  import { html, render } from 'lit';
  import '../dist/src/juliusbaer-webcomponent-search.js';
  import transactionData from '../dist/src/data/transactions.js';

  render(
    html`
      <juliusbaer-webcomponent-search
        name="Crew"
        .data=${[
          { id: 0, name: 'Case', role: 'Cowboy' },
          { id: 1, name: 'Molly', role: 'Razor Girl' },
          { id: 2, name: 'Armitage', role: 'Major' },
          { id: 3, name: 'Riviera', role: 'Illusionist' },
        ]}
        label="The Crew"
        placeholder="Type to search."
      >
      </juliusbaer-webcomponent-search>
    `,
    document.querySelector('#search-container'),
  );
</script>
``` -->

---

## Parameters

| Attribute   | optional? | type   | Purpose                                                                                                                                                                                                                                                                                                                                 | Notes                                                                                             |
| ----------- | --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| name        | required  | string | a string that acts as a unique identifier for this search facility. It will be used to determine the name of the event broadcast with the results of the search. e.g. a name of "Accounts" will result in the name of the event being "Accounts_ResultUpdate" which you will need to subscribe to these events in a listener.           | Refrain from using spaces. If spaces are used they will be omitted from the broadcast event name. |
| url         | required  | string | a URL string that is the resource that will provide the data through which the user will be able to search. This data should be an array of objects, in JSON format. Each object item requires an id(number) but other than that, the data can be any number of key/value pairs and can also accommodate nested data and other objects. | Each top-level object requires a unique numeric 'id'                                              |
| label       | optional  | string | a text label that sits above the search window to indicate what data the search facility will search through.                                                                                                                                                                                                                           |                                                                                                   |
| placeholder | optional  | string | a text label to act as a short written indicator to prompt the user to use the search input.                                                                                                                                                                                                                                            |                                                                                                   |

---

## Decisions

### Framework Choice

During the planning phase of this project, having reviewed the popular options available I decided to implement the spec requirements using Lit. This was the obvious choice over its competitors (Stencil, Fast etc) due to its popular and active eco-system, this provides an abundance of sources for documentation and troubleshooting. It is maintained by the Google Chrome team, thus providing first-class, dog-fooded support from the developers of the worlds pre-eminent browser.

The runtime library driven approach that Lit takes, might have the downside of dependency (a mere 5kb) but it also negates the need for compilation (which Stencil requires) while enabling quicker development and iteration. Time was a deciding factor for me personally; negating the need to setup a build system and the shallower learning curve of Lit (via Open Web Components Starter Kit) was what ultimately made me opt for Lit over Stencil in this case.

SOURCE: https://medium.com/@mz.ebrahimi/a-comparative-analysis-of-stencil-core-and-lit-element-choosing-the-right-tool-for-web-component-1ea02a516252

### Keyboard Navigation

The spec document requested that arrow-keys be used to navigate the results dropdown but that would conflict with accessibility best practices. To capture the up and down arrow key events (to navigate the results for instance) would prevent the scrolling of the page which would potentially cause problems for users who require accessibility considerations.

It is established practice for users to navigate through selectable elements on the page using <kbd>TAB</kbd> to go forward and <kbd>SHIFT</kbd> + <kbd>TAB</kbd> to go backward through the pages' interactive elements (as determined by the `tabindex` attribute). I decided to stick to this pattern and enabled the selection of rows by rendering each result row as a `<label>` element to enable the user to select the row and when interacting with it (via <kbd>SPACEBAR</kbd>).

During the implementation of this feature, I encountered a problem: In normal HTML documents the selection of a `<label>` tag that contains a `<input type="checkbox">` should automatically toggle the contained input checkbox, but this was not happening when using keyboard input. I suspect that Lit might be intercepting the keyboard select event for some reason. I spent some time investigating this but I never managed to successfully diagnose the issue (due to time constraints) but I was able to implement a workaround so now the user can use <kbd>TAB</kbd> and <kbd>SHIFT</kbd> + <kbd>TAB</kbd> to navigate through the results list and use <kbd>SPACEBAR</kbd> to toggle the selection of highlighted results successfully. This solution complies with accessibility practices whilst still enabling the user to navigate the search facility via the keyboard.

---

### Data Loading Approach

Rather late in the development of this project, I found I was not happy with my initial decision to load the data via javascript at the point of rendering like so (see: `import transactionData from '../dist/src/data/transactions.js';` and `.data=${transactionData}`):

```html
<div id="search-container"></div>
<script type="module">
  import { html, render } from 'lit';
  import '../dist/src/juliusbaer-webcomponent-search.js';
  // import accountData from '../dist/src/data/accounts.js';
  import transactionData from '../dist/src/data/transactions.js';

  render(
    html`
      <juliusbaer-webcomponent-search
        name="Transactions"
        .data=${transactionData}
        label="Transactions"
        placeholder="What can I help you with?"
      >
      </juliusbaer-webcomponent-search>
    `,
    document.querySelector('#search-container'),
  );
</script>
```

In hindsight, passing the data into an attribute like this is problematic (I think I've been using React.js too long!). This approach is especially cumbersome if implementing the component using the HTML method, like so:

```html
<script
  type="module"
  src="../dist/src/juliusbaer-webcomponent-search.js"
></script>
<juliusbaer-webcomponent-search
  name="Transactions"
  data='[{"id":0,"name":"Case","role":"Cowboy"},{"id":1,"name":"Molly","role":"Razor Girl"},{"id":2,"name":"Armitage","role":"Major"},{"id":3,"name":"Riviera","role":"Illusionist"}]'
  label="Transactions"
  placeholder="What can I help you with?"
></juliusbaer-webcomponent-search>
```

That string of data needs to be parsed inside the app and it puts the onus on the implementing developer to Stringify and Parse the JSON data to be passed in (which could be a huge json file or js array) as required which will be a frustrating developer experience. A better solution is to stick with the tried and trusted method of loading the data inside the component via a URL instead.

This change of approach simplifies the attributes API, provides a better DX and is an all-round more battle hardened approach to loading data into our Web Component.

---

## Requirements Checklist

- [x] Search Input by string ...
- [x] ... only start search after 2 chars or more are entered in search
- [x] ... and refine search on-change search input
- [x] Results Dropdown ...
- [x] ... With Search Term Highlighting.
- [x] ... With Placeholder Text.
- [x] ... With Multiple Selectable Results (checkboxes?).
- [x] ... With Keyboard Navigation.
- [x] ... With Results Being Keyboard Navigatable.
- [x] ... With Dynamic Positioning: Results Being Displayed above Search facility if space below is not sufficient.
- [x] Load Data from URL
- [x] ... With Loading State
- [x] ... With Error Notices and Retry Button
- [x] Dropdown overlays content below search input
- [x] Dark /Light Mode support ...
- [x] ... honors browser settings
- [x] Broadcast Event with selected results
- [x] Ensure responsive design patterns are adhered to
- [x] Styles are only within scope of shadowDOM
- [x] Test Suite
- [x] Storybook Scenarios
- [x] Document...
- [x] ... Installation
- [x] ... Usage Example
- [x] ... API documentation
- [x] ... Testing Instructions
- [x] ... Storybook

---

Thank you for taking the time to review my submission, I look forward to discussing it with you further.

Regards,

Anthony Cregan
