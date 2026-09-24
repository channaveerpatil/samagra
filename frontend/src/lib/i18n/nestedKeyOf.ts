// Recursively builds dotted-path keys from a nested translation object, e.g.
// { customers: { table: { name: string } } } -> "customers.table.name".
// Gives t() compile-time key checking without a code-generation step.
export type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends object
      ? `${K}.${NestedKeyOf<T[K]>}`
      : never;
}[keyof T & string];
