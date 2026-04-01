interface Person {
    first_name: string;
    last_name: string;
    account_number: number;
}
interface Transaction {
    id: number;
    currency: string;
    amount: number;
    from: Person;
    to: Person;
}
declare const TRANSACTIONS: Transaction[];
export default TRANSACTIONS;
export type { Transaction, Person };
