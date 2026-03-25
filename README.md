# JuliusBaer-WebComponent-Search

## Purpose

This repo contains a Web Component designed to enable a user to search for specific values amongst data, filter amongst the results and provide user interaction such as selection of results. It should provide keyboard navigation, be mobile friendly, compatible with screen-reader tech and provide clear visual feedback to the user.

The specification for this web component was provided by Julius Baer as part of the interview process for a Front-end Developer role vacancy.

## Usage

## Parameters

---

## Decisions

### Framework Choice

Having reviewed the popular options available I have decided to implement the spec requirements using Lit. This was the obvious choice over its competetors (Stencil, Fast etc) due to its popular and active eco-system, this provides an abundance of sources for documentation and troubleshooting. It is maintained by the Google Chrome team providing first-class, dog-fooded support from the developers of the worlds pre-eminent browser.

The runtime library driven approach that Lit takes, might have the downside of dependency (a mere 5kb) but it also negates the need for compilation (which Stencil requires) while enabling quicker development and iteration. Time was a deciding factor for me personally; negating the need to setup a build system and the shallower learning curve of Lit was what ultimately made me opt for Lit over Stencil in this case.

SOURCE: https://medium.com/@mz.ebrahimi/a-comparative-analysis-of-stencil-core-and-lit-element-choosing-the-right-tool-for-web-component-1ea02a516252

---

## Testing
