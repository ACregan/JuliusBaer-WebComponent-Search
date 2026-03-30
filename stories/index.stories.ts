import { html, TemplateResult } from 'lit';
import '../src/juliusbaer-webcomponent-search.js';
import TRANSACTIONS from '../src/data/transactions.js';

export default {
  title: 'JuliusbaerWebcomponentSearch',
  component: 'juliusbaer-webcomponent-search',
  argTypes: {
    name: { control: 'text' },
    data: { control: 'number' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  name: string;
  data: Array<any>;
  label?: string;
  placeholder?: string;
}

const Template: Story<ArgTypes> = ({
  name = 'Transactions',
  data = TRANSACTIONS,
  label = 'Transactions',
  placeholder = 'Type a string that matches the Transaction(s) you wish to find.',
}: ArgTypes) => html`
  <juliusbaer-webcomponent-search
    name=${name}
    .data=${data}
    label=${label}
    placeholder=${placeholder}
  >
  </juliusbaer-webcomponent-search>
`;

export const Regular = Template.bind({});

export const CustomName = Template.bind({});
CustomName.args = {
  name: 'Name',
};

export const CustomData = Template.bind({});
CustomData.args = {
  data: [
    { id: 0, name: 'Case', role: 'Cowboy' },
    { id: 1, name: 'Molly', role: 'Razor Girl' },
    { id: 2, name: 'Armitage', role: 'Major' },
    { id: 3, name: 'Riviera', role: 'Illusionist' },
  ],
};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
  label: 'Label',
};

export const CustomPlaceholder = Template.bind({});
CustomPlaceholder.args = {
  placeholder: 'Custom Placeholder Text',
};

export const AllCustom = Template.bind({});
AllCustom.args = {
  name: 'Characters',
  data: [
    { id: 0, name: 'Case', role: 'Cowboy' },
    { id: 1, name: 'Molly', role: 'Razor Girl' },
  ],
  label: 'Select Character',
  placeholder: 'Search characters...',
};

export const EmptyData = Template.bind({});
EmptyData.args = {
  data: [],
};

export const LargeDataset = Template.bind({});
LargeDataset.args = {
  data: Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    role: `Role ${i}`,
  })),
};