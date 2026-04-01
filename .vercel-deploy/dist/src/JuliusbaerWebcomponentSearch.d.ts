import { LitElement, PropertyValues, TemplateResult } from 'lit';
interface SearchItem {
    id: number;
    [key: string]: any;
}
export declare class JuliusbaerWebcomponentSearch extends LitElement {
    constructor();
    connectedCallback(): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    disconnectedCallback(): void;
    onClickOutside(event: PointerEvent): void;
    closeResultsElement(): void;
    resetForm(): void;
    static styles: import("lit").CSSResult;
    name: string;
    url: string;
    placeholder: string;
    label: string;
    data: Array<SearchItem>;
    textInput: string;
    result: Array<SearchItem>;
    selectedResults: Array<number>;
    displayResultsAboveInput: boolean;
    isLoading: boolean;
    loadError: string;
    fetchData(): Promise<void>;
    determineResultsContainerPosition(): void;
    submitSearch(textInput: string): void;
    renderRows(rowData: any, searchString: string, entryKey?: string): TemplateResult;
    onInput(e: Event): void;
    keyboardNav(e: KeyboardEvent, selectedId: number): void;
    toggleSelectedResult(selectedId: number): void;
    selectionSubmitButtonClick(): void;
    broadcastSelectedResultsEvent(results: Array<number>): void;
    areMandatoryAttributesPresent(): boolean;
    selectAllButtonClick(): void;
    render(): TemplateResult<1>;
}
export {};
