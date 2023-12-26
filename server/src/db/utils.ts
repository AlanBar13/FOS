type BooleanObject<T> = {
    [K in keyof T]?: boolean;
 };
 
export const excludeFields = <T>(fields: T, excludes: (keyof T)[]): BooleanObject<T> => {
    let keys = Object.keys(fields!).filter((key) => !excludes.includes(key as keyof T)) as (keyof T)[];
    let object: BooleanObject<T> = {};
    for (let key of keys) {
       object[key] = true;
    }
    return object;
};