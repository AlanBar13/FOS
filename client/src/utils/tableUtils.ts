export type Order = 'asc' | 'desc';

export function createCompareFn<T extends Object>(
    property: keyof T,
    sort_order: Order
  ) {
    const compareFn = (a: T, b: T) => {
      const val1 = a[property];
      const val2 = b[property];
      const order = sort_order !== "desc" ? 1 : -1;
      
      switch (typeof val1) {
        case "number": {
          const valb = val2 as number;
          const result = val1 - valb;
          return result * order;
        }
        case "string": {
          const valb = val2 as string;
          const result = val1.localeCompare(valb);
          return result * order;
        }
        case "boolean": {
            const valb = val2 as boolean;
            const vala = val1 as boolean;
            const result = Number(valb) - Number(vala);
            return result * order;
        }
        default:
          return 0;
      }
    };
    return compareFn;
}