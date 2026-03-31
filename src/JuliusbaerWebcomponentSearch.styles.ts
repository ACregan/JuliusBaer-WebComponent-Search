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
      color: var(--charcoal, #000);
      font-family:
        'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
      /* font-family: Verdana, Geneva, Tahoma, Helvetica, sans-serif; */
    }
    #root-container {
      position: relative;
      width: 100%;
      margin-top: 20px;
    }
    #status-message {
      position: absolute;
      top: -20px;
      right: 12px;
      height: 20px;
      margin: 0;

      font-size: 12px;
      font-weight: 600;
      padding: 5px 10px 0 10px;
      border-radius: 5px 5px 0 0;
      background: var(--container-border);
      color: var(--charcoal);
    }
    #status-message.error span {
      color: red;
    }
    #status-message.error button {
      font-size: 11px;
      transform: translateY(-2px);
      margin-left: 5px;
      cursor: pointer;
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
      top: -24px;
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
    #search-input:disabled {
      cursor: not-allowed;
    }
    #search-input.error:disabled {
      border-color: red;
    }
    /* #submit-button {
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
    } */

    #results-container {
      border-radius: 0 0 10px 10px;
      padding: 5px 12px 50px 12px;
      border: 5px solid var(--container-border);
      border-top: none;
      background: var(--container-background);
      transform: translateY(-13px);
      max-height: 40vh;

      position: absolute;
      left: 0;
      right: 0;
    }

    #results-container .result-item:first-child {
      border-radius: 7px 7px 3px 3px;
    }
    #results-container .result-item:last-child {
      border-radius: 3px 3px 7px 7px;
    }

    #results-container.positionAbove {
      border-radius: 20px 20px 0 0;
      border-top: 5px solid var(--dark-grey);
      border-bottom: none;
      bottom: 43px;
      padding: 10px 10px 50px 10px;
    }

    #results-list {
      max-height: calc(40vh - 30px);
      overflow-y: auto;
      background-color: var(--ghost-white);
      padding: 5px;
      border-radius: 8px;
      border: 1px solid var(--thistle);
    }

    #results-list::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    #results-list::-webkit-scrollbar {
      width: 10px;
    }
    #results-list::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 0 2px var(--cool-sky);
      -webkit-box-shadow: inset 0 0 0 2px var(--cool-sky);
      background-color: var(--cool-sky);
      border: 1px solid #ffffff;
    }

    #select-all-container {
      position: absolute;
      bottom: 5px;
      left: 18px;
      height: 40px;
      display: flex;
      align-items: center;
    }
    #select-all-button {
      height: 30px;
      padding: 5px;
      display: flex;
      align-items: center;
    }
    #decorative-checkbox {
      pointer-events: none;
    }
    #selected-records-detail {
      margin-left: 10px;
      font-weight: 600;
    }

    #selection-submit-button {
      position: absolute;
      bottom: 10px;
      right: 12px;
      padding: 5px;
      height: 30px;
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

    #attributesWarning {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: repeating-linear-gradient(
        -45deg,
        #222,
        #222 10px,
        #ffff00 10px,
        #ffff00 20px
      );
    }
    #attributesWarning > span {
      padding: 5px;
      background: black;
      color: #ffff00;
      border: 2px solid #ffff00;
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

      #status-message {
        background: var(--charcoal);
        border-color: var(--dark-grey);
        color: var(--ghost-white);
      }
      #status-message.error {
        border-color: #d78787;
        background: #5c2323;
        color: #ffe6e6;
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

      #results-list {
        background: var(--darker-grey);
        border-color: black;
      }
      #results-list::-webkit-scrollbar-thumb {
        border: 1px solid var(--darker-grey);
      }

      #selected-records-detail {
        color: var(--ghost-white);
      }

      .result-item {
        border-color: black;
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
