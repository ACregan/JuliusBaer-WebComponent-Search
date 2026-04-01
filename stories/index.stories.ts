import { html, TemplateResult } from 'lit';
import '../src/juliusbaer-webcomponent-search.js';
// import TRANSACTIONS from '../src/data/transactions.js';

export default {
  title: 'JuliusbaerWebcomponentSearch',
  component: 'juliusbaer-webcomponent-search',
  argTypes: {
    name: { control: 'text' },
    url: { control: 'text' },
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
  url: string;
  label?: string;
  placeholder?: string;
}

const Template: Story<ArgTypes> = ({
  name = 'Transactions',
  url = 'https://raw.githubusercontent.com/ACregan/JuliusBaer-WebComponent-Search/refs/heads/main/src/data/transactions.json',
  label = 'Transactions',
  placeholder = 'Type a string that matches the Transaction(s) you wish to find.',
}: ArgTypes) => html`
  <juliusbaer-webcomponent-search
    name=${name}
    .url=${url}
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
  url: 'https://raw.githubusercontent.com/ACregan/JuliusBaer-WebComponent-Search/refs/heads/main/src/data/accounts.json',
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
  name: 'Accounts',
  url: 'https://raw.githubusercontent.com/ACregan/JuliusBaer-WebComponent-Search/refs/heads/main/src/data/accounts.json',
  label: 'Accounts',
  placeholder: 'Search Accounts...',
};

export const EmptyData = Template.bind({});
EmptyData.args = {
  url: '',
};

export const LargeDataset = Template.bind({});
LargeDataset.args = {
  url: 'https://microsoftedge.github.io/Demos/json-dummy-data/1MB-min.json',
};
