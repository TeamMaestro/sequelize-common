// Remove types from T that are assignable to U
export type Diff<T, U> = T extends U ? never : T;
