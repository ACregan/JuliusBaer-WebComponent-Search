import { css, CSSResult } from 'lit';

export default function getStyles(): CSSResult {
  return css`
    :host {
      --ghost-white: #fffaff;
      --lavender: #e6e6e6;
      --thistle: #c5c5c5;
      --charcoal: #524f53;
      --cerulean: #2d728f;
      --cool-sky: #35a7ff;
      --banana: #ffe74c;

      --grey: #878787;
      --dark-grey: #595959;
      --darker-grey: #404040;

      --container-background: var(--lavender);
      --container-border: var(--thistle);

      display: block;
      padding: 25px;
      color: var(--charcoal, #000);
      font-family: Verdana, Geneva, Tahoma, Helvetica, sans-serif;
    }
    #root-container {
      width: 100%;
      margin-top: 20px;
    }
    #search-container {
      position: relative;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-content: stretch;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      background: var(--container-background);
      border-radius: 10px;

      border: 5px solid var(--container-border);
    }
    #search-label {
      position: absolute;
      top: -25px;
      left: 6px;
      padding: 5px 5px 0 5px;
      border-radius: 10px 10px 0 0;
      border: 5px solid var(--container-border);
      border-bottom: 0;
      font-size: 12px;
      font-weight: 600;
      background: var(--container-background);
      color: var(--charcoal);
    }
    #search-input {
      order: 0;
      flex: 1 1 auto;
      align-self: auto;
      height: 40px;
      padding: 0 10px;
      border: 1px solid var(--container-border);
      border-radius: 4px;
    }
    #submit-button {
      order: 0;
      flex: 0 1 auto;
      align-self: auto;
      height: 40px;
      font-weight: 600;
      padding: 0 10px;
      border: 1px solid var(--cerulean);
      border-radius: 4px;
      box-sizing: border-box;
      background: var(--cool-sky);
      color: var(--ghost-white);
      cursor: pointer;
    }
    #submit-button:active {
      background: var(--cerulean);
    }

    #results-container::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    #results-container::-webkit-scrollbar {
      width: 8px;
    }
    #results-container::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 0 2px var(--cool-sky);
      background-color: var(--cool-sky);
    }

    #results-container {
      border-radius: 0 0 10px 10px;
      padding: 10px;
      border: 5px solid var(--container-border);
      border-top: none;
      background: var(--container-background);
      transform: translateY(-13px);
      max-height: 40vh;
      overflow-y: scroll;
    }
    .result-item {
      border-radius: 3px;
      border: 1px solid var(--container-border);
      margin-bottom: 3px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-content: stretch;
      align-items: stretch;
      padding: 5px;
      cursor: pointer;
    }
    .result-item:last-child {
      margin-bottom: 0;
      border-radius: 3px 3px 7px 7px;
    }
    .result-item:focus-within {
      box-shadow: 0 0 0 2px inset var(--cerulean);
      outline: none;
    }
    .result-item:has(input[type='checkbox']:checked) {
      background: var(--cool-sky);
    }

    .result-checkbox {
      margin: 0 15px 0 10px;
      border: 5px solid var(--charcoal);
    }
    .result-cell {
      order: 0;
      flex: 1 1 80px;
      align-self: auto;
      position: relative;
      padding-top: 15px;
    }
    .result-cell-key {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 11px;
      color: var(--charcoal);
      text-transform: capitalize;
      user-select: none;
    }
    .result-cell-value {
      font-weight: 600;
    }

    .highlight {
      background: var(--banana);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --container-background: var(--dark-grey);
        --container-border: var(--darker-grey);
      }

      #search-container,
      #results-container {
        background: var(--charcoal);
        border-color: var(--dark-grey);
      }

      #search-label {
        border-color: var(--dark-grey);
        background: var(--charcoal);
        color: var(--lavender);
      }
      #search-input {
        background: var(--grey);
        color: var(--ghost-white);
      }
      #search-input::-webkit-search-cancel-button {
        color: white;
        background: white;
        fill: white;
      }
      #search-input::placeholder {
        color: var(--ghost-white);
        opacity: 0.6;
      }
      #search-input::selection {
        background: var(--cool-sky);
      }

      .result-item {
        border-color: var(--grey);
      }
      .result-cell-key {
        color: var(--thistle);
      }
      .result-cell-value {
        color: var(--ghost-white);
      }
      .highlight {
        color: var(--charcoal);
      }
    }
  `;
}
