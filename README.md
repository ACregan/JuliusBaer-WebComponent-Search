# JuliusBaer-WebComponent-Search

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
- [x] Dropdown overlays content below search input
- [x] Dark /Light Mode support ...
- [x] ... honors browser settings
- [ ] ... but can be overridden by attribute
- [x] Broadcast Event with selected results
- [ ] Ensure responsive design patterns are adhered to
- [x] Styles are only within scope of shadowDOM
- [ ] Test Suite
- [ ] Storybook Scenarios
- [ ] Document...
- [ ] ... Installation
- [ ] ... Usage Examples
- [ ] ... API documentation
- [ ] ... Testing Instructions
- [ ] ... Storybook

## Purpose

This repo contains a Web Component designed to enable a user to search for specific values amongst data, filter amongst the results and provide user interaction such as selection of results. It should provide keyboard navigation, be mobile friendly, compatible with screen-reader tech and provide clear visual feedback to the user.

The specification for this web component was provided by Julius Baer as part of the interview process for a Front-end Developer role vacancy.

## Usage

## Parameters

**name**: _(required)_ a string that acts as a unique identifier for this search facility. It will be used to determine the name of the event broadcast with the results of the search. e.g. a name of "Accounts" will result in the name of the event being "Accounts_ResultUpdate" which you will need to subscribe to these events in a listener.

**data**: _(required)_ an array of objects containing the data you wish to search. Each item requires an id(number) but other than that, the data can be any number of key/value pairs.

**label**: _(optional)_ a text label that sits above the search window to indicate what data the search facility will search through.

**placeholder**: _(optional)_ a text label to act as a short written indicator to prompt the user to use the search input.

---

## Decisions

### Framework Choice

Having reviewed the popular options available I have decided to implement the spec requirements using Lit. This was the obvious choice over its competetors (Stencil, Fast etc) due to its popular and active eco-system, this provides an abundance of sources for documentation and troubleshooting. It is maintained by the Google Chrome team providing first-class, dog-fooded support from the developers of the worlds pre-eminent browser.

The runtime library driven approach that Lit takes, might have the downside of dependency (a mere 5kb) but it also negates the need for compilation (which Stencil requires) while enabling quicker development and iteration. Time was a deciding factor for me personally; negating the need to setup a build system and the shallower learning curve of Lit was what ultimately made me opt for Lit over Stencil in this case.

SOURCE: https://medium.com/@mz.ebrahimi/a-comparative-analysis-of-stencil-core-and-lit-element-choosing-the-right-tool-for-web-component-1ea02a516252

---

## Testing

---

---

// TODO: Merge the content below (from open web component standard generated readme.md) with the readme above

# \<juliusbaer-webcomponent-search>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i juliusbaer-webcomponent-search
```

## Usage

```html
<script type="module">
  import 'juliusbaer-webcomponent-search/juliusbaer-webcomponent-search.js';
</script>

<juliusbaer-webcomponent-search></juliusbaer-webcomponent-search>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
