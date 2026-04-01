import { TemplateResult } from 'lit';
import '../src/juliusbaer-webcomponent-search.js';
declare const _default: {
    title: string;
    component: string;
    argTypes: {
        name: {
            control: string;
        };
        url: {
            control: string;
        };
        label: {
            control: string;
        };
        placeholder: {
            control: string;
        };
    };
};
export default _default;
interface Story<T> {
    (args: T): TemplateResult;
    args?: Partial<T>;
    argTypes?: Record<string, unknown>;
}
interface ArgTypes {
    name: string;
    url: string;
    label?: string;
    placeholder?: string;
}
export declare const Regular: Story<ArgTypes>;
export declare const CustomName: Story<ArgTypes>;
export declare const CustomData: Story<ArgTypes>;
export declare const CustomLabel: Story<ArgTypes>;
export declare const CustomPlaceholder: Story<ArgTypes>;
export declare const AllCustom: Story<ArgTypes>;
export declare const EmptyData: Story<ArgTypes>;
